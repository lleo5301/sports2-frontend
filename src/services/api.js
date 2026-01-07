import axios from 'axios'
import toast from 'react-hot-toast'
import csrfService from './csrf'

// Re-export CSRF service functions for backward compatibility
export const getCsrfToken = csrfService.getCsrfToken
export const setCsrfToken = csrfService.setCsrfToken
export const fetchCsrfToken = csrfService.fetchCsrfToken

// Create axios instance with cookie support
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
})

// Request interceptor to add CSRF token for state-changing requests
api.interceptors.request.use(
  async (config) => {
    // Add CSRF token for state-changing requests (POST, PUT, PATCH, DELETE)
    const requiresCsrf = ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())

    if (requiresCsrf) {
      const token = csrfService.getCsrfToken()
      if (token) {
        config.headers['X-CSRF-Token'] = token
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const message = error.response?.data?.error || 'An error occurred'

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Session expired or invalid - redirect to login
      // Cookie will be cleared by backend or browser
      window.location.href = '/login'
      toast.error('Session expired. Please log in again.')
    } else if (error.response?.status === 403 && error.response?.data?.error?.includes('CSRF')) {
      // CSRF token invalid or missing - fetch new token and retry
      try {
        await csrfService.refreshCsrfToken()
        // Retry the original request with new CSRF token
        return api.request(error.config)
      } catch (csrfError) {
        toast.error('Security token expired. Please try again.')
        return Promise.reject(error)
      }
    } else {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api 