<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Memuat detail artikel...</p>
    </div>

    <!-- Konten Detail -->
    <article v-else-if="article" class="bg-white shadow-lg rounded-lg overflow-hidden">
      <Breadcrumb :title="article.title" parentTitle="Artikel" parentPath="/artikel" />

      <div class="p-6">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ article.title }}</h1>

        <!-- Category Tags -->
        <div v-if="article.categories && article.categories.length > 0" class="mb-4">
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="category in article.categories"
              :key="category.slug"
              :to="`/artikel/kategori/${category.slug}`"
              class="inline-block bg-[#882f1d] text-white text-sm px-3 py-1 rounded-full hover:bg-[#6b2416] transition-colors duration-200"
            >
              {{ category.name }}
            </NuxtLink>
          </div>
        </div>

        <div class="flex items-center justify-between text-gray-500 mb-6">
          <span>Diposting: {{ formatDate(article.created_at) }}</span>
          <span v-if="article.author">Penulis: {{ article.author }}</span>
        </div>

        <div class="prose prose-lg max-w-none mb-8">
          <div v-html="article.content"></div>
        </div>

        <div class="flex space-x-4">
          <NuxtLink to="/artikel" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            ← Kembali ke Artikel
          </NuxtLink>
          <NuxtLink to="/berita" class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
            Lihat Berita Terkait
          </NuxtLink>
        </div>
      </div>
    </article>

    <!-- Error -->
    <div v-else class="text-center py-12">
      <h2 class="text-2xl font-bold text-red-500 mb-4">Artikel Tidak Ditemukan</h2>
      <p class="text-gray-500">ID: {{ id }} tidak valid.</p>
      <NuxtLink to="/artikel" class="mt-4 inline-block text-blue-500 hover:underline">Kembali ke Daftar Artikel</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const id = route.params.id;

// Fetch data from API
const { data: article, pending: loading } = useAsyncData(`artikel-${id}`, () => $fetch(`/api/artikel/${id}`));

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

useHead(() => ({
  title: article ? `${article.title} - Gereja Paulus Juanda` : 'Detail Artikel',
  meta: [{ name: 'description', content: article?.excerpt || 'Artikel rohani dari gereja kami.' }]
}));
</script>
