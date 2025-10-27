const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Adding document management tables to database...')

const migrateDocumentTables = async () => {
  try {
    // Check if document tables already exist
    const documentCategoriesExists = db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='document_categories'
    `).get()

    const documentsExists = db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='documents'
    `).get()

    if (documentCategoriesExists && documentsExists) {
      console.log('Document tables already exist. Migration skipped.')
      return
    }

    console.log('Creating document management tables...')

    // Create document_categories table
    if (!documentCategoriesExists) {
      db.exec(`
        CREATE TABLE document_categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          color TEXT NOT NULL DEFAULT '#6B7280',
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `)
      console.log('Created document_categories table')
    }

    // Create documents table
    if (!documentsExists) {
      db.exec(`
        CREATE TABLE documents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          category_id INTEGER NOT NULL,
          filename TEXT NOT NULL,
          original_filename TEXT NOT NULL,
          file_path TEXT NOT NULL,
          file_size INTEGER NOT NULL,
          mime_type TEXT NOT NULL,
          uploaded_by INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES document_categories (id) ON DELETE RESTRICT,
          FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE CASCADE
        );
      `)
      console.log('Created documents table')
    }

    // Create indexes
    console.log('Creating indexes...')
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_document_categories_slug ON document_categories(slug);
      CREATE INDEX IF NOT EXISTS idx_document_categories_is_active ON document_categories(is_active);
      CREATE INDEX IF NOT EXISTS idx_document_categories_display_order ON document_categories(display_order);
      CREATE INDEX IF NOT EXISTS idx_documents_category_id ON documents(category_id);
      CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
      CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
      CREATE INDEX IF NOT EXISTS idx_documents_filename ON documents(filename);
    `)

    // Insert default document categories
    console.log('Inserting default document categories...')
    const defaultCategories = [
      { name: 'Dokumen Paroki', slug: 'dokumen-paroki', description: 'Dokumen resmi paroki', color: '#10B981' },
      { name: 'Katekese', slug: 'katekese', description: 'Materi katekese dan pendidikan iman', color: '#3B82F6' },
      { name: 'Liturgi', slug: 'liturgi', description: 'Dokumen liturgi dan ibadat', color: '#8B5CF6' },
      { name: 'Administrasi', slug: 'administrasi', description: 'Dokumen administrasi paroki', color: '#F59E0B' },
      { name: 'Lainnya', slug: 'lainnya', description: 'Dokumen lainnya', color: '#6B7280' }
    ]

    const insertCategory = db.prepare(`
      INSERT OR IGNORE INTO document_categories (name, slug, description, color, display_order)
      VALUES (?, ?, ?, ?, ?)
    `)

    defaultCategories.forEach((cat, index) => {
      insertCategory.run(cat.name, cat.slug, cat.description, cat.color, index + 1)
    })

    console.log('Document tables migration completed successfully!')

  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  } finally {
    db.close()
  }
}

migrateDocumentTables().catch(console.error)
