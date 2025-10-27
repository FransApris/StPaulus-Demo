# TODO: Navigation Menu Restructure

## Overview
Restructure the navigation menu to include dropdowns for "Profil Paroki" and "Konten", create new static pages, and reorganize existing menu items.

## Tasks

### 1. Modify Navbar Component
- [ ] Update `components/Navbar.vue` to support dropdown menus
- [ ] Add hover/click functionality for dropdowns
- [ ] Update navLinks structure to include dropdown items
- [ ] Ensure mobile menu supports dropdowns
- [ ] Test desktop and mobile navigation

### 2. Create New Static Pages
- [ ] Create `pages/kronik-gereja.vue` (empty static page)
- [ ] Create `pages/teritorial-paroki.vue` (empty static page)
- [ ] Create `pages/romo-bertugas.vue` (empty static page)
- [ ] Create `pages/data-statistika-paroki.vue` (empty static page)
- [ ] Create `pages/dokumen-paroki.vue` (empty static page)

### 3. Update Existing Pages (if needed)
- [ ] Verify breadcrumb titles in existing pages match new menu structure
- [ ] Ensure no broken links after restructure

### 4. Testing and Verification
- [ ] Test all navigation links work correctly
- [ ] Verify dropdown functionality on desktop
- [ ] Verify mobile menu dropdowns work
- [ ] Check that admin panel functionality remains intact
- [ ] Run website locally to verify no regressions

## New Menu Structure
```
Beranda
Jadwal Misa
Profil Paroki (dropdown)
  - Sejarah Paroki (/sejarah)
  - Kronik Gereja (/kronik-gereja)
  - Teritorial Paroki (/teritorial-paroki)
  - Romo yang Bertugas (/romo-bertugas)
  - Data Statistik Paroki (/data-statistika-paroki)
Konten (dropdown)
  - Artikel (/artikel)
  - Berita (/berita)
  - Galeri (/galeri)
Agenda Paroki
Pemesanan Ruangan
Dokumen Paroki (/dokumen-paroki)
Kontak
```

## Notes
- Ensure no admin panel functionality is broken
- All new pages are static and empty for now
- "Sejarah" renamed to "Sejarah Paroki" in menu
- "Galeri Foto" renamed to "Galeri" in menu
