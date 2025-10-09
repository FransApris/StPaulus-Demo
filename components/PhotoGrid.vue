<template>
  <div class="masonry-gallery">
    <div
      v-for="photo in photos"
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
</template>

<script setup>
// Komponen ini menerima 'props' bernama 'photos' dari halaman induk ([id].vue)
defineProps({
  photos: {
    type: Array,
    required: true,
    default: () => []
  }
});

// PENTING: Kode di atas mengasumsikan setiap 'photo' dalam array 'photos'
// adalah sebuah objek yang memiliki properti 'id', 'url', dan 'caption'.
// Sesuaikan :src="photo.url" dan :alt="photo.caption" jika nama properti
// di data API Anda berbeda (misalnya photo.src atau photo.alt).
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