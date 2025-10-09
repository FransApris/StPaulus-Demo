import { allQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication using JWT
  requireAuth(event)

  try {
    // Get query parameters
    const query = getQuery(event)
    const status = query?.status as string

    // Build query with category information
    let sql = `
      SELECT
        a.*,
        GROUP_CONCAT(ac.name) as category_names,
        GROUP_CONCAT(ac.id) as category_ids
      FROM articles a
      LEFT JOIN article_category_relations acr ON a.id = acr.article_id
      LEFT JOIN article_categories ac ON acr.category_id = ac.id
    `
    let params: any[] = []

    if (status) {
      sql += ' WHERE a.status = ?'
      params = [status]
    }

    sql += ' GROUP BY a.id ORDER BY a.created_at DESC'

    const articles = allQuery(sql, params)

    // Convert to plain objects for JSON serialization
    return articles.map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      author: article.author,
      status: article.status,
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      categories: article.category_names ? article.category_names.split(',').map((name: string, index: number) => ({
        id: parseInt(article.category_ids.split(',')[index]),
        name: name
      })) : []
    }))
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
