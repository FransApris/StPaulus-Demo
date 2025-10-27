<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Pengelola Tema Hero</h1>
      <p class="text-gray-600">Kelola gambar hero section halaman depan</p>

      <!-- Image Guidelines -->
      <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 class="text-sm font-semibold text-blue-800 mb-2">Rekomendasi Ukuran Gambar Hero</h3>
        <ul class="text-sm text-blue-700 space-y-1">
          <li><strong>Lebar:</strong> 1920px (Full HD)</li>
          <li><strong>Tinggi:</strong> 1080px</li>
          <li><strong>Rasio:</strong> 16:9 (landscape)</li>
          <li><strong>Format:</strong> JPG atau WebP (untuk performa optimal)</li>
          <li><strong>Ukuran file:</strong> Maksimal 2MB</li>
        </ul>
        <h4 class="text-sm font-semibold text-blue-800 mt-3 mb-1">Alasan Rekomendasi</h4>
        <ul class="text-sm text-blue-700 space-y-1">
          <li>Hero container menggunakan min-h-screen (100vh) dengan bg-cover</li>
          <li>Background position: center dengan cover scaling</li>
          <li>Responsivitas: Gambar akan di-crop otomatis untuk berbagai ukuran layar</li>
          <li>Performance: Gambar besar memastikan kualitas pada layar retina/high-DPI</li>
        </ul>
        <h4 class="text-sm font-semibold text-blue-800 mt-3 mb-1">Tips Upload</h4>
        <ul class="text-sm text-blue-700 space-y-1">
          <li>Gunakan gambar horizontal dengan subjek di tengah</li>
          <li>Pastikan teks overlay masih terbaca dengan background apa pun</li>
          <li>Kompresi gambar tanpa kehilangan kualitas signifikan</li>
        </ul>
      </div>
    </div>

    <!-- Add Theme Button -->
    <div class="bg-white p-6 rounded-lg shadow">
      <button @click="showCreateModal = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Tambah Tema Baru
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white p-6 rounded-lg shadow">
      <p class="text-gray-500">Loading...</p>
    </div>

    <!-- Themes List -->
    <div v-else-if="themes.length > 0" class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Daftar Tema Hero</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-2 text-left">Nama</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="theme in themes" :key="theme.id" class="border-t">
              <td class="px-4 py-2">{{ theme.name }}</td>
              <td class="px-4 py-2">
                <span :class="theme.is_active ? 'text-green-600' : 'text-gray-500'">
                  {{ theme.is_active ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </td>
              <td class="px-4 py-2">
                <button v-if="!theme.is_active" @click="activateTheme(theme.id)" class="text-blue-600 hover:underline mr-2">Aktifkan</button>
                <button @click="deleteTheme(theme.id)" class="text-red-600 hover:underline">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white p-6 rounded-lg shadow">
      <p class="text-gray-500">Belum ada tema hero. Klik tombol "Tambah Tema Baru" untuk membuat tema pertama!</p>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Tambah Tema Baru</h3>
        <form @submit.prevent="createTheme" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Tema</label>
            <input v-model="newTheme.name" type="text" placeholder="Nama tema" class="w-full border border-gray-300 rounded-md px-3 py-2" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
            <input type="file" @change="handleFileChange" accept="image/*" class="w-full border border-gray-300 rounded-md px-3 py-2" required />
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="showCreateModal = false" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" :disabled="loading" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ loading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const themes = ref([])
const loading = ref(true)
const showCreateModal = ref(false)
const newTheme = ref({ name: '', image: null })

onMounted(async () => {
  await fetchThemes()
})

const fetchThemes = async () => {
  try {
    const response = await $fetch('/api/admin/hero-themes', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
    themes.value = response.data
  } catch (error) {
    console.error('Error fetching themes:', error)
  } finally {
    loading.value = false
  }
}

const handleFileChange = (event) => {
  newTheme.value.image = event.target.files[0]
}

const createTheme = async () => {
  try {
    const formData = new FormData()
    formData.append('name', newTheme.value.name)
    formData.append('image', newTheme.value.image)

    await $fetch('/api/admin/hero-themes', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      },
      body: formData
    })

    showCreateModal.value = false
    newTheme.value = { name: '', image: null }
    await fetchThemes()
  } catch (error) {
    console.error('Error creating theme:', error)
  }
}

const activateTheme = async (themeId) => {
  try {
    await $fetch(`/api/admin/hero-themes/${themeId}/activate`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
    await fetchThemes()
  } catch (error) {
    console.error('Error activating theme:', error)
  }
}

const deleteTheme = async (themeId) => {
  try {
    await $fetch(`/api/admin/hero-themes/${themeId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
    await fetchThemes()
  } catch (error) {
    console.error('Error deleting theme:', error)
  }
}
</script>
