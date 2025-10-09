import { runQuery, getQuery } from '../../../database/db'
import { requireAuth, hashPassword } from '../../../utils/auth'

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
  const { username, email, password, full_name, contact_phone, user_category, unit_name, role } = body

  if (!username || !email || !password || !full_name || !user_category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Field yang diperlukan: username, email, password, full_name, user_category'
    })
  }

  if (!['PARISH_COUNCIL', 'CATEGORICAL_GROUP', 'REGION', 'COMMUNITY'].includes(user_category)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kategori pengguna tidak valid'
    })
  }

  if (!['admin', 'user'].includes(role || 'user')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Role tidak valid'
    })
  }

  // Hash password
  const passwordHash = await hashPassword(password)

  // Insert user
  const result = runQuery(`
    INSERT INTO users (username, email, password_hash, full_name, contact_phone, user_category, unit_name, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [username, email, passwordHash, full_name, contact_phone, user_category, unit_name, role || 'user'])

  return {
    id: result.lastInsertRowid,
    message: 'Pengguna berhasil dibuat'
  }
})
