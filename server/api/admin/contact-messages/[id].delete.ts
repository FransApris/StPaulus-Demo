import { runQuery, getQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication using JWT
  requireAuth(event)

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID pesan diperlukan'
    })
  }

  try {
    // Check if message exists
    const existingMessage = getQuery('SELECT id FROM contact_messages WHERE id = ?', [id]) as any

    if (!existingMessage) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Pesan tidak ditemukan'
      })
    }

    // Delete message
    runQuery('DELETE FROM contact_messages WHERE id = ?', [id])

    return {
      message: 'Pesan berhasil dihapus'
    }
  } catch (error) {
    console.error('Error deleting contact message:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
