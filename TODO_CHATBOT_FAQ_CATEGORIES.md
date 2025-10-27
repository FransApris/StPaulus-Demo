# TODO: Implement Dynamic Chatbot FAQ Categories Management

## Overview
Add dynamic category management for Chatbot FAQ system to replace hardcoded categories.

## Tasks

### Backend
- [ ] Create `chatbot_faq_categories` table in schema.sql
- [ ] Create migration script to add the table
- [ ] Create API endpoints for categories CRUD:
  - GET /api/admin/chatbot-faq-categories
  - POST /api/admin/chatbot-faq-categories
  - PUT /api/admin/chatbot-faq-categories/[id]
  - DELETE /api/admin/chatbot-faq-categories/[id]
- [ ] Add RBAC permissions for category management

### Frontend
- [ ] Create new admin page: `pages/admin/chatbot-faq-categories.vue`
- [ ] Update `pages/admin/chatbot-faqs.vue` to use dynamic categories
- [ ] Add menu item in `layouts/admin.vue` under "Manajemen Konten"
- [ ] Update permissions in admin layout

### Database & Seeding
- [ ] Create seed script for initial categories
- [ ] Migrate existing FAQ categories to new system

### Testing
- [ ] Test category CRUD operations
- [ ] Test FAQ creation with dynamic categories
- [ ] Verify chatbot functionality with new categories
