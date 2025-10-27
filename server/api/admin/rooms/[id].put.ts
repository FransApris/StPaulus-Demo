import { runQuery, getQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check for manage_rooms permission
  requirePermission('manage_rooms')(event)

  const roomId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { name, capacity, location, facilities, requires_approval, allowed_categories } = body

  if (!name || !capacity || !location) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Field yang diperlukan: name, capacity, location'
    })
  }

  // Check if room exists
  const existingRoom = getQuery('SELECT * FROM rooms WHERE id = ?', [roomId]) as any
  if (!existingRoom) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Ruangan tidak ditemukan'
    })
  }

  // Validate allowed_categories if provided
  if (allowed_categories) {
    try {
      const categories = JSON.parse(allowed_categories)
      if (!Array.isArray(categories)) {
        throw new Error()
      }
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'allowed_categories harus berupa array JSON yang valid'
      })
    }
  }

  // Update room
  runQuery(`
    UPDATE rooms SET
      name = ?,
      capacity = ?,
      location = ?,
      facilities = ?,
      requires_approval = ?,
      allowed_categories = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [name, capacity, location, facilities || null, requires_approval ? 1 : 0, allowed_categories || null, roomId])

  return {
    message: 'Ruangan berhasil diperbarui'
  }
})
