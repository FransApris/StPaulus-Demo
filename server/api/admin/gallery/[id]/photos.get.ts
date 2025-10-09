import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { requireAuth } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Authentication check
  requireAuth(event)

  const albumId = getRouterParam(event, 'id')

  if (!albumId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Album ID is required'
    })
  }

  try {
    const albumPath = join('public/images/album', albumId)

    // Check if album directory exists
    try {
      await readdir(albumPath)
    } catch (error) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Album not found'
      })
    }

    const photoFiles = await readdir(albumPath)
    const imageFiles = photoFiles
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort()

    const photos = imageFiles.map((file, index) => ({
      id: `${albumId}-photo-${index + 1}`,
      url: `/images/album/${albumId}/${file}`,
      filename: file,
      title: file.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/-/g, ' ')
    }))

    return { photos }

  } catch (error: any) {
    console.error('Error fetching album photos:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Could not fetch album photos'
    })
  }
})
