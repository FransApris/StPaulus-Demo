import { authenticateUser } from '../../utils/auth'
import { getQuery } from '../../database/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { username, password } = body

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username dan password diperlukan'
    })
  }

  const result = await authenticateUser(username, password)

  if (!result) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Username atau password salah'
    })
  }

  // Check if user has admin role (RBAC: check if user has role_id assigned)
  const userDetails = getQuery('SELECT role_id FROM users WHERE id = ?', [result.user.id]) as { role_id?: number } | undefined
  if (!userDetails || !userDetails.role_id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Akses ditolak. Hanya admin yang dapat masuk.'
    })
  }

  return result
})
