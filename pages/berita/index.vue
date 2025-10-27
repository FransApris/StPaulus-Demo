<template>
  <div class="min-h-screen pt-20 bg-gray-50">
    <Breadcrumb title="Berita" />
    <!-- Header Halaman -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Berita Gereja Paulus Juanda</h1>
      <p class="text-lg text-gray-600">Update terbaru tentang kegiatan dan acara gereja kami.</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <p class="text-gray-500">Memuat berita...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500">Error memuat berita: {{ error.message }}</p>
      <NuxtLink to="/berita" class="mt-4 inline-block text-blue-500 hover:underline">Coba Lagi</NuxtLink>
    </div>

    <!-- Daftar Berita (Grid Card) -->
    <div v-else-if="posts && posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ArticleCard
        v-for="post in posts"
        :key="post.id"
        :image="post.image"
        image-type="url"
        :title="post.title"
        :description="post.excerpt"
        :date="post.date"
        :to="`/berita/${post.id}`"
      />
    </div>

    <!-- State Kosong -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 text-lg">Belum ada berita tersedia. Silakan cek lagi nanti!</p>
    </div>
  </div>
</template>

<script setup>
// Fetch data dinamis dari API
const { data: posts, pending, error } = await useAsyncData('posts', () => $fetch('/api/berita'));
</script>
