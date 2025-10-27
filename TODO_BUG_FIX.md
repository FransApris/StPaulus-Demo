# Bug Fix: Navigation Menu Redirect Issue

## Problem Description
When clicking on "Kelola Artikel", "Kategori Artikel / Berita", "Kelola Berita", or "Kelola Galeri" menus, the page redirects to Dashboard instead of the intended pages.

## Root Cause
Inconsistent token storage across the application:
- Login page stores token in `sessionStorage`
- Layout and dashboard use `sessionStorage`
- Affected pages (articles, news, gallery, article-categories) use `localStorage`
- When clicking menu, page checks `localStorage` (null), redirects to login
- Login finds token in `sessionStorage`, redirects to dashboard

## Solution
Update all admin pages to use `sessionStorage` consistently for token storage and retrieval.

## Files to Update
- pages/admin/articles.client.vue
- pages/admin/news.client.vue
- pages/admin/gallery.vue
- pages/admin/article-categories.vue

## Changes Needed
Replace `localStorage.getItem('admin_token')` with `sessionStorage.getItem('admin_token')`
Replace `localStorage.removeItem('admin_token')` with `sessionStorage.removeItem('admin_token')`
