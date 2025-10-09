const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Starting migration for chatbot FAQs...')

// Create chatbot_faqs table
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS chatbot_faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT,
      keywords TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      usage_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)
  console.log('Created chatbot_faqs table')
} catch (e) {
  console.log('Error creating chatbot_faqs table:', e.message)
}

// Create indexes
const indexes = [
  'CREATE INDEX IF NOT EXISTS idx_chatbot_faqs_category ON chatbot_faqs(category);',
  'CREATE INDEX IF NOT EXISTS idx_chatbot_faqs_is_active ON chatbot_faqs(is_active);',
  'CREATE INDEX IF NOT EXISTS idx_chatbot_faqs_usage_count ON chatbot_faqs(usage_count);'
]

indexes.forEach(index => {
  try {
    db.exec(index)
    console.log('Created index for chatbot_faqs')
  } catch (e) {
    console.log('Error creating index:', e.message)
  }
})

db.close()
console.log('Chatbot FAQs migration completed!')
