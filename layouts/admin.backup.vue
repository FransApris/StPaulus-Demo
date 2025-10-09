<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-lg">
      <div class="flex flex-col h-full">
        <!-- Logo/Header -->
        <div class="flex items-center justify-center h-16 px-4 bg-[#882f1d]">
          <img
            src="/images/logo-paulus-juanda.png"
            alt="Logo Paroki St. Paulus"
            class="h-10 w-auto mr-3"
          />
          <h1 class="text-xl font-cinzel text-white">CMS Admin</h1>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <NuxtLink
            to="/admin/dashboard"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="$route.path === '/admin/dashboard' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
            </svg>
            Dashboard
          </NuxtLink>

          <NuxtLink
            to="/admin/articles"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="$route.path === '/admin/articles' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Kelola Artikel
          </NuxtLink>

          <NuxtLink
            to="/admin/article-categories"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="$route.path === '/admin/article-categories' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            Kategori Artikel / Berita
          </NuxtLink>

          <NuxtLink
            to="/admin/news"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="$route.path === '/admin/news' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            Kelola Berita
          </NuxtLink>

          <NuxtLink
            to="/admin/gallery"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="$route.path === '/admin/gallery' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Kelola Galeri
          </NuxtLink>

          <NuxtLink
            to="/admin/agenda"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="$route.path === '/admin/agenda' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Kelola Agenda
          </NuxtLink>

          <NuxtLink
            to="/admin/categories"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="$route.path === '/admin/categories' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            Kelola Kategori Agenda
          </NuxtLink>

          <NuxtLink
            to="/admin/contact-messages"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="$route.path === '/admin/contact-messages' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Pesan Masuk
          </NuxtLink>
        </nav>

        <!-- Logout -->
        <div class="p-4 border-t">
          <button
            @click="handleLogout"
            class="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-cinzel text-gray-900">{{ pageTitle }}</h2>
              <p class="text-sm text-gray-600">Selamat datang di panel admin CMS</p>
            </div>
            <div class="text-sm text-gray-500">
              {{ currentDate }}
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const pageTitle = computed(() => {
  const route = useRoute()
  if (route.path === '/admin/dashboard') return 'Dashboard'
  if (route.path === '/admin/articles') return 'Kelola Artikel'
  if (route.path === '/admin/article-categories') return 'Kategori Artikel / Berita'
  if (route.path === '/admin/news') return 'Kelola Berita'
  if (route.path === '/admin/gallery') return 'Kelola Galeri'
  if (route.path === '/admin/agenda') return 'Kelola Agenda'
  if (route.path === '/admin/categories') return 'Kelola Kategori Agenda'
  if (route.path === '/admin/contact-messages') return 'Pesan Masuk'
  return 'Admin Panel'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const handleLogout = () => {
  localStorage.removeItem('admin_token')
  navigateTo('/admin/login')
}
</script>
