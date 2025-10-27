<template>
  <div class="bg-white rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out hover:shadow-xl border border-gray-100">
    <div class="h-64 sm:h-80 w-full overflow-hidden">
      <img
        :src="pastor.photoUrl || '/default-pastor.jpg'"
        :alt="`Foto Romo ${pastor.name}`"
        class="w-full h-full object-cover object-top"
      />
    </div>

    <div class="p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-1 leading-snug">
        {{ pastor.name }}
      </h3>

      <p class="text-sm font-medium text-gray-600 mt-3 border-t pt-3">
        Masa Bertugas:
      </p>
      <p class="text-lg font-bold text-green-700">
        {{ pastor.startYear }} - {{ pastor.endYear }}
      </p>

      <p class="text-sm font-medium text-gray-600 mt-2">
        Lama Bertugas:
      </p>
      <p class="text-lg font-bold text-gray-800">
        {{ calculateDuration(pastor.startYear, pastor.endYear) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  pastor: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      name: 'Nama Romo',
      startYear: 'YYYY',
      endYear: 'YYYY',
      photoUrl: '', // URL ke file gambar
    }),
  },
});

// Fungsi untuk menghitung Lama Bertugas
const calculateDuration = (start, end) => {
  const startYear = parseInt(start);
  const endYear = end.toLowerCase() === 'sekarang' ? new Date().getFullYear() : parseInt(end);

  if (isNaN(startYear) || isNaN(endYear)) {
    return 'Data tidak valid';
  }

  const duration = endYear - startYear;

  if (duration === 0) {
      return 'Kurang dari 1 tahun';
  }

  if (duration > 0) {
    return `${duration} Tahun`;
  }

  return 'Lama tidak diketahui';
};
</script>

<style scoped>
/* Anda bisa menambahkan styling spesifik di sini jika diperlukan,
   tapi Tailwind sudah mencakup sebagian besar kebutuhan. */
</style>
