/**
 * CSRF token management for Cross-Site Request Forgery protection.
 * Token caching, refresh on expiration, and integration with axios.
 */

import axios from 'axios'

let cachedToken: string | null = null
let tokenFetchPromise: Promise<string> | null = null
let tokenFetchedAt: number | null = null

const TOKEN_CACHE_DURATION =
  parseInt(import.meta.env.VITE_CSRF_TOKEN_CACHE_DURATION || '', 10) ||
  30 * 60 * 1000

const getBaseUrl = () => import.meta.env.VITE_API_URL || '/api/v1'

export function getCsrfToken(): string | null {
  return cachedToken
}

export function setCsrfToken(token: string | null): void {
  cachedToken = token
  tokenFetchedAt = token ? Date.now() : null
}

export function isTokenExpired(): boolean {
  if (!cachedToken || !tokenFetchedAt) return true
  return Date.now() - tokenFetchedAt > TOKEN_CACHE_DURATION
}

export async function fetchCsrfToken(): Promise<string> {
  if (tokenFetchPromise) return tokenFetchPromise

  tokenFetchPromise = (async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}/auth/csrf-token`, {
        withCredentials: true,
      })
      const token = response.data?.token
      if (!token) throw new Error('CSRF token not found in response')
      setCsrfToken(token)
      return token
    } catch (error) {
      setCsrfToken(null)
      throw error
    } finally {
      tokenFetchPromise = null
    }
  })()

  return tokenFetchPromise
}

export async function refreshCsrfToken(): Promise<string> {
  return fetchCsrfToken()
}

export async function ensureCsrfToken(): Promise<string> {
  if (cachedToken && !isTokenExpired()) return cachedToken
  return fetchCsrfToken()
}

export function clearCsrfToken(): void {
  setCsrfToken(null)
}

export async function initializeCsrf(): Promise<string | null> {
  try {
    return await fetchCsrfToken()
  } catch {
    return null
  }
}

const csrfService = {
  getCsrfToken,
  setCsrfToken,
  fetchCsrfToken,
  refreshCsrfToken,
  ensureCsrfToken,
  isTokenExpired,
  clearCsrfToken,
  initializeCsrf,
}

export default csrfService
