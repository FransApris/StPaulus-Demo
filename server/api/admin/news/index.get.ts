import { allQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  try {
    const query = getQuery(event)
    const status = query?.status as string

    let sql = `
      SELECT
        n.*,
        GROUP_CONCAT(ac.name) as category_names,
        GROUP_CONCAT(ac.id) as category_ids,
        GROUP_CONCAT(ac.slug) as category_slugs
      FROM news n
      LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
      LEFT JOIN article_categories ac ON ncr.category_id = ac.id
    `
    let params: any[] = []

    if (status) {
      sql += ' WHERE n.status = ? '
      params = [status]
    }

    sql += ' GROUP BY n.id ORDER BY n.created_at DESC'

    const newsList = allQuery(sql, params)

    return newsList.map((news: any) => {
      // Parse categories
      const categories: Array<{id: number, name: string, slug: string}> = [];
      if (news.category_names) {
        const names = news.category_names.split(',');
        const ids = news.category_ids.split(',');
        const slugs = news.category_slugs.split(',');

        names.forEach((name: string, index: number) => {
          categories.push({
            id: parseInt(ids[index]),
            name: name,
            slug: slugs[index]
          });
        });
      }

      return {
        id: news.id,
        title: news.title,
        slug: news.slug,
        content: news.content,
        excerpt: news.excerpt,
        author: news.author,
        status: news.status,
        published_at: news.published_at,
        created_at: news.created_at,
        updated_at: news.updated_at,
        categories: categories
      }
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
