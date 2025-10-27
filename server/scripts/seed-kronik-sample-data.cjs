const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('🌱 Seeding sample kronik data...')

const seedKronikData = () => {
  // Get category IDs
  const articleCategoryId = db.prepare('SELECT id FROM article_categories WHERE name = ?').get('Peristiwa Paroki')
  const agendaCategoryId = db.prepare('SELECT id FROM agenda_categories WHERE name = ?').get('Peristiwa Paroki')

  if (!articleCategoryId || !agendaCategoryId) {
    console.error('Peristiwa Paroki categories not found. Please run add-peristiwa-paroki-category.cjs first.')
    return
  }

  // Sample news items
  const newsItems = [
    {
      title: 'Peresmian Renovasi Kapel St. Maria',
      slug: 'peresmian-renovasi-kapel-st-maria',
      content: 'Kapel St. Maria telah selesai direnovasi dan diresmikan oleh Romo Paroki pada tanggal 15 Oktober 2024. Renovasi ini meliputi perbaikan atap, pengecatan ulang, dan pemasangan sistem audio yang lebih baik.',
      excerpt: 'Kapel St. Maria telah selesai direnovasi dan diresmikan oleh Romo Paroki.',
      author: 'Admin Paroki',
      status: 'published',
      published_at: '2024-10-15T10:00:00.000Z'
    },
    {
      title: 'Kunjungan Pastoral Keuskupan Surabaya',
      slug: 'kunjungan-pastoral-keuskupan-surabaya',
      content: 'Mgr. Vincentius Sutikno Wisaksono, Uskup Keuskupan Surabaya, melakukan kunjungan pastoral ke Paroki St. Paulus Juanda pada tanggal 20 November 2024. Kunjungan ini merupakan bagian dari rangkaian kunjungan tahunan keuskupan.',
      excerpt: 'Uskup Keuskupan Surabaya melakukan kunjungan pastoral ke Paroki St. Paulus Juanda.',
      author: 'Admin Paroki',
      status: 'published',
      published_at: '2024-11-20T14:00:00.000Z'
    }
  ]

  // Sample agenda items
  const agendaItems = [
    {
      title: 'Misa Syukur Ulang Tahun Paroki Ke-55',
      description: 'Perayaan Misa Syukur ulang tahun Paroki St. Paulus Juanda yang ke-55 dengan dihadiri oleh Mgr. Vincentius Sutikno Wisaksono.',
      start_date: '2024-12-15T09:00:00.000Z',
      end_date: '2024-12-15T11:00:00.000Z',
      location: 'Gereja Utama St. Paulus Juanda',
      category_id: agendaCategoryId.id,
      contact_person: 'Romo Paroki - 081234567890'
    },
    {
      title: 'Retret Tahun Baru 2025',
      description: 'Retret bersama umat Paroki St. Paulus Juanda untuk menyambut tahun baru 2025 dengan tema "Bersama dalam Kasih".',
      start_date: '2024-12-28T08:00:00.000Z',
      end_date: '2024-12-30T17:00:00.000Z',
      location: 'Retret House Paroki',
      category_id: agendaCategoryId.id,
      contact_person: 'Ketua OMK - 081234567891'
    }
  ]

  // Insert news items
  const insertNews = db.prepare(`
    INSERT OR IGNORE INTO news (title, slug, content, excerpt, author, status, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const insertNewsCategoryRelation = db.prepare(`
    INSERT OR IGNORE INTO news_category_relations (news_id, category_id)
    VALUES (?, ?)
  `)

  console.log('📰 Seeding News Items...')
  newsItems.forEach(news => {
    try {
      const result = insertNews.run(news.title, news.slug, news.content, news.excerpt, news.author, news.status, news.published_at)
      if (result.changes > 0) {
        // Add category relation
        insertNewsCategoryRelation.run(result.lastInsertRowid, articleCategoryId.id)
        console.log(`✅ Created news: ${news.title}`)
      } else {
        console.log(`⚠️  News ${news.title} already exists`)
      }
    } catch (e) {
      console.log(`⚠️  Error creating news ${news.title}:`, e.message)
    }
  })

  // Insert agenda items
  const insertAgenda = db.prepare(`
    INSERT OR IGNORE INTO agendas (title, description, start_date, end_date, location, category_id, contact_person)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  console.log('\n📅 Seeding Agenda Items...')
  agendaItems.forEach(agenda => {
    try {
      insertAgenda.run(agenda.title, agenda.description, agenda.start_date, agenda.end_date, agenda.location, agenda.category_id, agenda.contact_person)
      console.log(`✅ Created agenda: ${agenda.title}`)
    } catch (e) {
      console.log(`⚠️  Agenda ${agenda.title} already exists`)
    }
  })

  console.log('\n✨ Sample kronik data seeding completed!')
  console.log(`📊 Added ${newsItems.length} news items and ${agendaItems.length} agenda items`)
}

seedKronikData().catch(console.error).finally(() => db.close())
