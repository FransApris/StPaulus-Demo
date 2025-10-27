import { defineEventHandler, createError, getRouterParam, readBody } from 'h3'
import type { H3Event } from 'h3'
// Perbaikan: Menggunakan alias Nuxt yang benar untuk import server local
import db from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event: H3Event) => {
  // Hanya super_admin dan admin_sekretariat yang dapat mengubah status featured
  requireAuth(event)

  const user = event.context.auth
  if (!user || !user.permissions?.includes('manage_documents')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only Super Admin and Admin Sekretariat can manage documents'
    })
  }

  const documentId = getRouterParam(event, 'id')
  if (!documentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Document ID is required'
    })
  }

  try {
    // 1. Dapatkan status featured saat ini
    const documentQuery = db.prepare('SELECT is_featured FROM documents WHERE id = ?')
    // Menggunakan get() karena kita hanya mengharapkan satu baris
    const document = documentQuery.get(documentId) as { is_featured: number } | undefined

    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Document not found'
      })
    }

    // 2. Toggle status: 1 menjadi 0, atau 0 menjadi 1
    const newFeaturedStatus = document.is_featured === 1 ? 0 : 1

    // 3. Update database menggunakan db.prepare().run() untuk operasi tulis permanen
    const updateQuery = db.prepare('UPDATE documents SET is_featured = ? WHERE id = ?')
    updateQuery.run(newFeaturedStatus, documentId)

    return {
      id: parseInt(documentId),
      is_featured: Boolean(newFeaturedStatus)
    }
  } catch (error) {
    console.error('Toggle featured error:', error)
    // Tangani error yang mungkin disebabkan oleh masalah database
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to toggle featured status'
    })
  }
})
