# Laporan Bug Admin Panel - St. Paulus CMS

## 🔴 CRITICAL BUGS (Prioritas Tinggi)

### 1. **CRITICAL: Stats API Tidak Menggunakan Authentication**
**Lokasi:** `server/api/admin/stats.get.ts`
**Severity:** CRITICAL
**Deskripsi:**
- API endpoint `/api/admin/stats` tidak memiliki authentication check
- Siapapun bisa mengakses statistik admin tanpa login
- Tidak ada `requireAuth()` atau token verification

**Dampak:**
- Information disclosure - attacker bisa melihat jumlah artikel, berita, album, foto
- Bisa digunakan untuk reconnaissance sebelum attack

**Solusi:**
```typescript
import { allQuery } from '../../database/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  // Add authentication check
  requireAuth(event)
  
  try {
    // ... rest of code
  }
})
```

### 2. **CRITICAL: Gallery API Menggunakan Token Verification yang Salah**
**Lokasi:** `server/api/admin/gallery/index.get.ts` lines 13-23
**Severity:** CRITICAL
**Deskripsi:**
```typescript
try {
  // Verify token (simplified - in production use proper JWT verification)
  if (!token) {
    throw new Error('Invalid token')
  }
} catch (error) {
  throw createError({
    statusCode: 401,
    statusMessage: 'Invalid token'
  })
}
```
- Hanya mengecek apakah token ada, tidak memverifikasi JWT signature
- Attacker bisa menggunakan token palsu apapun
- Comment mengatakan "simplified" tapi ini production code

**Dampak:**
- Bypass authentication dengan token palsu
- Unauthorized access ke gallery management

**Solusi:**
```typescript
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  // Use proper authentication
  requireAuth(event)
  
  // ... rest of code
})
```

### 3. **CRITICAL: Gallery API Tidak Menggunakan Database**
**Lokasi:** `server/api/admin/gallery/index.get.ts`
**Severity:** CRITICAL
**Deskripsi:**
- Gallery API membaca langsung dari filesystem (`public/images/album`)
- Tidak konsisten dengan artikel/berita yang menggunakan database
- Stats API mencoba query `gallery_albums` dan `gallery_photos` table yang tidak digunakan
- Mismatch antara stats dan actual data

**Dampak:**
- Stats menunjukkan 0 albums/photos padahal ada data di filesystem
- Tidak ada metadata management (title, description, order)
- Tidak ada audit trail untuk perubahan gallery

**Solusi:**
Implementasi proper database schema untuk gallery atau update stats API untuk membaca dari filesystem.

### 4. **Keamanan: Tidak Ada Middleware Authentication di Client-Side**
**Lokasi:** Semua halaman admin (`pages/admin/*.vue`)
**Severity:** CRITICAL
**Deskripsi:** 
- Halaman admin hanya mengecek token di `onMounted()` menggunakan localStorage
- Tidak ada middleware Nuxt yang mencegah akses langsung ke halaman admin
- User bisa mengakses halaman admin sebelum pengecekan token selesai (race condition)
- Token disimpan di localStorage yang rentan terhadap XSS attacks

**Dampak:**
- Halaman admin bisa diakses sebentar sebelum redirect ke login
- Sensitive data bisa ter-expose
- Token bisa dicuri melalui XSS

**Solusi:**
```javascript
// Buat middleware di middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      return navigateTo('/admin/login')
    }
  }
})

// Tambahkan di setiap halaman admin:
definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})
```

### 5. **Keamanan: JWT Secret Menggunakan Default Value**
**Lokasi:** `server/utils/auth.ts` line 5
**Severity:** CRITICAL
**Deskripsi:**
```typescript
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
```
- Menggunakan default secret key yang hardcoded
- Jika JWT_SECRET tidak di-set di environment, menggunakan nilai default yang mudah ditebak

**Dampak:**
- Attacker bisa membuat token palsu
- Bypass authentication system

**Solusi:**
```typescript
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}
```

### 6. **Bug: Missing Import di auth.ts**
**Lokasi:** `server/utils/auth.ts` line 54
**Severity:** HIGH
**Deskripsi:**
```typescript
const authHeader = getHeader(event, 'authorization')
```
- Fungsi `getHeader` tidak di-import
- Akan menyebabkan runtime error

**Solusi:**
```typescript
import { getHeader } from 'h3'
```

### 7. **Bug: Error Handling di Dashboard Tidak Menangani 401**
**Lokasi:** `pages/admin/dashboard.vue`
**Severity:** HIGH
**Deskripsi:**
- Ketika token expired atau invalid, API akan return 401
- Dashboard tidak menangani error 401 untuk redirect ke login
- User akan melihat error console tanpa feedback yang jelas

**Solusi:**
```javascript
const fetchStats = async () => {
  try {
    const response = await $fetch('/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    stats.value = response
  } catch (error) {
    if (error.statusCode === 401) {
      localStorage.removeItem('admin_token')
      navigateTo('/admin/login')
    }
    console.error('Failed to fetch stats:', error)
  }
}
```

## 🟡 MEDIUM BUGS

