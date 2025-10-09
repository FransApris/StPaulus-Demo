import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { verifyToken } from '~/server/utils/auth'

interface PhotoMeta {
  filename: string
  title: string
  alt: string
  description: string
  order: number
}

interface AlbumMeta {
  photos: PhotoMeta[]
}

export default defineEventHandler(async (event) => {
  try {
    // Verify authentication
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const user = await verifyToken(token)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token'
      })
    }

    // Parse multipart form data
    const formData = await readMultipartFormData(event)
    if (!formData || !formData.length) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    // Find photo file and albumId
    const photoField = formData.find(field => field.name === 'photo')
    const albumIdField = formData.find(field => field.name === 'albumId')

    if (!photoField || !photoField.filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No photo file provided'
      })
    }

    if (!albumIdField || !albumIdField.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Album ID is required'
      })
    }

    const albumId = albumIdField.data.toString()
    const filename = photoField.filename
    const fileData = photoField.data

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(photoField.type || '')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.'
      })
    }

    // Validate file size (10MB limit)
    if (fileData.length > 10 * 1024 * 1024) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File size too large. Maximum 10MB allowed.'
      })
    }

    // Create album directory if it doesn't exist
    const albumPath = join(process.cwd(), 'public', 'images', 'album', albumId)
    try {
      await mkdir(albumPath, { recursive: true })
    } catch (error) {
      // Directory might already exist, continue
    }

    // Generate unique filename to avoid conflicts
    const timestamp = Date.now()
    const extension = filename.split('.').pop()?.toLowerCase() || 'jpg'
    const uniqueFilename = `${timestamp}-${Math.random().toString(36).substr(2, 9)}.${extension}`
    const filePath = join(albumPath, uniqueFilename)

    // Save file
    await writeFile(filePath, fileData)

    // Update meta.json
    const metaPath = join(albumPath, 'meta.json')
    let meta: AlbumMeta = { photos: [] }

    try {
      const { readFile } = await import('fs/promises')
      const metaContent = await readFile(metaPath, 'utf-8')
      meta = JSON.parse(metaContent)
    } catch (error) {
      // meta.json doesn't exist, use default
    }

    // Add new photo to meta
    const newPhoto: PhotoMeta = {
      filename: uniqueFilename,
      title: '',
      alt: '',
      description: '',
      order: meta.photos.length
    }

    meta.photos.push(newPhoto)

    // Save updated meta
    await writeFile(metaPath, JSON.stringify(meta, null, 2))

    return {
      success: true,
      photo: {
        id: uniqueFilename,
        filename: uniqueFilename,
        url: `/images/album/${albumId}/${uniqueFilename}`,
        title: '',
        alt: '',
        description: '',
        order: meta.photos.length - 1
      }
    }
  } catch (error: any) {
    console.error('Error uploading photo:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
