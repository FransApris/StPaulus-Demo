import { hash } from 'bcrypt'
import { runQuery } from '../database/db'

async function createAdminUser() {
  try {
    // Hash the password
    const passwordHash = await hash('admin123', 10)

    // Insert admin user
    runQuery(
      'INSERT OR IGNORE INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@stpaulusjuanda.org', passwordHash, 'admin']
    )

    console.log('Admin user created successfully!')
    console.log('Username: admin')
    console.log('Password: admin123')
  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}

createAdminUser()
