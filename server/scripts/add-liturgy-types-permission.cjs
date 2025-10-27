const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Adding liturgy types management permission to RBAC system...')

const addLiturgyTypesPermission = async () => {
  // Insert liturgy types management permission
  const permission = {
    name: 'manage_liturgy_types',
    display_name: 'Kelola Jenis Liturgi',
    description: 'Membuat, mengedit, dan menghapus jenis liturgi'
  }

  console.log('Inserting liturgy types management permission...')
  const insertPermission = db.prepare(`
    INSERT OR IGNORE INTO permissions (name, display_name, description)
    VALUES (?, ?, ?)
  `)

  insertPermission.run(permission.name, permission.display_name, permission.description)

  // Assign permission to super_admin role
  console.log('Assigning manage_liturgy_types permission to super_admin role...')
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

  const permResult = db.prepare('SELECT id FROM permissions WHERE name = ?').get('manage_liturgy_types')
  const permId = permResult?.id

  if (!permId) {
    console.error('manage_liturgy_types permission not found')
    return
  }

  insertRolePermission.run(roleId, permId)

  console.log('Liturgy types management permission added successfully!')
}

addLiturgyTypesPermission().catch(console.error).finally(() => db.close())
