const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Seeding user categories...')

const seedUserCategories = async () => {
  // Seed initial user categories
  const categories = [
    {
      name: 'PARISH_COUNCIL',
      display_name: 'Seksi Paroki',
      description: 'Anggota dewan paroki dan seksi-seksi paroki',
      display_order: 1
    },
    {
      name: 'CATEGORICAL_GROUP',
      display_name: 'Kelompok Kategorial',
      description: 'Kelompok kategorial seperti OMK, Remaja, Lansia, dll',
      display_order: 2
    },
    {
      name: 'REGION',
      display_name: 'Wilayah',
      description: 'Pengurus wilayah/lingkungan',
      display_order: 3
    },
    {
      name: 'COMMUNITY',
      display_name: 'Lingkungan',
      description: 'Ketua dan pengurus lingkungan',
      display_order: 4
    }
  ]

  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO user_categories (name, display_name, description, display_order)
    VALUES (?, ?, ?, ?)
  `)

  categories.forEach(category => {
    try {
      insertCategory.run(category.name, category.display_name, category.description, category.display_order)
      console.log(`Created category: ${category.display_name}`)
    } catch (e) {
      console.log(`Category ${category.name} already exists`)
    }
  })

  console.log('\nUser categories seeded successfully!')
}

seedUserCategories().catch(console.error).finally(() => db.close())
