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

  const body = await readBody(event)
  const { question, answer, category, keywords } = body

  if (!question || !answer) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Pertanyaan dan jawaban diperlukan'
    })
  }

  // Validate keywords is array if provided
  let keywordsJson = null
  if (keywords) {
    if (!Array.isArray(keywords)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Keywords harus berupa array'
      })
    }
    keywordsJson = JSON.stringify(keywords)
  }

  const result = runQuery(`
    INSERT INTO chatbot_faqs (question, answer, category, keywords)
    VALUES (?, ?, ?, ?)
  `, [question, answer, category || null, keywordsJson])

  return {
    id: result.lastInsertRowid,
    message: 'FAQ berhasil ditambahkan'
  }
})
