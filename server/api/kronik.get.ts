import db from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const offset = (page - 1) * limit

    // Get category IDs for "Peristiwa Paroki"
    const articleCategory = db.prepare('SELECT id FROM article_categories WHERE name = ?').get('Peristiwa Paroki') as { id: number } | undefined
    const agendaCategory = db.prepare('SELECT id FROM agenda_categories WHERE name = ?').get('Peristiwa Paroki') as { id: number } | undefined

    if (!articleCategory && !agendaCategory) {
      return { items: [], total: 0, page, limit, totalPages: 0 }
    }

    let kronikItems: any[] = []

    // Get news with the category
    if (articleCategory) {
      const newsQuery = `
        SELECT
          n.id,
          n.title,
          n.slug,
          n.excerpt,
          n.published_at as date,
          'news' as type,
          '/berita/' || n.slug as link,
          NULL as image
        FROM news n
        WHERE n.category_id = ? AND n.status = 'published'
        ORDER BY n.published_at DESC
      `
      const news = db.prepare(newsQuery).all(articleCategory.id)
      kronikItems.push(...news)
    }

    // Get agendas with the category
    if (agendaCategory) {
      const agendaQuery = `
        SELECT
          a.id,
          a.title,
          a.description as excerpt,
          a.start_date as date,
          'agenda' as type,
          '/agenda' as link,
          NULL as image
        FROM agendas a
        WHERE a.category_id = ?
        ORDER BY a.start_date DESC
      `
      const agendas = db.prepare(agendaQuery).all(agendaCategory.id)
      kronikItems.push(...agendas)
    }

    // Sort all items by date descending
    kronikItems.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const total = kronikItems.length
    const paginatedItems = kronikItems.slice(offset, offset + limit)

    return {
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  } catch (error) {
    console.error('Error fetching kronik:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch kronik data'
    })
  }
})
