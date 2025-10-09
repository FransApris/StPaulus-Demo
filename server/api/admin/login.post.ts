import { authenticateUser } from '../../utils/auth'

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

  // Check if user has admin role
  if (result.user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Akses ditolak. Hanya admin yang dapat masuk.'
    })
  }

  return result
})
