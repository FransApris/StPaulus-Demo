import { runQuery, getQuery } from '../database/db'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  const body = await readBody(event)
  const { room_id, event_name, start_time, end_time } = body

  if (!room_id || !event_name || !start_time || !end_time) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Semua field diperlukan'
    })
  }

  // Validate dates
  const start = new Date(start_time)
  const end = new Date(end_time)

  if (start >= end) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Waktu mulai harus sebelum waktu selesai'
    })
  }

  if (start < new Date()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tidak dapat memesan untuk waktu yang sudah lewat'
    })
  }

  // Check if room exists and is active
  const room = getQuery('SELECT * FROM rooms WHERE id = ? AND is_active = 1', [room_id]) as any
  if (!room) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Ruangan tidak ditemukan'
    })
  }

  // Check user permissions for the room
  const user = getQuery('SELECT user_category, role, role_id FROM users WHERE id = ?', [userId]) as any

  // Admin users (super_admin, admin_komsos, admin_sekretariat) can book any room
  if (user.role_id || user.role === 'admin' || user.role === 'super_admin' || user.role === 'admin_komsos' || user.role === 'admin_sekretariat') {
    // Admin can book any room, no restrictions
  } else {
    // Regular users must have appropriate user_category
    if (room.allowed_categories && user.user_category) {
      const allowedCategories = JSON.parse(room.allowed_categories)
      if (!allowedCategories.includes(user.user_category)) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Anda tidak memiliki akses ke ruangan ini'
        })
      }
    } else if (room.allowed_categories && !user.user_category) {
      // User doesn't have user_category but room requires specific categories
      throw createError({
        statusCode: 403,
        statusMessage: 'Anda tidak memiliki akses ke ruangan ini'
      })
    }
  }

  // Check for booking conflicts on the same date
  const startDate = new Date(start_time).toISOString().split('T')[0] // Extract date part
  const conflicts = getQuery(`
    SELECT COUNT(*) as count,
           GROUP_CONCAT(
             'dari ' || strftime('%H:%M', start_time) || ' hingga ' || strftime('%H:%M', end_time)
           ) as conflicting_times
    FROM bookings
    WHERE room_id = ? AND status = 'APPROVED'
    AND date(start_time) = ?
    AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?))
  `, [room_id, startDate, end_time, start_time, start_time, end_time]) as any

  if (conflicts.count > 0) {
    const conflictingTimes = conflicts.conflicting_times || 'waktu tertentu'
    throw createError({
      statusCode: 409,
      statusMessage: `Konflik Jadwal: Ruangan ini sudah dipesan ${conflictingTimes}. Mohon pilih waktu lain.`
    })
  }

  // Determine status based on room settings
  const status = room.requires_approval ? 'PENDING' : 'APPROVED'

  // Insert booking
  const result = runQuery(`
    INSERT INTO bookings (room_id, user_id, event_name, start_time, end_time, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [room_id, userId, event_name, start_time, end_time, status])

  return {
    id: result.lastInsertRowid,
    message: status === 'APPROVED' ? 'Pemesanan berhasil' : 'Pemesanan menunggu persetujuan admin'
  }
})
