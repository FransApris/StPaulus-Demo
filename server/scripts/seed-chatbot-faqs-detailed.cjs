const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('🌱 Seeding detailed chatbot FAQs...')

const seedDetailedFAQs = () => {
  // Detailed Chatbot FAQs
  const detailedFAQs = [
    {
      question: 'Jadwal misa hari Minggu?',
      answer: 'Misa Hari Minggu di Gereja St. Paulus Juanda diadakan pada:\n* Pagi: Pukul 07.00 dan 09.00 WIB\n* Sore: Pukul 17.00 WIB\nMohon hadir 15 menit lebih awal untuk persiapan batin. Tuhan Memberkati.',
      category: 'mass',
      keywords: '["jadwal misa", "misa minggu", "misa hari minggu", "jam berapa misa minggu", "kapan misa minggu"]',
      is_active: true
    },
    {
      question: 'Apakah ada misa harian?',
      answer: 'Ya, Misa Harian diadakan setiap hari Senin hingga Sabtu pada pukul 05.30 WIB. Untuk informasi jadwal Misa Harian jika ada perubahan, silakan cek warta paroki terbaru.',
      category: 'mass',
      keywords: '["misa harian", "jadwal misa setiap hari", "misa pagi hari biasa", "misa harian jam berapa"]',
      is_active: true
    },
    {
      question: 'Info Misa Jumat Pertama?',
      answer: 'Misa Jumat Pertama Hati Kudus Yesus diadakan setiap hari Jumat pertama dalam bulan, pada pukul 18.00 WIB. Misa ini biasanya didahului dengan Adorasi Sakramen Mahakudus.',
      category: 'mass',
      keywords: '["misa jumat pertama", "jumat pertama ada misa", "adorasi sakramen"]',
      is_active: true
    },
    {
      question: 'Jadwal Sakramen Tobat?',
      answer: 'Pelayanan Sakramen Tobat (Pengakuan Dosa) tersedia 30 menit sebelum setiap Misa Hari Minggu. Anda juga bisa membuat janji khusus dengan Romo melalui Sekretariat Paroki.',
      category: 'sakraments',
      keywords: '["sakramen tobat", "pengakuan dosa", "confession", "jadwal confession", "kapan pengakuan dosa"]',
      is_active: true
    },
    {
      question: 'Bagaimana cara mendaftarkan baptis bayi?',
      answer: 'Pendaftaran Sakramen Baptis Bayi dilakukan melalui Ketua Lingkungan. Orang tua diharap melengkapi dokumen berikut dan menyerahkannya ke sekretariat:\n1. Formulir Pendaftaran Baptis (dari sekretariat).\n2. Surat Pengantar dari Ketua Lingkungan.\n3. Fotokopi Kartu Keluarga (KK) Gereja & KK Sipil.\n4. Fotokopi Surat Perkawinan Gereja orang tua.\n5. Fotokopi Surat Baptis Calon Wali Baptis.\nPembaptisan biasanya diadakan setiap hari Minggu pertama setiap bulan.',
      category: 'sakraments',
      keywords: '["baptis bayi", "pendaftaran baptis", "syarat baptis anak", "prosedur baptisan bayi", "cara daftar baptis"]',
      is_active: true
    },
    {
      question: 'Kapan pendaftaran Komuni Pertama / Krisma?',
      answer: 'Pendaftaran untuk penerimaan Sakramen Komuni Pertama dan Sakramen Krisma biasanya dibuka setahun sekali, sekitar bulan Januari - Februari. Pengumuman resmi akan disampaikan melalui warta paroki dan ketua lingkungan. Calon penerima wajib mengikuti program pembinaan yang telah ditentukan.',
      category: 'sakraments',
      keywords: '["komuni pertama", "krisma", "pendaftaran komuni", "pendaftaran krisma", "info sakramen komuni krisma"]',
      is_active: true
    },
    {
      question: 'Bagaimana cara mengurus pernikahan di gereja?',
      answer: 'Untuk persiapan Sakramen Perkawinan, calon mempelai diharap segera menghubungi Sekretariat Paroki minimal 3 (tiga) bulan sebelum tanggal pernikahan untuk penjadwalan dan proses kanonik. Kedua calon juga wajib mengikuti Kursus Persiapan Perkawinan (KPP).',
      category: 'sakraments',
      keywords: '["pernikahan gereja", "menikah katolik", "syarat nikah gereja", "kursus persiapan perkawinan", "kpp"]',
      is_active: true
    },
    {
      question: 'Bagaimana jika butuh layanan Sakramen Perminyakan Orang Sakit?',
      answer: 'Untuk pelayanan Sakramen Perminyakan Orang Sakit, terutama dalam keadaan darurat, keluarga dapat segera menghubungi Sekretariat Paroki di nomor telepon [NOMOR TELEPON SEKRETARIAT] atau nomor darurat [NOMOR KONTAK DARURAT JIKA ADA].',
      category: 'sakraments',
      keywords: '["sakramen perminyakan", "orang sakit", "romo visitasi", "sakramen sakit"]',
      is_active: true
    },
    {
      question: 'Jam berapa kantor sekretariat buka?',
      answer: 'Sekretariat Paroki St. Paulus Juanda buka pada:\n* Selasa - Jumat: Pukul 08.00 - 15.00 WIB\n* Sabtu: Pukul 08.00 - 12.00 WIB\n* Minggu: Setelah Misa Pagi\n* Senin & Hari Libur Nasional: Tutup.',
      category: 'parish_info',
      keywords: '["jam sekretariat", "kantor sekretariat buka", "jam operasional sekretariat", "waktu sekretariat"]',
      is_active: true
    },
    {
      question: 'Berapa nomor WA sekretariat?',
      answer: 'Anda dapat menghubungi Sekretariat Paroki melalui WhatsApp di nomor [NOMOR WA SEKRETARIAT]. Mohon untuk berkirim pesan pada jam kerja agar dapat direspons dengan baik.',
      category: 'parish_info',
      keywords: '["nomor wa sekretariat", "kontak sekretariat", "wa paroki", "nomor whatsapp sekretariat"]',
      is_active: true
    },
    {
      question: 'Bagaimana cara bertemu dengan Romo?',
      answer: 'Jika Anda ingin bertemu atau berkonsultasi dengan Romo, disarankan untuk membuat janji terlebih dahulu melalui Sekretariat Paroki agar dapat disesuaikan dengan jadwal pelayanan Romo.',
      category: 'parish_info',
      keywords: '["bertemu romo", "konsultasi pastor", "janji dengan romo", "temu pastor"]',
      is_active: true
    },
    {
      question: 'Bagaimana cara bergabung dengan Orang Muda Katolik (OMK)?',
      answer: 'Tentu! Orang Muda Katolik (OMK) St. Paulus Juanda aktif dengan berbagai kegiatan. Kamu bisa datang langsung ke kegiatan mereka atau menghubungi pengurus melalui Sekretariat Paroki untuk mendapatkan kontak lebih lanjut.',
      category: 'activities',
      keywords: '["omk", "orang muda katolik", "bergabung omk", "info omk juanda"]',
      is_active: true
    },
    {
      question: 'Bagaimana cara memberikan persembahan/donasi?',
      answer: 'Terima kasih atas niat baik Anda. Persembahan kasih untuk pembangunan dan kegiatan gereja dapat ditransfer ke rekening resmi paroki di:\n* Bank: [NAMA BANK]\n* Nomor Rekening: [NOMOR REKENING]\n* Atas Nama: [GEREJA KATOLIK ST PAULUS JUANDA]\nTuhan memberkati kemurahan hati Anda.',
      category: 'parish_info',
      keywords: '["persembahan", "donasi", "kasih", "nomor rekening gereja", "transfer gereja"]',
      is_active: true
    },
    {
      question: 'Saya tidak mengerti pertanyaan Anda',
      answer: 'Mohon maaf, saya belum mengerti pertanyaan Anda. Untuk informasi lebih lanjut yang tidak dapat saya jawab, silakan hubungi Sekretariat Paroki melalui WhatsApp di nomor [NOMOR WA SEKRETARIAT] pada jam kerja. Terima kasih.',
      category: 'fallback',
      keywords: '["tidak tahu", "fallback", "tidak mengerti"]',
      is_active: true
    }
  ]

  // Insert Detailed FAQs
  const insertFAQ = db.prepare(`
    INSERT OR IGNORE INTO chatbot_faqs (question, answer, category, keywords, is_active)
    VALUES (?, ?, ?, ?, ?)
  `)

  console.log('🤖 Seeding Detailed Chatbot FAQs...')
  detailedFAQs.forEach(faq => {
    try {
      insertFAQ.run(faq.question, faq.answer, faq.category, faq.keywords, faq.is_active)
      console.log(`✅ Created FAQ: ${faq.question}`)
    } catch (e) {
      console.log(`⚠️  FAQ ${faq.question} already exists`)
    }
  })

  console.log('\n✨ Detailed chatbot FAQs seeding completed!')
  console.log(`📊 Added ${detailedFAQs.length} detailed FAQ entries`)
}

seedDetailedFAQs()
db.close()
