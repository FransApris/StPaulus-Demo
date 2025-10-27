<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <ClientOnly>
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
          <!-- Dashboard -->
          <NuxtLink
            v-if="menuVisibility.dashboard"
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

          <!-- Manajemen Konten -->
          <div v-if="groupVisibility.content">
            <div @click="openGroups.content = !openGroups.content" class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer" :class="isGroupActive('content') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Manajemen Konten
              <svg class="w-4 h-4 ml-auto transition-transform duration-200" :class="openGroups.content ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
            <div v-show="openGroups.content" class="ml-6 space-y-1">
              <!-- kelola artikel -->
              <NuxtLink
                v-if="menuVisibility.articles"
                to="/admin/articles"
                @click.stop
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/articles' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Kelola Artikel
              </NuxtLink>
              <!-- kategori artikel/ berita -->
              <NuxtLink
                v-if="menuVisibility.articleCategories"
                to="/admin/article-categories"
                @click.stop
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/article-categories' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Kategori Artikel / Berita
              </NuxtLink>
              <!-- kelola berita -->
              <NuxtLink
                v-if="menuVisibility.news"
                to="/admin/news"
                @click.stop
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/news' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                </svg>
                Kelola Berita
              </NuxtLink>
              <!-- kelola galeri -->
              <NuxtLink
                v-if="menuVisibility.gallery"
                to="/admin/gallery"
                @click.stop
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/gallery' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Kelola Galeri
              </NuxtLink>
              <!-- kategori galeri -->
              <NuxtLink
                v-if="hasPermission('manage_gallery_categories')"
                to="/admin/gallery-categories"
                @click.stop
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/gallery-categories' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Kategori Galeri
              </NuxtLink>
              <!-- kelola chatbot -->
              <NuxtLink
                v-if="menuVisibility.chatbotFaqs"
                to="/admin/chatbot-faqs"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/chatbot-faqs' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                Kelola Chatbot FAQ
              </NuxtLink>
              <!-- kategori chatbot -->
              <NuxtLink
                v-if="menuVisibility.chatbotFaqCategories"
                to="/admin/chatbot-faq-categories"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/chatbot-faq-categories' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Kategori Chatbot FAQ
              </NuxtLink>
            </div>
          </div>

          <!-- Jadwal & Agenda -->
          <div v-if="groupVisibility.schedule">
            <div @click="openGroups.schedule = !openGroups.schedule" class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer" :class="isGroupActive('schedule') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Jadwal & Agenda
              <svg class="w-4 h-4 ml-auto transition-transform duration-200" :class="openGroups.schedule ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
            <div v-show="openGroups.schedule" class="ml-6 space-y-1">
              <NuxtLink
                v-if="menuVisibility.agenda"
                to="/admin/agenda"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/agenda' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Kelola Agenda
              </NuxtLink>
              <NuxtLink
                v-if="menuVisibility.agendaCategories"
                to="/admin/categories"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/categories' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                Kelola Kategori Agenda
              </NuxtLink>
              <NuxtLink
                v-if="hasPermission('manage_liturgy_types')"
                to="/admin/liturgy-types"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/liturgy-types' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Kelola Jenis Liturgi
              </NuxtLink>
              <NuxtLink
                v-if="menuVisibility.massSchedules"
                to="/admin/mass-schedules"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/mass-schedules' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Kelola Jadwal Misa
              </NuxtLink>
            </div>
          </div>

          <!-- Administrasi Paroki -->
          <div v-if="groupVisibility.admin">
            <div @click="openGroups.admin = !openGroups.admin" class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer" :class="isGroupActive('admin') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Administrasi Paroki
              <svg class="w-4 h-4 ml-auto transition-transform duration-200" :class="openGroups.admin ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
            <div v-show="openGroups.admin" class="ml-6 space-y-1">
              <NuxtLink
                v-if="menuVisibility.users"
                to="/admin/users"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/users' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                Kelola Pengguna
              </NuxtLink>
              <NuxtLink
                v-if="menuVisibility.rooms"
                to="/admin/rooms"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/rooms' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Kelola Ruangan
              </NuxtLink>
              <NuxtLink
                v-if="menuVisibility.userCategories"
                to="/admin/user-categories"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/user-categories' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Kelola Kategori
              </NuxtLink>
              <NuxtLink
                v-if="menuVisibility.bookings"
                to="/admin/bookings"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/bookings' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
                Kelola Pemesanan
              </NuxtLink>
              <NuxtLink
                v-if="menuVisibility.contactMessages"
                to="/admin/contact-messages"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/contact-messages' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Pesan Masuk
              </NuxtLink>
            </div>
          </div>

          <!-- Manajemen Dokumen -->
          <div v-if="groupVisibility.documents">
            <div @click="openGroups.documents = !openGroups.documents" class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer" :class="isGroupActive('documents') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Manajemen Dokumen
              <svg class="w-4 h-4 ml-auto transition-transform duration-200" :class="openGroups.documents ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
            <div v-show="openGroups.documents" class="ml-6 space-y-1">
              <NuxtLink
                v-if="menuVisibility.documentCategories"
                to="/admin/document-categories"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/document-categories' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Kelola Kategori Dokumen
              </NuxtLink>
              <NuxtLink
                v-if="menuVisibility.documents"
                to="/admin/documents"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/documents' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Kelola Dokumen
              </NuxtLink>
            </div>
          </div>

          <!-- Tema -->
          <div v-if="groupVisibility.theme">
            <div @click="openGroups.theme = !openGroups.theme" class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer" :class="isGroupActive('theme') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Tema
              <svg class="w-4 h-4 ml-auto transition-transform duration-200" :class="openGroups.theme ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
            <div v-show="openGroups.theme" class="ml-6 space-y-1">
              <NuxtLink
                v-if="menuVisibility.heroThemes"
                to="/admin/hero-themes"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                :class="$route.path === '/admin/hero-themes' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Pengelola Tema Hero
              </NuxtLink>
            </div>
          </div>

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
    </ClientOnly>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-cinzel text-gray-900">{{ pageTitle }}</h2>
              <p class="text-sm text-gray-600">Selamat datang di panel admin CMS</p>
              <p v-if="user" class="text-sm text-gray-500">Anda login sebagai: {{ user.role_display_name }}</p>
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
// User state
const user = ref(null)

