<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="bg-paulus-blue text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-cinzel mb-4">{{ album.title }}</h1>
        <p class="text-xl max-w-2xl mx-auto">
          {{ album.description }}
        </p>
        <p class="text-lg mt-4">
          Menampilkan {{ album.photos?.length || 0 }} foto dari kegiatan ini.
        </p>
      </div>
    </section>

    <section class="py-8">
      <div class="container mx-auto px-4">
        <nav class="text-sm font-cinzel">
          <ol class="list-none p-0 inline-flex">
            <li class="flex items-center">
              <NuxtLink to="/" class="text-gray-500 hover:text-paulus-blue">Beranda</NuxtLink>
              <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
            </li>
            <li class="flex items-center">
              <NuxtLink to="/galeri" class="text-gray-500 hover:text-paulus-blue">Galeri</NuxtLink>
              <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
            </li>
            <li class="flex items-center">
              <span class="text-gray-700">{{ album.title }}</span>
            </li>
          </ol>
        </nav>
      </div>
    </section>

    <section class="py-16">
      <div class="container mx-auto px-4">
        <div v-if="loading" class="text-center text-gray-500">
          Memuat data foto...
        </div>
        <div v-else-if="error" class="text-center text-red-500">
          {{ error }}
        </div>
        <div v-else-if="album.photos && album.photos.length === 0" class="text-center text-gray-500">
          Tidak ada foto dalam album ini.
        </div>
        <div v-else class="masonry-gallery">
          <div
            v-for="photo in album.photos"
            :key="photo.id"
            class="masonry-item"
          >
            <a :href="photo.url" target="_blank" rel="noopener noreferrer">
              <img
                :src="photo.url"
                :alt="photo.caption"
                class="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const album = ref({
  id: 'bksn-biak-2025',
  title: 'BKSN Biak - 28 September 2025',
  description: 'Momen kebersamaan dan sukacita dalam perayaan Bulan Kitab Suci Nasional 2025 di Paroki Biak.',
  photos: []
})

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const response = await fetch('/api/galeri/bksn-biak-2025')
    if (!response.ok) {
      throw new Error('Gagal memuat data album')
    }
    const data = await response.json()
    album.value = data
  } catch (err) {
    console.error('Error loading album:', err)
    error.value = 'Gagal memuat data album. Silakan coba lagi nanti.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.masonry-gallery {
  /* Jumlah kolom untuk layar besar */
  column-count: 4;
  /* Jarak antar kolom */
  column-gap: 1rem;
}

.masonry-item {
  /* Mencegah gambar terpotong antar kolom */
  break-inside: avoid;
  margin-bottom: 1rem;
  display: inline-block;
  width: 100%;
}

/* Aturan Responsif */
@media (max-width: 1200px) {
  .masonry-gallery {
    column-count: 3;
  }
}

@media (max-width: 768px) {
  .masonry-gallery {
    column-count: 2;
  }
}

@media (max-width: 500px) {
  .masonry-gallery {
    column-count: 1;
  }
}
</style>
