import { requireAuth, requirePermission } from '../../../utils/auth'
import db from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_gallery')(event)

  const albumId = getRouterParam(event, 'id')

  if (!albumId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Album ID is required'
    })
  }

  try {
    // Check if album exists
    const existingAlbum = db.prepare('SELECT id, title FROM gallery_albums WHERE slug = ?').get(albumId) as any
    if (!existingAlbum) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Album not found'
      })
    }

    // Delete album (photos will be deleted automatically due to CASCADE)
    const deleteAlbum = db.prepare('DELETE FROM gallery_albums WHERE slug = ?')
    deleteAlbum.run(albumId)

    return {
      success: true,
      message: `Album "${existingAlbum.title}" has been deleted successfully`
    }
  } catch (error) {
    console.error('Error deleting album:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete album'
    })
  }
})
