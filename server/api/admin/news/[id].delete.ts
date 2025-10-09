import { runQuery, getQuery as getDbQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'News ID is required'
      })
    }

    const existingNews = getDbQuery('SELECT id FROM news WHERE id = ?', [id])
    if (!existingNews) {
      throw createError({
        statusCode: 404,
        statusMessage: 'News not found'
      })
    }

    runQuery('DELETE FROM news WHERE id = ?', [id])

    return {
      message: 'News deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting news:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
