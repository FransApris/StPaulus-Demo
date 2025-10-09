import { allQuery } from '../database/db'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  // Require authentication
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Get user info to check role
  const user = allQuery('SELECT role FROM users WHERE id = ?', [userId])[0] as any
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not found'
    })
  }

  const { start, end, status } = getQuery(event)

  let query = `
    SELECT
      b.id,
      b.room_id,
      b.user_id,
      b.event_name,
      b.start_time,
      b.end_time,
      b.status,
      b.created_at,
      r.name as room_name,
      r.location,
      u.full_name as user_name,
      u.unit_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN users u ON b.user_id = u.id
    WHERE r.is_active = 1
  `

  const params = []

  if (start) {
    query += ' AND b.start_time >= ?'
    params.push(start)
  }

  if (end) {
    query += ' AND b.end_time <= ?'
    params.push(end)
  }

  if (status) {
    query += ' AND b.status = ?'
    params.push(status)
  } else {
    // Default to approved for calendar view
    query += " AND b.status = 'APPROVED'"
  }

  // If user is not admin, only show their own bookings or all approved
  if (user.role !== 'admin') {
    query += " AND (b.user_id = ? OR b.status = 'APPROVED')"
    params.push(userId)
  }

  query += ' ORDER BY b.start_time ASC'

  const bookings = allQuery(query, params)

  return bookings
})
