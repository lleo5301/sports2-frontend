/**
 * Coaches API - external coach contacts CRUD.
 */

import api from './api'

function unwrap<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success ? res.data : undefined
}

export interface Coach {
  id: number
  first_name?: string
  last_name?: string
  school_name?: string
  position?: string
  email?: string
  phone?: string
  notes?: string
  status?: string
  created_at?: string
  updated_at?: string
}

export interface CoachCreateInput {
  first_name: string
  last_name: string
  school_name: string
  position?: string
  email?: string
  phone?: string
  notes?: string
}

export interface CoachesListParams {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export const coachesApi = {
  list: async (params?: CoachesListParams) => {
    const r = await api.get<{
      success?: boolean
      data?: Coach[]
      pagination?: { page: number; limit: number; total: number; pages: number }
    }>('/coaches', { params })
    const data = unwrap(r.data as { success?: boolean; data?: Coach[] })
    const pagination =
      (r.data as { pagination?: PaginatedResponse<Coach>['pagination'] })
        ?.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 }
    return { data: data ?? [], pagination } as PaginatedResponse<Coach>
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: Coach }>(
      `/coaches/${id}`
    )
    return unwrap(r.data as { success?: boolean; data?: Coach })
  },

  create: async (data: CoachCreateInput) => {
    const r = await api.post<{ success?: boolean; data?: Coach }>(
      '/coaches',
      data
    )
    return unwrap(r.data as { success?: boolean; data?: Coach })
  },

  update: async (id: number, data: Partial<CoachCreateInput>) => {
    const r = await api.put<{ success?: boolean; data?: Coach }>(
      `/coaches/${id}`,
      data
    )
    return unwrap(r.data as { success?: boolean; data?: Coach })
  },

  delete: async (id: number) => {
    await api.delete(`/coaches/${id}`)
  },
}
