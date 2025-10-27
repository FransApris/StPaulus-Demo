# TODO: Fix RBAC API Authorization Issues

## Step 1: Run RBAC Migration Scripts
- [x] Run `server/scripts/setup-rbac.cjs` to ensure RBAC tables are set up
- [x] Run `server/scripts/migrate-to-rbac.cjs` to migrate users to RBAC system
- [x] Run `server/scripts/fix-existing-user-roles.cjs` to fix any role issues
- [x] Run `server/scripts/seed-test-users.cjs` to seed test users with proper roles

## Step 2: Update Admin API Endpoints with requirePermission
- [ ] server/api/admin/users/index.get.ts - add requirePermission('manage_users') or requireUserManagementPermission
- [ ] server/api/admin/rooms/index.get.ts - add requirePermission('manage_rooms')
- [ ] server/api/admin/bookings/index.get.ts - already has requirePermission('manage_bookings'), verify working
- [ ] server/api/admin/chatbot-faqs/index.get.ts - add requirePermission('manage_chatbot_faqs')
- [ ] server/api/admin/chatbot-faqs/index.post.ts - add requirePermission('manage_chatbot_faqs')
- [ ] server/api/admin/chatbot-faqs/[id].put.ts - add requirePermission('manage_chatbot_faqs')
- [ ] server/api/admin/chatbot-faqs/[id].delete.ts - add requirePermission('manage_chatbot_faqs')
- [ ] server/api/admin/articles/index.get.ts - add requirePermission('manage_articles')
- [ ] server/api/admin/news/index.get.ts - add requirePermission('manage_news')
- [ ] server/api/admin/agenda/index.get.ts - add requirePermission('manage_agenda')

## Step 3: Update Other Endpoints
- [ ] server/api/admin/login.post.ts - update role check if needed
- [ ] server/api/bookings/[id].patch.ts - replace role check with requirePermission('manage_bookings')
- [ ] server/api/bookings.get.ts - update role check to use permissions

## Step 4: Test and Verify
- [ ] Restart the development server
- [ ] Test admin login and access to protected endpoints
- [ ] Verify 401 and 403 errors are resolved
- [ ] Check database for proper user roles and permissions
