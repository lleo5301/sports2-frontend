/**
 * Scouts API - scout contacts CRUD.
 */

import api from './api'

function unwrap<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success ? res.data : undefined
}

export interface Scout {
  id: number
  first_name?: string
  last_name?: string
  organization?: string
  email?: string
  phone?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface ScoutCreateInput {
  first_name: string
  last_name: string
  organization?: string
  email?: string
  phone?: string
  notes?: string
}

export interface ScoutsListParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export const scoutsApi = {
  list: async (params?: ScoutsListParams) => {
    const r = await api.get<{
      success?: boolean
      data?: Scout[]
      pagination?: { page: number; limit: number; total: number; pages: number }
    }>('/scouts', { params })
    const data = unwrap(r.data as { success?: boolean; data?: Scout[] })
    const pagination =
      (r.data as { pagination?: PaginatedResponse<Scout>['pagination'] })
        ?.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 }
    return { data: data ?? [], pagination } as PaginatedResponse<Scout>
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: Scout }>(
      `/scouts/${id}`
    )
    return unwrap(r.data as { success?: boolean; data?: Scout })
  },

  create: async (data: ScoutCreateInput) => {
    const r = await api.post<{ success?: boolean; data?: Scout }>(
      '/scouts',
      data
    )
    return unwrap(r.data as { success?: boolean; data?: Scout })
  },

  update: async (id: number, data: Partial<ScoutCreateInput>) => {
    const r = await api.put<{ success?: boolean; data?: Scout }>(
      `/scouts/${id}`,
      data
    )
    return unwrap(r.data as { success?: boolean; data?: Scout })
  },

  delete: async (id: number) => {
    await api.delete(`/scouts/${id}`)
  },
}
