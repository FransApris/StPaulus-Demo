<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Kelola Agenda</h1>
        <p class="mt-2 text-sm text-gray-700">
          Kelola jadwal misa, rapat, kegiatan lingkungan, dan acara lainnya.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="showAddModal = true"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-[#882f1d] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#a55e1f] focus:outline-none focus:ring-2 focus:ring-[#882f1d] focus:ring-offset-2"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Tambah Agenda
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mt-6 bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Cari</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Cari agenda..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
              @input="debouncedSearch"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Kategori</label>
            <select
              v-model="filters.category"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
              @change="fetchAgendas"
            >
              <option value="">Semua Kategori</option>
              <option v-for="category in categories" :key="category.id" :value="category.name">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Bulan</label>
            <select
              v-model="filters.month"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
              @change="fetchAgendas"
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
            <label class="block text-sm font-medium text-gray-700">Tahun</label>
            <select
              v-model="filters.year"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
              @change="fetchAgendas"
            >
              <option value="">Semua Tahun</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Agenda Table -->
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Tanggal & Waktu</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Kegiatan</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Lokasi</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Kategori</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="agenda in agendas" :key="agenda.id" class="hover:bg-gray-50">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div class="font-medium text-gray-900">{{ formatDate(agenda.start_date) }}</div>
                    <div class="text-gray-500">{{ formatTime(agenda.start_date) }}</div>
                    <div v-if="agenda.end_date" class="text-gray-400 text-xs">s/d {{ formatTime(agenda.end_date) }}</div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <div class="font-medium text-gray-900">{{ agenda.title }}</div>
                    <div v-if="agenda.description" class="text-gray-500 truncate max-w-xs">{{ agenda.description }}</div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ agenda.location }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span :class="getCategoryClass(agenda)" class="inline-flex rounded-full px-2 text-xs font-semibold leading-5">
                      {{ agenda.category }}
                    </span>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="editAgenda(agenda)"
                      class="text-[#882f1d] hover:text-[#a55e1f] mr-4"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteAgenda(agenda.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || editingAgenda" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveAgenda">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {{ editingAgenda ? 'Edit Agenda' : 'Tambah Agenda Baru' }}
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Nama Kegiatan *</label>
                      <input
                        v-model="agendaForm.title"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Tanggal Mulai *</label>
                        <input
                          v-model="agendaForm.start_date"
                          type="datetime-local"
                          required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
                        <input
                          v-model="agendaForm.end_date"
                          type="datetime-local"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Lokasi *</label>
                      <input
                        v-model="agendaForm.location"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Kategori *</label>
                      <select
                        v-model="agendaForm.category_id"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
                      >
                        <option value="">Pilih Kategori</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                          {{ category.name }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
                      <textarea
                        v-model="agendaForm.description"
                        rows="3"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
                        placeholder="Deskripsi kegiatan..."
                      ></textarea>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Kontak Person</label>
                      <input
                        v-model="agendaForm.contact_person"
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d] sm:text-sm"
                        placeholder="Nama atau nomor kontak"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                :disabled="saving"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#882f1d] text-base font-medium text-white hover:bg-[#a55e1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d] sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {{ saving ? 'Menyimpan...' : (editingAgenda ? 'Update' : 'Simpan') }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Batal
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
  layout: 'admin'
})

const agendas = ref([])
const categories = ref([])
const loading = ref(false)
const saving = ref(false)
const showAddModal = ref(false)
const editingAgenda = ref(null)

const filters = ref({
  search: '',
  category: '',
  month: '',
  year: ''
})

const agendaForm = ref({
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  location: '',
  category_id: '',
  contact_person: ''
})

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchAgendas()
  }, 500)
}

const fetchCategories = async () => {
  try {
    const response = await $fetch('/api/admin/agenda/categories', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
    categories.value = response
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const fetchAgendas = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.category) params.append('category', filters.value.category)
    if (filters.value.month) params.append('month', filters.value.month)
    if (filters.value.year) params.append('year', filters.value.year)

    const response = await $fetch(`/api/admin/agenda?${params}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
    agendas.value = response
  } catch (error) {
    console.error('Failed to fetch agendas:', error)
  } finally {
    loading.value = false
  }
}

const saveAgenda = async () => {
  saving.value = true
  try {
    const url = editingAgenda.value ? `/api/admin/agenda/${editingAgenda.value.id}` : '/api/admin/agenda'
    const method = editingAgenda.value ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      body: agendaForm.value,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })

    closeModal()
    fetchAgendas()
  } catch (error) {
    console.error('Failed to save agenda:', error)
    alert('Gagal menyimpan agenda. Silakan coba lagi.')
  } finally {
    saving.value = false
  }
}

const editAgenda = (agenda) => {
  editingAgenda.value = agenda
  agendaForm.value = {
    title: agenda.title,
    description: agenda.description,
    start_date: agenda.start_date,
    end_date: agenda.end_date,
    location: agenda.location,
    category_id: agenda.category_id || '',
    contact_person: agenda.contact_person
  }
  showAddModal.value = false
}

const deleteAgenda = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus agenda ini?')) return

  try {
    await $fetch(`/api/admin/agenda/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
    fetchAgendas()
  } catch (error) {
    console.error('Failed to delete agenda:', error)
    alert('Gagal menghapus agenda. Silakan coba lagi.')
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingAgenda.value = null
  agendaForm.value = {
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    category_id: '',
    contact_person: ''
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

const getCategoryClass = (agenda) => {
  if (agenda.category_color) {
    // Convert hex color to appropriate Tailwind classes
    const color = agenda.category_color
    if (color === '#3B82F6' || color.toLowerCase() === 'blue') return 'bg-blue-100 text-blue-800'
    if (color === '#10B981' || color.toLowerCase() === 'green') return 'bg-green-100 text-green-800'
    if (color === '#8B5CF6' || color.toLowerCase() === 'purple') return 'bg-purple-100 text-purple-800'
    if (color === '#EF4444' || color.toLowerCase() === 'red') return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  // Fallback to hardcoded classes
  const classes = {
    'Misa & Ibadat': 'bg-blue-100 text-blue-800',
    'Kegiatan Lingkungan': 'bg-green-100 text-green-800',
    'Rapat & Pertemuan': 'bg-purple-100 text-purple-800',
    'Acara Khusus': 'bg-red-100 text-red-800',
    'Lain-lain': 'bg-gray-100 text-gray-800'
  }
  return classes[agenda.category] || 'bg-gray-100 text-gray-800'
}

// Check authentication and fetch data on mount
onMounted(async () => {
  const token = sessionStorage.getItem('admin_token')
  if (!token) {
    navigateTo('/admin/login')
    return
  }

  await Promise.all([fetchCategories(), fetchAgendas()])
})
</script>
