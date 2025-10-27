const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '../database/cms.db')
const db = new Database(dbPath)

console.log('Adding gallery categories permission...')

try {
  // Add the permission
  const insertPermission = db.prepare(`
    INSERT OR IGNORE INTO permissions (name, display_name, description)
    VALUES (?, ?, ?)
  `)

  insertPermission.run(
    'manage_gallery_categories',
    'Manage Gallery Categories',
    'Can create, edit, and delete gallery categories'
  )

  console.log('✓ Added manage_gallery_categories permission')

  // Get role IDs
  const superAdminRole = db.prepare('SELECT id FROM roles WHERE name = ?').get('super_admin')
  const adminKomsosRole = db.prepare('SELECT id FROM roles WHERE name = ?').get('admin_komsos')

  if (superAdminRole) {
    // Assign to super_admin
    const assignSuperAdmin = db.prepare(`
      INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
      SELECT ?, id FROM permissions WHERE name = ?
    `)
    assignSuperAdmin.run(superAdminRole.id, 'manage_gallery_categories')
    console.log('✓ Assigned to super_admin role')
  }

  if (adminKomsosRole) {
    // Assign to admin_komsos
    const assignAdminKomsos = db.prepare(`
      INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
      SELECT ?, id FROM permissions WHERE name = ?
    `)
    assignAdminKomsos.run(adminKomsosRole.id, 'manage_gallery_categories')
    console.log('✓ Assigned to admin_komsos role')
  }

  console.log('✅ Gallery categories permission setup completed!')
} catch (error) {
  console.error('Error setting up gallery categories permission:', error)
} finally {
  db.close()
}
