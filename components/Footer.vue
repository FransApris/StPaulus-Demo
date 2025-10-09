<template>
  <footer class="bg-gray-800 text-white py-8 text-center dark:bg-gray-900">
    <div class="container mx-auto max-w-7xl px-4">
      <p class="text-sm font-medium">
        © {{ currentYear }} Copyright © Komsos Paroki St. Paulus - Juanda
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Dinamis tahun (current year)
const currentYear = new Date().getFullYear()
</script>