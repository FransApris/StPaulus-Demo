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
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Perjalanan iman kami sejak didirikan pada tahun 1980-an.</p>
        </div>

        <!-- Content Sejarah (Unchanged) -->
        <div class="prose prose-lg max-w-4xl mx-auto">
          <p>Paroki St. Paulus Juanda didirikan pada 15 Juni 1985 oleh Uskup Agung Surabaya. Awalnya sebagai kapel kecil, kini berkembang menjadi komunitas besar dengan 5000 umat.</p>
          <h2>Tahap Pembangunan Gereja</h2>
          <p>Pembangunan gereja utama dimulai 1990, diresmikan 1995. Renovasi terakhir 2020 untuk akomodasi misa online.</p>
        </div>

        <!-- Kronik Gereja Section -->
        <div class="mt-16">
          <h2 class="text-3xl font-cinzel text-[#882f1d] mb-4 text-center">Kronik Gereja</h2>
          <div class="flex justify-center space-x-2 mb-8">
            <button @click="exportToPDF" class="p-2 text-[#882f1d] hover:bg-gray-100 rounded-full transition-colors" title="Ekspor ke PDF">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </button>
            <button @click="printKronik" class="p-2 text-[#882f1d] hover:bg-gray-100 rounded-full transition-colors" title="Cetak">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
            </button>
          </div>
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"></div>
            <p class="mt-2 text-sm text-gray-500">Memuat kronik...</p>
          </div>
          <div v-else-if="kronikItems.length === 0" class="text-center py-8">
            <p class="text-gray-500">Belum ada kronik tersedia.</p>
          </div>
          <Timeline v-else :items="kronikItems" />

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center mt-8">
            <nav class="flex items-center space-x-2">
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage <= 1"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>

              <span v-for="page in visiblePages" :key="page" class="px-3 py-2">
                <button
                  @click="goToPage(page)"
                  :class="page === currentPage ? 'text-[#882f1d] font-bold' : 'text-gray-700'"
                  class="px-3 py-2 text-sm font-medium hover:bg-gray-50 rounded-md"
                >
                  {{ page }}
                </button>
              </span>

              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </nav>
          </div>
        </div>

        <!-- Tombol Bottom (Existing) -->
        <BackButton position="bottom" />
      </div>
    </section>
  </div>
</template>

<script setup>
const kronikItems = ref([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 10

const fetchKronik = async (page = 1) => {
  loading.value = true
  try {
    const response = await $fetch(`/api/kronik?page=${page}&limit=${limit}`)
    kronikItems.value = response.items
    totalPages.value = response.totalPages
    currentPage.value = response.page
  } catch (error) {
    console.error('Failed to fetch kronik:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchKronik()
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchKronik(page)
  }
}

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const exportToPDF = () => {
  // Simple PDF export using browser print to PDF
  window.print()
}

const printKronik = () => {
  window.print()
}
</script>

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
