import { allQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Check permissions using RBAC
  requirePermission('manage_bookings')(event)

  const { status } = getQuery(event)

  let query = `
    SELECT
      b.id,
      b.room_id,
      b.user_id,
      b.event_name,
      b.start_time,
      b.end_time,
      b.status,
      b.rejection_reason,
      b.created_at,
      r.name as room_name,
      r.location,
      u.full_name as user_name,
      u.unit_name,
      u.user_category
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN users u ON b.user_id = u.id
    WHERE r.is_active = 1
  `

  const params = []

  if (status) {
    query += ' AND b.status = ?'
    params.push(status)
  }

  query += ' ORDER BY b.created_at DESC'

  const bookings = allQuery(query, params)

  return bookings
})
