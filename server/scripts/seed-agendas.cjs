const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('🌱 Seeding agendas...')

const seedAgendas = () => {
  const agendas = [
    {
      title: 'Rapat Dewan Paroki',
      description: 'Rapat rutin dewan paroki untuk membahas program kerja tahun 2025',
      start_date: '2025-01-15T10:00:00.000Z',
      end_date: '2025-01-15T12:00:00.000Z',
      location: 'Sekretariat Paroki St. Paulus',
      category_id: 1,
      contact_person: 'Ketua Dewan Paroki'
    },
    {
      title: 'Misa Syukur Ulang Tahun Paroki',
      description: 'Perayaan ulang tahun paroki ke-50 dengan misa syukur',
      start_date: '2025-02-20T09:00:00.000Z',
      end_date: '2025-02-20T11:00:00.000Z',
      location: 'Gereja St. Paulus Juanda',
      category_id: 2,
      contact_person: 'Romo Paroki'
    },
    {
      title: 'Kegiatan Keluarga Katolik',
      description: 'Kumpul keluarga katolik dengan games dan makan bersama',
      start_date: '2025-03-10T14:00:00.000Z',
      end_date: '2025-03-10T17:00:00.000Z',
      location: 'Halaman Gereja',
      category_id: 3,
      contact_person: 'Ketua OMK'
    }
  ]

  const insertAgenda = db.prepare(`
    INSERT OR IGNORE INTO agendas (title, description, start_date, end_date, location, category_id, contact_person)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  console.log('📅 Seeding Agendas...')
  agendas.forEach(agenda => {
    try {
      insertAgenda.run(agenda.title, agenda.description, agenda.start_date, agenda.end_date, agenda.location, agenda.category_id, agenda.contact_person)
      console.log(`✅ Created agenda: ${agenda.title}`)
    } catch (e) {
      console.log(`⚠️  Agenda ${agenda.title} already exists`)
    }
  })

  console.log('\n✨ Agendas seeding completed!')
  console.log(`📊 Added ${agendas.length} agendas`)
}

seedAgendas()
db.close()
