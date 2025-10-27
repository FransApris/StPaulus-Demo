const { readdir, stat, readFile, mkdir, copyFile } = require('node:fs/promises')
const { join, extname } = require('node:path')
const Database = require('better-sqlite3')
const path = require('node:path')

// Database connection
const dbPath = path.join(__dirname, '../database/cms.db')
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

console.log('Starting gallery migration to database...')

async function migrateGallery() {
  try {
    // Check if we need to migrate existing tables
    console.log('Checking existing gallery tables...')

    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='gallery_albums'
    `).get()

    if (tableExists) {
      console.log('Existing gallery_albums table found. Adding new columns...')

      // Add new columns to existing gallery_albums table
      const columnsToAdd = [
        { name: 'tanggal_peristiwa', type: 'DATE' },
        { name: 'category_id', type: 'INTEGER' }
      ]

      for (const col of columnsToAdd) {
        try {
          db.prepare(`ALTER TABLE gallery_albums ADD COLUMN ${col.name} ${col.type}`).run()
          console.log(`Added column ${col.name} to gallery_albums`)
        } catch (error) {
          if (!error.message.includes('duplicate column name')) {
            console.log(`Column ${col.name} already exists`)
          }
        }
      }
    } else {
      console.log('Creating new gallery tables...')
      const createTablesSQL = `
        -- Gallery categories table
        CREATE TABLE gallery_categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nama_kategori TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          color TEXT NOT NULL DEFAULT '#6B7280',
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Gallery albums table
        CREATE TABLE gallery_albums (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          tanggal_peristiwa DATE,
          category_id INTEGER,
          cover_image TEXT,
          status TEXT DEFAULT 'published',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES gallery_categories (id) ON DELETE SET NULL
        );

        -- Gallery photos table
        CREATE TABLE gallery_photos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          album_id INTEGER NOT NULL,
          filename TEXT NOT NULL,
          original_filename TEXT,
          path TEXT NOT NULL,
          size INTEGER,
          mime_type TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (album_id) REFERENCES gallery_albums (id) ON DELETE CASCADE
        );
      `
      db.exec(createTablesSQL)
    }

    // Create indexes (these are safe to run multiple times)
    console.log('Creating indexes...')
    const indexSQL = `
      CREATE INDEX IF NOT EXISTS idx_gallery_categories_slug ON gallery_categories(slug);
      CREATE INDEX IF NOT EXISTS idx_gallery_categories_is_active ON gallery_categories(is_active);
      CREATE INDEX IF NOT EXISTS idx_gallery_categories_display_order ON gallery_categories(display_order);
      CREATE INDEX IF NOT EXISTS idx_gallery_albums_slug ON gallery_albums(slug);
      CREATE INDEX IF NOT EXISTS idx_gallery_albums_category ON gallery_albums(category_id);
      CREATE INDEX IF NOT EXISTS idx_gallery_albums_tanggal_peristiwa ON gallery_albums(tanggal_peristiwa);
      CREATE INDEX IF NOT EXISTS idx_gallery_photos_album ON gallery_photos(album_id);
    `
    db.exec(indexSQL)

    // Insert default categories
    console.log('Inserting default gallery categories...')
    const defaultCategories = [
      { nama_kategori: 'Kegiatan', slug: 'kegiatan', description: 'Album kegiatan paroki', color: '#10B981' },
      { nama_kategori: 'Misa', slug: 'misa', description: 'Album misa dan liturgi', color: '#3B82F6' },
      { nama_kategori: 'Retret', slug: 'retret', description: 'Album retret rohani', color: '#8B5CF6' },
      { nama_kategori: 'Katekese', slug: 'katekese', description: 'Album katekese dan pendidikan iman', color: '#F59E0B' },
      { nama_kategori: 'Perayaan', slug: 'perayaan', description: 'Album perayaan khusus', color: '#EF4444' }
    ]

    const insertCategory = db.prepare(`
      INSERT OR IGNORE INTO gallery_categories (nama_kategori, slug, description, color, display_order)
      VALUES (?, ?, ?, ?, ?)
    `)

    defaultCategories.forEach((cat, index) => {
      insertCategory.run(cat.nama_kategori, cat.slug, cat.description, cat.color, index + 1)
    })

    // Get existing albums from filesystem
    const albumsBaseDir = path.join(__dirname, '../../public/images/album')
    console.log('Reading existing albums from:', albumsBaseDir)

    try {
      const albumFolders = await readdir(albumsBaseDir)

      for (const folderName of albumFolders) {
        const albumPath = path.join(albumsBaseDir, folderName)
        const itemStat = await stat(albumPath)

        if (itemStat.isDirectory()) {
          console.log(`Processing album: ${folderName}`)

          let title = folderName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          let description = 'Tidak ada deskripsi.'
          let tanggalPeristiwa = null

          // Try to read meta.json for better metadata
          try {
            const metaPath = path.join(albumPath, 'meta.json')
            const metaContent = await readFile(metaPath, 'utf-8')
            const metaData = JSON.parse(metaContent)
            title = metaData.title || title
            description = metaData.description || description
            tanggalPeristiwa = metaData.tanggal_peristiwa || null
          } catch (e) {
            // meta.json doesn't exist, use defaults
          }

          // Insert album into database
          const insertAlbum = db.prepare(`
            INSERT OR REPLACE INTO gallery_albums (title, slug, description, tanggal_peristiwa, category_id, status)
            VALUES (?, ?, ?, ?, ?, 'published')
          `)

          // Assign default category (Kegiatan) for now
          const defaultCategoryId = db.prepare('SELECT id FROM gallery_categories WHERE slug = ?').get('kegiatan')?.id || 1

          const albumResult = insertAlbum.run(title, folderName, description, tanggalPeristiwa, defaultCategoryId)
          const albumId = albumResult.lastInsertRowid

          // Process photos
          const photoFiles = await readdir(albumPath)
          const imageFiles = photoFiles
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .sort()

          console.log(`Found ${imageFiles.length} photos in ${folderName}`)

          const insertPhoto = db.prepare(`
            INSERT OR REPLACE INTO gallery_photos (album_id, filename, original_filename, path, size, mime_type)
            VALUES (?, ?, ?, ?, ?, ?)
          `)

          for (const file of imageFiles) {
            const filePath = path.join(albumPath, file)
            const fileStat = await stat(filePath)

            insertPhoto.run(
              albumId,
              file,
              file,
              `/images/album/${folderName}/${file}`,
              fileStat.size,
              getMimeType(file)
            )
          }

          // Set cover image (first photo)
          if (imageFiles.length > 0) {
            const updateCover = db.prepare('UPDATE gallery_albums SET cover_image = ? WHERE id = ?')
            updateCover.run(`/images/album/${folderName}/${imageFiles[0]}`, albumId)
          }
        }
      }
    } catch (error) {
      console.error('Error reading albums directory:', error.message)
    }

    console.log('Gallery migration completed successfully!')

  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  } finally {
    db.close()
  }
}

function getMimeType(filename) {
  const ext = extname(filename).toLowerCase()
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  }
  return mimeTypes[ext] || 'image/jpeg'
}

// Run migration
migrateGallery().catch(console.error)
