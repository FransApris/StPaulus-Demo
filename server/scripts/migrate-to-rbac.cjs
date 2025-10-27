const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Migrating existing users to RBAC system...')

const migrateToRBAC = async () => {
  // Update existing users berdasarkan role lama
  console.log('Updating admin users to super_admin role...')
  db.prepare(`
    UPDATE users
    SET role_id = (SELECT id FROM roles WHERE name = 'super_admin')
    WHERE role = 'admin'
  `).run()

  console.log('Updating regular users to admin_sekretariat role...')
  db.prepare(`
    UPDATE users
    SET role_id = (SELECT id FROM roles WHERE name = 'admin_sekretariat')
    WHERE role = 'user'
  `).run()

  // Check results
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get()
  const migratedCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE role_id IS NOT NULL').get()

  console.log(`Total users: ${userCount.count}`)
  console.log(`Migrated users: ${migratedCount.count}`)

  console.log('Migration to RBAC completed successfully!')
}

migrateToRBAC().catch(console.error).finally(() => db.close())
