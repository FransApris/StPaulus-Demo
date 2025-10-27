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
              <option v-for="category in userCategories.filter(c => c.is_active)" :key="category.id" :value="category.name">
                {{ category.display_name }}
              </option>
            </select>
            <input v-model="newUser.unit_name" type="text" placeholder="Nama Unit" class="border p-2 rounded" />
            <select v-if="isSuperAdmin" v-model="newUser.role" class="border p-2 rounded">
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
                  <td class="px-4 py-2">{{ user.role_name || user.role }}</td>
                  <td class="px-4 py-2">
                    <button @click="editUser(user)" class="text-blue-600 hover:underline mr-2">Edit</button>
                    <button v-if="isSuperAdmin" @click="openResetPasswordModal(user)" class="text-orange-600 hover:underline mr-2">Reset Password</button>
                    <button @click="deleteUser(user)" class="text-red-600 hover:underline">Hapus</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Reset Password Modal -->
        <div v-if="showResetPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 class="text-lg font-semibold mb-4">Reset Password Pengguna</h3>
            <form @submit.prevent="resetPassword">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pengguna</label>
                <input
                  v-model="selectedUser.username"
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                  readonly
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <input
                  v-model="resetPasswordData.newPassword"
                  type="password"
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Masukkan password baru"
                  required
                  minlength="6"
                />
              </div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                <input
                  v-model="resetPasswordData.confirmPassword"
                  type="password"
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Konfirmasi password baru"
                  required
                  minlength="6"
                />
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeResetPasswordModal"
                  class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="resetPasswordLoading || resetPasswordData.newPassword !== resetPasswordData.confirmPassword || resetPasswordData.newPassword.length < 6"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ resetPasswordLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
              </div>
            </form>
            <p v-if="resetPasswordError" class="mt-2 text-red-600 text-sm">{{ resetPasswordError }}</p>
            <p v-if="resetPasswordMessage" class="mt-2 text-green-600 text-sm">{{ resetPasswordMessage }}</p>
          </div>
        </div>

        <!-- Edit User Modal -->
        <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 class="text-lg font-semibold mb-4">Edit Pengguna</h3>
            <form @submit.prevent="updateUser" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input v-model="editingUser.username" type="text" placeholder="Username" class="border p-2 rounded" required />
              <input v-model="editingUser.email" type="email" placeholder="Email" class="border p-2 rounded" required />
              <input v-model="editingUser.full_name" type="text" placeholder="Nama Lengkap" class="border p-2 rounded" required />
              <input v-model="editingUser.contact_phone" type="text" placeholder="No. Telepon" class="border p-2 rounded" />
              <select v-model="editingUser.user_category" class="border p-2 rounded" required>
                <option value="">Pilih Kategori</option>
                <option v-for="category in userCategories.filter(c => c.is_active)" :key="category.id" :value="category.name">
                  {{ category.display_name }}
                </option>
              </select>
              <input v-model="editingUser.unit_name" type="text" placeholder="Nama Unit" class="border p-2 rounded" />
              <select v-if="isSuperAdmin" v-model="editingUser.role" class="border p-2 rounded md:col-span-2">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
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

const users = ref([])
const userCategories = ref([])
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

// Reset password modal
const showResetPasswordModal = ref(false)
const selectedUser = ref({})
const resetPasswordData = ref({
  newPassword: '',
  confirmPassword: ''
})
const resetPasswordLoading = ref(false)
const resetPasswordMessage = ref('')
const resetPasswordError = ref('')

// Edit modal
const showEditModal = ref(false)
const editingUser = ref({
  id: '',
  username: '',
  email: '',
  full_name: '',
  contact_phone: '',
  user_category: '',
  unit_name: '',
  role: 'user'
})
const editLoading = ref(false)
const editMessage = ref('')
const editError = ref('')

// Current user info
const currentUser = ref(null)

// Check if current user is super admin
const isSuperAdmin = computed(() => {
  return currentUser.value?.role_name === 'super_admin'
})

