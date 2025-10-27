<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb (NEW) -->
        <Breadcrumb title="Sejarah Paroki" />

        <!-- Tombol Top (Existing) -->
        <!-- <BackButton position="top" /> -->

        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Sejarah Paroki St. Paulus Juanda</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Sebuah perjalanan iman yang unik, dimulai dari pengadaan lahan hingga menjadi komunitas Paroki yang mandiri dan terintegrasi.</p>
        </div>

        <!-- Content Sejarah -->
        <div class="max-w-[75%] mx-auto">
          <TimelineSejarahParoki />
        </div>

        <!-- Tombol Bottom (Existing) -->
        <BackButton position="bottom" />
      </div>
    </section>
  </div>
</template>

// Page meta
definePageMeta({
  title: 'Sejarah Paroki - St. Paulus'
})

// Import components
import TimelineSejarahParoki from '~/components/TimelineSejarahParoki.vue'

<style scoped>
.prose { color: #374151; }
.prose h2 { color: #882f1d; }

@media print {
  .timeline-grid {
    grid-template-columns: 1fr !important;
  }
  button, nav {
    display: none !important;
  }
}
</style>
