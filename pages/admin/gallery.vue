<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <p class="text-sm text-gray-600 mt-1">Kelola album dan foto galeri gereja</p>
    </div>

    <!-- Navigation Breadcrumb -->
    <div v-if="currentView === 'album-detail'" class="mb-6">
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <button @click="goToAlbumList" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0 1-1v-1h2v1a1 1 0 0 0 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z"/>
              </svg>
              Galeri
            </button>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
              </svg>
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">{{ currentAlbum?.title }}</span>
            </div>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Album List View -->
    <div v-if="currentView === 'album-list'">
      <!-- Add Album Button -->
      <div class="mb-6">
        <button
          @click="showAddAlbumModal = true"
          class="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Tambah Album Baru
        </button>
      </div>

      <!-- Albums Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Add New Album Card -->
        <div
          @click="showAddAlbumModal = true"
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-red-400 hover:bg-red-50 cursor-pointer transition-colors"
        >
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Tambah Album Baru</h3>
            <p class="mt-1 text-sm text-gray-500">Buat album untuk mengelompokkan foto</p>
          </div>
        </div>

        <!-- Album Cards -->
        <div
          v-for="album in albums"
          :key="album.id"
          class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="aspect-w-16 aspect-h-9 bg-gray-200 relative">
            <img
              :src="album.thumbnail || '/placeholder-image.jpg'"
              :alt="album.title"
              class="w-full h-48 object-cover cursor-pointer"
              @click="viewAlbum(album)"
              @error="handleImageError"
            />
            <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center">
              <button
                @click="viewAlbum(album)"
                class="opacity-0 hover:opacity-100 bg-white bg-opacity-90 text-gray-900 px-3 py-1 rounded-md text-sm font-medium"
              >
                Lihat Album
              </button>
            </div>
          </div>
          <div class="p-4">
            <h4 class="text-lg font-medium text-gray-900 cursor-pointer hover:text-red-600" @click="viewAlbum(album)">
              {{ album.title }}
            </h4>
            <p class="text-sm text-gray-500 mt-1">{{ album.description }}</p>
            <div class="flex items-center justify-between mt-4">
              <span class="text-sm text-gray-500">{{ album.photos?.length || 0 }} foto</span>
              <div class="flex space-x-2">
                <button
                  @click="editAlbum(album)"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                  title="Edit Album"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button
                  @click="deleteAlbum(album)"
                  class="text-red-600 hover:text-red-800 text-sm"
                  title="Hapus Album"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Album Detail View -->
    <div v-if="currentView === 'album-detail'">
      <!-- Album Header -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-cinzel text-gray-900">{{ currentAlbum?.title }}</h2>
            <p class="text-gray-600 mt-1">{{ currentAlbum?.description }}</p>
            <p class="text-sm text-gray-500 mt-2">{{ currentAlbum?.photos?.length || 0 }} foto dalam album ini</p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="showUploadModal = true"
              class="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Unggah Foto
            </button>
            <button
              @click="editAlbum(currentAlbum)"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Edit Album
            </button>
          </div>
        </div>
      </div>

      <!-- Photos Grid -->
      <div v-if="currentAlbum?.photos?.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div
          v-for="(photo, index) in currentAlbum.photos"
          :key="photo.id"
          class="relative group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          draggable="true"
          @dragstart="onDragStart($event, index)"
          @dragover.prevent
          @drop="onDrop($event, index)"
        >
          <img
            :src="photo.url"
            :alt="photo.title || 'Foto galeri'"
            class="w-full h-32 object-cover"
            @error="handleImageError"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
            <div class="opacity-0 group-hover:opacity-100 flex space-x-2">
              <button
                @click="editPhoto(photo)"
                class="bg-white bg-opacity-90 text-gray-900 p-2 rounded-full hover:bg-opacity-100"
                title="Edit Foto"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button
                @click="deletePhoto(photo)"
                class="bg-white bg-opacity-90 text-red-600 p-2 rounded-full hover:bg-opacity-100"
                title="Hapus Foto"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {{ index + 1 }}
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Belum ada foto</h3>
        <p class="mt-2 text-gray-500">Mulai dengan mengunggah foto pertama ke album ini.</p>
        <button
          @click="showUploadModal = true"
          class="mt-4 bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Unggah Foto Pertama
        </button>
      </div>
    </div>

    <!-- Add/Edit Album Modal -->
    <div v-if="showAddAlbumModal || editingAlbum" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingAlbum ? 'Edit Album' : 'Tambah Album Baru' }}
          </h3>

          <form @submit.prevent="saveAlbum">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Judul Album</label>
              <input
                v-model="albumForm.title"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                v-model="albumForm.description"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
              ></textarea>
            </div>

            <div class="mb-4" v-if="!editingAlbum">
              <label class="block text-sm font-medium text-gray-700">Slug/ID Album</label>
              <input
                v-model="albumForm.slug"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
              <p class="mt-1 text-sm text-gray-500">Slug akan digunakan sebagai nama folder</p>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closeAlbumModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 text-sm font-medium text-white bg-red-800 border border-transparent rounded-md hover:bg-red-900 disabled:opacity-50"
              >
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Photo Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Unggah Foto ke Album "{{ currentAlbum?.title }}"</h3>

          <!-- Drag and Drop Area -->
          <div
            @dragover.prevent
            @drop.prevent="onDropFiles"
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 hover:bg-red-50 transition-colors cursor-pointer"
            @click="$refs.fileInput.click()"
          >
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <p class="mt-2 text-sm text-gray-600">
              Seret dan jatuhkan file foto di sini, atau
              <span class="text-red-600 hover:text-red-800 font-medium">klik untuk memilih file</span>
            </p>
            <p class="text-xs text-gray-500 mt-1">Mendukung JPG, PNG, GIF hingga 10MB per file</p>
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              @change="onFileSelect"
              class="hidden"
            />
          </div>

          <!-- Selected Files Preview -->
          <div v-if="selectedFiles.length" class="mt-6">
            <h4 class="text-sm font-medium text-gray-900 mb-3">File yang dipilih ({{ selectedFiles.length }})</h4>
            <div class="space-y-3 max-h-60 overflow-y-auto">
              <div
                v-for="(file, index) in selectedFiles"
                :key="index"
                class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <img
                  :src="file.preview"
                  class="w-12 h-12 object-cover rounded"
                  @error="handleImageError"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                  <div v-if="file.uploading" class="mt-1">
                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        class="bg-red-600 h-1.5 rounded-full transition-all duration-300"
                        :style="{ width: file.progress + '%' }"
                      ></div>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">{{ file.progress }}% selesai</p>
                  </div>
                </div>
                <button
                  @click="removeFile(index)"
                  :disabled="file.uploading"
                  class="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Upload Actions -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeUploadModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              @click="uploadFiles"
              :disabled="!selectedFiles.length || uploading"
              class="px-4 py-2 text-sm font-medium text-white bg-red-800 border border-transparent rounded-md hover:bg-red-900 disabled:opacity-50"
            >
              {{ uploading ? 'Mengunggah...' : `Unggah ${selectedFiles.length} Foto` }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Photo Edit Modal -->
    <div v-if="editingPhoto" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Edit Detail Foto</h3>

          <!-- Photo Preview -->
          <div class="mb-4">
            <img
              :src="editingPhoto.url"
              :alt="editingPhoto.title || 'Foto galeri'"
              class="w-full h-48 object-cover rounded-lg"
              @error="handleImageError"
            />
          </div>

          <form @submit.prevent="savePhotoEdit">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Judul Foto</label>
              <input
                v-model="photoForm.title"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Teks Alt (untuk SEO)</label>
              <input
                v-model="photoForm.alt"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                v-model="photoForm.description"
                rows="4"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Deskripsi foto (opsional)"
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closePhotoEditModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 text-sm font-medium text-white bg-red-800 border border-transparent rounded-md hover:bg-red-900 disabled:opacity-50"
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
  layout: 'admin'
})

