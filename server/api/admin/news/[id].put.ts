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
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'News ID is required'
      })
    }

    const body = await readBody(event)
    const { title, slug, excerpt, content, author, status, category_ids } = body

    if (!title || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and content are required'
      })
    }

    const existingNews = getDbQuery('SELECT id FROM news WHERE id = ?', [id])
    if (!existingNews) {
      throw createError({
        statusCode: 404,
        statusMessage: 'News not found'
      })
    }

    const finalSlug = slug || createSlug(title)

    const slugCheck = getDbQuery('SELECT id FROM news WHERE slug = ? AND id != ?', [finalSlug, id])
    if (slugCheck) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug already exists'
      })
    }

    let publishedAt = null
    if (status === 'published') {
      const currentNews = getDbQuery('SELECT status, published_at FROM news WHERE id = ?', [id]) as { status: string, published_at: string } | undefined
      if (currentNews && currentNews.status !== 'published') {
        publishedAt = new Date().toISOString()
      } else if (currentNews) {
        publishedAt = currentNews.published_at
      }
    }

    runQuery(
      `UPDATE news SET title = ?, slug = ?, content = ?, excerpt = ?, author = ?, status = ?, published_at = ?, updated_at = datetime('now') WHERE id = ?`,
      [title, finalSlug, content, excerpt || '', author || '', status || 'draft', publishedAt, id]
    )

    // Update category relations
    // First, delete existing relations
    runQuery('DELETE FROM news_category_relations WHERE news_id = ?', [id])

    // Then insert new relations if provided
    if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
      for (const categoryId of category_ids) {
        runQuery(
          'INSERT INTO news_category_relations (news_id, category_id) VALUES (?, ?)',
          [id, categoryId]
        )
      }
    }

    return {
      message: 'News updated successfully'
    }
  } catch (error) {
    console.error('Error updating news:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
