import { requireAuth } from '../../../utils/auth'
import { runQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Require authentication
  requireAuth(event)

  try {
    const id = parseInt(getRouterParam(event, 'id')!)

    // Delete the regular mass schedule
    runQuery('DELETE FROM regular_mass_schedules WHERE id = ?', [id])

    return { success: true, message: 'Regular mass schedule deleted successfully' }
  } catch (error: any) {
    console.error('Error deleting regular mass schedule:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to delete regular mass schedule'
    })
  }
})