### 8. **Bug: Gallery Photo Upload API Endpoint Tidak Ada**
**Lokasi:** `pages/admin/gallery.vue` line 567
**Severity:** HIGH
**Deskripsi:**
```javascript
await $fetch('/api/admin/gallery/photos', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
  },
  body: formData
})
```
- Code mencoba upload ke `/api/admin/gallery/photos` tapi endpoint ini tidak ada
- Akan selalu error 404
- Upload foto tidak akan pernah berhasil

**Dampak:**
- Fitur upload foto tidak berfungsi sama sekali
- User tidak bisa menambah foto ke album

**Solusi:**
Buat endpoint `server/api/admin/gallery/photos/index.post.ts` untuk handle upload.

### 9. **Bug: Gallery Album Photos Endpoint Tidak Ada**
**Lokasi:** `pages/admin/gallery.vue` lines 296, 571
**Severity:** HIGH
**Deskripsi:**
```javascript
const response = await $fetch(`/api/admin/gallery/${album.id}/photos`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
  }
})
```
- Endpoint `/api/admin/gallery/[id]/photos` tidak ada
- Akan error 404 saat view album detail

**Dampak:**
- Tidak bisa melihat foto dalam album
- Gallery management tidak berfungsi

**Solusi:**
Buat endpoint atau gunakan data yang sudah ada dari `/api/admin/gallery`.

### 10. **Bug: Editor Content Update Sama di News dan Articles**
**Lokasi:** `pages/admin/news.client.vue` line 358, `pages/admin/articles.client.vue` line 358
**Severity:** MEDIUM
**Deskripsi:**
```javascript
nextTick(() => {
  editor.value?.commands.setContent(newsItem.content)
})
```
- Menggunakan `editor.value` tapi editor bukan ref
- Bug yang sama di kedua file

**Dampak:**
- Editor tidak ter-update saat edit artikel/berita
- User harus manual copy-paste content

**Solusi:**
```javascript
nextTick(() => {
  editor?.commands.setContent(newsItem.content)
})
```

### 11. **Bug: Slug Auto-generation Tidak Ada di Articles/News**
**Lokasi:** `pages/admin/articles.client.vue`
**Severity:** MEDIUM
**Deskripsi:**
- User harus manual input slug
- Tidak ada auto-generation dari title
- Bisa menyebabkan slug tidak konsisten atau invalid

**Solusi:**
```javascript
watch(() => articleForm.value.title, (newTitle) => {
  if (!editingArticle.value) {
    articleForm.value.slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
})
```

### 12. **Bug: Pagination Visibility Logic Error**
**Lokasi:** `pages/admin/dashboard.vue` line 177
**Severity:** MEDIUM
**Deskripsi:**
```javascript
return pages.filter(page => page !== '...')
```
- Filter menghapus '...' dari array pages
- Tapi '...' tidak pernah di-push ke array, hanya string '...' yang di-push
- Logic tidak konsisten

**Solusi:**
Hapus filter atau perbaiki logic untuk handle ellipsis dengan benar.

### 13. **Bug: No Error Handling untuk Failed API Calls**
**Lokasi:** Multiple files (articles.client.vue, news.client.vue, dll)
**Severity:** MEDIUM
**Deskripsi:**
- Banyak API calls hanya menggunakan `alert()` untuk error
- Tidak ada proper error notification system
- User experience buruk

**Solusi:**
Implementasi toast notification system atau error boundary.

### 14. **Bug: Gallery Drag & Drop Reorder Tidak Akan Berfungsi**
**Lokasi:** `pages/admin/gallery.vue` line 583
**Severity:** MEDIUM
**Deskripsi:**
```javascript
await $fetch(`/api/admin/gallery/${currentAlbum.value.id}/reorder`, {
  method: 'PUT',
  // ...
  body: { photoIds }
})
```
- Endpoint `/api/admin/gallery/[id]/reorder` ada di `server/api/admin/gallery/[id]/reorder.put.ts`
- Tapi karena photos tidak di database, reorder tidak akan persist
- Data photos di-generate dari filesystem setiap request

**Dampak:**
- Reorder foto tidak akan tersimpan
- Setiap refresh kembali ke urutan default (alphabetical)

**Solusi:**
Simpan order di database atau di meta.json file.

## 🟢 LOW PRIORITY BUGS

### 15. **UX: Tidak Ada Loading State di Modal**
**Lokasi:** `pages/admin/articles.client.vue`
**Severity:** LOW
**Deskripsi:**
- Saat save artikel, button disabled tapi tidak ada loading indicator
- User tidak tahu apakah proses sedang berjalan

**Solusi:**
Tambahkan spinner atau loading text yang lebih jelas.

### 16. **Bug: Duplicate handleLogout Function**
**Lokasi:** `layouts/admin.vue` dan semua admin pages
**Severity:** LOW
**Deskripsi:**
- Function `handleLogout` didefinisikan di layout dan di setiap page
- Code duplication

**Solusi:**
Buat composable `useAuth.ts`:
```javascript
export const useAuth = () => {
  const logout = () => {
    localStorage.removeItem('admin_token')
    navigateTo('/admin/login')
  }
  
  return { logout }
}
```

