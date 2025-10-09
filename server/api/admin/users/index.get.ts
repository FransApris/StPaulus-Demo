import { allQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Check if user is admin
  const user = allQuery('SELECT role FROM users WHERE id = ?', [userId])[0] as any
  if (user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Akses ditolak'
    })
  }

  const users = allQuery(`
    SELECT id, username, email, full_name, contact_phone, user_category, unit_name, role, created_at
    FROM users
    ORDER BY created_at DESC
  `)

  return users
})
