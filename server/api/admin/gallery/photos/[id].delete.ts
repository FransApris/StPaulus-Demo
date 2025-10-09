import { writeFile, readFile, unlink } from 'fs/promises'
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

    const photoId = getRouterParam(event, 'id')
    if (!photoId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Photo ID is required'
      })
    }

    // Find album containing this photo
    const albumsDir = join(process.cwd(), 'public', 'images', 'album')
    const { readdir } = await import('fs/promises')

    let albumId = null
    let metaPath = null
    let filePath = null

    try {
      const albums = await readdir(albumsDir)
      for (const album of albums) {
        const albumPath = join(albumsDir, album)
        const metaFile = join(albumPath, 'meta.json')
        const photoFile = join(albumPath, photoId)

        try {
          const metaContent = await readFile(metaFile, 'utf-8')
          const meta: AlbumMeta = JSON.parse(metaContent)

          const photoExists = meta.photos.some(p => p.filename === photoId)
          if (photoExists) {
            albumId = album
            metaPath = metaFile
            filePath = photoFile
            break
          }
        } catch (error) {
          // Continue to next album
        }
      }
    } catch (error) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Photo not found'
      })
    }

    if (!albumId || !metaPath || !filePath) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Photo not found'
      })
    }

    // Delete the physical file
    try {
      await unlink(filePath)
    } catch (error) {
      console.warn('Failed to delete physical file:', error)
      // Continue with metadata update even if file deletion fails
    }

    // Update meta.json to remove the photo
    const metaContent = await readFile(metaPath, 'utf-8')
    const meta: AlbumMeta = JSON.parse(metaContent)

    // Remove photo from metadata
    meta.photos = meta.photos.filter(p => p.filename !== photoId)

    // Reorder remaining photos
    meta.photos.forEach((photo, index) => {
      photo.order = index
    })

    // Save updated meta
    await writeFile(metaPath, JSON.stringify(meta, null, 2))

    return {
      success: true,
      message: 'Photo deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting photo:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
