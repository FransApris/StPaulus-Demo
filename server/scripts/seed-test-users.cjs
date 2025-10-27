const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Seeding test users for RBAC testing...')

const seedTestUsers = async () => {
  // Get role IDs
  const superAdminRole = db.prepare('SELECT id FROM roles WHERE name = ?').get('super_admin')
  const adminKomsosRole = db.prepare('SELECT id FROM roles WHERE name = ?').get('admin_komsos')
  const adminSekretariatRole = db.prepare('SELECT id FROM roles WHERE name = ?').get('admin_sekretariat')

  if (!superAdminRole || !adminKomsosRole || !adminSekretariatRole) {
    console.error('Roles not found. Please run setup-rbac.cjs first.')
    return
  }

  // Hash password
  const password = 'password123'
  const hashedPassword = await bcrypt.hash(password, 10)

  // Test users
  const testUsers = [
    {
      username: 'superadmin',
      email: 'superadmin@test.com',
      password_hash: hashedPassword,
      role: 'super_admin',
      role_id: superAdminRole.id,
      full_name: 'Super Admin User'
    },
    {
      username: 'adminkomsos',
      email: 'komsos@test.com',
      password_hash: hashedPassword,
      role: 'admin_komsos',
      role_id: adminKomsosRole.id,
      full_name: 'Admin Komsos User'
    },
    {
      username: 'adminsekretariat',
      email: 'sekretariat@test.com',
      password_hash: hashedPassword,
      role: 'admin_sekretariat',
      role_id: adminSekretariatRole.id,
      full_name: 'Admin Sekretariat User'
    }
  ]

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (username, email, password_hash, role, role_id, full_name)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  testUsers.forEach(user => {
    try {
      insertUser.run(user.username, user.email, user.password_hash, user.role, user.role_id, user.full_name)
      console.log(`Created user: ${user.username} (${user.full_name})`)
    } catch (e) {
      console.log(`User ${user.username} already exists`)
    }
  })

  console.log('\nTest users created successfully!')
  console.log('Login credentials:')
  console.log('Super Admin: superadmin / password123')
  console.log('Admin Komsos: adminkomsos / password123')
  console.log('Admin Sekretariat: adminsekretariat / password123')
}

seedTestUsers().catch(console.error).finally(() => db.close())
