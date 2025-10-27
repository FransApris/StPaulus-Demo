const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Adding is_featured column to documents table...')

const addFeaturedColumn = async () => {
  try {
    // Check if is_featured column already exists
    const tableInfo = db.prepare("PRAGMA table_info(documents)").all()
    const hasFeaturedColumn = tableInfo.some(col => col.name === 'is_featured')

    if (hasFeaturedColumn) {
      console.log('is_featured column already exists. Migration skipped.')
      return
    }

    // Add is_featured column to documents table
    db.exec(`
      ALTER TABLE documents ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    `)

    console.log('Successfully added is_featured column to documents table')

  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  } finally {
    db.close()
  }
}

addFeaturedColumn().catch(console.error)
