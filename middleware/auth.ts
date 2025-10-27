export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const token = sessionStorage.getItem('admin_token')
    if (!token) {
      return navigateTo('/admin/login')
    }
  }
})
