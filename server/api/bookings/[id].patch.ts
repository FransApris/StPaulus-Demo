import { runQuery, getQuery } from '../../database/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Check if user is admin
  const user = getQuery('SELECT role FROM users WHERE id = ?', [userId]) as any
  if (user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Hanya admin yang dapat mengubah status pemesanan'
    })
  }

  const bookingId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { status, rejection_reason } = body

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Status tidak valid'
    })
  }

  // Check if booking exists
  const booking = getQuery('SELECT * FROM bookings WHERE id = ?', [bookingId]) as any
  if (!booking) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Pemesanan tidak ditemukan'
    })
  }

  if (booking.status !== 'PENDING') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Pemesanan sudah diproses'
    })
  }

  if (status === 'REJECTED' && !rejection_reason) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Alasan penolakan diperlukan'
    })
  }

  // If approving, check for conflicts again (in case another booking was approved)
  if (status === 'APPROVED') {
    const conflicts = getQuery(`
      SELECT COUNT(*) as count FROM bookings
      WHERE room_id = ? AND status = 'APPROVED' AND id != ?
      AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))
    `, [booking.room_id, bookingId, booking.start_time, booking.end_time, booking.end_time, booking.start_time]) as any

    if (conflicts.count > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Konflik dengan pemesanan lain yang sudah disetujui'
      })
    }
  }

  // Update booking
  runQuery(`
    UPDATE bookings SET status = ?, rejection_reason = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [status, rejection_reason || null, bookingId])

  return {
    message: `Pemesanan ${status === 'APPROVED' ? 'disetujui' : 'ditolak'}`
  }
})
