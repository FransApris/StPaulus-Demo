const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Adding pages management permission to RBAC system...')

const addPagesPermission = async () => {
  // Insert pages management permission
  const permission = {
    name: 'manage_pages',
    display_name: 'Kelola Halaman',
    description: 'Membuat, mengedit, dan menghapus halaman statis'
  }

  console.log('Inserting pages management permission...')
  const insertPermission = db.prepare(`
    INSERT OR IGNORE INTO permissions (name, display_name, description)
    VALUES (?, ?, ?)
  `)

  insertPermission.run(permission.name, permission.display_name, permission.description)

  // Assign permission to super_admin role
  console.log('Assigning manage_pages permission to super_admin role...')
  const insertRolePermission = db.prepare(`
    INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
    VALUES (?, ?)
  `)

  const roleResult = db.prepare('SELECT id FROM roles WHERE name = ?').get('super_admin')
  const roleId = roleResult?.id

  if (!roleId) {
    console.error('super_admin role not found')
    return
  }

  const permResult = db.prepare('SELECT id FROM permissions WHERE name = ?').get('manage_pages')
  const permId = permResult?.id

  if (!permId) {
    console.error('manage_pages permission not found')
    return
  }

  insertRolePermission.run(roleId, permId)

  console.log('Pages management permission added successfully!')
}

addPagesPermission().catch(console.error).finally(() => db.close())