### 17. **Performance: Fetch Categories di Setiap Page Load**
**Lokasi:** `pages/admin/articles.client.vue`
**Severity:** LOW
**Deskripsi:**
- Categories di-fetch setiap kali page load
- Categories jarang berubah, bisa di-cache

**Solusi:**
Gunakan Pinia store untuk cache categories.

### 18. **Accessibility: Missing ARIA Labels**
**Lokasi:** Semua admin pages
**Severity:** LOW
**Deskripsi:**
- Button dan form elements tidak memiliki proper ARIA labels
- Tidak accessible untuk screen readers

**Solusi:**
Tambahkan `aria-label` pada semua interactive elements.

### 19. **Bug: Gallery File Upload Progress Simulation**
**Lokasi:** `pages/admin/gallery.vue` lines 545-550
**Severity:** LOW
**Deskripsi:**
```javascript
// Simulate progress (in real implementation, use XMLHttpRequest for progress tracking)
const progressInterval = setInterval(() => {
  if (fileData.progress < 90) {
    fileData.progress += Math.random() * 20
  }
}, 200)
```
- Progress bar fake, tidak menunjukkan actual upload progress
- Misleading untuk user

**Solusi:**
Gunakan XMLHttpRequest atau fetch dengan ReadableStream untuk track actual progress.

### 20. **Bug: Gallery Image Error Handler Menggunakan Placeholder yang Tidak Ada**
**Lokasi:** `pages/admin/gallery.vue` multiple locations
**Severity:** LOW
**Deskripsi:**
```javascript
const handleImageError = (event) => {
  event.target.src = '/placeholder-image.jpg'
}
```
- File `/placeholder-image.jpg` tidak ada di project
- Akan error lagi saat load placeholder

**Solusi:**
Buat placeholder image atau gunakan data URI inline SVG.

## 🔵 SECURITY RECOMMENDATIONS

### 21. **Security: Token Tidak Ada Expiry Check di Client**
**Severity:** MEDIUM
**Deskripsi:**
- Client tidak mengecek apakah token sudah expired
- Hanya mengandalkan server untuk reject expired token

**Solusi:**
Decode JWT di client dan cek expiry sebelum API call.

### 22. **Security: No CSRF Protection**
**Severity:** MEDIUM
**Deskripsi:**
- Tidak ada CSRF token untuk state-changing operations
- Vulnerable to CSRF attacks

**Solusi:**
Implementasi CSRF token atau gunakan SameSite cookies.

### 23. **Security: Sensitive Data di Console.log**
**Lokasi:** Multiple files
**Severity:** LOW
**Deskripsi:**
- Error messages di-log ke console dengan detail lengkap
- Bisa expose sensitive information di production

**Solusi:**
Gunakan proper logging library dan disable console.log di production.

### 24. **Security: File Upload Tidak Ada Validation**
**Lokasi:** `pages/admin/gallery.vue` lines 519-521
**Severity:** MEDIUM
**Deskripsi:**
```javascript
const imageFiles = files.filter(file => file.type.startsWith('image/'))
const validFiles = imageFiles.filter(file => file.size <= 10 * 1024 * 1024) // 10MB limit
```
- Validation hanya di client-side
- Attacker bisa bypass dengan direct API call
- Tidak ada server-side validation untuk file type dan size

**Dampak:**
- Bisa upload file berbahaya (PHP, executable, dll)
- Bisa upload file besar untuk DoS attack

**Solusi:**
Tambahkan server-side validation di upload endpoint.

## 📋 SUMMARY

**Total Bugs Found:** 24
- Critical: 7 (3 new critical bugs found!)
- High: 2
- Medium: 8
- Low: 7

**Prioritas Perbaikan:**
1. **URGENT** - Fix stats API authentication (Bug #1)
2. **URGENT** - Fix gallery API authentication (Bug #2)
3. **URGENT** - Fix gallery database mismatch (Bug #3)
4. **URGENT** - Fix authentication middleware (Bug #4)
5. **URGENT** - Fix JWT secret handling (Bug #5)
6. **URGENT** - Fix missing import (Bug #6)
7. **URGENT** - Add proper error handling untuk 401 (Bug #7)
8. **HIGH** - Create missing gallery upload endpoint (Bug #8)
9. **HIGH** - Create missing gallery photos endpoint (Bug #9)
10. Fix editor content update (Bug #10)
11. Implement slug auto-generation (Bug #11)
12. Other medium/low priority bugs

**Estimasi Waktu Perbaikan:**
- Critical bugs: 8-12 jam (increased due to gallery system issues)
- High priority bugs: 4-6 jam
- Medium bugs: 6-8 jam
- Low priority bugs: 4-6 jam
- **Total: 22-32 jam**

**Catatan Penting:**
Gallery system memiliki masalah arsitektur fundamental:
- API membaca dari filesystem tapi stats query database
- Upload endpoints tidak ada
- Tidak ada proper metadata management
- Perlu refactoring besar atau pilih satu approach (filesystem atau database)
