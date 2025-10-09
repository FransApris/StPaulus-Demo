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

console.log('Adding "Peristiwa Paroki" category...');

// Insert into article_categories
const insertArticleCategory = db.prepare(`
  INSERT OR IGNORE INTO article_categories (name, slug, parent_id, description, created_at, updated_at)
  VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
`);

const name = 'Peristiwa Paroki';
const slug = createSlug(name);

try {
  const result = insertArticleCategory.run(name, slug, null, 'Kategori untuk peristiwa penting paroki yang akan ditampilkan di kronik');
  if (result.changes > 0) {
    console.log(`✓ Inserted article category: ${name} (ID: ${result.lastInsertRowid})`);
  } else {
    console.log(`⚠ Category "${name}" already exists in article_categories`);
  }
} catch (error) {
  console.error('❌ Error inserting article category:', error);
}

// Insert into agenda_categories
const insertAgendaCategory = db.prepare(`
  INSERT OR IGNORE INTO agenda_categories (name, slug, description, color, created_at, updated_at)
  VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
`);

try {
  const result = insertAgendaCategory.run(name, slug, 'Kategori untuk agenda peristiwa penting paroki', '#882f1d');
  if (result.changes > 0) {
    console.log(`✓ Inserted agenda category: ${name} (ID: ${result.lastInsertRowid})`);
  } else {
    console.log(`⚠ Category "${name}" already exists in agenda_categories`);
  }
} catch (error) {
  console.error('❌ Error inserting agenda category:', error);
}

console.log('\n✅ "Peristiwa Paroki" category addition completed!');
db.close();
