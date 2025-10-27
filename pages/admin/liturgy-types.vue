<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-cinzel font-bold text-gray-900">Kelola Jenis Liturgi</h1>
        <p class="text-gray-600">Kelola jenis-jenis liturgi yang tersedia untuk jadwal misa</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#6b2416] transition-colors duration-200 flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Tambah Jenis Liturgi
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ikon</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urutan</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="type in liturgyTypes" :key="type.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-2xl">{{ type.icon }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: type.color }"></div>
                  <span class="text-sm font-medium text-gray-900">{{ type.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ type.slug }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{{ type.description || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ type.display_order }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="type.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ type.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editType(type)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(type)"
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

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showCreateModal ? 'Tambah Jenis Liturgi' : 'Edit Jenis Liturgi' }}
          </h3>

          <form @submit.prevent="saveType" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nama</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Slug</label>
              <input
                v-model="form.slug"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Ikon (emoji)</label>
              <input
                v-model="form.icon"
                type="text"
                placeholder="⛪"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Warna</label>
              <input
                v-model="form.color"
                type="color"
                class="mt-1 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Urutan Tampilan</label>
              <input
                v-model.number="form.display_order"
                type="number"
                min="0"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div v-if="showEditModal" class="flex items-center">
              <input
                v-model="form.is_active"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
                :disabled="loading"
                class="px-4 py-2 text-sm font-medium text-white bg-[#882f1d] border border-transparent rounded-md hover:bg-[#6b2416] disabled:opacity-50"
              >
                {{ loading ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Konfirmasi Hapus</h3>
          <p class="text-sm text-gray-500 mb-4">
            Apakah Anda yakin ingin menghapus jenis liturgi "{{ typeToDelete?.name }}"?
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div class="flex justify-end space-x-3">
            <button
              @click="closeModals"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              @click="deleteType"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {{ loading ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})
const liturgyTypes = ref([])
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const typeToDelete = ref(null)

const form = reactive({
  id: null,
  name: '',
  slug: '',
  icon: '⛪',
  color: '#6B7280',
  description: '',
  display_order: 0,
  is_active: true
})

// Fetch liturgy types
const fetchLiturgyTypes = async () => {
  try {
    const response = await $fetch('/api/admin/liturgy-types')
    liturgyTypes.value = response.liturgyTypes || []
  } catch (error) {
    console.error('Failed to fetch liturgy types:', error)
    alert('Gagal memuat data jenis liturgi')
  }
}

// Save type (create or update)
const saveType = async () => {
  loading.value = true
  try {
    const url = form.id ? `/api/admin/liturgy-types/${form.id}` : '/api/admin/liturgy-types'
    const method = form.id ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      body: form
    })

    alert(`Jenis liturgi ${form.id ? 'diperbarui' : 'ditambahkan'} berhasil`)
    closeModals()
    await fetchLiturgyTypes()
  } catch (error) {
    console.error('Failed to save liturgy type:', error)
    alert(error.data?.statusMessage || 'Gagal menyimpan jenis liturgi')
  } finally {
    loading.value = false
  }
}

// Edit type
const editType = (type) => {
  Object.assign(form, type)
  showEditModal.value = true
}

// Confirm delete
const confirmDelete = (type) => {
  typeToDelete.value = type
  showDeleteModal.value = true
}

// Delete type
const deleteType = async () => {
  if (!typeToDelete.value) return

  loading.value = true
  try {
    await $fetch(`/api/admin/liturgy-types/${typeToDelete.value.id}`, {
      method: 'DELETE'
    })

    alert('Jenis liturgi dihapus berhasil')
    closeModals()
    await fetchLiturgyTypes()
  } catch (error) {
    console.error('Failed to delete liturgy type:', error)
    alert(error.data?.statusMessage || 'Gagal menghapus jenis liturgi')
  } finally {
    loading.value = false
  }
}

// Close modals and reset form
const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  typeToDelete.value = null

  // Reset form
  Object.assign(form, {
    id: null,
    name: '',
    slug: '',
    icon: '⛪',
    color: '#6B7280',
    description: '',
    display_order: 0,
    is_active: true
  })
}

// Auto-generate slug from name
watch(() => form.name, (newName) => {
  if (newName) { // Generate for both new and edit entries
    form.slug = newName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
  }
})

// Fetch data on mount
onMounted(async () => {
  await fetchLiturgyTypes()
})
</script>
