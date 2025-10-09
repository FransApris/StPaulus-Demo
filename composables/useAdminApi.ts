export const useAdminApi = () => {
  const makeRequest = async (url: string, options: any = {}) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    }
    return $fetch(url, options)
  }

  return {
    makeRequest
  }
}
