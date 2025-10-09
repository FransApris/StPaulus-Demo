import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get admin token
const token = fs.readFileSync(path.join(__dirname, '../admin_token.txt'), 'utf8').trim();

const API_BASE = 'http://localhost:3000';

// Dummy data sesuai permintaan user
const dummyNews = [
  {
    title: "Perayaan Natal 2025 di Paroki Kita Berlangsung Meriah",
    content: "Paroki St. Paulus Juanda menggelar perayaan Natal yang meriah dengan berbagai kegiatan liturgi dan sosial. Ribuan umat hadir dalam misa malam Natal yang dipimpin oleh Romo Paroki. Acara ini juga diisi dengan pertunjukan koor anak dan remaja, serta pembagian bingkisan kepada kaum dhuafa.",
    excerpt: "Perayaan Natal 2025 di Paroki St. Paulus Juanda berlangsung meriah dengan kehadiran ribuan umat dan berbagai kegiatan liturgi serta sosial.",
    author: "Tim Komunikasi Paroki",
    status: "published",
    category_ids: [1] // Berita Paroki
  },
  {
    title: "OMK Paroki Mengadakan Bakti Sosial di Panti Asuhan Kasih Bunda",
    content: "Organisasi Muda Katolik (OMK) Paroki St. Paulus Juanda mengadakan bakti sosial di Panti Asuhan Kasih Bunda. Kegiatan ini melibatkan 50 pemuda dan pemudi yang membantu membersihkan lingkungan, memberikan bantuan materi, serta mengadakan games dan doa bersama dengan anak-anak panti.",
    excerpt: "OMK Paroki St. Paulus Juanda mengadakan bakti sosial di Panti Asuhan Kasih Bunda dengan berbagai kegiatan membantu anak-anak panti.",
    author: "OMK Paroki",
    status: "published",
    category_ids: [1]
  },
  {
    title: "Renovasi Gua Maria Paroki Telah Selesai Dilakukan",
    content: "Renovasi Gua Maria yang terletak di halaman gereja telah selesai dilakukan. Gua Maria yang merupakan tempat ziarah umat kini tampil lebih indah dengan pencahayaan yang lebih baik dan area yang lebih luas untuk berdoa. Renovasi ini dibiayai dari sumbangan umat dan diharapkan dapat menjadi tempat yang lebih nyaman untuk ibadat.",
    excerpt: "Renovasi Gua Maria Paroki St. Paulus Juanda telah selesai dengan tampilan yang lebih indah dan nyaman untuk ibadat umat.",
    author: "Tim Liturgi",
    status: "published",
    category_ids: [1]
  },
  {
    title: "Jadwal Pelaksanaan Kursus Persiapan Perkawinan (KPP) 2025",
    content: "Paroki St. Paulus Juanda membuka pendaftaran Kursus Persiapan Perkawinan (KPP) untuk tahun 2025. Kursus ini wajib diikuti oleh calon pengantin yang akan melangsungkan pernikahan di gereja. Kursus akan dilaksanakan setiap Sabtu selama 3 bulan dengan materi tentang katolik, pernikahan, dan keluarga.",
    excerpt: "Paroki St. Paulus Juanda membuka pendaftaran Kursus Persiapan Perkawinan (KPP) 2025 yang wajib diikuti calon pengantin.",
    author: "Kateket",
    status: "published",
    category_ids: [1]
  },
  {
    title: "Laporan Keuangan dan Kasih Umat Bulan September 2025",
    content: "Dewan Paroki St. Paulus Juanda telah merilis laporan keuangan dan kasih umat bulan September 2025. Total pemasukan mencapai Rp 150 juta dengan pengeluaran sebesar Rp 120 juta. Dana tersebut digunakan untuk kegiatan sosial, renovasi gereja, dan operasional paroki. Laporan lengkap dapat dilihat di sekretariat paroki.",
    excerpt: "Dewan Paroki merilis laporan keuangan September 2025 dengan total pemasukan Rp 150 juta dan pengeluaran Rp 120 juta.",
    author: "Bendahara Paroki",
    status: "published",
    category_ids: [1]
  }
];

