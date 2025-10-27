const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Adding hero themes permission...')

try {
  // Add the permission
  const insertPermission = db.prepare(`
    INSERT OR IGNORE INTO permissions (name, display_name)
    VALUES (?, ?)
  `)

  insertPermission.run('manage_hero_themes', 'Kelola Tema Hero')
  console.log('✓ Added manage_hero_themes permission')

  // Get role IDs
  const superAdminRole = db.prepare('SELECT id FROM roles WHERE name = ?').get('super_admin')
  const adminKomsosRole = db.prepare('SELECT id FROM roles WHERE name = ?').get('admin_komsos')

  if (!superAdminRole || !adminKomsosRole) {
    console.error('Required roles not found')
    return
  }

  // Get permission ID
  const permission = db.prepare('SELECT id FROM permissions WHERE name = ?').get('manage_hero_themes')

  if (!permission) {
    console.error('Permission not found')
    return
  }

  // Assign to super_admin and admin_komsos
  const insertRolePermission = db.prepare(`
    INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
    VALUES (?, ?)
  `)

  insertRolePermission.run(superAdminRole.id, permission.id)
  console.log('✓ Assigned to super_admin role')

  insertRolePermission.run(adminKomsosRole.id, permission.id)
  console.log('✓ Assigned to admin_komsos role')

  console.log('✅ Hero themes permission setup completed!')

} catch (error) {
  console.error('❌ Error:', error)
} finally {
  db.close()
}
