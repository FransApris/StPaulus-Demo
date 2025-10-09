<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <h1>Kategori: {{ slug }}</h1>
    <p>Loading...</p>
  </div>
</template>

<script setup>
const route = useRoute();
const slug = route.params.slug;
</script>
