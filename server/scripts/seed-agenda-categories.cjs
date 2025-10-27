const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('🌱 Seeding agenda categories...')

const seedAgendaCategories = () => {
  const categories = [
    {
      name: 'Rapat',
      slug: 'rapat',
      description: 'Kegiatan rapat dan pertemuan paroki',
      color: '#3B82F6'
    },
    {
      name: 'Ibadat',
      slug: 'ibadat',
      description: 'Kegiatan ibadat dan liturgi',
      color: '#10B981'
    },
    {
      name: 'Keluarga',
      slug: 'keluarga',
      description: 'Kegiatan untuk keluarga dan anak-anak',
      color: '#F59E0B'
    }
  ]

  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO agenda_categories (name, slug, description, color)
    VALUES (?, ?, ?, ?)
  `)

  console.log('📅 Seeding Agenda Categories...')
  categories.forEach(category => {
    try {
      insertCategory.run(category.name, category.slug, category.description, category.color)
      console.log(`✅ Created category: ${category.name}`)
    } catch (e) {
      console.log(`⚠️  Category ${category.name} already exists`)
    }
  })

  console.log('\n✨ Agenda categories seeding completed!')
  console.log(`📊 Added ${categories.length} agenda categories`)
}

seedAgendaCategories()
db.close()
