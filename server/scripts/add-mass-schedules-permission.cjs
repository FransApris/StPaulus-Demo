const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Adding mass schedules management permission to super_admin role...')

const addMassSchedulesPermission = async () => {
  // Check if permission exists
  const permResult = db.prepare('SELECT id FROM permissions WHERE name = ?').get('manage_mass_schedules')
  if (!permResult) {
    console.error('manage_mass_schedules permission not found')
    return
  }

  const permId = permResult.id

  // Get super_admin role
  const roleResult = db.prepare('SELECT id FROM roles WHERE name = ?').get('super_admin')
  if (!roleResult) {
    console.error('super_admin role not found')
    return
  }

  const roleId = roleResult.id

  // Check if already assigned
  const existing = db.prepare('SELECT id FROM role_permissions WHERE role_id = ? AND permission_id = ?').get(roleId, permId)
  if (existing) {
    console.log('manage_mass_schedules permission already assigned to super_admin')
    return
  }

  // Assign permission to super_admin role
  console.log('Assigning manage_mass_schedules permission to super_admin role...')
  const insertRolePermission = db.prepare(`
    INSERT INTO role_permissions (role_id, permission_id)
    VALUES (?, ?)
  `)

  insertRolePermission.run(roleId, permId)

  console.log('Mass schedules management permission added to super_admin successfully!')
}

addMassSchedulesPermission().catch(console.error).finally(() => db.close())
