<template>
  <div class="space-y-6">
        <!-- Add Room Form -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Tambah Ruangan Baru</h2>
          <form @submit.prevent="createRoom" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="newRoom.name" type="text" placeholder="Nama Ruangan" class="border p-2 rounded" required />
            <input v-model="newRoom.capacity" type="number" placeholder="Kapasitas" class="border p-2 rounded" required />
            <div class="flex flex-col">
              <label class="mb-1">Lokasi</label>
              <select v-model="newRoom.location" class="border p-2 rounded" required>
                <option value="">Pilih Lokasi</option>
                <option value="Gereja">Gereja</option>
                <option value="Balai Paroki Lt.1">Balai Paroki Lt.1</option>
                <option value="Balai Paroki Lt.2">Balai Paroki Lt.2</option>
                <option value="Balai Paroki Lt.3">Balai Paroki Lt.3</option>
                <option value="Selasar">Selasar</option>
                <option value="Halaman Belakang Gereja">Halaman Belakang Gereja</option>
                <option value="Halaman Depan Gereja">Halaman Depan Gereja</option>
              </select>
            </div>
            <input v-model="newRoom.facilities" type="text" placeholder="Fasilitas (comma separated)" class="border p-2 rounded" />
            <div class="flex flex-col">
              <label class="mb-1">Memerlukan Persetujuan</label>
              <select v-model="newRoom.requires_approval" class="border p-2 rounded">
                <option :value="true">Ya</option>
                <option :value="false">Tidak</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block mb-2">Kategori yang Diijinkan</label>
              <div class="grid grid-cols-2 gap-2">
                <label v-for="category in userCategories" :key="category.value" class="flex items-center">
                  <input v-model="newRoom.allowed_categories" :value="category.value" type="checkbox" class="mr-2" />
                  {{ category.label }}
                </label>
              </div>
            </div>
            <button type="submit" :disabled="loading" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {{ loading ? 'Membuat...' : 'Buat Ruangan' }}
            </button>
          </form>
          <p v-if="message" class="mt-2 text-green-600">{{ message }}</p>
          <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
        </div>

        <!-- Rooms List -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Daftar Ruangan</h2>
          <div v-if="rooms.length === 0" class="text-gray-500">Belum ada ruangan.</div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full table-auto">
              <thead>
                <tr class="bg-gray-50">
                  <th class="px-4 py-2 text-left">Nama</th>
                  <th class="px-4 py-2 text-left">Kapasitas</th>
                  <th class="px-4 py-2 text-left">Lokasi</th>
                  <th class="px-4 py-2 text-left">Fasilitas</th>
                  <th class="px-4 py-2 text-left">Persetujuan</th>
                  <th class="px-4 py-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="room in rooms" :key="room.id" class="border-t">
                  <td class="px-4 py-2">{{ room.name }}</td>
                  <td class="px-4 py-2">{{ room.capacity }}</td>
                  <td class="px-4 py-2">{{ room.location }}</td>
                  <td class="px-4 py-2">{{ room.facilities ? JSON.parse(room.facilities).join(', ') : '-' }}</td>
                  <td class="px-4 py-2">{{ room.requires_approval ? 'Ya' : 'Tidak' }}</td>
                  <td class="px-4 py-2">
                    <button @click="editRoom(room)" class="text-blue-600 hover:underline mr-2">Edit</button>
                    <button @click="deleteRoom(room)" class="text-red-600 hover:underline">Hapus</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Edit Room Modal -->
        <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 class="text-lg font-semibold mb-4">Edit Ruangan</h3>
            <form @submit.prevent="updateRoom" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input v-model="editingRoom.name" type="text" placeholder="Nama Ruangan" class="border p-2 rounded" required />
              <input v-model="editingRoom.capacity" type="number" placeholder="Kapasitas" class="border p-2 rounded" required />
              <div class="flex flex-col">
                <label class="mb-1">Lokasi</label>
                <select v-model="editingRoom.location" class="border p-2 rounded" required>
                  <option value="">Pilih Lokasi</option>
                  <option value="Gereja">Gereja</option>
                  <option value="Balai Paroki Lt.1">Balai Paroki Lt.1</option>
                  <option value="Balai Paroki Lt.2">Balai Paroki Lt.2</option>
                  <option value="Balai Paroki Lt.3">Balai Paroki Lt.3</option>
                  <option value="Selasar">Selasar</option>
                  <option value="Halaman Belakang Gereja">Halaman Belakang Gereja</option>
                  <option value="Halaman Depan Gereja">Halaman Depan Gereja</option>
                </select>
              </div>
              <input v-model="editingRoom.facilities" type="text" placeholder="Fasilitas (comma separated)" class="border p-2 rounded" />
              <div class="flex flex-col">
                <label class="mb-1">Memerlukan Persetujuan</label>
                <select v-model="editingRoom.requires_approval" class="border p-2 rounded">
                  <option :value="true">Ya</option>
                  <option :value="false">Tidak</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block mb-2">Kategori yang Diijinkan</label>
                <div class="grid grid-cols-2 gap-2">
                  <label v-for="category in userCategories" :key="category.value" class="flex items-center">
                    <input v-model="editingRoom.allowed_categories" :value="category.value" type="checkbox" class="mr-2" />
                    {{ category.label }}
                  </label>
                </div>
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

