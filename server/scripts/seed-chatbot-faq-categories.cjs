const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database/cms.db');
const db = new Database(dbPath);

// Seed initial chatbot FAQ categories
const categories = [
  {
    name: 'Jadwal Misa',
    slug: 'jadwal-misa',
    description: 'Pertanyaan tentang jadwal misa dan liturgi',
    color: '#3B82F6',
    display_order: 1
  },
  {
    name: 'Sakramen',
    slug: 'sakramen',
    description: 'Informasi tentang sakramen-sakramen gereja',
    color: '#10B981',
    display_order: 2
  },
  {
    name: 'Informasi Paroki',
    slug: 'informasi-paroki',
    description: 'Informasi umum tentang paroki St. Paulus',
    color: '#F59E0B',
    display_order: 3
  },
  {
    name: 'Kegiatan',
    slug: 'kegiatan',
    description: 'Informasi tentang kegiatan dan acara paroki',
    color: '#EF4444',
    display_order: 4
  }
];

console.log('Seeding chatbot FAQ categories...');

try {
  const insertCategory = db.prepare(`
    INSERT OR REPLACE INTO chatbot_faq_categories
    (name, slug, description, color, display_order, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  categories.forEach(category => {
    insertCategory.run(
      category.name,
      category.slug,
      category.description,
      category.color,
      category.display_order
    );
    console.log(`✓ Inserted category: ${category.name}`);
  });

  console.log('Chatbot FAQ categories seeded successfully!');
} catch (error) {
  console.error('Error seeding chatbot FAQ categories:', error);
} finally {
  db.close();
}
