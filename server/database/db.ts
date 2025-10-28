import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Database file path
const DB_PATH = path.join(process.cwd(), 'server/database/cms.db')

// Ensure database directory exists (skip on Vercel serverless)
const dbDir = path.dirname(DB_PATH)
try {
  if (!fs.existsSync(dbDir) && !process.env.VERCEL) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
} catch (error) {
  console.warn('Could not create database directory:', error instanceof Error ? error.message : String(error))
}

// Initialize database
const db = new Database(DB_PATH)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Export database instance
export default db

// Helper functions
export const runQuery = (query: string, params: any[] = []) => {
  return db.prepare(query).run(...params)
}

export const getQuery = (query: string, params: any[] = []) => {
  return db.prepare(query).get(...params)
}

export const allQuery = (query: string, params: any[] = []) => {
  return db.prepare(query).all(...params)
}

// Initialize database schema
export const initDatabase = () => {
  // Check if tables already exist
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get()
  if (tables) {
    console.log('Database already initialized')
    return
  }

  const schemaPath = path.join(process.cwd(), 'server/database/schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf8')

  // Split schema into individual statements
  const statements = schema.split(';').filter(stmt => stmt.trim().length > 0)

  // Execute each statement
  for (const statement of statements) {
    if (statement.trim()) {
      db.exec(statement.trim() + ';')
    }
  }

  console.log('Database initialized successfully')
}

// Close database connection
export const closeDatabase = () => {
  db.close()
}

// Export for use in API routes
export { db }
