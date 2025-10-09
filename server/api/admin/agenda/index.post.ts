import { runQuery, allQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication using JWT
  requireAuth(event)

  try {
    const body = await readBody(event)

    // Validate required fields
    const { title, start_date, location, category_id } = body

    if (!title || !start_date || !location || !category_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title, start date, location, and category are required'
      })
    }

    // Validate category exists
    const categoryCheck = allQuery('SELECT id FROM agenda_categories WHERE id = ?', [category_id])
    if (!categoryCheck || categoryCheck.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid category'
      })
    }

    // Insert new agenda
    const sql = `
      INSERT INTO agendas (title, description, start_date, end_date, location, category_id, contact_person)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    const result = runQuery(sql, [
      title,
      body.description || null,
      start_date,
      body.end_date || null,
      location,
      category_id,
      body.contact_person || null
    ])

    return {
      success: true,
      message: 'Agenda created successfully',
      id: result.lastInsertRowid
    }
  } catch (error: any) {
    console.error('Error creating agenda:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
