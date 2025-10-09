import { allQuery } from '../database/db'

export default defineEventHandler(async (event) => {
  try {
    // Fetch articles with categories (only published ones for public API)
    const sql = `
      SELECT
        a.*,
        GROUP_CONCAT(ac.name) as category_names,
        GROUP_CONCAT(ac.id) as category_ids,
        GROUP_CONCAT(ac.slug) as category_slugs
      FROM articles a
      LEFT JOIN article_category_relations acr ON a.id = acr.article_id
      LEFT JOIN article_categories ac ON acr.category_id = ac.id
      WHERE a.status = 'published'
      GROUP BY a.id
      ORDER BY a.published_at DESC, a.created_at DESC
    `;

    const articlesList = allQuery(sql);

    // Process categories for each article item
    const processedArticles = articlesList.map((article: any) => {
      const categories: Array<{id: number, name: string, slug: string}> = [];
      if (article.category_names) {
        const names = article.category_names.split(',');
        const ids = article.category_ids.split(',');
        const slugs = article.category_slugs.split(',');

        names.forEach((name: string, index: number) => {
          if (name) {
            categories.push({
              id: parseInt(ids[index]),
              name: name,
              slug: slugs[index]
            });
          }
        });
      }

      return {
        id: article.id,
        title: article.title,
        excerpt: article.excerpt || '',
        content: article.content,
        author: article.author || '',
        status: article.status,
        published_at: article.published_at,
        created_at: article.created_at,
        updated_at: article.updated_at,
        slug: article.slug,
        date: new Date(article.published_at || article.created_at).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        image: '/images/default-article.jpg',
        categories: categories
      };
    });

    return processedArticles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
