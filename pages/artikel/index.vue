<template>
  <div class="min-h-screen pt-20 bg-gray-50">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <!-- Main Content -->
      <div class="lg:col-span-9">
        <Breadcrumb title="Artikel" />

        <!-- Header Halaman -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Artikel Gereja Paulus Juanda</h1>
          <p class="text-lg text-gray-600">Temukan artikel mendalam tentang pengajaran Alkitab, renungan harian, dan inspirasi rohani untuk memperkuat iman Anda.</p>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="text-center py-8">
          <p class="text-gray-500">Memuat artikel...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500">Error memuat artikel: {{ error.message }}</p>
          <NuxtLink to="/artikel" class="mt-4 inline-block text-blue-500 hover:underline">Coba Lagi</NuxtLink>
        </div>

        <!-- Daftar Artikel -->
        <div v-else-if="articles && articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article
            v-for="article in articles"
            :key="article.id"
            class="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div class="p-6">
              <!-- Category Tags -->
              <div v-if="article.categories && article.categories.length > 0" class="mb-3">
                <div class="flex flex-wrap gap-1">
                  <NuxtLink
                    v-for="category in article.categories"
                    :key="category.slug"
                    :to="`/artikel/kategori/${category.slug}`"
                    class="inline-block bg-[#882f1d] text-white text-xs px-2 py-1 rounded-full hover:bg-[#6b2416] transition-colors duration-200"
                  >
                    {{ category.name }}
                  </NuxtLink>
                </div>
              </div>

              <h2 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                <NuxtLink :to="`/artikel/${article.slug}`" class="hover:text-[#882f1d] transition-colors">
                  {{ article.title }}
                </NuxtLink>
              </h2>

              <p v-if="article.excerpt" class="text-gray-600 mb-4 line-clamp-3">{{ article.excerpt }}</p>

              <div class="flex items-center justify-between text-sm text-gray-500">
                <span v-if="article.author">Oleh: {{ article.author }}</span>
                <span>{{ formatDate(article.published_at || article.created_at) }}</span>
              </div>

              <NuxtLink
                :to="`/artikel/${article.slug}`"
                class="inline-block mt-4 text-[#882f1d] font-medium hover:text-[#6b2416] transition-colors"
              >
                Baca Selengkapnya →
              </NuxtLink>
            </div>
          </article>
        </div>

        <!-- State Kosong -->
        <div v-else class="text-center py-12">
          <p class="text-gray-500 text-lg">Belum ada artikel tersedia. Silakan cek lagi nanti!</p>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-3 lg:mt-24">
        <!-- Categories Widget -->
        <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Kategori Artikel</h3>
          <div v-if="categories && categories.length > 0" class="space-y-2">
            <NuxtLink
              v-for="category in categories"
              :key="category.slug"
              :to="`/artikel/kategori/${category.slug}`"
              class="block text-gray-700 hover:text-[#882f1d] hover:bg-gray-50 px-3 py-2 rounded transition-colors duration-200"
            >
              <div class="flex items-center justify-between">
                <span>{{ category.name }}</span>
                <span class="text-sm text-gray-500">({{ category.article_count || 0 }})</span>
              </div>
            </NuxtLink>
          </div>
          <div v-else class="text-gray-500 text-sm">
            Belum ada kategori
          </div>
        </div>

        <!-- Recent Articles Widget -->
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Artikel Terbaru</h3>
          <div v-if="recentArticles && recentArticles.length > 0" class="space-y-3">
            <div
              v-for="article in recentArticles.slice(0, 5)"
              :key="article.id"
              class="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
            >
              <NuxtLink
                :to="`/artikel/${article.slug}`"
                class="block hover:text-[#882f1d] transition-colors"
              >
                <h4 class="font-medium text-gray-900 line-clamp-2 text-sm mb-1">{{ article.title }}</h4>
                <p class="text-xs text-gray-500">{{ formatDate(article.published_at || article.created_at) }}</p>
              </NuxtLink>
            </div>
          </div>
          <div v-else class="text-gray-500 text-sm">
            Belum ada artikel
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Fetch articles data from API
const { data: articles, pending, error } = await useAsyncData('articles', () => $fetch('/api/artikel'));

// Fetch categories data
const { data: categories } = await useAsyncData('categories', () => $fetch('/api/artikel/categories'));

// Use articles as recent articles (same data)
const recentArticles = articles;

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<style scoped>
/* Custom line-clamp dengan standar CSS untuk kompatibilitas */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  /* Properti standar (non-vendor) untuk kompatibilitas lintas browser */
  line-clamp: 2;
  display: box; /* Fallback untuk standar, tapi jarang dipakai */
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  /* Properti standar */
  line-clamp: 3;
  display: box;
}
</style>
