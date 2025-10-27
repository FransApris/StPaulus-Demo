import { requireAuth, requirePermission } from '../../../utils/auth'
import db from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_gallery_categories')(event)

  try {
    const categories = db.prepare(`
      SELECT
        id,
        nama_kategori,
        slug,
        description,
        color,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM gallery_categories
      ORDER BY display_order ASC, nama_kategori ASC
    `).all()

    return { categories }
  } catch (error) {
    console.error('Error fetching gallery categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not fetch gallery categories.'
    })
  }
})
