import { runQuery, getQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Check if user is admin
  const user = getQuery('SELECT role FROM users WHERE id = ?', [userId]) as any
  if (user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Akses ditolak'
    })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID diperlukan'
    })
  }

  // Check if FAQ exists
  const existing = getQuery('SELECT id FROM chatbot_faqs WHERE id = ?', [id]) as any
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'FAQ tidak ditemukan'
    })
  }

  runQuery('DELETE FROM chatbot_faqs WHERE id = ?', [id])

  return {
    message: 'FAQ berhasil dihapus'
  }
})
