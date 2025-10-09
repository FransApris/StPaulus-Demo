const Database = require('better-sqlite3');
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, '../database/cms.db');
const db = new Database(dbPath);

// Function to create slug from name
function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

console.log('Seeding initial categories...');

// Insert categories
const categories = [
  { name: 'Renungan', parent_id: null },
  { name: 'Warta Paroki', parent_id: null },
  { name: 'Sejarah Santo/Santa', parent_id: null },
  { name: 'Kegiatan', parent_id: null },
  { name: 'OMK', parent_id: null }, // Will be updated after Kegiatan is inserted
  { name: 'Legio Maria', parent_id: null }, // Will be updated after Kegiatan is inserted
  { name: 'Pengumuman', parent_id: null }
];

const insertCategory = db.prepare(`
  INSERT INTO article_categories (name, slug, parent_id, description, created_at, updated_at)
  VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
`);

const categoryIds = {};

try {
  // Insert parent categories first
  categories.forEach(cat => {
    if (!cat.name.includes('OMK') && !cat.name.includes('Legio Maria')) {
      const slug = createSlug(cat.name);
      const result = insertCategory.run(cat.name, slug, cat.parent_id, '');
      categoryIds[cat.name] = result.lastInsertRowid;
      console.log(`✓ Inserted category: ${cat.name} (ID: ${result.lastInsertRowid})`);
    }
  });

  // Insert child categories
  const kegiatanId = categoryIds['Kegiatan'];

  if (kegiatanId) {
    // Update OMK to be child of Kegiatan
    const omkSlug = createSlug('OMK');
    const omkResult = insertCategory.run('OMK', omkSlug, kegiatanId, '');
    console.log(`✓ Inserted category: OMK (ID: ${omkResult.lastInsertRowid}, Parent: Kegiatan)`);

    // Update Legio Maria to be child of Kegiatan
    const legioSlug = createSlug('Legio Maria');
    const legioResult = insertCategory.run('Legio Maria', legioSlug, kegiatanId, '');
    console.log(`✓ Inserted category: Legio Maria (ID: ${legioResult.lastInsertRowid}, Parent: Kegiatan)`);
  }

  console.log('\n✅ Initial categories seeded successfully!');
  console.log('Categories created:');
  console.log('- Renungan');
  console.log('- Warta Paroki');
  console.log('- Sejarah Santo/Santa');
  console.log('- Kegiatan');
  console.log('  - OMK');
  console.log('  - Legio Maria');
  console.log('- Pengumuman');

} catch (error) {
  console.error('❌ Error seeding categories:', error);
} finally {
  db.close();
}
