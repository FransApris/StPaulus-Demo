<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb -->
        <Breadcrumb :title="`Artikel Kategori: ${category?.name || slug}`" />

        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Artikel Kategori: {{ category?.name || slug }}</h1>
          <p v-if="category?.description" class="text-xl text-gray-600 max-w-3xl mx-auto">{{ category.description }}</p>
        </div>

        <!-- Articles Section -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"></div>
          <p class="mt-2 text-sm text-gray-500">Memuat artikel...</p>
        </div>
        <div v-else-if="articles.length === 0" class="text-center py-8">
          <p class="text-gray-500">Belum ada artikel dalam kategori ini.</p>
        </div>
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCard
            v-for="article in articles"
            :key="article.id"
            :title="article.title"
            :description="article.excerpt"
            :date="formatDate(article.published_at)"
            :to="`/artikel/${article.slug}`"
            :link-text="'Baca Selengkapnya →'"
          />
        </div>

        <!-- Back Button -->
        <BackButton position="bottom" />
      </div>
    </section>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  title: 'Artikel Kategori - St. Paulus'
})

const route = useRoute()
const slug = route.params.slug

// Fetch category articles
const { data: categoryData, pending: loading, error } = await useAsyncData(`category-articles-${slug}`, () =>
  $fetch(`/api/artikel/kategori/${slug}`)
)

const category = computed(() => categoryData.value?.category || null)
const articles = computed(() => categoryData.value?.articles || [])

// Handle error
if (error.value) {
  console.error('Error loading category articles:', error.value)
  throw createError({
    statusCode: 404,
    statusMessage: 'Kategori tidak ditemukan'
  })
}

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.prose { color: #374151; }
</style>
