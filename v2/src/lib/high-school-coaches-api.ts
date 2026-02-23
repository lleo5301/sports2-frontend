/**
 * High School Coaches API - HS coach contacts CRUD.
 */

import api from './api'

function unwrap<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success ? res.data : undefined
}

export interface HighSchoolCoach {
  id: number
  first_name?: string
  last_name?: string
  school_name?: string
  position?: string
  email?: string
  phone?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface HighSchoolCoachCreateInput {
  first_name: string
  last_name: string
  school_name: string
  position?: string
  email?: string
  phone?: string
}

export interface HighSchoolCoachesListParams {
  page?: number
  limit?: number
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export const highSchoolCoachesApi = {
  list: async (params?: HighSchoolCoachesListParams) => {
    const r = await api.get<{
      success?: boolean
      data?: HighSchoolCoach[]
      pagination?: { page: number; limit: number; total: number; pages: number }
    }>('/high-school-coaches', { params })
    const data = unwrap(r.data as { success?: boolean; data?: HighSchoolCoach[] })
    const pagination =
      (r.data as {
        pagination?: PaginatedResponse<HighSchoolCoach>['pagination']
      })?.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 }
    return { data: data ?? [], pagination } as PaginatedResponse<HighSchoolCoach>
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: HighSchoolCoach }>(
      `/high-school-coaches/${id}`
    )
    return unwrap(r.data as { success?: boolean; data?: HighSchoolCoach })
  },

  create: async (data: HighSchoolCoachCreateInput) => {
    const r = await api.post<{ success?: boolean; data?: HighSchoolCoach }>(
      '/high-school-coaches',
      data
    )
    return unwrap(r.data as { success?: boolean; data?: HighSchoolCoach })
  },

  update: async (id: number, data: Partial<HighSchoolCoachCreateInput>) => {
    const r = await api.put<{ success?: boolean; data?: HighSchoolCoach }>(
      `/high-school-coaches/${id}`,
      data
    )
    return unwrap(r.data as { success?: boolean; data?: HighSchoolCoach })
  },

  delete: async (id: number) => {
    await api.delete(`/high-school-coaches/${id}`)
  },
}
