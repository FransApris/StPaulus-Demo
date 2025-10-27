# TODO: Fitur Pengelola Tema Hero Section

## 🎯 User Story
Sebagai admin (super_admin atau admin_komsos), saya ingin bisa mengganti gambar hero section halaman depan website dengan mudah untuk menyesuaikan tema peristiwa liturgi.

## 📋 Requirements

### 1. Database Schema
- [ ] Create `hero_themes` table with fields: id, name, image_path, is_active, created_at, updated_at
- [ ] Add unique constraint: only one theme can be active at a time

### 2. RBAC Permissions
- [ ] Add `manage_hero_themes` permission
- [ ] Assign to super_admin and admin_komsos roles

### 3. API Endpoints
- [ ] GET `/api/admin/hero-themes` - List all themes
- [ ] POST `/api/admin/hero-themes` - Create new theme (with image upload)
- [ ] PUT `/api/admin/hero-themes/[id]` - Update theme
- [ ] DELETE `/api/admin/hero-themes/[id]` - Delete theme
- [ ] PUT `/api/admin/hero-themes/[id]/activate` - Set theme as active

### 4. Admin Interface
- [ ] Add "Pengelola Tema" menu in sidebar (for super_admin & admin_komsos)
- [ ] Create `/admin/hero-themes` page
- [ ] Form for adding new themes (name + image upload)
- [ ] Table showing existing themes (preview, name, status, actions)
- [ ] Actions: Activate, Edit, Delete

### 5. Public Website Integration
- [ ] Update hero section component to fetch active theme
- [ ] API endpoint GET `/api/hero-theme/active` for public access
- [ ] Fallback to default image if no active theme

### 6. File Upload Handling
- [ ] Configure image upload to `/public/images/themes/`
- [ ] Validate image formats (jpg, png, webp)
- [ ] Image optimization/resizing if needed

## 🔄 Implementation Steps

### Phase 1: Database & API Foundation
1. [ ] Create database migration script
2. [ ] Add RBAC permissions
3. [ ] Implement basic CRUD API endpoints
4. [ ] Test API endpoints with Postman

### Phase 2: Admin Interface
1. [ ] Add menu item to admin sidebar
2. [ ] Create theme management page
3. [ ] Implement image upload functionality
4. [ ] Add theme listing with actions

### Phase 3: Public Integration
1. [ ] Create public API for active theme
2. [ ] Update hero section component
3. [ ] Test theme switching

### Phase 4: Testing & Polish
1. [ ] Test all CRUD operations
2. [ ] Test permission restrictions
3. [ ] Test image upload and display
4. [ ] Add loading states and error handling

## 📁 Files to Create/Modify

### Database
- `server/database/schema.sql` - Add hero_themes table
- `server/scripts/migrate-hero-themes.cjs` - Migration script

### API
- `server/api/admin/hero-themes/index.get.ts`
- `server/api/admin/hero-themes/index.post.ts`
- `server/api/admin/hero-themes/[id].put.ts`
- `server/api/admin/hero-themes/[id].delete.ts`
- `server/api/admin/hero-themes/[id]/activate.put.ts`
- `server/api/hero-theme/active.get.ts`

### Admin UI
- `pages/admin/hero-themes.vue` - Main management page
- Update `layouts/admin.vue` - Add menu item

### Public Website
- Update `components/HeroSection.vue` - Dynamic theme loading

### Utils
- `server/utils/upload.ts` - Image upload utility

## 🔐 Security Considerations
- File upload validation (type, size, malware)
- Permission checks for all admin operations
- Secure file serving from public directory

## 🎨 UI/UX Considerations
- Image preview in admin table
- Drag & drop upload
- Loading states during upload
- Confirmation dialogs for delete
- Responsive design for mobile admin

## 📊 Success Criteria
- [ ] Admin can upload new theme images
- [ ] Admin can activate/deactivate themes
- [ ] Only one theme active at a time
- [ ] Public website shows active theme
- [ ] Proper error handling and validation
- [ ] Mobile-responsive admin interface
