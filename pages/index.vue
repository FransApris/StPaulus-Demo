<template>
  <div class="min-h-screen pt-16">
    <!-- HeroSection (Dynamic based on active theme) -->
    <HeroSection
      :show-hero="true"
      title="Selamat Datang di Website Gereja Paulus Juanda"
      subtitle="Temukan berita, artikel, galeri kegiatan, dan agenda terbaru kami."
      cta-text="Lihat Jadwal Misa"
      cta-to="/misa"
      :hero-image="activeTheme?.image_path || '/images/gereja-stpaulus-hero.jpg'"
    />

    <!-- Section 1: Welcome / About Teaser (Unchanged) -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-cinzel text-[#882f1d] mb-4">Paroki St. Paulus- Juanda</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Jl. Juanda No. 123, Sidoarjo, Jawa Timur 61234, Tel: (031) 123-4567 | Email: info@stpaulusjuanda.org</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <SimpleCard
            title="Gallery Foto"
            description="Lihat momen indah kegiatan paroki kami. Dari misa hingga retret rohani."
            to="/galeri"
            link-text="Lihat Gallery →"
          />
          <SimpleCard
            title="Sejarah Gereja"
            description="Pelajari perjalanan Paroki St. Paulus sejak didirikan. Warisan iman yang kaya."
            to="/sejarah"
            link-text="Baca Sejarah →"
          />
          <SimpleCard
            title="Kontak Kami"
            description="Hubungi pastor, staf, atau komunitas untuk informasi lebih lanjut."
            to="/kontak"
            link-text="Hubungi →"
          />
        </div>
      </div>
    </section>

    <!-- Section 2: Teritorial Lingkungan -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-cinzel text-[#882f1d] mb-4">Teritorial Lingkungan</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Peta wilayah teritorial Paroki St. Paulus Juanda.</p>
        </div>
        <div class="max-w-6xl mx-auto">
          <div class="aspect-w-16 aspect-h-9 bg-white rounded-lg shadow-md overflow-hidden">
            <iframe
              src="https://www.google.com/maps/d/embed?mid=18ysqVOVWT_ynb_DwhlxG_ZasT675kas&ehbc=2E312F"
              width="100%"
              height="480"
              frameborder="0"
              style="border:0;"
              allowfullscreen=""
              aria-hidden="false"
              tabindex="0"
            ></iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: Album Terbaru -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-cinzel text-[#882f1d] mb-4">Album Terbaru</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Lihat album foto terbaru dari kegiatan paroki kami.</p>
        </div>
        <div v-if="pending" class="text-center text-gray-500">
          Memuat album terbaru...
        </div>
        <div v-else-if="error" class="text-center text-red-500">
          Gagal memuat album.
        </div>
        <div v-else-if="latestAlbum" class="max-w-4xl mx-auto">
          <NuxtLink :to="`/galeri/${latestAlbum.id}`" class="block group">
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img :src="latestAlbum.thumbnail" :alt="latestAlbum.title" class="w-full h-64 object-cover group-hover:scale-105 transition-transform">
              <div class="p-6">
                <h3 class="text-2xl font-cinzel text-[#882f1d] mb-2">{{ latestAlbum.title }}</h3>
                <p class="text-gray-600 line-clamp-3">{{ latestAlbum.description }}</p>
                <div class="mt-4 flex items-center justify-between">
                  <span class="text-sm text-gray-500">{{ latestAlbum.photos.length }} foto</span>
                  <span class="text-[#882f1d] font-semibold group-hover:underline">Lihat Album →</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
        <div v-else class="text-center text-gray-500">
          Belum ada album tersedia.
        </div>
      </div>
    </section>

    <!-- Section 4: Latest News / Events Teaser -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-cinzel text-[#882f1d] text-center mb-8">Berita Terbaru</h2>
        <div v-if="newsPending" class="text-center text-gray-500">
          Memuat berita terbaru...
        </div>
        <div v-else-if="newsError" class="text-center text-red-500">
          Gagal memuat berita terbaru.
        </div>
        <div v-else-if="latestNews && latestNews.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleCard
            v-for="news in latestNews.slice(0, 3)"
            :key="news.id"
            :image="news.image || '/images/default-news.jpg'"
            image-type="url"
            :title="news.title"
            :description="news.excerpt"
            :date="news.date"
            :to="`/berita/${news.id}`"
          />
        </div>
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleCard
            image="Misa Natal 2024"
            :show-clock="true"
            title="Misa Khusus Natal 2024"
            description="Rayakan Natal bersama keluarga di gereja kami. Jadwal lengkap tersedia."
            to="/berita/natal-2024"
          />
          <!-- Card 2: Text-Only - Keep inline as it's a special placeholder -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1 flex items-center justify-center min-h-[200px]">
            <div class="p-6 text-center">
              <p class="text-gray-600 italic">Belum ada berita terbaru? Cek jadwal misa untuk update kegiatan.</p>
              <NuxtLink to="/misa" class="mt-4 inline-block text-[#882f1d] hover:underline">Ke Jadwal Misa</NuxtLink>
            </div>
          </div>
        </div>
        <!-- CTA ke Full Berita -->
        <div class="text-center mt-8">
          <NuxtLink to="/berita" class="bg-[#882f1d] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#a55e1f] transition-colors">
            Lihat Semua Berita
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 5: Dokumen Paroki -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-cinzel text-[#882f1d] mb-4">DOKUMEN UNGGULAN</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Koleksi dokumen resmi dan informasi penting Gereja St. Paulus Juanda.</p>
        </div>
        <div v-if="featuredDocumentsPending" class="text-center text-gray-500">
          Memuat dokumen unggulan...
        </div>
        <div v-else-if="featuredDocumentsError" class="text-center text-red-500">
          Gagal memuat dokumen unggulan.
        </div>
        <div v-else-if="featuredDocuments && featuredDocuments.length > 0" class="grid md:grid-cols-3 gap-8">
          <div
            v-for="document in featuredDocuments.slice(0, 3)"
            :key="document.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div class="p-6">
              <!-- Category Badge -->
              <div class="flex items-center mb-3">
                <div class="flex-shrink-0 w-4 h-4 rounded mr-2" :style="{ backgroundColor: document.category_color }"></div>
                <span class="text-sm font-medium text-gray-600">{{ document.category_name }}</span>
              </div>

              <!-- Title -->
              <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{{ document.title }}</h3>

              <!-- Description -->
              <p v-if="document.description" class="text-gray-600 text-sm mb-4 line-clamp-3">
                {{ document.description }}
              </p>

              <!-- File Info -->
              <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{{ document.original_filename }}</span>
                <span>{{ formatFileSize(document.file_size) }}</span>
              </div>

              <!-- Upload Date and Action Buttons Row -->
              <div class="flex items-center justify-between">
                <!-- Upload Date -->
                <div class="text-xs text-gray-400">
                  Diunggah: {{ formatDate(document.created_at) }}
                </div>

                <!-- Action Buttons -->
                <div class="flex space-x-1">
                  <button
                    @click="viewDocument(document)"
                    class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    title="Lihat Dokumen"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button
                    @click="printDocument(document)"
                    class="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200"
                    title="Cetak Dokumen"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                    </svg>
                  </button>
                  <button
                    @click="downloadDocument(document)"
                    class="p-2 text-gray-600 hover:text-[#882f1d] hover:bg-red-50 rounded-md transition-colors duration-200"
                    title="Download Dokumen"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">
          <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada dokumen unggulan</h3>
          <p class="text-gray-600">Belum ada dokumen yang ditandai sebagai unggulan.</p>
        </div>
        <!-- CTA ke Full Dokumen -->
        <div class="text-center mt-12">
          <NuxtLink to="/dokumen-paroki" class="bg-[#882f1d] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a55e1f] transition-colors">
            Lihat Semua Dokumen
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 6: Artikel Terbaru (Updated to use API) -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-cinzel text-[#882f1d] mb-4">Artikel & Renungan</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Baca inspirasi rohani, khotbah, dan artikel dari pastor serta komunitas paroki kami.</p>
        </div>
        <div v-if="articlesPending" class="text-center text-gray-500">
          Memuat artikel terbaru...
        </div>
        <div v-else-if="articlesError" class="text-center text-red-500">
          Gagal memuat artikel terbaru.
        </div>
        <div v-else-if="latestArticles && latestArticles.length > 0" class="grid md:grid-cols-3 gap-8">
          <ArticleCard
            v-for="article in latestArticles.slice(0, 3)"
            :key="article.id"
            :image="article.image || '/images/default-article.jpg'"
            image-type="url"
            :title="article.title"
            :description="article.excerpt"
            :date="article.date"
            :to="`/artikel/${article.slug}`"
            link-text="Baca Artikel →"
          />
        </div>
        <div v-else class="grid md:grid-cols-3 gap-8">
          <ArticleCard
            image="Renungan Harian"
            title="Renungan Minggu Ini: Kasih dan Pengampunan"
            description="Artikel singkat tentang ajaran Yesus mengenai pengampunan, dihubungkan dengan kehidupan sehari-hari umat."
            to="/artikel/renungan-kasih"
            link-text="Baca Artikel →"
          />
          <ArticleCard
            image="Khotbah Pastor"
            title="Khotbah Minggu Lalu: Iman di Tengah Tantangan"
            description="Transkrip khotbah Pastor Yohanes tentang mempertahankan iman di era modern."
            to="/artikel/khotbah-iman"
            link-text="Baca Lengkap →"
          />
          <ArticleCard
            image="Pengumuman"
            title="Panduan Retret Rohani 2024"
            description="Informasi lengkap tentang retret tahunan paroki, termasuk jadwal dan persiapan."
            to="/artikel/retret-2024"
            link-text="Lihat Detail →"
          />
        </div>
        <!-- CTA ke Full Artikel -->
        <div class="text-center mt-12">
          <NuxtLink to="/artikel" class="bg-[#882f1d] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a55e1f] transition-colors">
            Lihat Semua Artikel
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 6: Agenda Mendatang -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-cinzel text-[#882f1d] mb-4">Agenda Mendatang</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Jadwal kegiatan dan acara mendatang di Paroki St. Paulus Juanda.</p>
        </div>
        <div v-if="agendaPending" class="text-center text-gray-500">
          Memuat agenda mendatang...
        </div>
        <div v-else-if="agendaError" class="text-center text-red-500">
          Gagal memuat agenda mendatang.
        </div>
        <div v-else-if="upcomingAgendas && upcomingAgendas.length > 0" class="grid md:grid-cols-3 gap-8">
          <div
            v-for="agenda in upcomingAgendas.slice(0, 3)"
            :key="agenda.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div class="p-6">
              <div class="flex items-center space-x-2 mb-3">
                <span
                  :style="getCategoryStyle(agenda)"
                  class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                >
                  {{ agenda.category }}
                </span>
              </div>

              <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ agenda.title }}</h3>

              <div class="flex items-center text-gray-600 mb-2">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="font-medium">{{ formatDate(agenda.start_date) }}</span>
              </div>

              <div class="flex items-center text-gray-600 mb-3">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{{ agenda.location }}</span>
              </div>

              <div v-if="agenda.description" class="text-gray-700 mb-4">
                <p class="text-sm line-clamp-2">{{ agenda.description }}</p>
              </div>

              <NuxtLink
                :to="`/agenda/${agenda.id}`"
                class="inline-block text-[#882f1d] font-medium hover:text-[#6b2416] transition-colors"
              >
                Lihat Detail →
              </NuxtLink>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">
          <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Tidak ada agenda mendatang</h3>
          <p class="text-gray-600">Belum ada agenda yang dijadwalkan untuk periode mendatang.</p>
        </div>
        <!-- CTA ke Full Agenda -->
        <div class="text-center mt-12">
          <NuxtLink to="/agenda" class="bg-[#882f1d] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a55e1f] transition-colors">
            Lihat Semua Agenda
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 7: Status Pemesanan Ruangan -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-cinzel text-[#882f1d] mb-4">Status Pemesanan Ruangan</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Status pemesanan ruangan di Paroki St. Paulus - Juanda.</p>
        </div>
        <div v-if="bookingsPending" class="text-center text-gray-500">
          Memuat status pemesanan...
        </div>
        <div v-else-if="bookingsError" class="text-center text-red-500">
          Gagal memuat status pemesanan.
        </div>
        <div v-else-if="publicBookings && publicBookings.length > 0" class="overflow-x-auto">
          <table class="min-w-full bg-white rounded-lg shadow-md">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal & Waktu</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Acara</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruangan</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="booking in publicBookings.slice(0, 10)"
                :key="booking.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(booking.event_date) }}</div>
                  <div class="text-sm text-gray-500">{{ booking.start_time }} - {{ booking.end_time }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ booking.event_name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ booking.room_name }}</div>
                  <div class="text-sm text-gray-500">{{ booking.room_location }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :style="getBookingStatusStyle(booking.status)"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ booking.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center text-gray-500">
          <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Tidak ada pemesanan ruangan</h3>
          <p class="text-gray-600">Belum ada pemesanan ruangan yang tercatat.</p>
        </div>
        <!-- CTA ke Full Bookings -->
        <div class="text-center mt-12">
          <NuxtLink to="/booking" class="bg-[#882f1d] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a55e1f] transition-colors">
            Pesan Ruangan
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Fetch latest album data
const { data: galleryData, pending, error } = await useAsyncData('homepage-gallery', () =>
  $fetch('/api/galeri')
);

// Fetch latest news data
const { data: newsData, pending: newsPending, error: newsError } = await useAsyncData('homepage-news', () =>
  $fetch('/api/berita')
);

// Fetch latest articles data
const { data: articlesData, pending: articlesPending, error: articlesError } = await useAsyncData('homepage-articles', () =>
  $fetch('/api/artikel')
);

// Fetch upcoming agenda data
const { data: agendaData, pending: agendaPending, error: agendaError } = await useAsyncData('homepage-agenda', () =>
  $fetch('/api/agenda/upcoming')
);

// Fetch featured documents data
const { data: featuredDocumentsData, pending: featuredDocumentsPending, error: featuredDocumentsError } = await useAsyncData('homepage-featured-documents', () =>
  $fetch('/api/featured-documents'), { server: false }
);

// Fetch public bookings data
const { data: bookingsData, pending: bookingsPending, error: bookingsError } = await useAsyncData('homepage-bookings', () =>
  $fetch('/api/bookings/public-list')
);

// Fetch active hero theme
const { data: activeThemeData } = await useAsyncData('active-hero-theme', () =>
  $fetch('/api/hero-theme/active')
);

// Get the latest album (first in sorted array)
const latestAlbum = computed(() => {
  return galleryData.value?.albums?.[0] || null;
});

// Get latest news (first 3)
const latestNews = computed(() => {
  return newsData.value || [];
});

// Get latest articles (first 3)
const latestArticles = computed(() => {
  return articlesData.value || [];
});

// Get upcoming agendas (first 3)
const upcomingAgendas = computed(() => {
  return agendaData.value || [];
});

// Get featured documents (first 3)
const featuredDocuments = computed(() => {
  return featuredDocumentsData.value || [];
});

// Get public bookings (first 6)
const publicBookings = computed(() => {
  return bookingsData.value?.bookings || [];
});

// Get active hero theme
const activeTheme = computed(() => {
  return activeThemeData.value?.data || null;
});

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const viewDocument = async (document) => {
  if (process.client) {
    try {
      const response = await fetch(`/api/documents/${document.id}/download`)
      if (!response.ok) throw new Error('Failed to fetch document')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (error) {
      console.error('Failed to view document:', error)
      alert('Gagal membuka dokumen')
    }
  }
}

const printDocument = async (document) => {
  if (process.client) {
    try {
      const response = await fetch(`/api/documents/${document.id}/download`)
      if (!response.ok) throw new Error('Failed to fetch document')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const printWindow = window.open(url, '_blank')

      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print()
        }
      }
    } catch (error) {
      console.error('Failed to print document:', error)
      alert('Gagal mencetak dokumen')
    }
  }
}

const downloadDocument = async (document) => {
  if (process.client) {
    try {
      const response = await fetch(`/api/documents/${document.id}/download`)
      if (!response.ok) throw new Error('Failed to fetch document')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', document.original_filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Failed to download document:', error)
      alert('Gagal mengunduh dokumen')
    }
  }
}

const getCategoryStyle = (agenda) => {
  if (agenda.category_color) {
    // Convert hex to RGB for background with opacity
    const hex = agenda.category_color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
      color: agenda.category_color,
      border: `1px solid ${agenda.category_color}`
    }
  }
  return {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    color: '#6B7280',
    border: '1px solid #D1D5DB'
  }
}

const getBookingStatusStyle = (status) => {
  switch (status) {
    case 'APPROVED':
      return {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        color: '#16A34A',
        border: '1px solid #16A34A'
      }
    case 'PENDING':
      return {
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        color: '#D97706',
        border: '1px solid #D97706'
      }
    case 'REJECTED':
      return {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: '#DC2626',
        border: '1px solid #DC2626'
      }
    default:
      return {
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        color: '#6B7280',
        border: '1px solid #D1D5DB'
      }
  }
}
</script>

<style scoped>
/* No additional styles - All Tailwind */
</style>
