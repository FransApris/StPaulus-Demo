<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-[#882f1d] to-[#a55e1f] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-cinzel font-bold mb-4">
            Jadwal Misa
          </h1>
          <p class="text-xl md:text-2xl text-white/90 mb-8">
            Jadwal misa di Paroki St. Paulus Juanda
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Filters -->
      <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Misa</label>
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
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#882f1d] mx-auto"></div>
        <p class="mt-4 text-gray-600">Memuat jadwal misa...</p>
      </div>

      <!-- Schedules List -->
      <div v-else-if="schedules.length > 0" class="space-y-4">
        <div
          v-for="schedule in schedules"
          :key="schedule.id"
          class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow border-l-4"
          :style="{ borderLeftColor: schedule.liturgy_type.color }"
        >
          <div class="flex items-center justify-between">
            <!-- Time and Day -->
            <div class="flex items-center space-x-4">
              <div class="text-3xl font-bold text-gray-800">
                {{ schedule.time }}
              </div>
              <div class="text-lg text-gray-600">
                {{ formatDay(schedule.date) }}
              </div>
            </div>

            <!-- Mass Type Badge -->
            <div class="flex items-center space-x-2">
              <span class="text-2xl">{{ schedule.liturgy_type.icon }}</span>
              <span class="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-semibold rounded-full">
                {{ schedule.liturgy_type.name }}
              </span>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div class="flex items-center space-x-4">
              <span>📅 {{ formatDate(schedule.date) }}</span>
              <span>📍 {{ schedule.location }}</span>
              <span v-if="schedule.priest_name">👤 {{ schedule.priest_name }}</span>
            </div>
            <div v-if="schedule.notes" class="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
              📝 {{ schedule.notes }}
            </div>
          </div>
        </div>
      </div>

      <!-- No Schedules -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">⛪</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Tidak ada jadwal misa</h3>
        <p class="text-gray-600">Belum ada jadwal misa untuk periode yang dipilih.</p>
      </div>

      <!-- Legend -->
      <div class="mt-12 bg-white shadow-lg rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Keterangan Jenis Misa</h3>
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
const loading = ref(false)

const filters = ref({
  type: '',
  startDate: '',
  endDate: ''
})

// Fetch liturgy types
const fetchLiturgyTypes = async () => {
  try {
    const response = await $fetch('/api/liturgy/types')
    liturgyTypes.value = response.types
  } catch (error) {
    console.error('Failed to fetch liturgy types:', error)
  }
}

// Fetch schedules
const fetchSchedules = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()

    if (filters.value.type) params.append('type', filters.value.type)
    if (filters.value.startDate) params.append('start_date', filters.value.startDate)
    if (filters.value.endDate) params.append('end_date', filters.value.endDate)

    const response = await $fetch(`/api/liturgy/schedules?${params}`)
    schedules.value = response.schedules
  } catch (error) {
    console.error('Failed to fetch schedules:', error)
  } finally {
    loading.value = false
  }
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

// Helper functions
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDay = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    weekday: 'long'
  })
}

// Set default to this week on mount
onMounted(async () => {
  await fetchLiturgyTypes()
  setThisWeek()
})

// SEO
useHead({
  title: 'Jadwal Misa - Paroki St. Paulus Juanda',
  meta: [
    {
      name: 'description',
      content: 'Jadwal misa di Paroki St. Paulus Juanda. Temukan jadwal misa harian, minggu, dan kegiatan rohani lainnya.'
    }
  ]
})
</script>
