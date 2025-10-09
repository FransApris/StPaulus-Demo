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
  const user = getQuery('SELECT user_category FROM users WHERE id = ?', [userId]) as any
  if (room.allowed_categories) {
    const allowedCategories = JSON.parse(room.allowed_categories)
    if (!allowedCategories.includes(user.user_category)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Anda tidak memiliki akses ke ruangan ini'
      })
    }
  }

  // Check for booking conflicts
  const conflicts = getQuery(`
    SELECT COUNT(*) as count FROM bookings
    WHERE room_id = ? AND status = 'APPROVED'
    AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))
  `, [room_id, start_time, end_time, end_time, start_time]) as any

  if (conflicts.count > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Ruangan sudah dipesan pada waktu tersebut'
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
