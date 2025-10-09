import { runQuery, getQuery } from '../../../../database/db'
import { requireAuth } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication using JWT
  requireAuth(event)

  try {
    const body = await readBody(event)

    // Validate required fields
    const { name, color } = body

    if (!name || !color) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and color are required'
      })
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if name already exists
    const existingName = getQuery('SELECT id FROM agenda_categories WHERE name = ?', [name])
    if (existingName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category with this name already exists'
      })
    }

    // Check if slug already exists (fallback)
    const existingSlug = getQuery('SELECT id FROM agenda_categories WHERE slug = ?', [slug])
    if (existingSlug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category with this slug already exists'
      })
    }

    // Insert new category
    const sql = `
      INSERT INTO agenda_categories (name, slug, description, color)
      VALUES (?, ?, ?, ?)
    `

    const result = runQuery(sql, [
      name,
      slug,
      body.description || null,
      color
    ])

    return {
      success: true,
      message: 'Category created successfully',
      id: result.lastInsertRowid
    }
  } catch (error: any) {
    console.error('Error creating category:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
