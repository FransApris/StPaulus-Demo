const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../database/cms.db');
const SNAPSHOTS_DIR = path.join(__dirname, '../database/snapshots');

// Ensure snapshots directory exists
if (!fs.existsSync(SNAPSHOTS_DIR)) {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
}

// Initialize database
const db = new Database(DB_PATH);

// List of tables to export
const tables = [
  'users',
  'roles',
  'permissions',
  'role_permissions',
  'articles',
  'news',
  'gallery_albums',
  'gallery_photos',
  'agenda_categories',
  'agendas',
  'article_categories',
  'article_category_relations',
  'news_category_relations',
  'contact_messages',
  'sessions',
  'liturgy_types',
  'liturgy_schedules',
  'regular_mass_schedules',
  'rooms',
  'bookings',
  'chatbot_faqs'
];

console.log('Starting data export...');

tables.forEach(table => {
  try {
    const data = db.prepare(`SELECT * FROM ${table}`).all();
    const filePath = path.join(SNAPSHOTS_DIR, `${table}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Exported ${data.length} records from ${table} to ${filePath}`);
  } catch (error) {
    console.error(`Error exporting ${table}:`, error.message);
  }
});

db.close();
console.log('Data export completed.');
