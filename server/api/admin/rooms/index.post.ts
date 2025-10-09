import { runQuery, getQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const adminId = decoded.userId

  // Check if user is admin
  const admin = getQuery('SELECT role FROM users WHERE id = ?', [adminId]) as any
  if (!admin || admin.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Akses ditolak'
    })
  }

  const body = await readBody(event)
  const { name, capacity, location, facilities, photo_url, requires_approval, allowed_categories } = body

  if (!name || !capacity || !location) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Field yang diperlukan: name, capacity, location'
    })
  }

  // Validate allowed_categories if provided
  if (allowed_categories) {
    try {
      const categories = JSON.parse(allowed_categories)
      if (!Array.isArray(categories)) {
        throw new Error()
      }
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'allowed_categories harus berupa array JSON yang valid'
      })
    }
  }

  // Insert room
  const result = runQuery(`
    INSERT INTO rooms (name, capacity, location, facilities, photo_url, requires_approval, allowed_categories)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [name, capacity, location, facilities || null, photo_url || null, requires_approval ? 1 : 0, allowed_categories || null])

  return {
    id: result.lastInsertRowid,
    message: 'Ruangan berhasil dibuat'
  }
})
