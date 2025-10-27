# TODO: Perbaikan Modul "Kelola Jadwal Misa Khusus"

## 1. Perbaikan pada Sisi Frontend (pages/admin/mass-schedules.vue)
- [x] Modifikasi logic fetchSpecialSchedules untuk menangani respons paginated API ({schedules: [...], pagination: {...}})
- [x] Tambahkan check dan fallback untuk tampilan tanggal yang "Invalid Date"
- [x] Perbaiki dialog konfirmasi hapus untuk menangani schedule.title yang undefined
- [x] Perbaiki dropdown Jenis Liturgi: hapus headers auth, filter hanya aktif, tambah loading state, fetch saat modal dibuka
- [x] Verifikasi field status untuk tampilan Aktif/Tidak Aktif

## 2. Perbaikan pada Sisi Backend (API Routes & Validasi)
- [x] Pastikan dropdown Jenis Liturgi mengambil data dari liturgy-types API (sudah benar)
- [x] Tambahkan validasi backend liturgy_type_id pada POST /api/admin/liturgy-schedules
- [x] Tambahkan validasi server-side untuk format tanggal dan waktu
- [x] Tambahkan validasi yang sama pada PUT endpoint

## 3. Pengujian dan Pencegahan Regresi
- [x] Test Create, Update, Delete jadwal misa khusus
- [x] Test kasus error (data tidak valid)
- [x] Test regresi pada Kelola Jadwal Misa Rutin
- [x] Test regresi pada Kelola Jenis Liturgi
