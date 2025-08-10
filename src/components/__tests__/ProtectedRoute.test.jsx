import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute'
import { AuthProvider } from '../../contexts/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as authService from '../../services/auth'

const Page = ({ text }) => <div>{text}</div>

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
  })

  it('redirects unauthenticated users to /login', () => {
    renderWithRouter(
      <Routes>
        <Route path="/protected" element={<ProtectedRoute><Page text="protected" /></ProtectedRoute>} />
        <Route path="/login" element={<Page text="login" />} />
      </Routes>,
      { route: '/protected' }
    )

    expect(screen.getByText('login')).toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    window.localStorage.setItem('token', 'abc')
    vi.spyOn(authService, 'getProfile').mockResolvedValue({ id: 1, role: 'assistant' })
    renderWithRouter(
      <Routes>
        <Route path="/protected" element={<ProtectedRoute><Page text="protected" /></ProtectedRoute>} />
        <Route path="/login" element={<Page text="login" />} />
      </Routes>,
      { route: '/protected' }
    )
    return waitFor(() => {
      expect(screen.getByText('protected')).toBeInTheDocument()
    })
  })
})


