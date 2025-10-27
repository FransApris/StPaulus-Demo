# TODO: Implementasi Kelola Jenis Liturgi (CRUD) & Restrukturisasi Menu

## Overview
Implementasi fitur CRUD untuk mengelola Jenis Liturgi dengan restrukturisasi menu sidebar admin.

## Tasks

### 1. Restrukturisasi Sidebar Navigation
- [ ] Update `layouts/admin.vue` to change "Jadwal Misa Rutin" to "Kelola Jenis Liturgi" linking to `/admin/liturgy-types`

### 2. Add RBAC Permission
- [ ] Create `server/scripts/add-liturgy-types-permission.cjs` to add `manage_liturgy_types` permission
- [ ] Assign permission to super_admin role

### 3. Create CRUD API Endpoints
- [ ] Create `server/api/admin/liturgy-types/index.get.ts` (GET all liturgy types)
- [ ] Create `server/api/admin/liturgy-types/index.post.ts` (CREATE new liturgy type)
- [ ] Create `server/api/admin/liturgy-types/[id].put.ts` (UPDATE liturgy type)
- [ ] Create `server/api/admin/liturgy-types/[id].delete.ts` (DELETE liturgy type)
- [ ] Apply permission middleware to all endpoints

### 4. Create Frontend CRUD Page
- [ ] Create `pages/admin/liturgy-types.vue` with table and forms for CRUD operations
- [ ] Implement form validation and error handling
- [ ] Add loading states and success/error messages

### 5. Testing & Verification
- [ ] Run permission script to add manage_liturgy_types permission
- [ ] Test CRUD operations work correctly
- [ ] Verify sidebar navigation updates
- [ ] Ensure existing mass schedule functionality remains intact
- [ ] Test permission restrictions (only super_admin can access)

## Safety Notes
- Existing mass schedule endpoints and pages must remain unchanged
- No regressions in current functionality
- All new endpoints must have proper permission checks
