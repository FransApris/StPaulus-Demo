const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('🌱 Seeding additional dummy data...')

const seedAdditionalDummyData = () => {
  // Additional Rooms
  const additionalRooms = [
    {
      name: 'Aula St. Maria',
      capacity: 150,
      location: 'Gedung Utama',
      facilities: '["Proyektor", "Sound System", "AC", "Kursi"]',
      photo_url: null,
      requires_approval: true,
      allowed_categories: '["PARISH_COUNCIL", "CATEGORICAL_GROUP", "COMMUNITY"]',
      is_active: true
    },
    {
      name: 'Ruang Rapat St. Yusuf',
      capacity: 25,
      location: 'Lantai 1 Gedung Pastoral',
      facilities: '["Meja Rapat", "Kursi", "Whiteboard", "AC"]',
      photo_url: null,
      requires_approval: true,
      allowed_categories: '["PARISH_COUNCIL", "CATEGORICAL_GROUP", "REGION"]',
      is_active: true
    },
    {
      name: 'Pendopo St. Yohanes',
      capacity: 50,
      location: 'Halaman Belakang',
      facilities: '["Sound System", "AC", "Kursi", "Panggung Kecil"]',
      photo_url: null,
      requires_approval: false,
      allowed_categories: '["PARISH_COUNCIL", "CATEGORICAL_GROUP", "REGION", "COMMUNITY"]',
      is_active: true
    }
  ]

  // Insert Additional Rooms
  const insertRoom = db.prepare(`
    INSERT OR IGNORE INTO rooms (name, capacity, location, facilities, photo_url, requires_approval, allowed_categories, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  console.log('🏢 Seeding Additional Rooms...')
  additionalRooms.forEach(room => {
    try {
      insertRoom.run(room.name, room.capacity, room.location, room.facilities, room.photo_url, room.requires_approval, room.allowed_categories, room.is_active)
      console.log(`✅ Created room: ${room.name}`)
    } catch (e) {
      console.log(`⚠️  Room ${room.name} already exists`)
    }
  })

  // Additional Agendas
  const additionalAgendas = [
    {
      title: 'Misa Jumat Pertama & Adorasi Sakramen Mahakudus',
      description: 'Misa Jumat Pertama bulan November dengan adorasi Sakramen Mahakudus dan kesempatan pengakuan dosa.',
      start_date: '2025-11-07T19:00:00',
      end_date: '2025-11-07T21:00:00',
      location: 'Kapel Paroki',
      category_id: 1,
      contact_person: 'Ketua Liturgi - 081234567897'
    },
    {
      title: 'Pertemuan Calon Penerima Sakramen Krisma 2025',
      description: 'Pertemuan persiapan bagi calon penerima Sakramen Krisma tahun 2025 dengan materi pembinaan iman.',
      start_date: '2025-11-10T14:00:00',
      end_date: '2025-11-10T16:00:00',
      location: 'Aula Paroki',
      category_id: 4,
      contact_person: 'Kateket Krisma - 081234567898'
    },
    {
      title: 'Kursus Persiapan Perkawinan (KPP) Angkatan IV',
      description: 'Kursus Persiapan Perkawinan angkatan IV tahun 2025 untuk calon pengantin Katolik.',
      start_date: '2025-11-20T09:00:00',
      end_date: '2025-11-20T16:00:00',
      location: 'Ruang Katekese',
      category_id: 4,
      contact_person: 'Kateket Perkawinan - 081234567899'
    }
  ]

  // Insert Additional Agendas
  const insertAgenda = db.prepare(`
    INSERT OR IGNORE INTO agendas (title, description, start_date, end_date, location, category_id, contact_person)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  console.log('\n📅 Seeding Additional Agendas...')
  additionalAgendas.forEach(agenda => {
    try {
      insertAgenda.run(agenda.title, agenda.description, agenda.start_date, agenda.end_date, agenda.location, agenda.category_id, agenda.contact_person)
      console.log(`✅ Created agenda: ${agenda.title}`)
    } catch (e) {
      console.log(`⚠️  Agenda ${agenda.title} already exists`)
    }
  })

  // Get user IDs for bookings
  const getUserId = (username) => {
    const user = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
    return user ? user.id : null
  }

  const getRoomId = (name) => {
    const room = db.prepare('SELECT id FROM rooms WHERE name = ?').get(name)
    return room ? room.id : null
  }

  // Additional Bookings
  const additionalBookings = [
    {
      user_id: getUserId('theresia1'),
      room_id: getRoomId('Aula St. Maria'),
      event_name: 'Rapat Lingkungan Bulanan',
      start_time: '2025-11-05T19:00:00',
      end_time: '2025-11-05T21:00:00',
      status: 'APPROVED'
    },
    {
      user_id: getUserId('simon1'),
      room_id: getRoomId('Ruang Rapat St. Yusuf'),
      event_name: 'Latihan Koor',
      start_time: '2025-11-08T18:00:00',
      end_time: '2025-11-08T20:00:00',
      status: 'PENDING'
    },
    {
      user_id: getUserId('petrus6'),
      room_id: getRoomId('Pendopo St. Yohanes'),
      event_name: 'Arisan Lingkungan',
      start_time: '2025-11-12T15:00:00',
      end_time: '2025-11-12T17:00:00',
      status: 'APPROVED'
    }
  ]

  // Insert Additional Bookings
  const insertBooking = db.prepare(`
    INSERT OR IGNORE INTO bookings (user_id, room_id, event_name, start_time, end_time, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  console.log('\n📋 Seeding Additional Bookings...')
  additionalBookings.forEach(booking => {
    if (booking.user_id && booking.room_id) {
      try {
        insertBooking.run(booking.user_id, booking.room_id, booking.event_name, booking.start_time, booking.end_time, booking.status)
        console.log(`✅ Created booking: ${booking.event_name}`)
      } catch (e) {
        console.log(`⚠️  Booking ${booking.event_name} already exists`)
      }
    } else {
      console.log(`⚠️  Skipping booking ${booking.event_name} - user or room not found`)
    }
  })

  // Additional Chatbot FAQs
  const additionalFAQs = [
    {
      question: 'Bagaimana cara mendaftar baptis anak?',
      answer: 'Untuk pendaftaran baptis anak, silakan menghubungi kantor sekretariat paroki pada jam kerja (Senin-Jumat, 08.00-16.00 WIB) dengan membawa fotokopi surat nikah gereja orang tua, kartu keluarga, dan akta kelahiran anak. Pendaftaran minimal 1 bulan sebelum tanggal baptis yang diinginkan.',
      category: 'sakraments',
      keywords: '["baptis", "anak", "pendaftaran", "syarat"]',
      is_active: true
    },
    {
      question: 'Kapan jadwal misa harian?',
      answer: 'Misa harian di Paroki St. Paulus Juanda diadakan setiap hari pukul 05.30 WIB di Gereja Utama. Misa Minggu diadakan pukul 05.30 WIB (Misa Pagi), 07.00 WIB, dan 17.00 WIB (Misa Sore). Untuk jadwal lengkap, silakan lihat di halaman Jadwal Misa.',
      category: 'mass',
      keywords: '["misa", "jadwal", "harian", "minggu"]',
      is_active: true
    },
    {
      question: 'Apa syarat untuk menjadi anggota dewan paroki?',
      answer: 'Syarat menjadi anggota Dewan Paroki adalah: 1) Berusia minimal 18 tahun, 2) Aktif sebagai umat paroki minimal 2 tahun, 3) Mengikuti proses seleksi yang ditentukan, 4) Mendapat rekomendasi dari ketua lingkungan. Informasi lebih lanjut dapat ditanyakan langsung kepada Pastor Paroki atau Ketua Dewan Paroki Harian.',
      category: 'parish_info',
      keywords: '["dewan paroki", "anggota", "syarat", "seleksi"]',
      is_active: true
    },
    {
      question: 'Bagaimana cara mendaftar KPP (Kursus Persiapan Perkawinan)?',
      answer: 'Untuk mendaftar KPP, calon pengantin harus menghubungi sekretariat paroki dengan membawa surat pengantar dari ketua lingkungan dan surat keterangan status jomblo/jejaka dari ketua lingkungan. Kursus diadakan setiap bulan dengan durasi 3 bulan. Biaya kursus sesuai dengan ketentuan paroki.',
      category: 'sakraments',
      keywords: '["kpp", "kursus", "perkawinan", "pendaftaran"]',
      is_active: true
    }
  ]

  // Insert Additional FAQs
  const insertFAQ = db.prepare(`
    INSERT OR IGNORE INTO chatbot_faqs (question, answer, category, keywords, is_active)
    VALUES (?, ?, ?, ?, ?)
  `)

  console.log('\n🤖 Seeding Additional Chatbot FAQs...')
  additionalFAQs.forEach(faq => {
    try {
      insertFAQ.run(faq.question, faq.answer, faq.category, faq.keywords, faq.is_active)
      console.log(`✅ Created FAQ: ${faq.question}`)
    } catch (e) {
      console.log(`⚠️  FAQ ${faq.question} already exists`)
    }
  })

  console.log('\n✨ Additional dummy data seeding completed!')
  console.log('📊 Summary:')
  console.log(`   - ${additionalRooms.length} Additional Rooms`)
  console.log(`   - ${additionalAgendas.length} Additional Agendas`)
  console.log(`   - ${additionalBookings.length} Additional Bookings`)
  console.log(`   - ${additionalFAQs.length} Additional FAQs`)
}

seedAdditionalDummyData().catch(console.error).finally(() => db.close())
