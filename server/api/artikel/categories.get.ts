export default defineEventHandler(async (event) => {
  try {
    // Mock categories for now
    const categories = [
      {
        id: 1,
        name: 'Renungan',
        slug: 'renungan',
        description: 'Artikel renungan harian',
        article_count: 5
      },
      {
        id: 2,
        name: 'Warta Paroki',
        slug: 'warta-paroki',
        description: 'Berita dan informasi paroki',
        article_count: 3
      }
    ];

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
