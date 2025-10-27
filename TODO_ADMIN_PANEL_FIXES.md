# TODO: Fix Critical Admin Panel Issues

## Priority 1: Fix Users List Display (KRITIS)
- [ ] Debug RBAC filtering in `/api/admin/users/index.get.ts`
- [ ] Ensure super_admin can see all users regardless of role filtering
- [ ] Test API response with different user roles
- [ ] Verify frontend displays users correctly

## Priority 2: Fix Bookings Approve/Reject (KRITIS)
- [ ] Check permission validation in `/api/bookings/[id].patch.ts`
- [ ] Ensure super_admin has 'manage_bookings' permission
- [ ] Debug conflict checking logic for APPROVED status
- [ ] Improve error handling in `pages/admin/bookings.vue`
- [ ] Test approve/reject functionality

## Priority 3: Implement Edit Functionality
### Rooms Edit
- [ ] Add edit modal/form to `pages/admin/rooms.vue`
- [ ] Implement editRoom function to call PUT API
- [ ] Add form validation and error handling
- [ ] Test room editing functionality

### Users Edit
- [ ] Create PUT endpoint `/api/admin/users/[id].put.ts`
- [ ] Add edit modal/form to `pages/admin/users.vue`
- [ ] Implement editUser function to call PUT API
- [ ] Add form validation and error handling
- [ ] Test user editing functionality

## Testing
- [ ] End-to-end testing of all admin panel fixes
- [ ] Verify all CRUD operations work correctly
- [ ] Test with different user roles (super_admin, admin_komsos, admin_sekretariat)
