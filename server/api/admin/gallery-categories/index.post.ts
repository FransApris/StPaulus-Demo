import { requireAuth, requirePermission } from '../../../utils/auth'
import db from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_gallery_categories')(event)

  const body = await readBody(event)
  const { nama_kategori, description, color } = body

  // Validate required fields
  if (!nama_kategori) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nama kategori is required'
    })
  }

  try {
    // Generate slug from nama_kategori
    const slug = nama_kategori
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if slug already exists
    const existingCategory = db.prepare('SELECT id FROM gallery_categories WHERE slug = ?').get(slug)
    if (existingCategory) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Category with this name already exists'
      })
    }

    // Get next display order
    const maxOrder = db.prepare('SELECT MAX(display_order) as max_order FROM gallery_categories').get() as any
    const displayOrder = (maxOrder?.max_order || 0) + 1

    // Insert new category
    const insertCategory = db.prepare(`
      INSERT INTO gallery_categories (nama_kategori, slug, description, color, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `)

    const result = insertCategory.run(nama_kategori, slug, description || '', color || '#6B7280', displayOrder)

    // Get the created category
    const category = db.prepare('SELECT * FROM gallery_categories WHERE id = ?').get(result.lastInsertRowid) as any

    return {
      success: true,
      category
    }
  } catch (error) {
    console.error('Error creating gallery category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create gallery category'
    })
  }
})
