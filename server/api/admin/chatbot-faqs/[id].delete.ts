import { runQuery, getQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Check permissions using RBAC
  requirePermission('manage_chatbot_faqs')(event)

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
