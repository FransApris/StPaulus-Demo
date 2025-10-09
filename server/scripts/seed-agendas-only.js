import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get admin token
const token = fs.readFileSync(path.join(__dirname, '../admin_token.txt'), 'utf8').trim();

const API_BASE = 'http://localhost:3000';

// Dummy agendas with correct category_id
const dummyAgendas = [
  {
    title: "Rapat Pleno Dewan Paroki",
    description: "Rapat pleno dewan paroki membahas program kerja tahun 2025 dan laporan keuangan bulan Oktober.",
    start_date: "2025-10-15T19:00:00",
    end_date: "2025-10-15T21:00:00",
    location: "Ruang Rapat Paroki",
    category_id: 4, // Rapat
    contact_person: "Ketua Dewan Paroki - 081234567890"
  },
  {
    title: "Latihan Koor OMK untuk Misa Natal",
    description: "Latihan koor OMK mempersiapkan repertoar lagu Natal untuk misa malam Natal dan misa hari raya.",
    start_date: "2025-10-18T18:00:00",
    end_date: "2025-10-18T20:00:00",
    location: "Ruang Musik Gereja",
    category_id: 2, // Misa
    contact_person: "Ketua OMK - 081234567891"
  },
  {
    title: "Adorasi Sakramen Mahakudus",
    description: "Adorasi Sakramen Mahakudus Jumat Pertama dengan tema 'Kasih Kristus yang Tiada Akhir'.",
    start_date: "2025-10-24T20:00:00",
    end_date: "2025-10-24T21:00:00",
    location: "Kapel",
    category_id: 2, // Misa
    contact_person: "Ketua Liturgi - 081234567892"
  },
  {
    title: "Kerja Bakti Lingkungan Santa Maria",
    description: "Kerja bakti membersihkan lingkungan Gua Santa Maria dan memperbaiki jalur ziarah.",
    start_date: "2025-10-26T08:00:00",
    end_date: "2025-10-26T12:00:00",
    location: "Halaman Gua Santa Maria",
    category_id: 3, // Baptis (digunakan untuk kegiatan sosial)
    contact_person: "Ketua Karya Sosial - 081234567893"
  },
  {
    title: "Seminar Keluarga Harmonis",
    description: "Seminar dengan tema 'Membangun Keluarga yang Harmonis di Era Digital' menghadirkan pembicara dari keuskupan.",
    start_date: "2025-10-30T10:00:00",
    end_date: "2025-10-30T16:00:00",
    location: "Aula Paroki",
    category_id: 4, // Rapat
    contact_person: "Kateket - 081234567894"
  }
];

// Function to create agenda via API
async function createAgenda(data) {
  try {
    const response = await fetch(`${API_BASE}/api/admin/agenda`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Created: ${data.title}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create: ${data.title}`, error.message);
    return null;
  }
}

// Main seeding function
async function seedAgendas() {
  console.log('📅 Starting agenda seeding...\n');

  for (const agenda of dummyAgendas) {
    await createAgenda(agenda);
  }

  console.log('\n✨ Agenda seeding completed!');
  console.log(`📊 Summary: ${dummyAgendas.length} Agenda items`);
}

// Run seeding
seedAgendas().catch(console.error);
