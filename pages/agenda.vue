<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#882f1d] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">Agenda Paroki</h1>
          <p class="text-xl text-gray-200 max-w-2xl mx-auto">
            Jadwal kegiatan, misa, rapat, dan acara lainnya di Paroki St. Paulus
          </p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              v-model="filters.category"
              @change="fetchAgendas"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
            >
              <option value="">Semua Kategori</option>
              <option v-for="category in categories" :key="category.id" :value="category.name">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
            <select
              v-model="filters.month"
              @change="fetchAgendas"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
            >
              <option value="">Semua Bulan</option>
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
              <option value="05">Mei</option>
              <option value="06">Juni</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
            <select
              v-model="filters.year"
              @change="fetchAgendas"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
            >
              <option value="">Semua Tahun</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#882f1d] mx-auto"></div>
        <p class="mt-4 text-gray-600">Memuat agenda...</p>
      </div>

      <!-- Agenda List -->
      <div v-else-if="agendas.length > 0" class="space-y-6">
        <div
          v-for="agenda in agendas"
          :key="agenda.id"
          class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <span :style="getCategoryStyle(agenda)" class="inline-flex px-3 py-1 text-sm font-semibold rounded-full">
                    {{ agenda.category }}
                  </span>
                  <span class="text-sm text-gray-500">{{ formatDate(agenda.start_date) }}</span>
                </div>

                <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ agenda.title }}</h3>

                <div class="flex items-center text-gray-600 mb-3">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="font-medium">{{ formatTime(agenda.start_date) }}</span>
                  <span v-if="agenda.end_date" class="mx-2">-</span>
                  <span v-if="agenda.end_date">{{ formatTime(agenda.end_date) }}</span>
                </div>

                <div class="flex items-center text-gray-600 mb-3">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>{{ agenda.location }}</span>
                </div>

                <div v-if="agenda.description" class="text-gray-700 mb-3">
                  <p class="whitespace-pre-line">{{ agenda.description }}</p>
                </div>

                <div v-if="agenda.contact_person" class="flex items-center text-gray-600">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span class="text-sm">Kontak: {{ agenda.contact_person }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Tidak ada agenda</h3>
        <p class="mt-2 text-gray-500">Belum ada agenda yang dijadwalkan untuk periode ini.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Agenda Paroki - St. Paulus'
})

const agendas = ref([])
const categories = ref([])
const loading = ref(false)

const filters = ref({
  category: '',
  month: '',
  year: ''
})

const fetchCategories = async () => {
  try {
    const response = await $fetch('/api/agenda/categories')
    categories.value = response
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const fetchAgendas = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (filters.value.category) params.append('category', filters.value.category)
    if (filters.value.month) params.append('month', filters.value.month)
    if (filters.value.year) params.append('year', filters.value.year)

    const response = await $fetch(`/api/agenda?${params}`)
    agendas.value = response
  } catch (error) {
    console.error('Failed to fetch agendas:', error)
  } finally {
    loading.value = false
  }
}

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCategoryStyle = (agenda) => {
  if (agenda.category_color) {
    // Convert hex to RGB for background with opacity
    const hex = agenda.category_color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
      color: agenda.category_color,
      border: `1px solid ${agenda.category_color}`
    }
  }
  return {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    color: '#6B7280',
    border: '1px solid #D1D5DB'
  }
}

// Set default year to current year
onMounted(async () => {
  const currentYear = new Date().getFullYear().toString()
  filters.value.year = currentYear
  await fetchCategories()
  fetchAgendas()
})
</script>
