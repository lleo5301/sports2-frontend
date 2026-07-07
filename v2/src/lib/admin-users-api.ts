/**
 * Admin user management API (super_admin only).
 * Wraps /api/v1/auth/admin/* and maps backend snake_case to camelCase.
 */
import api from './api'

export type AdminRole = 'super_admin' | 'head_coach' | 'assistant_coach'

export interface AdminUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: AdminRole
  isActive: boolean
  teamName?: string
  createdAt?: string
  updatedAt?: string
}

export interface AdminUserCreateInput {
  email: string
  password: string
  first_name: string
  last_name: string
  role: AdminRole
  phone?: string
}

export interface AdminUserUpdateInput {
  email?: string
  first_name?: string
  last_name?: string
  role?: AdminRole
  phone?: string
  is_active?: boolean
}

interface BackendUser {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string | null
  role: AdminRole
  is_active: boolean
  Team?: { id: number; name: string } | null
  created_at?: string
  updated_at?: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

function mapUser(u: BackendUser): AdminUser {
  return {
    id: u.id,
    firstName: u.first_name,
    lastName: u.last_name,
    email: u.email,
    phone: u.phone ?? undefined,
    role: u.role,
    isActive: u.is_active,
    teamName: u.Team?.name,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
  }
}

export const adminUsersApi = {
  list: async (params?: {
    search?: string
    role?: AdminRole
    is_active?: boolean
    page?: number
    limit?: number
  }) => {
    const r = await api.get<{
      success?: boolean
      data?: BackendUser[]
      pagination?: Pagination
    }>('/auth/admin/users', { params })
    const users = (r.data?.data ?? []).map(mapUser)
    const pagination = r.data?.pagination ?? {
      page: 1,
      limit: 20,
      total: users.length,
      pages: 1,
    }
    return { users, pagination }
  },

  create: async (input: AdminUserCreateInput) => {
    const r = await api.post<{ success?: boolean; data?: BackendUser }>(
      '/auth/admin/users',
      input
    )
    return mapUser(r.data!.data!)
  },

  update: async (id: number, input: AdminUserUpdateInput) => {
    const r = await api.put<{ success?: boolean; data?: BackendUser }>(
      `/auth/admin/users/${id}`,
      input
    )
    return mapUser(r.data!.data!)
  },

  remove: async (id: number) => {
    await api.delete(`/auth/admin/users/${id}`)
  },

  resetPassword: async (id: number, newPassword?: string) => {
    const r = await api.put<{
      success?: boolean
      data?: { temporaryPassword?: string; email_sent?: boolean }
    }>(`/auth/admin/users/${id}/reset-password`, {
      ...(newPassword ? { new_password: newPassword } : {}),
    })
    return {
      temporaryPassword: r.data?.data?.temporaryPassword,
      emailSent: !!r.data?.data?.email_sent,
    }
  },
}
