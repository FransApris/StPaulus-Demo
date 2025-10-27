<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      
      <div class="container mx-auto px-4">
        <!-- Breadcrumb -->
        <Breadcrumb title="Romo yang Bertugas" />

        <div class="text-center mb-12  ">
          <h1 class="text-4xl  font-cinzel text-[#882f1d] mb-4">Romo-Romo yang Pernah Bertugas</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Kami menghormati dan mengenang para Romo yang telah memberikan pelayanan dan dedikasi luar biasa di paroki ini.</p>
        </div>

      <div class="max-w-5xl mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <PastorProfileCard
            v-for="pastor in pastors"
            :key="pastor.id"
            :pastor="pastor"
          />
        </div>
      </div>

        <div v-if="pastors.length === 0" class="text-center py-10">
            <p class="text-gray-500 italic">Data Romo belum tersedia saat ini.</p>
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
  title: 'Romo yang Bertugas - St. Paulus'
})

// Contoh Data Romo
// Idealnya, data ini akan diambil dari API atau database.
// Untuk demonstrasi, kita gunakan data statis.
const pastors = [
  {
    id: 1,
    name: 'Romo Aaaaaa',
    startYear: '2010',
    endYear: '2015',
    photoUrl: '/images/pastor 1.jpg', // Ganti dengan path foto Anda
  },
  {
    id: 2,
    name: 'Romo Bbbbbbb',
    startYear: '2015',
    endYear: '2020',
    photoUrl: '/images/pastor 2.jpg',
  },
  {
    id: 3,
    name: 'Romo Ccccccc',
    startYear: '2020',
    endYear: '2024',
    photoUrl: '/images/pastor 3.jpg',
  },
  {
    id: 4,
    name: 'Romo Dddddd',
    startYear: '2024',
    endYear: 'Sekarang', // "Sekarang" akan dihitung otomatis oleh komponen
    photoUrl: '/images/pastor 4.jpg',
  },
  {
    id: 5,
    name: 'Romo Eeeeee',
    startYear: '2005',
    endYear: '2010',
    photoUrl: '/images/pastor 5.jpg',
  },
  // Tambahkan Romo lainnya di sini
];

// Nuxt secara otomatis akan mengimpor PastorProfileCard karena berada di folder 'components'.
</script>

<style scoped>
.prose { color: #374151; }
</style>
