<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb (NEW) -->
        <Breadcrumb title="Jadwal Misa" />
        
        <!-- Tombol Top -->
        <!-- <BackButton position="top" /> -->
        
        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Jadwal Misa Paroki St. Paulus</h1>
          <p class="text-xl text-gray-600">Jadwal misa harian dan akhir pekan. Datanglah dan ikuti perayaan Ekaristi.</p>
        </div>
        
        <!-- Loading -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d]"></div>
          <p class="mt-2 text-gray-600">Memuat jadwal misa...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error</h3>
              <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Tabel Jadwal -->
        <div v-else class="overflow-x-auto">
          <table class="w-4/5 mx-auto bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr class="bg-[#882f1d] text-white">
                <th class="px-4 py-2">Hari</th>
                <th class="px-4 py-2">Waktu</th>
                <th class="px-4 py-2">Jenis Misa</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="schedule in schedules" :key="schedule.id" class="border-t">
                <td class="px-4 py-2 text-center">{{ schedule.day_of_week }}</td>
                <td class="px-4 py-2 text-center">{{ schedule.time }}</td>
                <td class="px-4 py-2 text-center">{{ schedule.mass_type }}</td>
              </tr>
              <tr v-if="schedules.length === 0" class="border-t">
                <td colspan="3" class="px-4 py-8 text-center text-gray-500">
                  Belum ada jadwal misa yang tersedia.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Tombol Bottom -->
        <BackButton position="bottom" />
      </div>
    </section>
  </div>
</template>

<script setup>
const schedules = ref([])
const loading = ref(true)
const error = ref('')

// Fetch regular mass schedules
const fetchSchedules = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await $fetch('/api/regular-mass-schedules')
    // Filter only active schedules
    schedules.value = response.filter(schedule => schedule.is_active)
  } catch (err) {
    error.value = err.data?.message || 'Failed to fetch schedules'
    console.error('Error fetching schedules:', err)
  } finally {
    loading.value = false
  }
}

// Fetch data on mount
onMounted(async () => {
  await fetchSchedules()
})
</script>
