/**
 * Auth service: login, register, getProfile, logout.
 * JWT is in httpOnly cookie; responses use { success, data }.
 */

import api from './api'

export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  name?: string
  role?: string
  phone?: string
  avatar?: string
  created_at?: string
  updated_at?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  role: 'head_coach' | 'assistant_coach'
  phone?: string
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await api.post<{ success: boolean; data: User }>(
    '/auth/login',
    credentials
  )
  return response.data.data
}

export async function register(data: RegisterData): Promise<User> {
  const response = await api.post<{ success: boolean; data: User }>(
    '/auth/register',
    data
  )
  return response.data.data
}

export async function getProfile(): Promise<User> {
  const response = await api.get<{ success: boolean; data: User }>('/auth/me')
  return response.data.data
}

export async function updateProfile(
  profileData: Partial<Pick<User, 'first_name' | 'last_name' | 'phone'>>
): Promise<User> {
  const response = await api.put<{ success: boolean; data: User }>(
    '/auth/me',
    profileData
  )
  return response.data.data
}

export async function changePassword(data: {
  current_password: string
  new_password: string
}): Promise<void> {
  await api.put('/auth/change-password', data)
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } finally {
    // Always clear local state; cookie is cleared by backend
  }
}
