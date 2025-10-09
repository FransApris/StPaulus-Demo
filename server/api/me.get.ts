import { getQuery } from '../database/db'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)

  const user = getQuery('SELECT id, username, email, full_name, contact_phone, user_category, unit_name, role FROM users WHERE id = ?', [decoded.userId]) as any

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  return user
})
