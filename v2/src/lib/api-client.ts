/**
 * Sports2 API client wrapper.
 * Configures base URL from env, credentials (cookies), CSRF for mutations.
 * Uses the OpenAPI-generated DefaultApi.
 */

import { Configuration } from '@/api-client/runtime'
import { DefaultApi } from '@/api-client/apis/DefaultApi'
import csrfService from './csrf'

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

// OpenAPI paths include /api/v1; server base is origin only
// Use '' for relative URLs (proxy mode) so requests stay same-origin
const serverBase =
  API_BASE.startsWith('/') || API_BASE === ''
    ? ''
    : API_BASE.replace(/\/api\/v1\/?$/, '') || 'http://localhost:5000'

const csrfMiddleware = {
  pre: async (ctx: { init: RequestInit; url: string }) => {
    const method = ctx.init.method?.toUpperCase()
    if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      try {
        const token = await csrfService.ensureCsrfToken()
        if (token) {
          const headers = new Headers(ctx.init.headers)
          headers.set('X-CSRF-Token', token)
          return { url: ctx.url, init: { ...ctx.init, headers } }
        }
      } catch {
        // Continue; server will reject if CSRF required
      }
    }
  },
}

const config = new Configuration({
  basePath: serverBase,
  credentials: 'include',
  middleware: [csrfMiddleware],
})

export const apiClient = new DefaultApi(config)

/**
 * Unwrap API response: { success, data } -> data.
 * Throws if success is false.
 */
export function unwrap<T>(response: { success?: boolean; data?: T }): T {
  if (response?.success !== true) {
    throw new Error(
      (response as { error?: string })?.error ?? 'Request failed'
    )
  }
  return response.data as T
}
