import { runQuery } from '../database/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, message } = body

    // Validation
    if (!name || !email || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nama, email, dan pesan diperlukan'
      })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format email tidak valid'
      })
    }

    // Insert contact message
    const result = runQuery(
      'INSERT INTO contact_messages (name, email, message, is_read, created_at, updated_at) VALUES (?, ?, ?, FALSE, datetime(\'now\'), datetime(\'now\'))',
      [name, email, message]
    )

    return {
      id: result.lastInsertRowid,
      message: 'Pesan berhasil dikirim'
    }
  } catch (error) {
    console.error('Error creating contact message:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
