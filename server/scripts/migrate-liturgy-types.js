import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_PATH = path.join(__dirname, '../database/cms.db')
const db = new Database(DB_PATH)

console.log('🔄 Starting liturgy types migration...')

try {
  // First, update existing schedules to use new liturgy type IDs
  // Map old types to new types:
  // - Misa Harian -> Misa Pagi
  // - Misa Minggu -> Misa Minggu (keep same)
  // - Others -> Misa Pagi (default)

  console.log('📝 Updating existing schedules...')

  // Get the new liturgy type IDs
  const getTypeId = db.prepare('SELECT id FROM liturgy_types WHERE slug = ?')

  const misaPagiId = getTypeId.get('misa-pagi')?.id
  const misaMingguId = getTypeId.get('misa-minggu')?.id
  const misaSabtuId = getTypeId.get('misa-sabtu')?.id
  const misaJumatPertamaId = getTypeId.get('misa-jumat-pertama')?.id

  if (!misaPagiId || !misaMingguId || !misaSabtuId || !misaJumatPertamaId) {
    throw new Error('New liturgy types not found. Please run seed-liturgy-types-new.js first')
  }

  // Update schedules based on their current type
  const updateSchedule = db.prepare('UPDATE liturgy_schedules SET liturgy_type_id = ? WHERE liturgy_type_id = ?')

  // Map Misa Harian (id: 1) -> Misa Pagi
  const misaHarianType = db.prepare('SELECT id FROM liturgy_types WHERE slug = ?').get('misa-harian')
  if (misaHarianType) {
    updateSchedule.run(misaPagiId, misaHarianType.id)
    console.log(`✅ Updated Misa Harian schedules to Misa Pagi`)
  }

  // Misa Minggu should already be correct, but let's make sure
  const existingMisaMinggu = db.prepare('SELECT id FROM liturgy_types WHERE slug = ?').get('misa-minggu')
  if (existingMisaMinggu && existingMisaMinggu.id !== misaMingguId) {
    updateSchedule.run(misaMingguId, existingMisaMinggu.id)
    console.log(`✅ Updated Misa Minggu schedules`)
  }

  // Update other schedules to Misa Pagi as default
  const otherSchedules = db.prepare(`
    SELECT ls.id, lt.name
    FROM liturgy_schedules ls
    JOIN liturgy_types lt ON ls.liturgy_type_id = lt.id
    WHERE lt.slug NOT IN ('misa-pagi', 'misa-minggu', 'misa-sabtu', 'misa-jumat-pertama')
  `).all()

  if (otherSchedules.length > 0) {
    for (const schedule of otherSchedules) {
      db.prepare('UPDATE liturgy_schedules SET liturgy_type_id = ? WHERE id = ?')
         .run(misaPagiId, schedule.id)
    }
    console.log(`✅ Updated ${otherSchedules.length} other schedules to Misa Pagi`)
  }

  // Now delete old liturgy types that are no longer needed
  console.log('🗑️ Removing old liturgy types...')
  const typesToDelete = ['misa-harian', 'hari-raya', 'ibadat-khusus', 'sakramen-tobat', 'adorasi', 'rosario', 'novena', 'ibadat-lainnya']

  for (const slug of typesToDelete) {
    const type = db.prepare('SELECT id FROM liturgy_types WHERE slug = ?').get(slug)
    if (type) {
      db.prepare('DELETE FROM liturgy_types WHERE id = ?').run(type.id)
      console.log(`✅ Deleted liturgy type: ${slug}`)
    }
  }

  // Now insert the new simplified liturgy types
  console.log('📝 Inserting new liturgy types...')
  const liturgyTypes = [
    {
      name: 'Misa Pagi',
      slug: 'misa-pagi',
      icon: '🌅',
      color: '#F59E0B',
      description: 'Misa pagi hari Senin-Jumat',
      display_order: 1
    },
    {
      name: 'Misa Minggu',
      slug: 'misa-minggu',
      icon: '⛪',
      color: '#10B981',
      description: 'Misa hari Minggu',
      display_order: 2
    },
    {
      name: 'Misa Sabtu',
      slug: 'misa-sabtu',
      icon: '🌙',
      color: '#8B5CF6',
      description: 'Misa hari Sabtu',
      display_order: 3
    },
    {
      name: 'Misa Jumat Pertama',
      slug: 'misa-jumat-pertama',
      icon: '💙',
      color: '#3B82F6',
      description: 'Misa Jumat pertama setiap bulan',
      display_order: 4
    }
  ]

  const insert = db.prepare(`
    INSERT OR REPLACE INTO liturgy_types (name, slug, icon, color, description, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `)

  for (const type of liturgyTypes) {
    insert.run(
      type.name,
      type.slug,
      type.icon,
      type.color,
      type.description,
      type.display_order
    )
    console.log(`✅ Inserted: ${type.name}`)
  }

  // Verify the migration
  const finalTypes = db.prepare('SELECT * FROM liturgy_types ORDER BY display_order').all()
  console.log('\n📋 Final Liturgy Types:')
  console.table(finalTypes)

  const scheduleCount = db.prepare('SELECT COUNT(*) as count FROM liturgy_schedules').get()
  console.log(`📊 Total schedules: ${scheduleCount.count}`)

  console.log('✨ Liturgy types migration completed successfully!')

} catch (error) {
  console.error('❌ Error during migration:', error)
  process.exit(1)
} finally {
  db.close()
}