const albums = ref([])
const loading = ref(false)
const currentView = ref('album-list') // 'album-list' or 'album-detail'
const currentAlbum = ref(null)
const showAddAlbumModal = ref(false)
const editingAlbum = ref(null)
const showUploadModal = ref(false)
const editingPhoto = ref(null)
const saving = ref(false)
const uploading = ref(false)

const albumForm = ref({
  title: '',
  description: '',
  slug: ''
})

const photoForm = ref({
  title: '',
  alt: '',
  description: ''
})

const selectedFiles = ref([])
let draggedIndex = null

// Fetch albums
const fetchAlbums = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/gallery', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    albums.value = response.albums
  } catch (error) {
    console.error('Failed to fetch albums:', error)
    alert('Gagal memuat album')
  } finally {
    loading.value = false
  }
}

// Save album
const saveAlbum = async () => {
  saving.value = true
  try {
    const token = localStorage.getItem('admin_token')
    const method = editingAlbum.value ? 'PUT' : 'POST'
    const url = editingAlbum.value ? `/api/admin/gallery/${editingAlbum.value.id}` : '/api/admin/gallery'

    await $fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: albumForm.value
    })

    closeAlbumModal()
    await fetchAlbums()
    alert(editingAlbum.value ? 'Album berhasil diperbarui' : 'Album berhasil dibuat')
  } catch (error) {
    console.error('Failed to save album:', error)
    alert('Gagal menyimpan album')
  } finally {
    saving.value = false
  }
}

