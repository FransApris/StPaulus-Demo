import { allQuery } from '../database/db'
import { requireAuth, getUserPermissions } from '../utils/auth'

export default defineEventHandler(async (event) => {
  // Require authentication
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Get user permissions
  const userPermissions = getUserPermissions({ id: userId })

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

  // If user doesn't have manage_bookings permission, only show their own bookings or all approved
  if (!userPermissions.includes('manage_bookings')) {
    query += " AND (b.user_id = ? OR b.status = 'APPROVED')"
    params.push(userId)
  }

  query += ' ORDER BY b.start_time ASC'

  const bookings = allQuery(query, params)

  return bookings
})