const dummyArticles = [
  {
    title: "Makna Adven: Penantian Penuh Harap",
    content: "Adven adalah masa penantian yang penuh harap. Dalam masa ini, kita diajak untuk mempersiapkan hati menyambut kelahiran Yesus Kristus. Adven mengajarkan kita tentang kesabaran, harapan, dan persiapan spiritual. Melalui doa, puasa, dan amal, kita belajar untuk membuka hati bagi kedatangan Tuhan dalam hidup kita sehari-hari.",
    excerpt: "Adven mengajarkan kita tentang kesabaran, harapan, dan persiapan spiritual menyambut kelahiran Yesus Kristus.",
    author: "Romo Yohanes",
    status: "published",
    category_ids: [2] // Renungan
  },
  {
    title: "Menjadi Garam dan Terang Dunia di Era Digital",
    content: "Dalam Matius 5:13-16, Yesus menyebut murid-muridNya sebagai garam dan terang dunia. Di era digital saat ini, tantangan menjadi garam dan terang semakin kompleks. Kita harus bijak menggunakan media sosial untuk menyebarkan kasih dan kebenaran, sambil menjaga integritas iman kita di tengah arus informasi yang deras.",
    excerpt: "Menjadi garam dan terang dunia di era digital memerlukan kebijaksanaan dalam menggunakan media sosial untuk menyebarkan kasih.",
    author: "Suster Maria",
    status: "published",
    category_ids: [2]
  },
  {
    title: "Kisah Santo Pelindung Paroki Kita",
    content: "Santo Paulus adalah santo pelindung Paroki St. Paulus Juanda. Kisah pertobatannya dari Saulus yang menganiaya orang Kristen menjadi Paulus yang menjadi rasul terbesar menunjukkan bahwa Tuhan dapat mengubah hidup siapa saja. Santo Paulus mengajarkan kita tentang pentingnya pertobatan, penginjilan, dan ketekunan dalam iman.",
    excerpt: "Kisah pertobatan Santo Paulus mengajarkan tentang pengubahan hidup dan ketekunan dalam iman yang menjadi teladan bagi umat paroki.",
    author: "Kateket Paroki",
    status: "published",
    category_ids: [2]
  },
  {
    title: "Refleksi Minggu Biasa ke-28: Iman yang Menyembuhkan",
    content: "Bacaan Injil Minggu Biasa ke-28 mengisahkan tentang iman yang dapat menyembuhkan. Seorang perempuan penderita pendarahan disembuhkan karena imannya yang kuat. Kisah ini mengajarkan bahwa iman bukan hanya keyakinan intelektual, tetapi juga kepercayaan yang mendalam yang menghasilkan tindakan dan kesembuhan.",
    excerpt: "Bacaan Injil Minggu Biasa ke-28 mengajarkan tentang iman yang dapat menyembuhkan dan menghasilkan mukjizat.",
    author: "Romo Petrus",
    status: "published",
    category_ids: [2]
  },
  {
    title: "Panggilan Hidup Berkeluarga yang Kudus",
    content: "Keluarga adalah panggilan suci dari Tuhan. Dalam Sakramen Perkawinan, suami istri dipanggil untuk menjadi saksi kasih Kristus di dunia. Hidup berkeluarga yang kudus memerlukan pengorbanan, kesetiaan, dan kasih yang tulus. Melalui doa bersama dan Sakramen Ekaristi, keluarga dapat menjadi terang di tengah dunia.",
    excerpt: "Keluarga adalah panggilan suci untuk menjadi saksi kasih Kristus melalui pengorbanan, kesetiaan, dan doa bersama.",
    author: "Romo Markus",
    status: "published",
    category_ids: [2]
  }
];

const dummyAgendas = [
  {
    title: "Rapat Pleno Dewan Paroki",
    description: "Rapat pleno dewan paroki membahas program kerja tahun 2025 dan laporan keuangan bulan Oktober.",
    start_date: "2025-10-15T19:00:00",
    end_date: "2025-10-15T21:00:00",
    location: "Ruang Rapat Paroki",
    category: "Rapat",
    contact_person: "Ketua Dewan Paroki - 081234567890"
  },
  {
    title: "Latihan Koor OMK untuk Misa Natal",
    description: "Latihan koor OMK mempersiapkan repertoar lagu Natal untuk misa malam Natal dan misa hari raya.",
    start_date: "2025-10-18T18:00:00",
    end_date: "2025-10-18T20:00:00",
    location: "Ruang Musik Gereja",
    category: "Latihan",
    contact_person: "Ketua OMK - 081234567891"
  },
  {
    title: "Adorasi Sakramen Mahakudus",
    description: "Adorasi Sakramen Mahakudus Jumat Pertama dengan tema 'Kasih Kristus yang Tiada Akhir'.",
    start_date: "2025-10-24T20:00:00",
    end_date: "2025-10-24T21:00:00",
    location: "Kapel",
    category: "Ibadat",
    contact_person: "Ketua Liturgi - 081234567892"
  },
  {
    title: "Kerja Bakti Lingkungan Santa Maria",
    description: "Kerja bakti membersihkan lingkungan Gua Santa Maria dan memperbaiki jalur ziarah.",
    start_date: "2025-10-26T08:00:00",
    end_date: "2025-10-26T12:00:00",
    location: "Halaman Gua Santa Maria",
    category: "Sosial",
    contact_person: "Ketua Karya Sosial - 081234567893"
  },
  {
    title: "Seminar Keluarga Harmonis",
    description: "Seminar dengan tema 'Membangun Keluarga yang Harmonis di Era Digital' menghadirkan pembicara dari keuskupan.",
    start_date: "2025-10-30T10:00:00",
    end_date: "2025-10-30T16:00:00",
    location: "Aula Paroki",
    category: "Pendidikan",
    contact_person: "Kateket - 081234567894"
  }
];

// Function to create content via API
async function createContent(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`✅ Created: ${data.title || data.title}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create: ${data.title || data.title}`, error.message);
    return null;
  }
}

// Main seeding function
async function seedDummyContent() {
  console.log('🌱 Starting dummy content seeding...\n');

  // Seed News
  console.log('📝 Seeding News...');
  for (const news of dummyNews) {
    await createContent('/api/admin/news', news);
  }

  // Seed Articles
  console.log('\n📖 Seeding Articles...');
  for (const article of dummyArticles) {
    await createContent('/api/admin/articles', article);
  }

  // Seed Agendas
  console.log('\n📅 Seeding Agendas...');
  for (const agenda of dummyAgendas) {
    await createContent('/api/admin/agenda', agenda);
  }

  console.log('\n✨ Dummy content seeding completed!');
  console.log('📊 Summary:');
  console.log(`   - ${dummyNews.length} News items`);
  console.log(`   - ${dummyArticles.length} Articles`);
  console.log(`   - ${dummyAgendas.length} Agenda items`);
  console.log(`   - 11 Liturgy schedules (already seeded)`);
}

// Run seeding
seedDummyContent().catch(console.error);