// Edit album
const editAlbum = (album) => {
  editingAlbum.value = album
  albumForm.value = {
    title: album.title,
    description: album.description,
    slug: album.id
  }
}

// Delete album
const deleteAlbum = async (album) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus album "${album.title}"? Semua foto di dalamnya akan ikut terhapus.`)) {
    return
  }

  try {
    const token = localStorage.getItem('admin_token')
    await $fetch(`/api/admin/gallery/${album.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    await fetchAlbums()
    alert('Album berhasil dihapus')
  } catch (error) {
    console.error('Failed to delete album:', error)
    alert('Gagal menghapus album')
  }
}

// View album detail
const viewAlbum = async (album) => {
  currentAlbum.value = album
  currentView.value = 'album-detail'

  // Fetch album photos if not already loaded
  if (!album.photos) {
    try {
      const response = await $fetch(`/api/admin/gallery/${album.id}/photos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      })
      album.photos = response.photos
    } catch (error) {
      console.error('Failed to fetch album photos:', error)
      alert('Gagal memuat foto album')
    }
  }
}

// Go back to album list
const goToAlbumList = () => {
  currentView.value = 'album-list'
  currentAlbum.value = null
}

// File upload handlers
const onFileSelect = (event) => {
  const files = Array.from(event.target.files)
  addFiles(files)
}

const onDropFiles = (event) => {
  const files = Array.from(event.dataTransfer.files)
  addFiles(files)
}

const addFiles = (files) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  const validFiles = imageFiles.filter(file => file.size <= 10 * 1024 * 1024) // 10MB limit

  if (validFiles.length !== imageFiles.length) {
    alert('Beberapa file dilewati karena ukuran melebihi 10MB atau bukan file gambar')
  }

  validFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedFiles.value.push({
        file,
        name: file.name,
        size: file.size,
        preview: e.target.result,
        progress: 0,
        uploading: false
      })
    }
    reader.readAsDataURL(file)
  })
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const uploadFiles = async () => {
  if (!selectedFiles.value.length) return

  uploading.value = true

  for (const fileData of selectedFiles.value) {
    try {
      fileData.uploading = true
      fileData.progress = 0

      const formData = new FormData()
      formData.append('photo', fileData.file)
      formData.append('albumId', currentAlbum.value.id)

      // Simulate progress (in real implementation, use XMLHttpRequest for progress tracking)
      const progressInterval = setInterval(() => {
        if (fileData.progress < 90) {
          fileData.progress += Math.random() * 20
        }
      }, 200)

      await $fetch('/api/admin/gallery/photos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: formData
      })

      clearInterval(progressInterval)
      fileData.progress = 100

      // Remove from selected files after successful upload
      setTimeout(() => {
        const index = selectedFiles.value.indexOf(fileData)
        if (index > -1) {
          selectedFiles.value.splice(index, 1)
        }
      }, 1000)

    } catch (error) {
      console.error('Failed to upload file:', error)
      fileData.uploading = false
      fileData.progress = 0
      alert(`Gagal mengunggah ${fileData.name}`)
    }
  }

  uploading.value = false

  // Refresh album photos
  if (currentAlbum.value) {
    try {
      const response = await $fetch(`/api/admin/gallery/${currentAlbum.value.id}/photos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      })
      currentAlbum.value.photos = response.photos
    } catch (error) {
      console.error('Failed to refresh album photos:', error)
    }
  }

  if (selectedFiles.value.length === 0) {
    closeUploadModal()
  }
}

