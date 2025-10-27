<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-cinzel font-bold text-gray-900 mb-2">Kelola Dokumen</h1>
      <p class="text-gray-600">Kelola dokumen paroki dan unggah file baru</p>
    </div>

    <!-- Add Document Button -->
    <div class="mb-6">
      <button
        @click="openModal()"
        class="bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#6b2416] transition-colors duration-200 flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Tambah Dokumen
      </button>
    </div>

    <!-- Filter by Category -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Filter berdasarkan Kategori</label>
      <select
        v-model="selectedCategory"
        @change="fetchDocuments"
        class="rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
      >
        <option value="">Semua Kategori</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <!-- Documents Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"></div>
        <p class="mt-2 text-gray-600">Memuat dokumen...</p>
      </div>

      <div v-else-if="documents.length === 0" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada dokumen</h3>
        <p class="mt-1 text-sm text-gray-500">Mulai dengan mengunggah dokumen pertama.</p>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Judul
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategori
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              File
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ukuran
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal Upload
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Featured
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="document in documents" :key="document.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div>
                <div class="text-sm font-medium text-gray-900">{{ document.title }}</div>
                <div class="text-sm text-gray-500">{{ document.description }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 w-3 h-3 rounded mr-2" :style="{ backgroundColor: document.category_color }"></div>
                <span class="text-sm text-gray-900">{{ document.category_name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ document.original_filename }}</div>
              <div class="text-sm text-gray-500">{{ document.mime_type }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-gray-900">{{ formatFileSize(document.file_size) }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-gray-900">{{ formatDate(document.created_at) }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  :checked="document.is_featured || false"
                  @change="toggleFeatured(document.id, $event.target.checked)"
                  class="rounded border-gray-300 text-[#882f1d] focus:ring-[#882f1d]"
                />
                <span class="ml-2 text-sm text-gray-900">Featured</span>
              </label>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="downloadDocument(document)"
                class="text-[#882f1d] hover:text-[#6b2416] mr-4"
              >
                Download
              </button>
              <button
                @click="openModal(document)"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                Edit
              </button>
              <button
                @click="deleteDocument(document.id)"
                class="text-red-600 hover:text-red-900"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? 'Edit Dokumen' : 'Tambah Dokumen' }}
          </h3>

          <form @submit.prevent="saveDocument" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Judul Dokumen *
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
                placeholder="Masukkan judul dokumen"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Kategori *
              </label>
              <select
                v-model="form.category_id"
                required
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
              >
                <option value="">Pilih Kategori</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
                placeholder="Deskripsi dokumen (opsional)"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                File Dokumen {{ !isEditing ? '*' : '(Opsional - kosongkan jika tidak ingin mengubah)' }}
              </label>
              <input
                ref="fileInput"
                type="file"
                @change="handleFileChange"
                :required="!isEditing"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
              />
              <p class="mt-1 text-sm text-gray-500">
                Format yang didukung: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, JPEG, PNG
              </p>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 text-sm font-medium text-white bg-[#882f1d] border border-transparent rounded-md hover:bg-[#6b2416] disabled:opacity-50"
              >
                {{ saving ? 'Menyimpan...' : (isEditing ? 'Update' : 'Simpan') }}
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

const documents = ref([])
const categories = ref([])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const editingId = ref(null)
const selectedCategory = ref('')
const fileInput = ref(null)

const form = ref({
  title: '',
  description: '',
  category_id: '',
  file: null
})

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await $fetch('/api/admin/document-categories', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
    categories.value = response
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// Fetch documents
const fetchDocuments = async () => {
  loading.value = true
  try {
    const params = selectedCategory.value ? `?category_id=${selectedCategory.value}` : ''
    const response = await $fetch(`/api/admin/documents${params}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
    documents.value = response
  } catch (error) {
    console.error('Failed to fetch documents:', error)
    alert('Gagal memuat dokumen')
  } finally {
    loading.value = false
  }
}

// Modal functions
const openModal = (document = null) => {
  if (document) {
    isEditing.value = true
    editingId.value = document.id
    form.value = {
      title: document.title,
      description: document.description || '',
      category_id: document.category_id,
      file: null
    }
  } else {
    isEditing.value = false
    editingId.value = null
    form.value = {
      title: '',
      description: '',
      category_id: '',
      file: null
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    title: '',
    description: '',
    category_id: '',
    file: null
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Handle file change
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.file = file
  }
}

// Save document
const saveDocument = async () => {
  saving.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('description', form.value.description)
    formData.append('category_id', form.value.category_id)

    if (!isEditing.value && form.value.file) {
      formData.append('file', form.value.file)
    }

    const url = isEditing.value
      ? `/api/admin/documents/${editingId.value}`
      : '/api/admin/documents'

    const method = isEditing.value ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      body: formData,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })

    alert(isEditing.value ? 'Dokumen berhasil diupdate' : 'Dokumen berhasil ditambahkan')
    closeModal()
    fetchDocuments()
  } catch (error) {
    console.error('Failed to save document:', error)
    alert(error.data?.message || 'Gagal menyimpan dokumen')
  } finally {
    saving.value = false
  }
}

// Delete document
const deleteDocument = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
    return
  }

  try {
    await $fetch(`/api/admin/documents/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })

    alert('Dokumen berhasil dihapus')
    // Update local state to remove the deleted document immediately
    documents.value = documents.value.filter(doc => doc.id !== id)
  } catch (error) {
    console.error('Failed to delete document:', error)
    alert(error.data?.message || 'Gagal menghapus dokumen')
  }
}

// Download document
const downloadDocument = async (document) => {
  try {
    const response = await $fetch(`/api/admin/documents/${document.id}/download`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      },
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', document.original_filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Failed to download document:', error)
    alert('Gagal mengunduh dokumen')
  }
}

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID')
}

// Toggle featured status
const toggleFeatured = async (id, isFeatured) => {
  try {
    await $fetch(`/api/admin/documents/${id}/toggle-featured`, {
      method: 'PUT',
      body: { is_featured: isFeatured },
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })

    // Update local state
    const doc = documents.value.find(d => d.id === id)
    if (doc) {
      doc.is_featured = isFeatured
    }
  } catch (error) {
    console.error('Failed to toggle featured status:', error)
    alert('Gagal mengubah status featured')
    // Revert checkbox
    fetchDocuments()
  }
}

// Initialize
onMounted(async () => {
  const token = sessionStorage.getItem('admin_token')
  if (!token) {
    navigateTo('/admin/login')
    return
  }

  await Promise.all([fetchCategories(), fetchDocuments()])
})
</script>
