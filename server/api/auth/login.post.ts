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

  return result
})
