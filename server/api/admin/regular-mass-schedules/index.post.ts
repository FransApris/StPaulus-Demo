import { requireAuth } from '../../../utils/auth'
import { runQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  // Require authentication
  requireAuth(event)

  try {
    const body = await readBody(event)
    const { day_of_week, time, mass_type } = body

    // Validate required fields
    if (!day_of_week || !time || !mass_type) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Hari, waktu, dan jenis misa diperlukan'
      })
    }

    // Validate day_of_week
    const validDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
    if (!validDays.includes(day_of_week)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Hari tidak valid'
      })
    }

    // Insert new regular mass schedule
    const result = runQuery(
      'INSERT INTO regular_mass_schedules (day_of_week, time, mass_type) VALUES (?, ?, ?)',
      [day_of_week, time, mass_type]
    )

    return {
      id: result.lastInsertRowid,
      day_of_week,
      time,
      mass_type,
      is_active: true,
      created_at: new Date().toISOString()
    }
  } catch (error: any) {
    console.error('Error creating regular mass schedule:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to create regular mass schedule'
    })
  }
})