const rooms = ref([])
const newRoom = ref({
  name: '',
  capacity: '',
  location: '',
  facilities: '',
  requires_approval: true,
  allowed_categories: []
})

const loading = ref(false)
const message = ref('')
const error = ref('')

// Edit modal
const showEditModal = ref(false)
const editingRoom = ref({
  id: '',
  name: '',
  capacity: '',
  location: '',
  facilities: '',
  requires_approval: true,
  allowed_categories: []
})
const editLoading = ref(false)
const editMessage = ref('')
const editError = ref('')

const userCategories = [
  { value: 'PARISH_COUNCIL', label: 'Dewan Paroki' },
  { value: 'CATEGORICAL_GROUP', label: 'Kelompok Kategorial' },
  { value: 'REGION', label: 'Wilayah' },
  { value: 'COMMUNITY', label: 'Komunitas' },
  { value: 'LINGKUNGAN', label: 'Lingkungan' },
  { value: 'SEKSI', label: 'Seksi' }
]

// Load rooms
const loadRooms = async () => {
  try {
    rooms.value = await $fetch('/api/admin/rooms', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
  } catch (err) {
    console.error('Failed to load rooms', err)
  }
}

onMounted(() => {
  loadRooms()
})

const createRoom = async () => {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    const facilities = newRoom.value.facilities ? JSON.stringify(newRoom.value.facilities.split(',').map(f => f.trim())) : null
    const allowedCategories = newRoom.value.allowed_categories.length > 0 ? JSON.stringify(newRoom.value.allowed_categories) : null

    await $fetch('/api/admin/rooms', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      },
      body: {
        ...newRoom.value,
        facilities,
        allowed_categories: allowedCategories
      }
    })
    message.value = 'Ruangan berhasil dibuat'
    newRoom.value = {
      name: '',
      capacity: '',
      location: '',
      facilities: '',
      requires_approval: true,
      allowed_categories: []
    }
    await loadRooms()
  } catch (err) {
    error.value = err.data?.statusMessage || 'Gagal membuat ruangan'
  } finally {
    loading.value = false
  }
}

const editRoom = (room) => {
  // Populate edit form with room data
  editingRoom.value = { ...room }
  editingRoom.value.facilities = room.facilities ? JSON.parse(room.facilities).join(', ') : ''
  editingRoom.value.allowed_categories = room.allowed_categories ? JSON.parse(room.allowed_categories) : []
  showEditModal.value = true
}

const deleteRoom = (room) => {
  // TODO: Implement delete functionality
  alert('Delete functionality not implemented yet')
}

const updateRoom = async () => {
  editLoading.value = true
  editMessage.value = ''
  editError.value = ''
  try {
    const facilities = editingRoom.value.facilities ? JSON.stringify(editingRoom.value.facilities.split(',').map(f => f.trim())) : null
    const allowedCategories = editingRoom.value.allowed_categories.length > 0 ? JSON.stringify(editingRoom.value.allowed_categories) : null

    await $fetch(`/api/admin/rooms/${editingRoom.value.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      },
      body: {
        ...editingRoom.value,
        facilities,
        allowed_categories: allowedCategories
      }
    })
    editMessage.value = 'Ruangan berhasil diperbarui'
    showEditModal.value = false
    await loadRooms()
    setTimeout(() => {
      editMessage.value = ''
    }, 3000)
  } catch (err) {
    editError.value = err.data?.statusMessage || 'Gagal memperbarui ruangan'
  } finally {
    editLoading.value = false
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editingRoom.value = {
    id: '',
    name: '',
    capacity: '',
    location: '',
    facilities: '',
    requires_approval: true,
    allowed_categories: []
  }
  editMessage.value = ''
  editError.value = ''
}
</script>
