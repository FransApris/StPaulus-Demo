<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-[#882f1d] to-[#a55e1f] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-cinzel font-bold mb-4">
            Jadwal Liturgi & Misa
          </h1>
          <p class="text-xl md:text-2xl text-white/90 mb-8">
            Jadwal lengkap misa, sakramen, dan ibadat di Paroki St. Paulus Juanda
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Filters -->
      <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Liturgi</label>
            <select
              v-model="filters.type"
              @change="fetchSchedules"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
            >
              <option value="">Semua Jenis</option>
              <option v-for="type in liturgyTypes" :key="type.id" :value="type.id">
                {{ type.icon }} {{ type.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Minggu Ini</label>
            <button
              @click="setThisWeek"
              class="w-full bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#a55e1f] transition-colors"
            >
              Tampilkan Minggu Ini
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Minggu Depan</label>
            <button
              @click="setNextWeek"
              class="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Tampilkan Minggu Depan
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#882f1d] mx-auto"></div>
        <p class="mt-4 text-gray-600">Memuat jadwal liturgi...</p>
      </div>

      <!-- Schedules List -->
      <div v-else-if="schedules.length > 0" class="space-y-6">
        <div
          v-for="schedule in schedules"
          :key="schedule.id"
          class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div class="flex items-start space-x-4">
            <!-- Time -->
            <div class="flex-shrink-0">
              <div class="text-2xl font-bold text-[#882f1d] bg-[#882f1d]/10 px-3 py-2 rounded-lg">
                {{ schedule.time }}
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-3">
                <span class="text-2xl">{{ schedule.liturgy_type.icon }}</span>
                <h3 class="text-xl font-semibold text-gray-900">{{ schedule.title }}</h3>
                <span class="px-3 py-1 bg-[#882f1d] text-white text-sm rounded-full font-medium">
                  {{ schedule.liturgy_type.name }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span><strong>Tanggal:</strong> {{ formatDate(schedule.date) }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span><strong>Lokasi:</strong> {{ schedule.location }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                  <span><strong>Bahasa:</strong> {{ schedule.language }}</span>
                </div>
                <div v-if="schedule.priest_name" class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span><strong>Romo:</strong> {{ schedule.priest_name }}</span>
                </div>
              </div>

              <div v-if="schedule.notes" class="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border-l-4 border-[#882f1d]">
                <strong>Catatan:</strong> {{ schedule.notes }}
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="bg-white shadow-lg rounded-lg p-6">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Menampilkan {{ (pagination.page - 1) * pagination.limit + 1 }} -
              {{ Math.min(pagination.page * pagination.limit, pagination.total) }}
              dari {{ pagination.total }} jadwal
            </div>

            <div class="flex items-center space-x-2">
              <!-- Previous Button -->
              <button
                @click="goToPrevPage"
                :disabled="!pagination.hasPrev"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Sebelumnya
              </button>

              <!-- Page Numbers -->
              <div class="flex items-center space-x-1">
                <button
                  v-for="page in getPageNumbers()"
                  :key="page"
                  @click="page !== '...' ? goToPage(page) : null"
                  :class="page === currentPage
                    ? 'px-3 py-2 text-sm font-medium text-white bg-[#882f1d] border border-[#882f1d] rounded-md'
                    : page === '...'
                    ? 'px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md cursor-default'
                    : 'px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50'"
                  :disabled="page === '...'"
                >
                  {{ page }}
                </button>
              </div>

              <!-- Next Button -->
              <button
                @click="goToNextPage"
                :disabled="!pagination.hasNext"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Berikutnya
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Schedules -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">⛪</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Tidak ada jadwal liturgi</h3>
        <p class="text-gray-600">Belum ada jadwal liturgi untuk periode yang dipilih.</p>
      </div>

      <!-- Legend -->
      <div class="mt-12 bg-white shadow-lg rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Keterangan Jenis Liturgi</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="type in liturgyTypes"
            :key="type.id"
            class="flex items-center space-x-2"
          >
            <span class="text-xl">{{ type.icon }}</span>
            <span class="text-sm text-gray-700">{{ type.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const liturgyTypes = ref([])
const schedules = ref([])
const pagination = ref({})
const loading = ref(false)

const filters = ref({
  type: '',
  startDate: '',
  endDate: ''
})

const currentPage = ref(1)

// Fetch liturgy types
const fetchLiturgyTypes = async () => {
  try {
    const response = await $fetch('/api/liturgy/types')
    liturgyTypes.value = response.types
  } catch (error) {
    console.error('Failed to fetch liturgy types:', error)
  }
}

// Fetch schedules with pagination
const fetchSchedules = async (page = 1) => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', '10')

    if (filters.value.type) params.append('type', filters.value.type)
    if (filters.value.startDate) params.append('start_date', filters.value.startDate)
    if (filters.value.endDate) params.append('end_date', filters.value.endDate)

    const response = await $fetch(`/api/liturgy/schedules?${params}`)
    schedules.value = response.schedules
    pagination.value = response.pagination
    currentPage.value = page
  } catch (error) {
    console.error('Failed to fetch schedules:', error)
  } finally {
    loading.value = false
  }
}

// Pagination methods
const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    fetchSchedules(page)
  }
}

const goToPrevPage = () => {
  if (pagination.value.hasPrev) {
    fetchSchedules(currentPage.value - 1)
  }
}

const goToNextPage = () => {
  if (pagination.value.hasNext) {
    fetchSchedules(currentPage.value + 1)
  }
}

// Generate page numbers for pagination
const getPageNumbers = () => {
  const pages = []
  const total = pagination.value.totalPages
  const current = currentPage.value

  if (total <= 7) {
    // Show all pages if total is small
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show pages with ellipsis
    if (current <= 4) {
      // Current page is near the beginning
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // Current page is near the end
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Current page is in the middle
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
}

// Set date filters
const setThisWeek = () => {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay()) // Start of week (Sunday)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6) // End of week (Saturday)

  filters.value.startDate = startOfWeek.toISOString().split('T')[0]
  filters.value.endDate = endOfWeek.toISOString().split('T')[0]

  fetchSchedules()
}

const setNextWeek = () => {
  const today = new Date()
  const startOfNextWeek = new Date(today)
  startOfNextWeek.setDate(today.getDate() - today.getDay() + 7) // Start of next week

  const endOfNextWeek = new Date(startOfNextWeek)
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6) // End of next week

  filters.value.startDate = startOfNextWeek.toISOString().split('T')[0]
  filters.value.endDate = endOfNextWeek.toISOString().split('T')[0]

  fetchSchedules()
}

// Helper functions
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return `Hari Ini - ${date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Besok - ${date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`
  } else {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

// Set default to this week on mount
onMounted(async () => {
  await fetchLiturgyTypes()
  setThisWeek()
})

// SEO
useHead({
  title: 'Jadwal Liturgi & Misa - Paroki St. Paulus Juanda',
  meta: [
    {
      name: 'description',
      content: 'Jadwal lengkap misa, sakramen, dan ibadat di Paroki St. Paulus Juanda. Temukan jadwal misa harian, minggu, dan kegiatan rohani lainnya.'
    }
  ]
})
</script>
