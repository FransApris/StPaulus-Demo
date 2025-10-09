import { runQuery, getQuery as dbGetQuery, allQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category slug is required'
      })
    }

    // Get category info
    const category = dbGetQuery('SELECT id, name, slug, description FROM article_categories WHERE slug = ?', [slug]) as any

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // Get articles in this category
    const articlesQuery = `
      SELECT a.id, a.title, a.slug, a.excerpt, a.author, a.created_at, a.published_at
      FROM articles a
      INNER JOIN article_category_relations acr ON a.id = acr.article_id
      WHERE acr.category_id = ? AND a.status = 'published'
      ORDER BY a.published_at DESC
    `
    const articles = allQuery(articlesQuery, [category.id]) as any[]

    // Format articles
    const formattedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      author: article.author || '',
      published_at: article.published_at,
      created_at: article.created_at
    }))

    return {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description
      },
      articles: formattedArticles
    }
  } catch (error) {
    console.error('Error fetching category articles:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
