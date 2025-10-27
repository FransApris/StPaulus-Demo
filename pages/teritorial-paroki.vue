<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb -->
        <Breadcrumb title="Teritorial Paroki" />

        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Teritorial Paroki</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Peta wilayah lingkungan Paroki St. Paulus Juanda</p>
        </div>

        <!-- Google My Maps Embed -->
        <div class="max-w-7xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/d/embed?mid=18ysqVOVWT_ynb_DwhlxG_ZasT675kas&ehbc=2E312F"
              width="100%"
              height="600"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
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
  title: 'Teritorial Paroki - St. Paulus'
})
</script>

<style scoped>
.prose { color: #374151; }
</style>
