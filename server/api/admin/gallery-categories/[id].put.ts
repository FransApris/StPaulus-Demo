import { requireAuth, requirePermission } from '../../../utils/auth'
import db from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_gallery_categories')(event)

  const categoryId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { nama_kategori, description, color, display_order, is_active } = body

  if (!categoryId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID is required'
    })
  }

  try {
    // Check if category exists
    const existingCategory = db.prepare('SELECT id FROM gallery_categories WHERE id = ?').get(categoryId)
    if (!existingCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // Generate new slug if nama_kategori changed
    let slug = null
    if (nama_kategori) {
      slug = nama_kategori
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      // Check if new slug conflicts with other categories
      const slugConflict = db.prepare('SELECT id FROM gallery_categories WHERE slug = ? AND id != ?').get(slug, categoryId)
      if (slugConflict) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Category with this name already exists'
        })
      }
    }

    // Update category
    const updateFields = []
    const updateValues = []

    if (nama_kategori !== undefined) {
      updateFields.push('nama_kategori = ?')
      updateValues.push(nama_kategori)
    }

    if (slug) {
      updateFields.push('slug = ?')
      updateValues.push(slug)
    }

    if (description !== undefined) {
      updateFields.push('description = ?')
      updateValues.push(description)
    }

    if (color !== undefined) {
      updateFields.push('color = ?')
      updateValues.push(color)
    }

    if (display_order !== undefined) {
      updateFields.push('display_order = ?')
      updateValues.push(display_order)
    }

    if (is_active !== undefined) {
      updateFields.push('is_active = ?')
      updateValues.push(is_active ? 1 : 0)
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP')
    updateValues.push(categoryId)

    const updateQuery = `UPDATE gallery_categories SET ${updateFields.join(', ')} WHERE id = ?`
    db.prepare(updateQuery).run(...updateValues)

    // Get updated category
    const category = db.prepare('SELECT * FROM gallery_categories WHERE id = ?').get(categoryId) as any

    return {
      success: true,
      category
    }
  } catch (error) {
    console.error('Error updating gallery category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update gallery category'
    })
  }
})
