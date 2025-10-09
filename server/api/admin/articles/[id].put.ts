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
  // Check authentication using JWT
  requireAuth(event)

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Article ID is required'
      })
    }

    const body = await readBody(event)
    const { title, slug, excerpt, content, author, status, category_ids } = body

    // Validation
    if (!title || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and content are required'
      })
    }

    // Check if article exists
    const existingArticle = getDbQuery('SELECT id FROM articles WHERE id = ?', [id])
    if (!existingArticle) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }

    // Generate slug if not provided
    const finalSlug = slug || createSlug(title)

    // Check if slug already exists (excluding current article)
    const slugCheck = getDbQuery('SELECT id FROM articles WHERE slug = ? AND id != ?', [finalSlug, id])
    if (slugCheck) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug already exists'
      })
    }

    // Validate category_ids if provided
    if (category_ids && Array.isArray(category_ids)) {
      for (const categoryId of category_ids) {
        const category = getDbQuery('SELECT id FROM article_categories WHERE id = ?', [categoryId])
        if (!category) {
          throw createError({
            statusCode: 400,
            statusMessage: `Category with ID ${categoryId} does not exist`
          })
        }
      }
    }

    // Update published_at based on status
    let publishedAt = null
    if (status === 'published') {
      // Check current status
      const currentArticle = getDbQuery('SELECT status, published_at FROM articles WHERE id = ?', [id]) as { status: string, published_at: string } | undefined
      if (currentArticle && currentArticle.status !== 'published') {
        publishedAt = new Date().toISOString()
      } else if (currentArticle) {
        publishedAt = currentArticle.published_at
      }
    }

    // Update article
    runQuery(
      `UPDATE articles SET title = ?, slug = ?, content = ?, excerpt = ?, author = ?, status = ?, published_at = ?, updated_at = datetime('now') WHERE id = ?`,
      [title, finalSlug, content, excerpt || '', author || '', status || 'draft', publishedAt, id]
    )

    // Update category relations
    // First, remove existing relations
    runQuery('DELETE FROM article_category_relations WHERE article_id = ?', [id])

    // Then, insert new relations if provided
    if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
      for (const categoryId of category_ids) {
        runQuery(
          'INSERT INTO article_category_relations (article_id, category_id) VALUES (?, ?)',
          [id, categoryId]
        )
      }
    }

    return {
      message: 'Article updated successfully'
    }
  } catch (error) {
    console.error('Error updating article:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
