<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Kelola Jadwal Misa Reguler</h1>
        <p class="text-gray-600">Kelola jadwal misa reguler mingguan</p>
      </div>
      <button
        @click="showAddModal = true"
        class="bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#a55e1f] transition-colors"
      >
        Tambah Jadwal Misa
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d]"></div>
      <p class="mt-2 text-gray-600">Memuat data...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
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

    <!-- Schedules Table -->
    <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hari</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Misa</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="schedule in (schedules || [])" :key="schedule.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ schedule.day_of_week }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ schedule.time }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ schedule.mass_type }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="schedule.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ schedule.is_active ? 'Aktif' : 'Tidak Aktif' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="editSchedule(schedule)"
                    class="text-[#882f1d] hover:text-[#a55e1f] mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteSchedule(schedule.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && (!schedules || schedules.length === 0)" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada jadwal misa</h3>
          <p class="mt-1 text-sm text-gray-500">Mulai dengan menambahkan jadwal misa reguler.</p>
          <div class="mt-6">
            <button
              @click="showAddModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#882f1d] hover:bg-[#a55e1f]"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Jadwal Misa
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModals">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showAddModal ? 'Tambah Jadwal Misa' : 'Edit Jadwal Misa' }}
          </h3>

          <form @submit.prevent="saveSchedule" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Hari</label>
              <select
                v-model="form.day_of_week"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
              >
                <option value="">Pilih hari</option>
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
                <option value="Minggu">Minggu</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Waktu</label>
              <input
                v-model="form.time"
                type="time"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Jenis Misa</label>
              <input
                v-model="form.mass_type"
                type="text"
                required
                placeholder="contoh: Misa Pagi, Misa Sore"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
              />
            </div>

            <div class="flex items-center">
              <input
                v-model="form.is_active"
                type="checkbox"
                class="h-4 w-4 text-[#882f1d] focus:ring-[#882f1d] border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">Aktif</label>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModals"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 text-sm font-medium text-white bg-[#882f1d] border border-transparent rounded-md hover:bg-[#a55e1f] disabled:opacity-50"
              >
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const schedules = ref([])
const loading = ref(true)
const error = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const saving = ref(false)

const form = ref({
  id: null,
  day_of_week: '',
  time: '',
  mass_type: '',
  is_active: true
})

// Fetch schedules
const fetchSchedules = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await $fetch('/api/admin/regular-mass-schedules', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }
    })

    schedules.value = response
  } catch (err) {
    error.value = err.data?.message || 'Failed to fetch schedules'
    console.error('Error fetching schedules:', err)
  } finally {
    loading.value = false
  }
}

// Save schedule (add or update)
const saveSchedule = async () => {
  try {
    saving.value = true

    const url = form.value.id
      ? `/api/admin/regular-mass-schedules/${form.value.id}`
      : '/api/admin/regular-mass-schedules'

    const method = form.value.id ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      },
      body: {
        day_of_week: form.value.day_of_week,
        time: form.value.time,
        mass_type: form.value.mass_type,
        is_active: form.value.is_active
      }
    })

    closeModals()
    await fetchSchedules()
  } catch (err) {
    console.error('Error saving schedule:', err)
    alert('Gagal menyimpan jadwal misa')
  } finally {
    saving.value = false
  }
}

// Edit schedule
const editSchedule = (schedule) => {
  form.value = { ...schedule }
  showEditModal.value = true
}

// Delete schedule
const deleteSchedule = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus jadwal misa ini?')) {
    return
  }

  try {
    await $fetch(`/api/admin/regular-mass-schedules/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }
    })

    await fetchSchedules()
  } catch (err) {
    console.error('Error deleting schedule:', err)
    alert('Gagal menghapus jadwal misa')
  }
}

// Close modals
const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  form.value = {
    id: null,
    day_of_week: '',
    time: '',
    mass_type: '',
    is_active: true
  }
}

// Fetch data on mount (middleware already checks auth)
onMounted(async () => {
  await fetchSchedules()
})
</script>
