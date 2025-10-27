const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Setting up RBAC system...')

const setupRBAC = async () => {
  // Insert roles
  const roles = [
    { name: 'super_admin', display_name: 'Super Admin', description: 'Akses penuh ke semua fitur' },
    { name: 'admin_komsos', display_name: 'Admin Komsos', description: 'Kelola konten dan komunikasi' },
    { name: 'admin_sekretariat', display_name: 'Admin Sekretariat', description: 'Kelola agenda dan administrasi' }
  ]

  console.log('Inserting roles...')
  const insertRole = db.prepare(`
    INSERT OR IGNORE INTO roles (name, display_name, description)
    VALUES (?, ?, ?)
  `)

  for (const role of roles) {
    insertRole.run(role.name, role.display_name, role.description)
  }

  // Insert permissions
  const permissions = [
    { name: 'manage_articles', display_name: 'Kelola Artikel' },
    { name: 'manage_news', display_name: 'Kelola Berita' },
    { name: 'manage_article_categories', display_name: 'Kelola Kategori Artikel/Berita' },
    { name: 'manage_gallery', display_name: 'Kelola Galeri' },
    { name: 'manage_agenda', display_name: 'Kelola Agenda' },
    { name: 'manage_agenda_categories', display_name: 'Kelola Kategori Agenda' },
    { name: 'manage_regular_mass_schedules', display_name: 'Kelola Jadwal Misa Rutin' },
    { name: 'manage_mass_schedules', display_name: 'Kelola Jadwal Misa' },
    { name: 'manage_contact_messages', display_name: 'Kelola Pesan Masuk' },
    { name: 'manage_users', display_name: 'Kelola Semua Pengguna' },
    { name: 'manage_users_komsos_sekretariat', display_name: 'Kelola Admin Komsos & Sekretariat' },
    { name: 'manage_rooms', display_name: 'Kelola Ruangan' },
    { name: 'manage_bookings', display_name: 'Kelola Pemesanan' },
    { name: 'manage_chatbot_faqs', display_name: 'Kelola Chatbot FAQ' }
  ]

  console.log('Inserting permissions...')
  const insertPermission = db.prepare(`
    INSERT OR IGNORE INTO permissions (name, display_name)
    VALUES (?, ?)
  `)

  for (const perm of permissions) {
    insertPermission.run(perm.name, perm.display_name)
  }

  // Assign permissions to roles
  const rolePermissions = {
    super_admin: [
      'manage_articles', 'manage_news', 'manage_article_categories', 'manage_gallery',
      'manage_agenda', 'manage_agenda_categories', 'manage_regular_mass_schedules',
      'manage_contact_messages', 'manage_users', 'manage_rooms', 'manage_bookings', 'manage_chatbot_faqs'
    ],
    admin_komsos: [
      'manage_articles', 'manage_news', 'manage_article_categories', 'manage_gallery', 'manage_chatbot_faqs'
    ],
    admin_sekretariat: [
      'manage_agenda', 'manage_agenda_categories', 'manage_regular_mass_schedules', 'manage_mass_schedules',
      'manage_contact_messages', 'manage_users_komsos_sekretariat', 'manage_rooms', 'manage_bookings'
    ]
  }

  console.log('Assigning permissions to roles...')
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

  console.log('RBAC setup completed successfully!')
}

setupRBAC().catch(console.error).finally(() => db.close())
