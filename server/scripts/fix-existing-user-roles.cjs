const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Fixing existing user roles...')

const fixUserRoles = () => {
  // Update users with correct role names based on role_id
  const updateRole = db.prepare(`
    UPDATE users
    SET role = (
      SELECT r.name
      FROM roles r
      WHERE r.id = users.role_id
    )
    WHERE role_id IS NOT NULL
  `)

  const result = updateRole.run()
  console.log(`Updated ${result.changes} user roles`)

  // Verify the updates
  const users = db.prepare('SELECT id, username, role, role_id FROM users').all()
  console.log('Current user roles:')
  users.forEach(user => {
    console.log(`- ${user.username}: role='${user.role}', role_id=${user.role_id}`)
  })
}

fixUserRoles()
db.close()
console.log('User roles fixed successfully!')
