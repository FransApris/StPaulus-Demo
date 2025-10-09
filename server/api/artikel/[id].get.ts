import { runQuery, getQuery as getDbQuery } from '../../database/db'

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  slug: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID artikel diperlukan'
    });
  }

  try {
    // Fetch article with categories
    const articleQuery = `
      SELECT
        a.*,
        GROUP_CONCAT(ac.name) as category_names,
        GROUP_CONCAT(ac.id) as category_ids,
        GROUP_CONCAT(ac.slug) as category_slugs
      FROM articles a
      LEFT JOIN article_category_relations acr ON a.id = acr.article_id
      LEFT JOIN article_categories ac ON acr.category_id = ac.id
      WHERE a.id = ? AND a.status = 'published'
      GROUP BY a.id
    `;

    const article = getDbQuery(articleQuery, [id]) as any;

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Artikel tidak ditemukan'
      });
    }

    // Parse categories
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

    // Format response
    const formattedArticle = {
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content,
      author: article.author || '',
      date: new Date(article.published_at || article.created_at).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      image: '/images/default-article.jpg', // Default image since we don't have image field yet
      categories: categories,
      slug: article.slug
    };

    return formattedArticle;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
