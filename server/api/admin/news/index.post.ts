import { runQuery, getQuery as getDbQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export default defineEventHandler(async (event) => {
  requireAuth(event)

  try {
    const body = await readBody(event)
    const { title, slug, excerpt, content, author, status, category_ids } = body

    if (!title || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and content are required'
      })
    }

    const finalSlug = slug || createSlug(title)

    const existingNews = getDbQuery('SELECT id FROM news WHERE slug = ?', [finalSlug])
    if (existingNews) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug already exists'
      })
    }

    const publishedAt = status === 'published' ? new Date().toISOString() : null

    const result = runQuery(
      `INSERT INTO news (title, slug, content, excerpt, author, status, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [title, finalSlug, content, excerpt || '', author || '', status || 'draft', publishedAt]
    )

    const newsId = result.lastInsertRowid

    // Insert category relations if provided
    if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
      for (const categoryId of category_ids) {
        runQuery(
          'INSERT INTO news_category_relations (news_id, category_id) VALUES (?, ?)',
          [newsId, categoryId]
        )
      }
    }

    return {
      id: newsId,
      message: 'News created successfully'
    }
  } catch (error) {
    console.error('Error creating news:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
