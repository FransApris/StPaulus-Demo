import { allQuery } from '../../../database/db'
import { requireAuth, requireUserManagementPermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Check permissions using RBAC
  requireUserManagementPermission(event)

  // Get current user's role
  const currentUserResult = allQuery(`
    SELECT r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `, [userId])

  const currentUser = currentUserResult[0] as { role_name?: string } | undefined

  let query = `
    SELECT u.id, u.username, u.email, u.full_name, u.contact_phone, u.user_category, u.unit_name, u.role, r.name as role_name, r.display_name as role_display_name, u.created_at
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
  `

  const params: any[] = []

  // Filter users based on requester's role
  if (currentUser?.role_name === 'admin_sekretariat') {
    // Admin sekretariat can only see users with role 'user' and 'admin_komsos'
    // Check both RBAC role name and legacy role field
    query += ` WHERE (r.name IN ('user', 'admin_komsos') OR (r.name IS NULL AND u.role IN ('user', 'admin_komsos')))`
  } else if (currentUser?.role_name === 'admin_komsos') {
    // Admin komsos can only see users with role 'user'
    // Check both RBAC role name and legacy role field
    query += ` WHERE (r.name = 'user' OR (r.name IS NULL AND u.role = 'user'))`
  }
  // Super admin can see all users (no additional WHERE clause)
  // Note: super_admin role_name will not trigger the WHERE clause above, so all users are returned

  query += ` ORDER BY u.created_at DESC`

  const users = allQuery(query, params)

  return users
})
