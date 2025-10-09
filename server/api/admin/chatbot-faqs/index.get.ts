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

  const faqs = allQuery(`
    SELECT id, question, answer, category, keywords, is_active, usage_count, created_at, updated_at
    FROM chatbot_faqs
    ORDER BY created_at DESC
  `)

  return faqs
})
