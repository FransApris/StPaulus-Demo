<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-cinzel text-gray-900">Kategori Galeri</h1>
      <p class="text-sm text-gray-600 mt-1">Kelola kategori untuk album galeri foto</p>
    </div>

    <!-- Add Category Button -->
    <div class="mb-6">
      <button
        @click="showAddCategoryModal = true"
        class="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Tambah Kategori Baru
      </button>
    </div>

    <!-- Categories Table -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="category in categories" :key="category.id" class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div
                class="w-4 h-4 rounded-full mr-3"
                :style="{ backgroundColor: category.color }"
              ></div>
              <div>
                <h3 class="text-sm font-medium text-gray-900">{{ category.nama_kategori }}</h3>
                <p v-if="category.description" class="text-sm text-gray-500">{{ category.description }}</p>
                <p class="text-xs text-gray-400">Urutan: {{ category.display_order }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ category.is_active ? 'Aktif' : 'Tidak Aktif' }}
              </span>
              <button
                @click="editCategory(category)"
                class="text-blue-600 hover:text-blue-900 text-sm font-medium"
              >
                Edit
              </button>
              <button
                @click="deleteCategory(category)"
                class="text-red-600 hover:text-red-900 text-sm font-medium"
              >
                Hapus
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Add/Edit Category Modal -->
    <div
      v-if="showAddCategoryModal || editingCategory"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
          </h3>

          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nama Kategori</label>
              <input
                v-model="categoryForm.nama_kategori"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                v-model="categoryForm.description"
                rows="3"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Warna</label>
              <input
                v-model="categoryForm.color"
                type="color"
                class="mt-1 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div v-if="editingCategory">
              <label class="block text-sm font-medium text-gray-700">Urutan Tampilan</label>
              <input
                v-model.number="categoryForm.display_order"
                type="number"
                min="0"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div v-if="editingCategory" class="flex items-center">
              <input
                v-model="categoryForm.is_active"
                type="checkbox"
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">Aktif</label>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeCategoryModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
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
            Apakah Anda yakin ingin menghapus kategori "{{ deletingCategory?.nama_kategori }}"?
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div class="flex justify-end space-x-3">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              @click="confirmDelete"
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

import { ref, onMounted } from 'vue'

// Reactive data
const categories = ref([])
const showAddCategoryModal = ref(false)
const editingCategory = ref(null)
const showDeleteModal = ref(false)
const deletingCategory = ref(null)
const loading = ref(false)

const categoryForm = ref({
  nama_kategori: '',
  description: '',
  color: '#6B7280',
  display_order: 0,
  is_active: true
})

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await $fetch('/api/admin/gallery-categories', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
    categories.value = response.categories
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    alert('Gagal memuat kategori')
  }
}

// Save category (create or update)
const saveCategory = async () => {
  loading.value = true
  try {
    const url = editingCategory.value
      ? `/api/admin/gallery-categories/${editingCategory.value.id}`
      : '/api/admin/gallery-categories'

    const method = editingCategory.value ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        'Content-Type': 'application/json'
      },
      body: categoryForm.value
    })

    alert(editingCategory.value ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambahkan')
    closeCategoryModal()
    await fetchCategories()
  } catch (error) {
    console.error('Failed to save category:', error)
    alert('Gagal menyimpan kategori')
  } finally {
    loading.value = false
  }
}

// Edit category
const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.value = {
    nama_kategori: category.nama_kategori,
    description: category.description || '',
    color: category.color,
    display_order: category.display_order,
    is_active: category.is_active
  }
  showAddCategoryModal.value = false
}

// Delete category
const deleteCategory = (category) => {
  deletingCategory.value = category
  showDeleteModal.value = true
}

// Confirm delete
const confirmDelete = async () => {
  loading.value = true
  try {
    await $fetch(`/api/admin/gallery-categories/${deletingCategory.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })

    alert('Kategori berhasil dihapus')
    closeDeleteModal()
    await fetchCategories()
  } catch (error) {
    console.error('Failed to delete category:', error)
    alert('Gagal menghapus kategori')
  } finally {
    loading.value = false
  }
}

// Modal handlers
const closeCategoryModal = () => {
  showAddCategoryModal.value = false
  editingCategory.value = null
  categoryForm.value = {
    nama_kategori: '',
    description: '',
    color: '#6B7280',
    display_order: 0,
    is_active: true
  }
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingCategory.value = null
}

// Check authentication and fetch data on mount
onMounted(async () => {
  const token = sessionStorage.getItem('admin_token')
  if (!token) {
    navigateTo('/admin/login')
    return
  }

  await fetchCategories()
})
</script>
