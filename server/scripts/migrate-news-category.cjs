const Database = require('better-sqlite3');
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, '../database/cms.db');
const db = new Database(dbPath);

console.log('Migrating news table to add category_id...');

try {
  // Add category_id column to news table if it doesn't exist
  const addColumnQuery = `
    ALTER TABLE news ADD COLUMN category_id INTEGER REFERENCES article_categories(id)
  `;

  db.exec(addColumnQuery);
  console.log('✅ Added category_id column to news table');

} catch (error) {
  if (error.message.includes('duplicate column name')) {
    console.log('⚠ Column category_id already exists in news table');
  } else {
    console.error('❌ Error migrating news table:', error);
  }
} finally {
  db.close();
}

console.log('Migration completed!');
