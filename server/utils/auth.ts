import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getHeader, getRouterParam } from 'h3'
import db, { getQuery, allQuery } from '../database/db'

const JWT_SECRET = process.env.JWT_SECRET || (() => {
  const defaultSecret = 'dev-secret-key-change-in-production-min-32-characters'
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production')
  }
  console.warn('⚠️  WARNING: Using default JWT_SECRET for development. Set JWT_SECRET environment variable for production!')
  return defaultSecret
})()

// Types
interface User {
  id: number
  username: string
  email: string
  password_hash: string
  role: string
  role_id?: number
  created_at: string
  updated_at: string
}

interface AuthResult {
  user: {
    id: number
    username: string
    email: string
    role: string
  }
  token: string
}

interface AuthContext {
  userId: number
  permissions: string[]
}

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10)
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash)
}

// JWT token generation
export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' })
}

export const verifyToken = (token: string): any => {
  // console.log('Verifying token:', token.substring(0, 50) + '...')
  // console.log('Using secret length:', JWT_SECRET.length)
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    // console.log('Token decoded successfully:', decoded)
    return decoded
  } catch (error: any) {
    // console.log('Token verification failed:', error.message)
    return null
  }
}

// Authentication middleware for API routes
export const requireAuth = (event: any) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)

  if (!decoded) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }

  return decoded
}

// User authentication functions
export const authenticateUser = async (username: string, password: string): Promise<AuthResult | null> => {
  const user = getQuery('SELECT * FROM users WHERE username = ?', [username]) as User | undefined

  if (!user) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.password_hash)

  if (!isValidPassword) {
    return null
  }

  // Generate token
  const token = generateToken(user.id)

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    token
  }
}

// RBAC Functions
export const getUserPermissions = (user: any): string[] => {
  if (!user.role_id) return []

  const permissions = allQuery(`
    SELECT p.name
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    WHERE rp.role_id = ?
  `, [user.role_id]) as { name: string }[]
  return permissions.map(p => p.name)
}

export const requirePermission = (permission: string) => {
  return (event: any) => {
    const authContext = event.context.auth as AuthContext
    if (!authContext || !authContext.permissions?.includes(permission)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Insufficient permissions'
      })
    }
    return authContext
  }
}

export const requireUserManagementPermission = (event: any) => {
  const authContext = event.context.auth as AuthContext
  if (!authContext) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const { userId, permissions } = authContext

  // Super Admin bisa manage semua
  if (permissions.includes('manage_users')) {
    return authContext
  }

  // Admin Sekretariat hanya bisa manage admin_komsos dan admin_sekretariat
  if (permissions.includes('manage_users_komsos_sekretariat')) {
    // For list endpoint (no target user), allow access
    const targetUserId = getRouterParam(event, 'id')
    if (!targetUserId) {
      return authContext
    }
    // Cek apakah target user adalah admin_komsos atau admin_sekretariat
    const targetRole = getQuery('SELECT r.name FROM roles r JOIN users u ON u.role_id = r.id WHERE u.id = ?', [targetUserId]) as { name: string } | undefined
    if (targetRole && ['admin_komsos', 'admin_sekretariat'].includes(targetRole.name)) {
      return authContext
    }
  }

  throw createError({
    statusCode: 403,
    statusMessage: 'Forbidden: Cannot manage this user type'
  })
}

export const getUserById = (userId: number) => {
  return getQuery('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [userId])
}
