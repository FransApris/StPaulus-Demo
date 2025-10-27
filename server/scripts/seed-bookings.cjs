const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('🌱 Seeding bookings...')

const seedBookings = () => {
  const bookings = [
    {
      room_id: 1,
      user_id: 1,
      event_name: 'Rapat Dewan Paroki',
      start_time: '2025-01-20T10:00:00.000Z',
      end_time: '2025-01-20T12:00:00.000Z',
      status: 'approved'
    },
    {
      room_id: 2,
      user_id: 1,
      event_name: 'Pertemuan OMK',
      start_time: '2025-02-15T14:00:00.000Z',
      end_time: '2025-02-15T16:00:00.000Z',
      status: 'pending'
    }
  ]

  const insertBooking = db.prepare(`
    INSERT OR IGNORE INTO bookings (room_id, user_id, event_name, start_time, end_time, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  console.log('📅 Seeding Bookings...')
  bookings.forEach(booking => {
    try {
      insertBooking.run(booking.room_id, booking.user_id, booking.event_name, booking.start_time, booking.end_time, booking.status)
      console.log(`✅ Created booking: ${booking.event_name}`)
    } catch (e) {
      console.log(`⚠️  Booking ${booking.event_name} already exists`)
    }
  })

  console.log('\n✨ Bookings seeding completed!')
  console.log(`📊 Added ${bookings.length} bookings`)
}

seedBookings()
db.close()
