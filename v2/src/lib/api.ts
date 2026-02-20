/**
 * Core API client with axios: JWT via httpOnly cookies, CSRF for mutations.
 */

import axios from 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    skipErrorToast?: boolean
  }
}
import { toast } from 'sonner'
import csrfService from './csrf'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use(
  async (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    const method = config.method?.toLowerCase()
    if (method && ['post', 'put', 'patch', 'delete'].includes(method)) {
      try {
        const token = await csrfService.ensureCsrfToken()
        if (token) config.headers['X-CSRF-Token'] = token
      } catch {
        // Continue; server will reject if CSRF required
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const skipToast = (error.config as { skipErrorToast?: boolean })?.skipErrorToast
    if (skipToast) return Promise.reject(error)
    const message = error.response?.data?.error || 'An error occurred'
    if (error.response?.status === 401) {
      const basePath = import.meta.env.VITE_BASE_PATH || ''
      const path = window.location.pathname
      const isAuthPage = path.includes('/login') || path.includes('/register')
      const isAuthMe = error.config?.url?.includes('/auth/me')

      if (!isAuthPage && !isAuthMe) {
        window.location.href = `${basePath}/login`
        toast.error(
          message.includes('revoked')
            ? 'Your session has been revoked. Please log in again.'
            : 'Session expired. Please log in again.'
        )
      }
    } else {
      toast.error(message)
    }
    return Promise.reject(error)
  }
)

export default api
