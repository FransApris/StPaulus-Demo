const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('Seeding chatbot FAQs...')

const sampleFaqs = [
  {
    question: 'Kapan jadwal misa di Gereja St. Paulus Juanda?',
    answer: 'Gereja St. Paulus Juanda memiliki jadwal misa sebagai berikut:\n- Misa Harian: Senin-Jumat pukul 05:30 WIB\n- Misa Sabtu: pukul 17:00 WIB\n- Misa Minggu: pukul 05:30 WIB, 07:00 WIB, dan 17:00 WIB\n\nUntuk jadwal lengkap dan pembaruan, silakan hubungi kantor paroki.',
    category: 'mass',
    keywords: JSON.stringify(['misa', 'jadwal', 'waktu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'])
  },
  {
    question: 'Bagaimana cara mendaftar baptis?',
    answer: 'Untuk mendaftar baptis anak, orang dewasa, atau baptis kondisional, silakan hubungi kantor paroki St. Paulus Juanda. Persyaratan umum meliputi:\n\n1. Formulir pendaftaran baptis\n2. Akta kelahiran anak\n3. Kartu keluarga\n4. Bukti kehadiran di gereja\n\nPastoral baptis akan dijadwalkan sesuai ketersediaan.',
    category: 'sacraments',
    keywords: JSON.stringify(['baptis', 's baptis', 'daftar', 'pendaftaran', 'anak', 'dewasa', 'kondisional'])
  },
  {
    question: 'Di mana lokasi Gereja St. Paulus Juanda?',
    answer: 'Gereja St. Paulus Juanda terletak di:\nJl. Paulus Juanda No. 123\nSurabaya, Jawa Timur 60234\n\nGPS Coordinates: -7.123456, 112.789012\n\nTransportasi umum: Angkot atau taksi online dapat menjangkau lokasi ini.',
    category: 'parish_info',
    keywords: JSON.stringify(['lokasi', 'alamat', 'dimana', 'jalan', 'surabaya', 'GPS', 'koordinat'])
  },
  {
    question: 'Apa saja kegiatan di paroki ini?',
    answer: 'Gereja St. Paulus Juanda memiliki berbagai kegiatan untuk umat:\n\n- Kegiatan Katekisasi untuk anak-anak dan remaja\n- Kelompok doa dan renungan\n- Kegiatan sosial seperti kunjungan ke panti asuhan\n- Latihan paduan suara\n- Pertemuan kelompok kategorial\n- Retret dan rekoleksi\n\nInformasi detail dapat diperoleh di kantor paroki.',
    category: 'activities',
    keywords: JSON.stringify(['kegiatan', 'aktivitas', 'katekisasi', 'doa', 'paduan suara', 'retret', 'rekoleksi'])
  },
  {
    question: 'Bagaimana cara menghubungi kantor paroki?',
    answer: 'Anda dapat menghubungi kantor paroki St. Paulus Juanda melalui:\n\n- Telepon: (031) 123-4567\n- Email: info@stpaulusjuanda.org\n- WhatsApp: +62 812-3456-7890\n- Alamat: Jl. Paulus Juanda No. 123, Surabaya\n\nJam operasional kantor: Senin-Jumat, pukul 08:00-16:00 WIB',
    category: 'parish_info',
    keywords: JSON.stringify(['kontak', 'hubungi', 'telepon', 'email', 'whatsapp', 'jam operasional'])
  }
]

const insertFaq = db.prepare(`
  INSERT OR IGNORE INTO chatbot_faqs (question, answer, category, keywords)
  VALUES (?, ?, ?, ?)
`)

sampleFaqs.forEach(faq => {
  try {
    insertFaq.run(faq.question, faq.answer, faq.category, faq.keywords)
    console.log('Inserted FAQ:', faq.question.substring(0, 50) + '...')
  } catch (e) {
    console.log('Error inserting FAQ:', e.message)
  }
})

db.close()
console.log('Chatbot FAQs seeding completed!')
