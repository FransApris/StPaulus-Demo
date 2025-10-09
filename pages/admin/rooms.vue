<template>
  <div class="space-y-6">
        <!-- Add Room Form -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Tambah Ruangan Baru</h2>
          <form @submit.prevent="createRoom" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="newRoom.name" type="text" placeholder="Nama Ruangan" class="border p-2 rounded" required />
            <input v-model="newRoom.capacity" type="number" placeholder="Kapasitas" class="border p-2 rounded" required />
            <input v-model="newRoom.location" type="text" placeholder="Lokasi" class="border p-2 rounded" required />
            <input v-model="newRoom.facilities" type="text" placeholder="Fasilitas (comma separated)" class="border p-2 rounded" />
            <input v-model="newRoom.photo_url" type="text" placeholder="URL Foto" class="border p-2 rounded" />
            <div class="flex items-center">
              <input v-model="newRoom.requires_approval" type="checkbox" class="mr-2" />
              <label>Butuh Persetujuan</label>
            </div>
            <input v-model="newRoom.allowed_categories" type="text" placeholder="Kategori yang diizinkan (JSON array)" class="border p-2 rounded" />
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
  </div>
</template>

<script setup>
const rooms = ref([])
const newRoom = ref({
  name: '',
  capacity: '',
  location: '',
  facilities: '',
  photo_url: '',
  requires_approval: true,
  allowed_categories: ''
})

const loading = ref(false)
const message = ref('')
const error = ref('')

// Load rooms
const loadRooms = async () => {
  try {
    rooms.value = await $fetch('/api/admin/rooms')
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
    const allowedCategories = newRoom.value.allowed_categories ? newRoom.value.allowed_categories : null

    await $fetch('/api/admin/rooms', {
      method: 'POST',
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
      photo_url: '',
      requires_approval: true,
      allowed_categories: ''
    }
    await loadRooms()
  } catch (err) {
    error.value = err.data?.statusMessage || 'Gagal membuat ruangan'
  } finally {
    loading.value = false
  }
}

const editRoom = (room) => {
  // TODO: Implement edit functionality
  alert('Edit functionality not implemented yet')
}

const deleteRoom = (room) => {
  // TODO: Implement delete functionality
  alert('Delete functionality not implemented yet')
}
</script>
