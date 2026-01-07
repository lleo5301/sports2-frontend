import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import api from '../api'
import MockAdapter from 'axios-mock-adapter'
import csrfService from '../csrf'

describe('api axios instance', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(api)
    // Clear any cached CSRF tokens
    csrfService.clearCsrfToken()
  })

  afterEach(() => {
    mock.restore()
  })

  it('is configured with withCredentials for cookie support', () => {
    expect(api.defaults.withCredentials).toBe(true)
  })

  it('includes CSRF token header for POST requests', async () => {
    // Set a mock CSRF token
    csrfService.setCsrfToken('test-csrf-token')

    mock.onPost('/test').reply((config) => {
      expect(config.headers['X-CSRF-Token']).toBe('test-csrf-token')
      return [200, { ok: true }]
    })

    const res = await api.post('/test', { data: 'test' })
    expect(res.data.ok).toBe(true)
  })

  it('does not include CSRF token for GET requests', async () => {
    csrfService.setCsrfToken('test-csrf-token')

    mock.onGet('/test').reply((config) => {
      expect(config.headers['X-CSRF-Token']).toBeUndefined()
      return [200, { ok: true }]
    })

    const res = await api.get('/test')
    expect(res.data.ok).toBe(true)
  })

  it('redirects to /login on 401 without clearing localStorage', async () => {
    const originalLocation = window.location
    delete window.location
    window.location = { href: '', assign: vi.fn() }

    mock.onGet('/auth-required').reply(401, { error: 'Not authorized' })

    await expect(api.get('/auth-required')).rejects.toBeTruthy()

    // Should redirect to login
    expect(window.location.href).toContain('/login')

    // Note: No localStorage cleanup (cookies handled by backend)

    window.location = originalLocation
  })

  it('refreshes CSRF token and retries on 403 CSRF error', async () => {
    csrfService.setCsrfToken('old-token')

    let requestCount = 0

    mock.onPost('/test').reply((config) => {
      requestCount++
      if (requestCount === 1) {
        // First request fails with CSRF error
        return [403, { error: 'Invalid or missing CSRF token' }]
      } else {
        // Second request succeeds (after token refresh)
        expect(config.headers['X-CSRF-Token']).toBe('new-token')
        return [200, { ok: true }]
      }
    })

    // Mock CSRF token refresh endpoint
    mock.onGet('/auth/csrf-token').reply(200, { token: 'new-token' })

    const res = await api.post('/test', { data: 'test' })

    expect(requestCount).toBe(2)
    expect(res.data.ok).toBe(true)
    expect(csrfService.getCsrfToken()).toBe('new-token')
  })
})
