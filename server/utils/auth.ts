import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getHeader } from 'h3'
import { getQuery } from '../database/db'

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
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
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

export const getUserById = (userId: number) => {
  return getQuery('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [userId])
}
