import { runQuery, getQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check permissions using RBAC
  requirePermission('manage_pages')(event)

  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Page slug is required'
    })
  }

  // Check if page exists
  const existingPage = getQuery('SELECT id FROM pages WHERE slug = ?', [slug])
  if (!existingPage) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not found'
    })
  }

  try {
    runQuery('DELETE FROM pages WHERE slug = ?', [slug])

    return { success: true, message: 'Page deleted successfully' }
  } catch (error: any) {
    console.error('Error deleting page:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to delete page'
    })
  }
})
