const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')

const DB_PATH = path.join(__dirname, '../database/cms.db')

const db = new Database(DB_PATH)

console.log('🌱 Seeding dummy data for presentation...')

const seedDummyData = async () => {
  // Hash password for users
  const password = 'password123'
  const hashedPassword = await bcrypt.hash(password, 10)

  // Dummy Users - Ketua Lingkungan
  const dummyUsers = [
    {
      username: 'theresia1',
      email: 'theresia1@stpaulusjuanda.org',
      password_hash: hashedPassword,
      role: 'user',
      full_name: 'Ketua Lingkungan Theresia 1',
      user_category: 'PARISH_COUNCIL',
      unit_name: 'Lingkungan St. Theresia 1'
    },
    {
      username: 'simon1',
      email: 'simon1@stpaulusjuanda.org',
      password_hash: hashedPassword,
      role: 'user',
      full_name: 'Ketua Lingkungan Simon 1',
      user_category: 'PARISH_COUNCIL',
      unit_name: 'Lingkungan St. Simon 1'
    },
    {
      username: 'petrus6',
      email: 'petrus6@stpaulusjuanda.org',
      password_hash: hashedPassword,
      role: 'user',
      full_name: 'Ketua Lingkungan Petrus 6',
      user_category: 'PARISH_COUNCIL',
      unit_name: 'Lingkungan St. Petrus 6'
    },
    {
      username: 'bartolomeus2',
      email: 'bartolomeus2@stpaulusjuanda.org',
      password_hash: hashedPassword,
      role: 'user',
      full_name: 'Ketua Lingkungan Bartolomeus 2',
      user_category: 'PARISH_COUNCIL',
      unit_name: 'Lingkungan St. Bartolomeus 2'
    },
    {
      username: 'maria3',
      email: 'maria3@stpaulusjuanda.org',
      password_hash: hashedPassword,
      role: 'user',
      full_name: 'Ketua Lingkungan Maria 3',
      user_category: 'PARISH_COUNCIL',
      unit_name: 'Lingkungan St. Maria 3'
    }
  ]

  // Insert Users
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (username, email, password_hash, role, full_name, user_category, unit_name)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  console.log('👥 Seeding Users...')
  dummyUsers.forEach(user => {
    try {
      insertUser.run(user.username, user.email, user.password_hash, user.role, user.full_name, user.user_category, user.unit_name)
      console.log(`✅ Created user: ${user.username} (${user.full_name})`)
    } catch (e) {
      console.log(`⚠️  User ${user.username} already exists`)
    }
  })

  // Dummy Rooms
  const dummyRooms = [
    {
      name: 'Aula St. Petrus',
      capacity: 200,
      location: 'Gedung Utama',
      facilities: '["Proyektor", "Sound System", "AC", "Kursi Lipat"]',
      photo_url: null,
      requires_approval: true,
      allowed_categories: '["PARISH_COUNCIL", "CATEGORICAL_GROUP"]',
      is_active: true
    },
    {
      name: 'Ruang Rapat Bijaksana',
      capacity: 50,
      location: 'Lantai 2 Gedung Pastoral',
      facilities: '["Meja Rapat", "Kursi", "Whiteboard", "AC"]',
      photo_url: null,
      requires_approval: true,
      allowed_categories: '["PARISH_COUNCIL", "REGION"]',
      is_active: true
    },
    {
      name: 'Ruang Rapat Adil',
      capacity: 30,
      location: 'Lantai 1 Gedung Pastoral',
      facilities: '["Meja Rapat", "Kursi", "Proyektor", "AC"]',
      photo_url: null,
      requires_approval: true,
      allowed_categories: '["PARISH_COUNCIL", "CATEGORICAL_GROUP", "REGION"]',
      is_active: true
    },
    {
      name: 'Aula Serbaguna Maria Bunda',
      capacity: 150,
      location: 'Gedung Belakang',
      facilities: '["Sound System", "AC", "Kursi", "Panggung"]',
      photo_url: null,
      requires_approval: true,
      allowed_categories: '["PARISH_COUNCIL", "CATEGORICAL_GROUP", "COMMUNITY"]',
      is_active: true
    },
    {
      name: 'Ruang Katekese',
      capacity: 40,
      location: 'Lantai 3 Gedung Pastoral',
      facilities: '["Meja", "Kursi", "Whiteboard", "AC"]',
      photo_url: null,
      requires_approval: false,
      allowed_categories: '["PARISH_COUNCIL", "CATEGORICAL_GROUP", "REGION", "COMMUNITY"]',
      is_active: true
    }
  ]

  // Insert Rooms
  const insertRoom = db.prepare(`
    INSERT OR IGNORE INTO rooms (name, capacity, location, facilities, photo_url, requires_approval, allowed_categories, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  console.log('\n🏢 Seeding Rooms...')
  dummyRooms.forEach(room => {
    try {
      insertRoom.run(room.name, room.capacity, room.location, room.facilities, room.photo_url, room.requires_approval, room.allowed_categories, room.is_active)
      console.log(`✅ Created room: ${room.name}`)
    } catch (e) {
      console.log(`⚠️  Room ${room.name} already exists`)
    }
  })

  // Dummy Agendas
  const dummyAgendas = [
    {
      title: 'Misa Syukur HUT Lingkungan St. Petrus 6',
      description: 'Misa syukur ulang tahun Lingkungan St. Petrus 6 yang ke-25 dengan tema "Bersama Membangun Komunitas".',
      start_date: '2025-10-25T17:00:00',
      end_date: '2025-10-25T19:00:00',
      location: 'Gereja Utama',
      category_id: 1, // Assuming agenda_categories are seeded
      contact_person: 'Ketua Lingkungan St. Petrus 6 - 081234567890'
    },
    {
      title: 'Rapat Pleno Dewan Paroki Kuartal IV',
      description: 'Rapat pleno dewan paroki membahas program kerja kuartal IV 2025 dan evaluasi kegiatan tahun ini.',
      start_date: '2025-11-01T19:00:00',
      end_date: '2025-11-01T21:00:00',
      location: 'Ruang Rapat Bijaksana',
      category_id: 2,
      contact_person: 'Sekretaris Paroki - 081234567891'
    },
    {
      title: 'Pendaftaran Baptis Bayi Periode Natal 2025',
      description: 'Pembukaan pendaftaran baptis bayi untuk periode Natal 2025. Persyaratan: surat nikah orang tua, KK, akta kelahiran.',
      start_date: '2025-11-15T09:00:00',
      end_date: '2025-11-15T11:00:00',
      location: 'Sekretariat Paroki',
      category_id: 3,
      contact_person: 'Kateket Baptis - 081234567892'
    },
    {
      title: 'Retret OMK Tahun 2025',
      description: 'Retret tahunan OMK Paroki St. Paulus Juanda dengan tema "Panggilan Hidup sebagai Murid Kristus".',
      start_date: '2025-11-22T08:00:00',
      end_date: '2025-11-23T17:00:00',
      location: 'Retret House Maria Fatima',
      category_id: 4,
      contact_person: 'Ketua OMK - 081234567893'
    },
    {
      title: 'Kegiatan Sosial Bakti Kebersihan Lingkungan',
      description: 'Kegiatan sosial membersihkan lingkungan gereja dan sekitarnya sebagai wujud kepedulian terhadap kebersihan.',
      start_date: '2025-11-29T07:00:00',
      end_date: '2025-11-29T11:00:00',
      location: 'Halaman Gereja dan Lingkungan Sekitar',
      category_id: 5,
      contact_person: 'Ketua Karya Sosial - 081234567894'
    },
    {
      title: 'Misa Malam Natal 2025',
      description: 'Misa malam Natal dengan pementasan kisah kelahiran Yesus oleh anak-anak paroki.',
      start_date: '2025-12-24T22:00:00',
      end_date: '2025-12-24T23:30:00',
      location: 'Gereja Utama',
      category_id: 1,
      contact_person: 'Ketua Liturgi - 081234567895'
    },
    {
      title: 'Perayaan Tahun Baru 2026',
      description: 'Perayaan tahun baru dengan misa dan doa bersama untuk tahun yang penuh berkat.',
      start_date: '2025-12-31T23:00:00',
      end_date: '2026-01-01T00:30:00',
      location: 'Gereja Utama',
      category_id: 1,
      contact_person: 'Romo Paroki - 081234567896'
    }
  ]

  // Insert Agendas
  const insertAgenda = db.prepare(`
    INSERT OR IGNORE INTO agendas (title, description, start_date, end_date, location, category_id, contact_person)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  console.log('\n📅 Seeding Agendas...')
  dummyAgendas.forEach(agenda => {
    try {
      insertAgenda.run(agenda.title, agenda.description, agenda.start_date, agenda.end_date, agenda.location, agenda.category_id, agenda.contact_person)
      console.log(`✅ Created agenda: ${agenda.title}`)
    } catch (e) {
      console.log(`⚠️  Agenda ${agenda.title} already exists`)
    }
  })

  // Dummy News
  const dummyNews = [
    {
      title: 'Jadwal Pengakuan Dosa Jelang Hari Raya Kristus Raja',
      slug: 'jadwal-pengakuan-dosa-kristus-raja-2025',
      content: 'Paroki St. Paulus Juanda mengumumkan jadwal pengakuan dosa khusus jelang Hari Raya Kristus Raja. Pengakuan dosa akan dilaksanakan setiap hari mulai tanggal 20 November hingga 22 November 2025 di Kapel Paroki. Romo Paroki dan Romo Pembantu akan siaga untuk melayani umat.',
      excerpt: 'Jadwal pengakuan dosa khusus jelang Hari Raya Kristus Raja 2025 tersedia di kapel paroki.',
      author: 'Tim Liturgi Paroki',
      status: 'published',
      published_at: '2025-10-15T08:00:00'
    },
    {
      title: 'Renovasi Gua Maria Paroki Telah Selesai',
      slug: 'renovasi-gua-maria-selesai-2025',
      content: 'Renovasi Gua Maria yang terletak di halaman gereja telah selesai dilakukan. Gua Maria yang merupakan tempat ziarah umat kini tampil lebih indah dengan pencahayaan LED, area berdoa yang lebih luas, dan patung Bunda Maria yang diperbaharui. Renovasi ini dibiayai dari sumbangan umat dan diharapkan dapat menjadi tempat yang lebih nyaman untuk ibadat.',
      excerpt: 'Renovasi Gua Maria Paroki St. Paulus Juanda telah selesai dengan tampilan yang lebih indah dan nyaman.',
      author: 'Tim Komunikasi Paroki',
      status: 'published',
      published_at: '2025-10-12T10:00:00'
    },
    {
      title: 'OMK Paroki Mengadakan Bakti Sosial di Panti Asuhan',
      slug: 'omk-bakti-sosial-panti-asuhan-2025',
      content: 'Organisasi Muda Katolik (OMK) Paroki St. Paulus Juanda mengadakan bakti sosial di Panti Asuhan Kasih Bunda. Kegiatan yang diikuti 50 pemuda dan pemudi ini meliputi pembersihan lingkungan, pembagian sembako, games edukatif, dan doa bersama dengan anak-anak panti. Kegiatan ini merupakan bagian dari program karya sosial OMK.',
      excerpt: 'OMK Paroki St. Paulus Juanda mengadakan bakti sosial di Panti Asuhan Kasih Bunda dengan berbagai kegiatan membantu anak-anak panti.',
      author: 'OMK Paroki',
      status: 'published',
      published_at: '2025-10-10T14:00:00'
    },
    {
      title: 'Laporan Keuangan Paroki September 2025',
      slug: 'laporan-keuangan-september-2025',
      content: 'Dewan Paroki St. Paulus Juanda telah merilis laporan keuangan bulan September 2025. Total pemasukan mencapai Rp 145 juta dengan pengeluaran sebesar Rp 118 juta. Dana tersebut digunakan untuk kegiatan sosial, renovasi gereja, gaji karyawan, dan operasional paroki. Laporan lengkap dapat dilihat di sekretariat paroki.',
      excerpt: 'Dewan Paroki merilis laporan keuangan September 2025 dengan total pemasukan Rp 145 juta.',
      author: 'Bendahara Paroki',
      status: 'published',
      published_at: '2025-10-08T09:00:00'
    },
    {
      title: 'Pembukaan Pendaftaran KPP 2025',
      slug: 'pendaftaran-kpp-2025',
      content: 'Paroki St. Paulus Juanda membuka pendaftaran Kursus Persiapan Perkawinan (KPP) untuk tahun 2025. Kursus ini wajib diikuti oleh calon pengantin yang akan melangsungkan pernikahan di gereja. Kursus akan dilaksanakan setiap Sabtu selama 3 bulan dengan materi tentang ajaran katolik, pernikahan, dan membangun keluarga.',
      excerpt: 'Paroki St. Paulus Juanda membuka pendaftaran Kursus Persiapan Perkawinan (KPP) 2025.',
      author: 'Kateket Paroki',
      status: 'published',
      published_at: '2025-10-05T11:00:00'
    }
  ]

  // Insert News
  const insertNews = db.prepare(`
    INSERT OR IGNORE INTO news (title, slug, content, excerpt, author, status, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  console.log('\n📰 Seeding News...')
  dummyNews.forEach(news => {
    try {
      insertNews.run(news.title, news.slug, news.content, news.excerpt, news.author, news.status, news.published_at)
      console.log(`✅ Created news: ${news.title}`)
    } catch (e) {
      console.log(`⚠️  News ${news.title} already exists`)
    }
  })

  // Dummy Articles
  const dummyArticles = [
    {
      title: 'Renungan Harian: Mengandalkan Penyelenggaraan Ilahi',
      slug: 'renungan-mengandalkan-penyelenggaraan-ilahi',
      content: 'Dalam bacaan Injil hari ini, kita diajak untuk merenungkan tentang penyelenggaraan ilahi. Tuhan Yesus mengajarkan kita untuk tidak khawatir tentang kebutuhan hidup sehari-hari, karena Bapa di surga mengetahui apa yang kita perlukan. Iman yang sejati adalah mengandalkan Tuhan sepenuhnya, percaya bahwa Dia akan menyediakan segala sesuatu pada waktunya.',
      excerpt: 'Renungan tentang mengandalkan penyelenggaraan ilahi dan belajar percaya sepenuhnya kepada Tuhan.',
      author: 'Romo Yohanes',
      status: 'published',
      published_at: '2025-10-14T06:00:00'
    },
    {
      title: 'Sejarah Singkat Paroki St. Paulus Juanda',
      slug: 'sejarah-paroki-stpaulus-juanda',
      content: 'Paroki St. Paulus Juanda didirikan pada tahun 1985 oleh Keuskupan Surabaya. Bermula dari sebuah kapel kecil, kini paroki ini telah berkembang menjadi komunitas yang besar dengan berbagai kegiatan pastoral. Gereja utama dibangun pada tahun 1995 dan terus mengalami renovasi untuk melayani umat yang semakin bertambah.',
      excerpt: 'Sejarah singkat Paroki St. Paulus Juanda dari kapel kecil hingga komunitas besar saat ini.',
      author: 'Tim Dokumentasi Paroki',
      status: 'published',
      published_at: '2025-10-11T08:00:00'
    },
    {
      title: 'Makna Advent: Penantian Penuh Harap',
      slug: 'makna-advent-penantian-harap',
      content: 'Advent adalah masa penantian yang penuh harap. Dalam masa ini, kita diajak untuk mempersiapkan hati menyambut kelahiran Yesus Kristus. Advent mengajarkan kita tentang kesabaran, harapan, dan persiapan spiritual. Melalui doa, puasa, dan amal, kita belajar untuk membuka hati bagi kedatangan Tuhan dalam hidup kita sehari-hari.',
      excerpt: 'Advent mengajarkan kita tentang kesabaran, harapan, dan persiapan spiritual menyambut kelahiran Yesus Kristus.',
      author: 'Suster Maria',
      status: 'published',
      published_at: '2025-10-09T07:00:00'
    },
    {
      title: 'Panggilan Hidup Berkeluarga yang Kudus',
      slug: 'panggilan-keluarga-kudus',
      content: 'Keluarga adalah panggilan suci dari Tuhan. Dalam Sakramen Perkawinan, suami istri dipanggil untuk menjadi saksi kasih Kristus di dunia. Hidup berkeluarga yang kudus memerlukan pengorbanan, kesetiaan, dan kasih yang tulus. Melalui doa bersama dan Sakramen Ekaristi, keluarga dapat menjadi terang di tengah dunia.',
      excerpt: 'Keluarga adalah panggilan suci untuk menjadi saksi kasih Kristus melalui pengorbanan, kesetiaan, dan doa bersama.',
      author: 'Romo Markus',
      status: 'published',
      published_at: '2025-10-07T06:30:00'
    }
  ]

  // Insert Articles
  const insertArticle = db.prepare(`
    INSERT OR IGNORE INTO articles (title, slug, content, excerpt, author, status, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  console.log('\n📖 Seeding Articles...')
  dummyArticles.forEach(article => {
    try {
      insertArticle.run(article.title, article.slug, article.content, article.excerpt, article.author, article.status, article.published_at)
      console.log(`✅ Created article: ${article.title}`)
    } catch (e) {
      console.log(`⚠️  Article ${article.title} already exists`)
    }
  })

  console.log('\n✨ Dummy data seeding completed!')
  console.log('📊 Summary:')
  console.log(`   - ${dummyUsers.length} Users (Ketua Lingkungan)`)
  console.log(`   - ${dummyRooms.length} Rooms`)
  console.log(`   - ${dummyAgendas.length} Agendas`)
  console.log(`   - ${dummyNews.length} News items`)
  console.log(`   - ${dummyArticles.length} Articles`)
  console.log('\n🔑 User login credentials: username / password123')
}

seedDummyData().catch(console.error).finally(() => db.close())
