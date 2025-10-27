const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Fixing super admin role_ids...')

const fixSuperAdminRoles = async () => {
  // Get super_admin role ID
  const superAdminRole = db.prepare('SELECT id FROM roles WHERE name = ?').get('super_admin')

  if (!superAdminRole) {
    console.error('Super admin role not found. Please run setup-rbac.cjs first.')
    return
  }

  // Update users with role = 'super_admin' but role_id is null
  const updateSuperAdmins = db.prepare(`
    UPDATE users
    SET role_id = ?
    WHERE role = 'super_admin' AND (role_id IS NULL OR role_id != ?)
  `)

  const result = updateSuperAdmins.run(superAdminRole.id, superAdminRole.id)

  console.log(`Updated ${result.changes} super admin users with correct role_id`)

  // Check for any other admin users that might need fixing
  const checkAdmins = db.prepare(`
    SELECT COUNT(*) as count FROM users
    WHERE role = 'admin' AND role_id IS NULL
  `).get()

  if (checkAdmins.count > 0) {
    console.log(`Found ${checkAdmins.count} admin users with null role_id. Updating...`)
    const updateAdmins = db.prepare(`
      UPDATE users
      SET role_id = ?
      WHERE role = 'admin' AND role_id IS NULL
    `)
    const adminResult = updateAdmins.run(superAdminRole.id)
    console.log(`Updated ${adminResult.changes} admin users`)
  }

  // Verify the fix
  const verifySuperAdmins = db.prepare(`
    SELECT u.username, u.role, u.role_id, r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.role = 'super_admin'
  `).all()

  console.log('\nSuper admin users after fix:')
  verifySuperAdmins.forEach(user => {
    console.log(`- ${user.username}: role=${user.role}, role_id=${user.role_id}, role_name=${user.role_name}`)
  })

  console.log('\nSuper admin role fix completed successfully!')
}

fixSuperAdminRoles().catch(console.error).finally(() => db.close())
