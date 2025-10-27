import { getUserPermissions } from '../utils/auth'
import { getQuery } from '../database/db'

export default defineEventHandler(async (event) => {
  // Hanya berlaku untuk rute API admin
  if (event.node.req.url?.startsWith('/api/admin')) {
    try {
      const decoded = requireAuth(event)
      if (decoded) {
        const user = getQuery('SELECT role_id FROM users WHERE id = ?', [decoded.userId])
        if (!user) {
          throw createError({
            statusCode: 401,
            statusMessage: 'User not found'
          })
        }
        const permissions = getUserPermissions(user)
        // Simpan user dan permissions di dalam context event
        event.context.auth = {
          userId: decoded.userId,
          permissions: permissions
        }
      }
    } catch (error) {
      // Jika auth gagal, biarkan middleware auth lain menangani
      throw error
    }
  }
})
