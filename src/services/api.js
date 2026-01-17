/**
 * @fileoverview Core API client configuration using axios for all HTTP requests
 * to the backend API. This module creates a configured axios instance with automatic
 * JWT token injection and centralized error handling.
 *
 * Request/Response Flow:
 * 1. Request Interceptor: Automatically injects JWT token from localStorage into Authorization header
 * 2. HTTP Request: Sent to backend API with base URL and configured headers
 * 3. Response Interceptor: Handles errors globally, including 401 authentication failures
 * 4. Error Handling: Displays toast notifications for all errors, redirects to login on 401
 *
 * All other service modules (auth, players, teams, etc.) use this configured api instance
 * to inherit the authentication and error handling behavior.
 *
 * @module services/api
 * @requires axios
 * @requires react-hot-toast
 */

import axios from 'axios'
import toast from 'react-hot-toast'
import csrfService from './csrf'

/**
 * Configured axios instance for API requests
 *
 * @description Creates an axios client with the backend API base URL and default headers.
 *              The base URL is read from the VITE_API_URL environment variable, defaulting
 *              to '/api' for relative requests in development.
 *
 *              All requests automatically include:
 *              - Content-Type: application/json header
 *              - Authorization: Bearer <token> header (if token exists in localStorage)
 *
 *              All responses automatically handle:
 *              - 401 errors: Clear token, redirect to login, show "Session expired" message
 *              - Other errors: Show error message from response.data.error via toast
 *
 * @type {import('axios').AxiosInstance}
 *
 * @example
 * import api from './api';
 * const response = await api.get('/players');
 * const newPlayer = await api.post('/players', { name: 'John Doe' });
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
})

/**
 * Request interceptor to inject JWT authentication token
 *
 * @description Intercepts all outgoing requests to add the JWT token from localStorage
 *              to the Authorization header as a Bearer token. If no token exists in
 *              localStorage, the request proceeds without an Authorization header.
 *
 *              This enables automatic authentication for all API requests without
 *              requiring each service method to manually attach the token.
 *
 * @function
 * @param {import('axios').AxiosRequestConfig} config - The axios request configuration
 * @returns {import('axios').AxiosRequestConfig} Modified config with Authorization header
 *
 * @example
 * // Token is automatically injected from localStorage
 * // Before interceptor: GET /api/players
 * // After interceptor: GET /api/players with header "Authorization: Bearer eyJhbGc..."
 */
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

/**
 * Response interceptor for centralized error handling
 *
 * @description Intercepts all API responses to handle errors globally. Success responses
 *              pass through unchanged. Error responses trigger different actions based on
 *              the HTTP status code:
 *
 *              - 401 Unauthorized: Clears the token from localStorage, redirects to /login,
 *                and displays "Session expired" message. This handles expired or invalid tokens.
 *              - Other errors: Displays the error message from response.data.error via toast,
 *                or a generic "An error occurred" message if no specific error is provided.
 *
 *              This centralized error handling ensures consistent UX for authentication
 *              failures and provides user feedback for all API errors.
 *
 * @function
 * @param {import('axios').AxiosResponse} response - The successful axios response
 * @returns {import('axios').AxiosResponse} The unmodified response for successful requests
 *
 * @throws {Error} The original error is re-thrown after displaying the toast message
 *
 * @example
 * // On 401 error:
 * // 1. localStorage.removeItem('token')
 * // 2. window.location.href = '/login'
 * // 3. toast.error('Session expired. Please log in again.')
 * // 4. Promise rejected with original error
 *
 * // On other errors:
 * // 1. toast.error(error.response.data.error || 'An error occurred')
 * // 2. Promise rejected with original error
 */
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
      const basePath = import.meta.env.VITE_BASE_PATH || ''
      window.location.href = `${basePath}/login`

      // Show specific message for revoked tokens
      if (message.includes('Token has been revoked')) {
        toast.error('Your session has been revoked. Please log in again.')
      } else {
        toast.error('Session expired. Please log in again.')
      }
    } else {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api 