<template>
  <div class="container mx-auto px-12 py-12">

    <div class="relative wrap overflow-hidden p-10 h-full">
      
      <div class="absolute border-2 border-opacity-20 border-teal-700 h-full left-1/2 transform -translate-x-0.5" style="z-index: 1;"></div>

      <div 
        v-for="(item, index) in timelineData" 
        :key="index" 
        :class="['mb-12 flex justify-between items-center w-full relative', index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse']"
      >
        <div class="order-1 w-full md:w-5/12 px-6 py-4 transition duration-500 ease-in-out transform hover:scale-105"
             :class="{'bg-white border-l-4 border-teal-500 shadow-md': index % 2 === 0, 'bg-teal-50 border-r-4 border-teal-500 shadow-md': index % 2 === 1}">
          <p class="mb-2 text-xl font-bold text-teal-700">{{ item.tahun }}</p>
          <p class="text-base leading-snug text-gray-800">
            <span v-html="item.deskripsi"></span>
            <span v-if="item.catatan" class="block mt-2 italic text-sm text-gray-600">
              Catatan: {{ item.catatan }}
            </span>
          </p>
        </div>

        <div class="z-20 flex items-center order-1 bg-teal-600 shadow-xl w-8 h-8 rounded-full absolute left-1/2 transform -translate-x-1/2">
          <h1 class="mx-auto font-semibold text-lg text-white">{{ item.tahun.slice(-2) }}</h1>
        </div>
        
        <div class="order-1 w-full md:w-5/12 hidden md:block"></div>
      </div>
    </div>
    <div class="mt-16 pt-8 border-t border-gray-300 max-w-4xl mx-auto">
      <h3 class="text-3xl font-bold text-red-700 mb-4 text-center">
        Fokus Pastoral Sejak Agustus 2014 (Masa Romo Cun)
      </h3>
      <p class="text-center text-gray-700 mb-6">
        Paroki St. Paulus – Juanda dinilai masih dalam proses pendewasaan, dengan 3 area utama yang menjadi perhatian:
      </p>
      
      <div class="grid md:grid-cols-3 gap-6 text-center">
        <div class="p-6 bg-red-50 rounded-lg shadow-md border-t-4 border-red-600">
          <span class="text-4xl block mb-2">🤝</span>
          <p class="font-bold text-lg text-red-800">Integrasi Komunitas Warga</p>
          <p class="text-sm text-gray-700">Mendorong pengenalan lintas wilayah pasca-penggabungan dan memperkuat komunitas hidup.</p>
        </div>
        <div class="p-6 bg-red-50 rounded-lg shadow-md border-t-4 border-red-600">
          <span class="text-4xl block mb-2">❤️‍🔥</span>
          <p class="font-bold text-lg text-red-800">Membangun Sense of Belonging</p>
          <p class="text-sm text-gray-700">Menciptakan rasa memiliki yang kuat di antara warga paroki yang berasal dari berbagai paroki asal.</p>
        </div>
        <div class="p-6 bg-red-50 rounded-lg shadow-md border-t-4 border-red-600">
          <span class="text-4xl block mb-2">🏗️</span>
          <p class="font-bold text-lg text-red-800">Organisasi dan Pembangunan</p>
          <p class="text-sm text-gray-700">Melanjutkan pembangunan Balai Paroki dan menata organisasi pastoral (DPP, pengelolaan, SDM).</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const timelineData = [
  // Saya pastikan semua data lengkap dan berurutan sesuai cerita
  { tahun: '1996', deskripsi: 'Muncul informasi awal tentang upaya pengadaan lahan untuk gereja dan pura di kalangan Angkatan Laut.' },
  { tahun: '1998', deskripsi: 'Informasi pengadaan lahan untuk kompleks gereja dan pura beredar luas di kalangan Angkatan Laut.' },
  { 
    tahun: '1999', 
    deskripsi: 'Setelah berkoordinasi dengan Paroki Salib Suci, dibentuklah Panitia Pembangunan Gereja yang kemudian berkoordinasi dengan Angkatan Laut.', 
    catatan: 'Terjadi pergeseran fokus lahan dari "gereja ekumene" menjadi "gereja Katolik" (pura dan gereja Katolik).' 
  },
  { 
    tahun: '2001', 
    deskripsi: 'Proses pembangunan gedung gereja dimulai, namun segera dihentikan karena adanya isu penolakan pembangunan dari kalangan Angkatan Laut.' 
  },
  { 
    tahun: '2002', 
    deskripsi: 'Proses pembangunan gereja dilanjutkan kembali setelah isu penolakan mereda. Proses perizinan IMB di Pemkab. Sidoarjo dimulai.' 
  },
  { 
    tahun: '2005', 
    deskripsi: 'Gedung gereja selesai dibangun dan diresmikan, disusul dengan pembangunan pastoran. Setelah pastoran jadi, Paroki Salib Suci membentuk **Stasi Santo Paulus**.', 
    catatan: 'Area Stasi diperluas dengan sumbangan masing-masing 1 wilayah dari Paroki Sidoarjo, Pagesangan, dan Gembala yang Baik.' 
  },
  { 
    tahun: '2008', 
    deskripsi: 'Pada **1 Mei**, Stasi Santo Paulus resmi ditingkatkan statusnya menjadi **Paroki** dan tanggal tersebut ditetapkan sebagai hari jadi Paroki St. Paulus – Juanda.' 
  },
  { tahun: '2013', deskripsi: 'Dimulainya pembangunan Balai Paroki.' },
  { 
    tahun: '2014', 
    deskripsi: 'Terjadi pergantian Romo Kepala Paroki dari Romo Sony kepada **Romo Tri Kuncoro Yekti (Romo Cun)** pada Agustus.', 
    catatan: 'Romo Cun mencatat bahwa paroki saat itu masih "belum matang" dan berada dalam dinamika proses menjadi paroki sejati.' 
  },
];
</script>

<style scoped>
/* Tidak perlu custom CSS yang kompleks, hanya untuk memastikan dot terpusat */
/* Ini adalah solusi yang paling stabil: garis dan dot di-absolute center */

/* Penyesuaian untuk tampilan mobile: Timeline menjadi satu kolom di sisi kiri */
@media (max-width: 767px) {
  /* Geser Garis Vertikal ke Kiri di Mobile */
  .wrap > div:first-child {
    left: 20px !important; 
    transform: none !important; 
  }

  /* Posisikan Dot di Garis Vertikal Kiri di Mobile */
  .z-20 {
    left: 20px !important;
    transform: translateX(-50%) !important; /* Geser dot agar center di garis */
  }

  /* Konten mengambil seluruh lebar dan memiliki padding untuk dot */
  .wrap > div {
    padding-left: 40px; 
    padding-right: 0;
  }
  
  /* Hapus tata letak bolak-balik di mobile */
  .wrap > div > div:first-child,
  .wrap > div > div:nth-child(3) {
      width: 100% !important;
  }
  
  /* Pastikan border ada di kiri untuk semua kotak konten di mobile */
  .wrap > div > div:first-child {
      border-right: none !important;
      border-left: 4px solid #10b981 !important; /* teal-500 */
  }
}
</style>