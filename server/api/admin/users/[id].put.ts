import { runQuery, getQuery, allQuery } from '../../../database/db'
import { requireAuth, requireUserManagementPermission } from '../../../utils/auth'
import { hashPassword } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Check permissions using RBAC
  requireUserManagementPermission(event)

  const targetUserId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { username, email, full_name, contact_phone, user_category, unit_name, role } = body

  // Validate required fields
  if (!username || !email || !full_name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username, email, dan nama lengkap diperlukan'
    })
  }

  // Validate user_category against dynamic categories if provided
  if (user_category) {
    const validCategories = allQuery('SELECT name FROM user_categories WHERE is_active = 1') as { name: string }[]
    const validCategoryNames = validCategories.map((c: { name: string }) => c.name)
    if (!validCategoryNames.includes(user_category)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Kategori pengguna tidak valid'
      })
    }
  }

  // Check if user exists
  const existingUser = getQuery('SELECT id, role_id FROM users WHERE id = ?', [targetUserId]) as any
  if (!existingUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Pengguna tidak ditemukan'
    })
  }

  // Check if username/email is already taken by another user
  const duplicateCheck = getQuery(`
    SELECT id FROM users
    WHERE (username = ? OR email = ?) AND id != ?
  `, [username, email, targetUserId]) as any

  if (duplicateCheck) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username atau email sudah digunakan'
    })
  }

  // Get current user's role to determine what they can edit
  const currentUserRole = getQuery(`
    SELECT r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `, [userId]) as { role_name?: string } | undefined

  // Prepare update data
  const updateData: any = {
    username,
    email,
    full_name,
    contact_phone: contact_phone || null,
    user_category: user_category || null,
    unit_name: unit_name || null,
    updated_at: new Date().toISOString()
  }

  // Handle role updates - only super_admin can change roles
  if (role && currentUserRole?.role_name === 'super_admin') {
    // Normalize role to lowercase for validation
    const normalizedRole = role.toLowerCase()
    // Get role_id from roles table (case insensitive)
    const roleRecord = getQuery('SELECT id FROM roles WHERE LOWER(name) = ?', [normalizedRole]) as { id?: number } | undefined
    if (roleRecord?.id) {
      updateData.role_id = roleRecord.id
      // Also update legacy role field for backward compatibility
      updateData.role = normalizedRole
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'Role tidak valid'
      })
    }
  }

  // Build update query
  const fields = Object.keys(updateData)
  const values = Object.values(updateData)
  const setClause = fields.map(field => `${field} = ?`).join(', ')

  runQuery(`
    UPDATE users SET ${setClause} WHERE id = ?
  `, [...values, targetUserId])

  return {
    message: 'Pengguna berhasil diperbarui'
  }
})
