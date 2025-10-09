const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Starting migration for booking system...')

// Add new columns to users table
try {
  db.exec(`
    ALTER TABLE users ADD COLUMN full_name TEXT;
  `)
  console.log('Added full_name to users')
} catch (e) {
  console.log('full_name column already exists or error:', e.message)
}

try {
  db.exec(`
    ALTER TABLE users ADD COLUMN contact_phone TEXT;
  `)
  console.log('Added contact_phone to users')
} catch (e) {
  console.log('contact_phone column already exists or error:', e.message)
}

try {
  db.exec(`
    ALTER TABLE users ADD COLUMN user_category TEXT;
  `)
  console.log('Added user_category to users')
} catch (e) {
  console.log('user_category column already exists or error:', e.message)
}

try {
  db.exec(`
    ALTER TABLE users ADD COLUMN unit_name TEXT;
  `)
  console.log('Added unit_name to users')
} catch (e) {
  console.log('unit_name column already exists or error:', e.message)
}

// Update default role to 'user'
try {
  db.exec(`
    UPDATE users SET role = 'user' WHERE role IS NULL OR role = '';
  `)
  console.log('Updated default roles')
} catch (e) {
  console.log('Error updating roles:', e.message)
}

// Create rooms table
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      location TEXT NOT NULL,
      facilities TEXT,
      photo_url TEXT,
      requires_approval BOOLEAN DEFAULT TRUE,
      allowed_categories TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)
  console.log('Created rooms table')
} catch (e) {
  console.log('Error creating rooms table:', e.message)
}

// Create bookings table
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      event_name TEXT NOT NULL,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      status TEXT DEFAULT 'PENDING',
      rejection_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE RESTRICT,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `)
  console.log('Created bookings table')
} catch (e) {
  console.log('Error creating bookings table:', e.message)
}

// Create indexes
const indexes = [
  'CREATE INDEX IF NOT EXISTS idx_rooms_is_active ON rooms(is_active);',
  'CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);',
  'CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);',
  'CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);',
  'CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);',
  'CREATE INDEX IF NOT EXISTS idx_bookings_end_time ON bookings(end_time);'
]

indexes.forEach(index => {
  try {
    db.exec(index)
    console.log('Created index')
  } catch (e) {
    console.log('Error creating index:', e.message)
  }
})

db.close()
console.log('Migration completed!')
