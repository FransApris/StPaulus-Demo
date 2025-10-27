const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Migrating hero themes table...')

try {
  // Create hero_themes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS hero_themes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      image_path TEXT NOT NULL,
      is_active BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)
  console.log('✓ Created hero_themes table')

  // Create unique index to ensure only one active theme
  db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_hero_themes_active
    ON hero_themes(is_active)
    WHERE is_active = TRUE;
  `)
  console.log('✓ Created unique index for active theme constraint')

  console.log('✅ Hero themes migration completed successfully!')

} catch (error) {
  console.error('❌ Error during migration:', error)
} finally {
  db.close()
}