// Photo editing
const editPhoto = (photo) => {
  editingPhoto.value = photo
  photoForm.value = {
    title: photo.title || '',
    alt: photo.alt || '',
    description: photo.description || ''
  }
}

const savePhotoEdit = async () => {
  saving.value = true
  try {
    await $fetch(`/api/admin/gallery/photos/${editingPhoto.value.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        'Content-Type': 'application/json'
      },
      body: photoForm.value
    })

    closePhotoEditModal()

    // Update photo in current album
    if (currentAlbum.value?.photos) {
      const photoIndex = currentAlbum.value.photos.findIndex(p => p.id === editingPhoto.value.id)
      if (photoIndex > -1) {
        currentAlbum.value.photos[photoIndex] = {
          ...currentAlbum.value.photos[photoIndex],
          ...photoForm.value
        }
      }
    }

    alert('Detail foto berhasil diperbarui')
  } catch (error) {
    console.error('Failed to save photo edit:', error)
    alert('Gagal menyimpan perubahan foto')
  } finally {
    saving.value = false
  }
}

const deletePhoto = async (photo) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus foto "${photo.title || 'tanpa judul'}"?`)) {
    return
  }

  try {
    await $fetch(`/api/admin/gallery/photos/${photo.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }
    })

    // Remove from current album
    if (currentAlbum.value?.photos) {
      currentAlbum.value.photos = currentAlbum.value.photos.filter(p => p.id !== photo.id)
    }

    alert('Foto berhasil dihapus')
  } catch (error) {
    console.error('Failed to delete photo:', error)
    alert('Gagal menghapus foto')
  }
}

// Drag and drop for photo reordering
const onDragStart = (event, index) => {
  draggedIndex = index
  event.dataTransfer.effectAllowed = 'move'
}

const onDrop = async (event, dropIndex) => {
  if (draggedIndex === null || draggedIndex === dropIndex) return

  const photos = [...currentAlbum.value.photos]
  const [draggedPhoto] = photos.splice(draggedIndex, 1)
  photos.splice(dropIndex, 0, draggedPhoto)

  currentAlbum.value.photos = photos

  // Save new order to server
  try {
    const photoIds = photos.map(p => p.id)
    await $fetch(`/api/admin/gallery/${currentAlbum.value.id}/reorder`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        'Content-Type': 'application/json'
      },
      body: { photoIds }
    })
  } catch (error) {
    console.error('Failed to reorder photos:', error)
    alert('Gagal menyimpan urutan foto baru')
    // Revert order
    await viewAlbum(currentAlbum.value)
  }

  draggedIndex = null
}

// Modal handlers
const closeAlbumModal = () => {
  showAddAlbumModal.value = false
  editingAlbum.value = null
  albumForm.value = {
    title: '',
    description: '',
    slug: ''
  }
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFiles.value = []
}

const closePhotoEditModal = () => {
  editingPhoto.value = null
  photoForm.value = {
    title: '',
    alt: '',
    description: ''
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

const handleImageError = (event) => {
  event.target.src = '/placeholder-image.jpg'
}

// Auto-generate slug from title
watch(() => albumForm.value.title, (newTitle) => {
  if (!editingAlbum.value && newTitle) {
    albumForm.value.slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
})

// Check authentication and fetch data on mount
onMounted(async () => {
  const token = localStorage.getItem('admin_token')
  if (!token) {
    navigateTo('/admin/login')
    return
  }

  await fetchAlbums()
})
</script>
