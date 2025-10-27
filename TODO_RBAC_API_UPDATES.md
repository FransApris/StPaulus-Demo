# TODO: Update API Endpoints for RBAC

## Admin API Endpoints to Update
- [ ] server/api/admin/users/index.get.ts - requirePermission('manage_users') or requireUserManagementPermission
- [ ] server/api/admin/rooms/index.get.ts - requirePermission('manage_rooms')
- [ ] server/api/admin/bookings/index.get.ts - requirePermission('manage_bookings')
- [ ] server/api/admin/chatbot-faqs/index.get.ts - requirePermission('manage_chatbot_faqs')
- [ ] server/api/admin/chatbot-faqs/index.post.ts - requirePermission('manage_chatbot_faqs')
- [ ] server/api/admin/chatbot-faqs/[id].put.ts - requirePermission('manage_chatbot_faqs')
- [ ] server/api/admin/chatbot-faqs/[id].delete.ts - requirePermission('manage_chatbot_faqs')

## Other Endpoints
- [ ] server/api/admin/login.post.ts - update role check
- [ ] server/api/bookings/[id].patch.ts - update role check
- [ ] server/api/bookings.get.ts - update role check

## Permissions Mapping
- manage_users: super_admin only
- manage_users_komsos_sekretariat: admin_sekretariat (for managing komsos and sekretariat users)
- manage_rooms: admin_sekretariat
- manage_bookings: admin_sekretariat
- manage_articles: admin_komsos
- manage_news: admin_komsos
- manage_gallery: admin_komsos
- manage_chatbot_faqs: admin_komsos
- manage_agenda: admin_sekretariat
- manage_contact_messages: admin_sekretariat
- etc.
