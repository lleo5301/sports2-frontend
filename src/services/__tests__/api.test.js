import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '../api'
import MockAdapter from 'axios-mock-adapter'

describe('api axios instance', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(api)
    window.localStorage.clear()
  })

  it('attaches Authorization header when token exists', async () => {
    window.localStorage.setItem('token', 'xyz')
    mock.onGet('/test').reply((config) => {
      expect(config.headers.Authorization).toBe('Bearer xyz')
      return [200, { ok: true }]
    })
    const res = await api.get('/test')
    expect(res.data.ok).toBe(true)
  })

  it('redirects to /login on 401 and clears token', async () => {
    window.localStorage.setItem('token', 'xyz')
    const originalLocation = window.location
    delete window.location
    window.location = { href: '', assign: vi.fn() }
    mock.onGet('/auth-required').reply(401, { error: 'Not authorized' })
    await expect(api.get('/auth-required')).rejects.toBeTruthy()
    expect(window.localStorage.getItem('token')).toBe(null)
    expect(window.location.href).toContain('/login')
    window.location = originalLocation
  })
})


