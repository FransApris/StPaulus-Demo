<template>
  <div class="space-y-6">
    <!-- Add Category Form -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Tambah Kategori Pengguna Baru</h2>
      <form @submit.prevent="createCategory" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="newCategory.name" type="text" placeholder="Nama Kategori (unik)" class="border p-2 rounded" required />
        <input v-model="newCategory.display_name" type="text" placeholder="Nama Tampilan" class="border p-2 rounded" required />
        <input v-model="newCategory.description" type="text" placeholder="Deskripsi" class="border p-2 rounded" />
        <input v-model.number="newCategory.display_order" type="number" placeholder="Urutan Tampilan" class="border p-2 rounded" />
        <button type="submit" :disabled="loading" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 md:col-span-2">
          {{ loading ? 'Membuat...' : 'Buat Kategori' }}
        </button>
      </form>
      <p v-if="message" class="mt-2 text-green-600">{{ message }}</p>
      <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
    </div>

    <!-- Categories List -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Daftar Kategori Pengguna</h2>
      <div v-if="categories.length === 0" class="text-gray-500">Belum ada kategori pengguna.</div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-2 text-left">Nama</th>
              <th class="px-4 py-2 text-left">Nama Tampilan</th>
              <th class="px-4 py-2 text-left">Deskripsi</th>
              <th class="px-4 py-2 text-left">Urutan</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id" class="border-t">
              <td class="px-4 py-2">{{ category.name }}</td>
              <td class="px-4 py-2">{{ category.display_name }}</td>
              <td class="px-4 py-2">{{ category.description }}</td>
              <td class="px-4 py-2">{{ category.display_order }}</td>
              <td class="px-4 py-2">
                <span :class="category.is_active ? 'text-green-600' : 'text-red-600'">
                  {{ category.is_active ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </td>
              <td class="px-4 py-2">
                <button @click="editCategory(category)" class="text-blue-600 hover:underline mr-2">Edit</button>
                <button @click="deleteCategory(category)" class="text-red-600 hover:underline">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Category Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Edit Kategori Pengguna</h3>
        <form @submit.prevent="updateCategory" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="editingCategory.name" type="text" placeholder="Nama Kategori (unik)" class="border p-2 rounded" required />
          <input v-model="editingCategory.display_name" type="text" placeholder="Nama Tampilan" class="border p-2 rounded" required />
          <input v-model="editingCategory.description" type="text" placeholder="Deskripsi" class="border p-2 rounded" />
          <input v-model.number="editingCategory.display_order" type="number" placeholder="Urutan Tampilan" class="border p-2 rounded" />
          <div class="flex items-center md:col-span-2">
            <input v-model="editingCategory.is_active" type="checkbox" class="mr-2" />
            <label>Aktif</label>
          </div>
          <div class="md:col-span-2 flex justify-end space-x-2">
            <button type="button" @click="closeEditModal" class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" :disabled="editLoading" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {{ editLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
        <p v-if="editMessage" class="mt-2 text-green-600">{{ editMessage }}</p>
        <p v-if="editError" class="mt-2 text-red-600">{{ editError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const categories = ref([])
const newCategory = ref({
  name: '',
  display_name: '',
  description: '',
  display_order: 0
})

const loading = ref(false)
const message = ref('')
const error = ref('')

// Edit modal
const showEditModal = ref(false)
const editingCategory = ref({
  id: '',
  name: '',
  display_name: '',
  description: '',
  display_order: 0,
  is_active: true
})
const editLoading = ref(false)
const editMessage = ref('')
const editError = ref('')

// Load categories
const loadCategories = async () => {
  try {
    categories.value = await $fetch('/api/admin/user-categories', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
  } catch (err) {
    console.error('Failed to load categories', err)
  }
}

onMounted(async () => {
  await loadCategories()
})

const createCategory = async () => {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    await $fetch('/api/admin/user-categories', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      },
      body: newCategory.value
    })
    message.value = 'Kategori berhasil dibuat'
    newCategory.value = {
      name: '',
      display_name: '',
      description: '',
      display_order: 0
    }
    await loadCategories()
  } catch (err) {
    error.value = err.data?.statusMessage || 'Gagal membuat kategori'
  } finally {
    loading.value = false
  }
}

const editCategory = (category) => {
  editingCategory.value = { ...category }
  showEditModal.value = true
}

const deleteCategory = (category) => {
  if (confirm(`Apakah Anda yakin ingin menghapus kategori "${category.display_name}"?`)) {
    $fetch(`/api/admin/user-categories/${category.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
    .then(() => {
      loadCategories()
    })
    .catch(err => {
      alert('Gagal menghapus kategori: ' + (err.data?.statusMessage || 'Unknown error'))
    })
  }
}

const updateCategory = async () => {
  editLoading.value = true
  editMessage.value = ''
  editError.value = ''
  try {
    await $fetch(`/api/admin/user-categories/${editingCategory.value.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      },
      body: editingCategory.value
    })
    editMessage.value = 'Kategori berhasil diperbarui'
    showEditModal.value = false
    await loadCategories()
    setTimeout(() => {
      editMessage.value = ''
    }, 3000)
  } catch (err) {
    editError.value = err.data?.statusMessage || 'Gagal memperbarui kategori'
  } finally {
    editLoading.value = false
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editingCategory.value = {
    id: '',
    name: '',
    display_name: '',
    description: '',
    display_order: 0,
    is_active: true
  }
  editMessage.value = ''
  editError.value = ''
}
</script>
