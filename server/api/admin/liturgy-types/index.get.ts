import { allQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check permission
  requirePermission('manage_liturgy_types')(event)

  try {
    const liturgyTypes = allQuery(`
      SELECT id, name, slug, icon, color, description, display_order, is_active, created_at, updated_at
      FROM liturgy_types
      ORDER BY display_order ASC, name ASC
    `)

    return { liturgyTypes }
  } catch (error) {
    console.error('Error fetching liturgy types:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch liturgy types'
    })
  }
})
