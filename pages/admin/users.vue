<template>
  <div class="space-y-6">
        <!-- Add User Form -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Tambah Pengguna Baru</h2>
          <form @submit.prevent="createUser" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="newUser.username" type="text" placeholder="Username" class="border p-2 rounded" required />
            <input v-model="newUser.email" type="email" placeholder="Email" class="border p-2 rounded" required />
            <input v-model="newUser.password" type="password" placeholder="Password" class="border p-2 rounded" required />
            <input v-model="newUser.full_name" type="text" placeholder="Nama Lengkap" class="border p-2 rounded" required />
            <input v-model="newUser.contact_phone" type="text" placeholder="No. Telepon" class="border p-2 rounded" />
            <select v-model="newUser.user_category" class="border p-2 rounded" required>
              <option value="">Pilih Kategori</option>
              <option value="PARISH_COUNCIL">Seksi Paroki</option>
              <option value="CATEGORICAL_GROUP">Kelompok Kategorial</option>
              <option value="REGION">Wilayah</option>
              <option value="COMMUNITY">Lingkungan</option>
            </select>
            <input v-model="newUser.unit_name" type="text" placeholder="Nama Unit" class="border p-2 rounded" />
            <select v-model="newUser.role" class="border p-2 rounded">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" :disabled="loading" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {{ loading ? 'Membuat...' : 'Buat Pengguna' }}
            </button>
          </form>
          <p v-if="message" class="mt-2 text-green-600">{{ message }}</p>
          <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
        </div>

        <!-- Users List -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Daftar Pengguna</h2>
          <div v-if="users.length === 0" class="text-gray-500">Belum ada pengguna.</div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full table-auto">
              <thead>
                <tr class="bg-gray-50">
                  <th class="px-4 py-2 text-left">Username</th>
                  <th class="px-4 py-2 text-left">Nama</th>
                  <th class="px-4 py-2 text-left">Email</th>
                  <th class="px-4 py-2 text-left">Kategori</th>
                  <th class="px-4 py-2 text-left">Role</th>
                  <th class="px-4 py-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id" class="border-t">
                  <td class="px-4 py-2">{{ user.username }}</td>
                  <td class="px-4 py-2">{{ user.full_name }}</td>
                  <td class="px-4 py-2">{{ user.email }}</td>
                  <td class="px-4 py-2">{{ user.user_category }}</td>
                  <td class="px-4 py-2">{{ user.role }}</td>
                  <td class="px-4 py-2">
                    <button @click="editUser(user)" class="text-blue-600 hover:underline mr-2">Edit</button>
                    <button @click="deleteUser(user)" class="text-red-600 hover:underline">Hapus</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  </div>
</template>

<script setup>
const users = ref([])
const newUser = ref({
  username: '',
  email: '',
  password: '',
  full_name: '',
  contact_phone: '',
  user_category: '',
  unit_name: '',
  role: 'user'
})

const loading = ref(false)
const message = ref('')
const error = ref('')

// Load users
const loadUsers = async () => {
  try {
    users.value = await $fetch('/api/admin/users')
  } catch (err) {
    console.error('Failed to load users', err)
  }
}

onMounted(() => {
  loadUsers()
})

const createUser = async () => {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    await $fetch('/api/admin/users', {
      method: 'POST',
      body: newUser.value
    })
    message.value = 'Pengguna berhasil dibuat'
    newUser.value = {
      username: '',
      email: '',
      password: '',
      full_name: '',
      contact_phone: '',
      user_category: '',
      unit_name: '',
      role: 'user'
    }
    await loadUsers()
  } catch (err) {
    error.value = err.data?.statusMessage || 'Gagal membuat pengguna'
  } finally {
    loading.value = false
  }
}

const editUser = (user) => {
  // TODO: Implement edit functionality
  alert('Edit functionality not implemented yet')
}

const deleteUser = (user) => {
  // TODO: Implement delete functionality
  alert('Delete functionality not implemented yet')
}
</script>
