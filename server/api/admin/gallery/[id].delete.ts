import { rm, access } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  // Check authentication
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const token = authHeader.substring(7)
  try {
    if (!token) {
      throw new Error('Invalid token')
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Album ID is required'
    })
  }

  const albumsBaseDir = 'public/images/album'
  const albumPath = join(albumsBaseDir, id)

  try {
    // Check if album exists
    try {
      await access(albumPath)
    } catch (error) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Album not found'
      })
    }

    // Delete the entire album directory
    await rm(albumPath, { recursive: true, force: true })

    return {
      success: true,
      message: 'Album deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting album:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not delete album.',
    })
  }
})
