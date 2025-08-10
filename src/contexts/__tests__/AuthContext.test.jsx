import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as authService from '../../services/auth'

const TestConsumer = () => {
  const { user, loading, login, logout, updateUser, isAuthenticated, isHeadCoach } = useAuth()
  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="isAuthenticated">{String(isAuthenticated)}</div>
      <div data-testid="isHeadCoach">{String(isHeadCoach)}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : ''}</div>
      <button onClick={() => login({ id: 1, role: 'head_coach' }, 'token-123')}>login</button>
      <button onClick={() => logout()}>logout</button>
      <button onClick={() => updateUser({ id: 1, role: 'assistant' })}>updateUser</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('initializes without token', async () => {
    const queryClient = new QueryClient()
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      </QueryClientProvider>
    )
    expect(screen.getByTestId('loading').textContent).toBe('false')
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false')
  })

  it('loads profile when token exists', async () => {
    window.localStorage.setItem('token', 'abc')
    vi.spyOn(authService, 'getProfile').mockResolvedValue({ id: 10, role: 'head_coach' })

    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      </QueryClientProvider>
    )

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true')
    expect(JSON.parse(screen.getByTestId('user').textContent)).toEqual({ id: 10, role: 'head_coach' })
  })

  it('login stores token and sets user', async () => {
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      </QueryClientProvider>
    )

    screen.getByText('login').click()
    expect(window.localStorage.getItem('token')).toBe('token-123')
    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true')
      expect(screen.getByTestId('isHeadCoach').textContent).toBe('true')
    })
  })

  it('logout clears token and user', () => {
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      </QueryClientProvider>
    )

    screen.getByText('login').click()
    screen.getByText('logout').click()
    expect(window.localStorage.getItem('token')).toBe(null)
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false')
  })

  it('updateUser updates user state', async () => {
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      </QueryClientProvider>
    )

    screen.getByText('login').click()
    screen.getByText('updateUser').click()
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).not.toBe('')
      expect(JSON.parse(screen.getByTestId('user').textContent)).toEqual({ id: 1, role: 'assistant' })
      expect(screen.getByTestId('isHeadCoach').textContent).toBe('false')
    })
  })
})


