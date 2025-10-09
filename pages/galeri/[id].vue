<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section v-if="album" class="bg-paulus-blue text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-cinzel mb-4">{{ album.title }}</h1>
        <p class="text-xl max-w-2xl mx-auto">
          {{ album.description }}
        </p>
      </div>
    </section>

    <section class="py-8">
      <div class="container mx-auto px-4">
        <nav class="text-sm font-cinzel">
          <ol class="list-none p-0 inline-flex">
            <li class="flex items-center">
              <NuxtLink to="/galeri" class="text-gray-500 hover:text-paulus-blue">Galeri Foto</NuxtLink>
              <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
            </li>
            <li class="flex items-center">
              <span class="text-gray-700">{{ album ? album.title : 'Loading...' }}</span>
            </li>
          </ol>
        </nav>
      </div>
    </section>

    <section class="py-16">
      <div class="container mx-auto px-4">
        <div v-if="pending" class="text-center text-gray-500">
          Memuat foto...
        </div>
        <div v-else-if="error || !album" class="text-center text-red-500">
          Maaf, album tidak ditemukan atau terjadi kesalahan.
        </div>
        <div v-else>
          <PhotoGrid :photos="album.photos" />
        </div>
      </div>
    </section>


  </div>
</template>

<script setup>
import { computed } from 'vue';

const route = useRoute();
const albumId = route.params.id;

// Ambil semua data galeri dari API
const { data: galleryData, pending, error } = await useAsyncData('gallery-detail', () =>
  $fetch('/api/galeri')
);

// Cari album yang spesifik berdasarkan ID dari URL
const album = computed(() => {
  if (!galleryData.value || !galleryData.value.albums) return null;
  return galleryData.value.albums.find(a => a.id === albumId);
});
</script>
