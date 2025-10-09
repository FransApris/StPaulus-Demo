<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header: No ClientOnly - SSR Compatible -->
    <Header :show-hero="isHomePage" />  <!-- Direct render, computed safe di server/client -->

    <!-- Main Content: Full Remaining Height -->
    <main class="flex-grow pt-16 container mx-auto p-4">  <!-- Offset fixed navbar -->
      <NuxtPage />
    </main>

    <!-- Footer: Always Bottom -->
    <footer class="bg-gray-800 text-white p-4 text-center mt-auto">
      <p>&copy; 2023 Gereja Paulus Juanda. Semua hak cipta dilindungi.</p>
    </footer>

    <!-- Chat Widget -->
    <ClientOnly>
      <ChatWidget />
    </ClientOnly>
  </div>
</template>

<script setup>
// Route check (SSR-safe, auto-available)
const route = useRoute()
const isHomePage = computed(() => route.path === '/')
</script>

<style scoped>
/* Minimal - No overrides */
</style>