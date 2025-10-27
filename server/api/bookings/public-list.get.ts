import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  // Get query parameters for filtering
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 20 // Default limit
  const days = parseInt(query.days as string) || 30 // Show bookings for next 30 days and past 7 days

  // Calculate date range
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(now.getDate() - 7) // Include past 7 days
  const endDate = new Date(now)
  endDate.setDate(now.getDate() + days) // Include next X days

  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = endDate.toISOString().split('T')[0]

  // Get public booking list (without user names for privacy)
  const bookings = allQuery(`
    SELECT
      b.id,
      r.name as room_name,
      r.location as room_location,
      b.event_name,
      DATE(b.start_time) as event_date,
      TIME(b.start_time) as start_time,
      TIME(b.end_time) as end_time,
      b.status,
      b.created_at
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.status IN ('APPROVED', 'PENDING', 'REJECTED')
    AND DATE(b.start_time) BETWEEN ? AND ?
    ORDER BY b.start_time ASC
    LIMIT ?
  `, [startDateStr, endDateStr, limit])

  // Format the response
  const formattedBookings = bookings.map((booking: any) => ({
    id: booking.id,
    room_name: booking.room_name,
    room_location: booking.room_location,
    event_name: booking.event_name,
    event_date: booking.event_date,
    start_time: booking.start_time,
    end_time: booking.end_time,
    status: booking.status,
    created_at: booking.created_at
  }))

  return {
    bookings: formattedBookings,
    date_range: {
      start: startDateStr,
      end: endDateStr
    },
    total: formattedBookings.length
  }
})
