import { runQuery, getQuery, allQuery } from '../../../database/db'
import { requireAuth, hashPassword } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const adminId = decoded.userId

  // Check admin's role using RBAC
  const admin = getQuery(`
    SELECT u.id, r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `, [adminId]) as any

  if (!admin) {
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

  // Validate user_category against dynamic categories
  const validCategories = allQuery('SELECT name FROM user_categories WHERE is_active = 1') as { name: string }[]
  const validCategoryNames = validCategories.map((c: { name: string }) => c.name)
  if (!validCategoryNames.includes(user_category)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kategori pengguna tidak valid'
    })
  }

  // Validate role permissions: only super_admin can create admin accounts
  const requestedRole = role || 'user'
  if (!['admin', 'user'].includes(requestedRole)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Role tidak valid'
    })
  }

  // Only super_admin can create admin accounts
  if (requestedRole === 'admin' && admin.role_name !== 'super_admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Hanya super admin yang dapat membuat akun admin'
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