// Load current user info
const loadCurrentUser = async () => {
  try {
    currentUser.value = await $fetch('/api/me', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
  } catch (err) {
    console.error('Failed to load current user', err)
  }
}

// Load user categories
const loadUserCategories = async () => {
  try {
    userCategories.value = await $fetch('/api/admin/user-categories', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
  } catch (err) {
    // If 403 Forbidden, set empty categories for restricted users
    if (err.statusCode === 403) {
      userCategories.value = []
      return
    }
    console.error('Failed to load user categories', err)
  }
}

// Load users
const loadUsers = async () => {
  try {
    users.value = await $fetch('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
  } catch (err) {
    console.error('Failed to load users', err)
  }
}

onMounted(async () => {
  await loadCurrentUser()
  await loadUserCategories()
  await loadUsers()
})

const createUser = async () => {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    // Ensure non-super-admin users can only create 'user' role accounts
    const userData = { ...newUser.value }
    if (!isSuperAdmin.value) {
      userData.role = 'user'
    }

    await $fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      },
      body: userData
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
  // Populate edit form with user data
  editingUser.value = { ...user }
  showEditModal.value = true
}

const deleteUser = async (user) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.username}"? Tindakan ini tidak dapat dibatalkan.`)) {
    return
  }

  try {
    await $fetch(`/api/admin/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
    alert('Pengguna berhasil dihapus')
    await loadUsers()
  } catch (err) {
    alert(`Gagal menghapus pengguna: ${err.data?.statusMessage || 'Terjadi kesalahan'}`)
  }
}

// Reset password functions
const openResetPasswordModal = (user) => {
  selectedUser.value = user
  resetPasswordData.value = {
    newPassword: '',
    confirmPassword: ''
  }
  resetPasswordMessage.value = ''
  resetPasswordError.value = ''
  showResetPasswordModal.value = true
}

const closeResetPasswordModal = () => {
  showResetPasswordModal.value = false
  selectedUser.value = {}
  resetPasswordData.value = {
    newPassword: '',
    confirmPassword: ''
  }
}

const resetPassword = async () => {
  if (resetPasswordData.value.newPassword !== resetPasswordData.value.confirmPassword) {
    resetPasswordError.value = 'Password dan konfirmasi password tidak cocok'
    return
  }

  resetPasswordLoading.value = true
  resetPasswordMessage.value = ''
  resetPasswordError.value = ''

  try {
    const response = await $fetch(`/api/admin/users/${selectedUser.value.id}/reset-password`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      },
      body: {
        newPassword: resetPasswordData.value.newPassword
      }
    })

    resetPasswordMessage.value = response.message
    setTimeout(() => {
      closeResetPasswordModal()
    }, 2000)
  } catch (err) {
    resetPasswordError.value = err.data?.statusMessage || 'Gagal me-reset password'
  } finally {
    resetPasswordLoading.value = false
  }
}

const updateUser = async () => {
  editLoading.value = true
  editMessage.value = ''
  editError.value = ''
  try {
    // Ensure non-super-admin users can only edit limited fields
    const userData = { ...editingUser.value }
    if (!isSuperAdmin.value) {
      // Non-super-admin can only edit basic info, not role
      delete userData.role
    }

    await $fetch(`/api/admin/users/${editingUser.value.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      },
      body: userData
    })
    editMessage.value = 'Pengguna berhasil diperbarui'
    showEditModal.value = false
    await loadUsers()
    setTimeout(() => {
      editMessage.value = ''
    }, 3000)
  } catch (err) {
    editError.value = err.data?.statusMessage || 'Gagal memperbarui pengguna'
  } finally {
    editLoading.value = false
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editingUser.value = {
    id: '',
    username: '',
    email: '',
    full_name: '',
    contact_phone: '',
    user_category: '',
    unit_name: '',
    role: 'user'
  }
  editMessage.value = ''
  editError.value = ''
}
</script>
