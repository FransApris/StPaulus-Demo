const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Adding document management permissions to RBAC system...')

const addDocumentPermissions = async () => {
  // Insert document management permissions
  const permissions = [
    { name: 'manage_document_categories', display_name: 'Kelola Kategori Dokumen', description: 'Membuat, mengedit, dan menghapus kategori dokumen' },
    { name: 'manage_documents', display_name: 'Kelola Dokumen', description: 'Mengunggah, mengedit, dan menghapus dokumen paroki' }
  ]

  console.log('Inserting document management permissions...')
  const insertPermission = db.prepare(`
    INSERT OR IGNORE INTO permissions (name, display_name, description)
    VALUES (?, ?, ?)
  `)

  for (const perm of permissions) {
    insertPermission.run(perm.name, perm.display_name, perm.description)
  }

  // Assign permissions to roles
  const rolePermissions = {
    super_admin: [
      'manage_document_categories',
      'manage_documents'
    ],
    admin_sekretariat: [
      'manage_document_categories',
      'manage_documents'
    ]
  }

  console.log('Assigning document permissions to roles...')
  const insertRolePermission = db.prepare(`
    INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
    VALUES (?, ?)
  `)

  for (const [roleName, perms] of Object.entries(rolePermissions)) {
    const roleResult = db.prepare('SELECT id FROM roles WHERE name = ?').get(roleName)
    const roleId = roleResult?.id

    if (!roleId) {
      console.error(`Role ${roleName} not found`)
      continue
    }

    for (const permName of perms) {
      const permResult = db.prepare('SELECT id FROM permissions WHERE name = ?').get(permName)
      const permId = permResult?.id

      if (!permId) {
        console.error(`Permission ${permName} not found`)
        continue
      }

      insertRolePermission.run(roleId, permId)
    }
  }

  console.log('Document management permissions added successfully!')
}

addDocumentPermissions().catch(console.error).finally(() => db.close())
