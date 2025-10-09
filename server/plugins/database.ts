import { initDatabase } from '../database/db'

export default defineNitroPlugin(() => {
  // Initialize database on server start
  try {
    initDatabase()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization failed:', error)
  }
})
