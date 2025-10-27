<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h2 class="text-3xl font-cinzel text-[#882f1d] mb-2">CMS Admin</h2>
        <p class="text-gray-600">Masuk ke panel administrasi</p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div class="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                required
                v-model="form.username"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d] sm:text-sm"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                v-model="form.password"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d] sm:text-sm"
                placeholder="Masukkan password"
              />
            </div>
          </div>

          <div v-if="error" class="text-red-600 text-sm text-center">
            {{ error }}
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#882f1d] hover:bg-[#a55e1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#882f1d] disabled:opacity-50"
            >
              <span v-if="loading">Sedang masuk...</span>
              <span v-else>Masuk</span>
            </button>
          </div>
        </form>

        <div class="mt-6 text-center text-sm text-gray-600">
          <p>Pengelolan Konten Website St. Paulus - Juanda</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value
    })

    // Store token in sessionStorage (cleared when tab is closed)
    sessionStorage.setItem('admin_token', response.token)

    // Redirect to dashboard
    await navigateTo('/admin/dashboard')
  } catch (err) {
    error.value = err.data?.message || 'Login gagal'
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in
onMounted(() => {
  const token = sessionStorage.getItem('admin_token')
  if (token) {
    navigateTo('/admin/dashboard')
  }
})
</script>
