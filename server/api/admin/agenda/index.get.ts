import { allQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication using JWT
  requireAuth(event)

  try {
    // Get query parameters
    const query = getQuery(event)
    const category = query?.category as string
    const search = query?.search as string
    const startDate = query?.startDate as string
    const endDate = query?.endDate as string

    // Build query with JOIN to get category names
    let sql = `
      SELECT a.*, c.name as category_name, c.color as category_color
      FROM agendas a
      LEFT JOIN agenda_categories c ON a.category_id = c.id
      WHERE 1=1
    `
    let params: any[] = []

    if (category) {
      sql += ' AND c.name = ?'
      params.push(category)
    }

    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)'
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (startDate) {
      sql += ' AND start_date >= ?'
      params.push(startDate)
    }

    if (endDate) {
      sql += ' AND start_date <= ?'
      params.push(endDate)
    }

    sql += ' ORDER BY start_date ASC'

    const agendas = allQuery(sql, params)

    // Convert to plain objects for JSON serialization
    return agendas.map((agenda: any) => ({
      id: agenda.id,
      title: agenda.title,
      description: agenda.description,
      start_date: agenda.start_date,
      end_date: agenda.end_date,
      location: agenda.location,
      category: agenda.category_name || 'Uncategorized', // Use category name from JOIN
      category_id: agenda.category_id,
      category_color: agenda.category_color,
      contact_person: agenda.contact_person,
      created_at: agenda.created_at,
      updated_at: agenda.updated_at
    }))
  } catch (error) {
    console.error('Error fetching agendas:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
