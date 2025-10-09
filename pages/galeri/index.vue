<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="bg-paulus-blue text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-cinzel mb-4">Galeri Foto</h1>
        <p class="text-xl max-w-2xl mx-auto">
          Lihat momen-momen indah dari kegiatan paroki kami. Dari misa hingga retret rohani.
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
              <span class="text-gray-700">Galeri Foto</span>
            </li>
          </ol>
        </nav>
      </div>
    </section>

    <section class="py-16">
      <div class="container mx-auto px-4">
        <div v-if="pending" class="text-center text-gray-500">
          Memuat daftar album...
        </div>
        <div v-else-if="error" class="text-center text-red-500">
          Gagal memuat album. Coba lagi nanti.
        </div>
        <div v-else-if="galleryData && galleryData.albums" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div v-for="album in galleryData.albums" :key="album.id" class="album-card bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <NuxtLink :to="`/galeri/${album.id}`">
              <img :src="album.thumbnail" :alt="album.title" class="w-full h-48 object-cover">
              <div class="p-6">
                <h3 class="text-2xl font-cinzel text-paulus-blue mb-2">{{ album.title }}</h3>
                <p class="text-gray-600 line-clamp-3">{{ album.description }}</p>
              </div>
            </NuxtLink>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
// Mengambil data dari API galeri
const { data: galleryData, pending, error } = await useAsyncData('gallery-list', () =>
  $fetch('/api/galeri')
);

// PENTING: Kode ini mengasumsikan API Anda ('/api/galeri') 
// mengembalikan objek dengan array bernama 'albums'.
// Setiap album di dalamnya harus memiliki properti:
// - id: untuk link (e.g., 'bksn-biak-2025')
// - thumbnail: URL gambar sampul
// - title: Judul album
// - description: Deskripsi singkat album
</script>

<style scoped>
/* Opsi untuk memastikan deskripsi terpotong dengan elipsis (...) */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  /* Tambahkan baris ini sesuai saran dari editor */
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>