const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('🌱 Seeding regular mass schedules...')

const seedRegularMassSchedules = () => {
  const schedules = [
    {
      day_of_week: 1, // Monday
      time: '05:30:00',
      is_active: true
    },
    {
      day_of_week: 2, // Tuesday
      time: '05:30:00',
      is_active: true
    },
    {
      day_of_week: 3, // Wednesday
      time: '05:30:00',
      is_active: true
    },
    {
      day_of_week: 4, // Thursday
      time: '05:30:00',
      is_active: true
    },
    {
      day_of_week: 5, // Friday
      time: '05:30:00',
      is_active: true
    },
    {
      day_of_week: 6, // Saturday
      time: '05:30:00',
      is_active: true
    },
    {
      day_of_week: 0, // Sunday
      time: '07:00:00',
      is_active: true
    },
    {
      day_of_week: 0, // Sunday
      time: '09:00:00',
      is_active: true
    },
    {
      day_of_week: 0, // Sunday
      time: '17:00:00',
      is_active: true
    }
  ]

  const insertSchedule = db.prepare(`
    INSERT OR IGNORE INTO regular_mass_schedules (day_of_week, time, is_active)
    VALUES (?, ?, ?)
  `)

  console.log('⏰ Seeding Regular Mass Schedules...')
  schedules.forEach(schedule => {
    try {
      insertSchedule.run(schedule.day_of_week, schedule.time, schedule.is_active)
      console.log(`✅ Created schedule: Day ${schedule.day_of_week} at ${schedule.time}`)
    } catch (e) {
      console.log(`⚠️  Schedule Day ${schedule.day_of_week} at ${schedule.time} already exists`)
    }
  })

  console.log('\n✨ Regular mass schedules seeding completed!')
  console.log(`📊 Added ${schedules.length} mass schedules`)
}

seedRegularMassSchedules()
db.close()
