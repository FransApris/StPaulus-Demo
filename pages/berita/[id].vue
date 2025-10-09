<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Loading -->
    <div v-if="pending" class="text-center py-8">
      <p class="text-gray-500">Memuat detail berita...</p>
    </div>

    <!-- Konten Detail -->
    <article v-else-if="post" class="bg-white shadow-lg rounded-lg overflow-hidden">
      <Breadcrumb :title="post.title" parentTitle="Berita" parentPath="/berita" />
      <img :src="post.image" :alt="post.title" class="w-full h-96 object-cover">
      <div class="p-6">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ post.title }}</h1>
        <div class="flex items-center justify-between text-gray-500 mb-6">
          <span>Diposting: {{ post.date }}</span>
          <span>Kategori: {{ post.category }}</span>
        </div>
        <div class="prose prose-lg max-w-none mb-8">
          <p v-for="(paragraph, index) in post.content" :key="index" class="mb-6">{{ paragraph }}</p>
        </div>
        <div class="flex space-x-4">
          <NuxtLink to="/berita" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            ← Kembali ke Berita
          </NuxtLink>
          <NuxtLink to="/artikel" class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
            Lihat Artikel Terkait
          </NuxtLink>
        </div>
      </div>
    </article>

    <!-- Error -->
    <div v-else class="text-center py-12">
      <h2 class="text-2xl font-bold text-red-500 mb-4">Berita Tidak Ditemukan</h2>
      <p class="text-gray-500">ID: {{ id }} tidak valid atau terjadi kesalahan.</p>
      <NuxtLink to="/berita" class="mt-4 inline-block text-blue-500 hover:underline">Kembali ke Daftar Berita</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const id = route.params.id;

// Fetch data dinamis dari API
const { data: post, pending, error } = useAsyncData(`berita-${id}`, () => $fetch(`/api/berita/${id}`));
</script>