// Group toggle states
const openGroups = reactive({
  content: false,
  schedule: false,
  admin: false,
  theme: false,
  documents: false
})

// Fetch user data on mount
onMounted(async () => {
  try {
    const userData = await $fetch('/api/me', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
    user.value = userData
  } catch (error) {
    // If failed to fetch user, redirect to login
    navigateTo('/admin/login')
  }
})

// Helper function to check permissions
const hasPermission = (permission) => {
  return user.value?.permissions?.includes(permission) || false
}

// Computed for menu visibility
const menuVisibility = computed(() => {
  // Super Admin has access to all features
  if (user.value?.role_name === 'super_admin') {
    return {
      dashboard: true,
      articles: true,
      articleCategories: true,
      news: true,
      gallery: true,
      agenda: true,
      regularMassSchedules: true,
      agendaCategories: true,
      contactMessages: true,
      users: true,
      userCategories: true,
      rooms: true,
      bookings: true,
      chatbotFaqCategories: true,
      chatbotFaqs: true,
      heroThemes: true,
      massSchedules: true,
      documentCategories: true,
      documents: true
    }
  }

  // Admin Komsos: Dashboard, Kelola Artikel, News, Gallery, Chatbot
  else if (user.value?.role_name === 'admin_komsos') {
    return {
      dashboard: true,
      articles: true,
      articleCategories: false,
      news: true,
      gallery: true,
      agenda: false,
      regularMassSchedules: false,
      agendaCategories: false,
      contactMessages: false,
      users: false,
      rooms: false,
      bookings: false,
      chatbotFaqCategories: true,
      chatbotFaqs: true,
      heroThemes: true,
      documentCategories: false,
      documents: false
    }
  }

  // Admin Sekretariat: Dashboard, Agenda, Users, Rooms, Bookings, Mass Schedules, Documents
  else if (user.value?.role_name === 'admin_sekretariat') {
    return {
      dashboard: true,
      articles: false,
      articleCategories: false,
      news: false,
      gallery: false,
      agenda: true,
      regularMassSchedules: false,
      massSchedules: true,
      agendaCategories: false,
      contactMessages: true,
      users: true,
      rooms: true,
      bookings: true,
      chatbotFaqCategories: false,
      chatbotFaqs: false,
      documentCategories: true,
      documents: true
    }
  }

  // Default for other roles or no user: only Dashboard
  else {
    return {
      dashboard: true,
      articles: false,
      articleCategories: false,
      news: false,
      gallery: false,
      agenda: false,
      regularMassSchedules: false,
      agendaCategories: false,
      contactMessages: false,
      users: false,
      rooms: false,
      bookings: false,
      chatbotFaqCategories: false,
      chatbotFaqs: false,
      heroThemes: false,
      documentCategories: false,
      documents: false
    }
  }
})

// Computed for group visibility
const groupVisibility = computed(() => {
  return {
    content: menuVisibility.value.articles || menuVisibility.value.news || menuVisibility.value.articleCategories || menuVisibility.value.gallery || menuVisibility.value.chatbotFaqCategories || menuVisibility.value.chatbotFaqs,
    schedule: menuVisibility.value.agenda || menuVisibility.value.agendaCategories || menuVisibility.value.regularMassSchedules,
    admin: menuVisibility.value.users || menuVisibility.value.userCategories || menuVisibility.value.rooms || menuVisibility.value.bookings,
    theme: menuVisibility.value.heroThemes,
    documents: menuVisibility.value.documentCategories || menuVisibility.value.documents
  }
})

// Function to check if group is active
const isGroupActive = (group) => {
  const routes = {
    content: ['/admin/articles', '/admin/article-categories', '/admin/news', '/admin/gallery', '/admin/chatbot-faq-categories', '/admin/chatbot-faqs'],
    schedule: ['/admin/agenda', '/admin/categories', '/admin/regular-mass-schedules', '/admin/mass-schedules'],
    admin: ['/admin/users', '/admin/user-categories', '/admin/rooms', '/admin/bookings'],
    theme: ['/admin/hero-themes'],
    documents: ['/admin/document-categories', '/admin/documents']
  }
  return routes[group].includes(useRoute().path)
}

const pageTitle = computed(() => {
  const route = useRoute()
  if (route.path === '/admin/dashboard') return 'Dashboard'
  if (route.path === '/admin/articles') return 'Kelola Artikel'
  if (route.path === '/admin/article-categories') return 'Kategori Artikel / Berita'
  if (route.path === '/admin/news') return 'Kelola Berita'
  if (route.path === '/admin/gallery') return 'Kelola Galeri'
  if (route.path === '/admin/gallery-categories') return 'Kategori Galeri'
  if (route.path === '/admin/agenda') return 'Kelola Agenda'
  if (route.path === '/admin/liturgy-types') return 'Kelola Jenis Liturgi'
  if (route.path === '/admin/mass-schedules') return 'Kelola Jadwal Misa'
  if (route.path === '/admin/categories') return 'Kelola Kategori Agenda'
  if (route.path === '/admin/contact-messages') return 'Pesan Masuk'
  if (route.path === '/admin/users') return 'Kelola Pengguna'
  if (route.path === '/admin/user-categories') return 'Kelola Kategori Pengguna'
  if (route.path === '/admin/rooms') return 'Kelola Ruangan'
  if (route.path === '/admin/bookings') return 'Kelola Pemesanan'
  if (route.path === '/admin/chatbot-faq-categories') return 'Kategori Chatbot FAQ'
  if (route.path === '/admin/chatbot-faqs') return 'Kelola Chatbot FAQ'
  if (route.path === '/admin/hero-themes') return 'Pengelola Tema Hero'
  if (route.path === '/admin/document-categories') return 'Kelola Kategori Dokumen'
  if (route.path === '/admin/documents') return 'Kelola Dokumen'
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
  // Clear session storage
  sessionStorage.removeItem('admin_token')
  // Clear local storage as backup
  localStorage.removeItem('admin_token')
  // Clear user state
  user.value = null
  // Navigate to login page
  navigateTo('/admin/login')
}
</script>
