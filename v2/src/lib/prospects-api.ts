/**
 * Prospects API - recruiting CRUD.
 */

import api from './api'

function unwrap<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success ? res.data : undefined
}

export const PROSPECT_STATUSES = [
  'identified',
  'evaluating',
  'contacted',
  'visiting',
  'offered',
  'committed',
  'signed',
  'passed',
] as const

export const SCHOOL_TYPES = [
  'HS',
  'JUCO',
  'D1',
  'D2',
  'D3',
  'NAIA',
  'Independent',
] as const

export const POSITIONS = [
  'P',
  'C',
  '1B',
  '2B',
  '3B',
  'SS',
  'LF',
  'CF',
  'RF',
  'OF',
  'DH',
  'UTL',
] as const

export interface Prospect {
  id: number
  first_name?: string
  last_name?: string
  primary_position?: string
  secondary_position?: string
  school_type?: string
  school_name?: string
  city?: string
  state?: string
  graduation_year?: number
  class_year?: string
  bats?: string
  throws?: string
  height?: string
  weight?: number
  status?: string
  notes?: string
  email?: string
  phone?: string
  team_id?: number
  created_at?: string
  updated_at?: string
}

export interface ProspectCreateInput {
  first_name: string
  last_name: string
  primary_position: string
  secondary_position?: string
  school_type?: string
  school_name?: string
  city?: string
  state?: string
  graduation_year?: number
  class_year?: string
  bats?: string
  throws?: string
  height?: string
  weight?: number
  status?: string
  notes?: string
  email?: string
  phone?: string
}

export interface ProspectListParams {
  page?: number
  limit?: number
  school_type?: string
  primary_position?: string
  status?: string
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export const prospectsApi = {
  list: async (params?: ProspectListParams) => {
    const r = await api.get<{
      success?: boolean
      data?: Prospect[]
      pagination?: { page: number; limit: number; total: number; pages: number }
    }>('/prospects', { params })
    const data = unwrap(r.data as { success?: boolean; data?: Prospect[] })
    const pagination = (r.data as { pagination?: PaginatedResponse<Prospect>['pagination'] })
      ?.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 }
    return { data: data ?? [], pagination } as PaginatedResponse<Prospect>
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: Prospect }>(
      `/prospects/${id}`
    )
    return unwrap(r.data as { success?: boolean; data?: Prospect })
  },

  create: async (data: ProspectCreateInput) => {
    const r = await api.post<{ success?: boolean; data?: Prospect }>(
      '/prospects',
      data
    )
    return unwrap(r.data as { success?: boolean; data?: Prospect })
  },

  update: async (id: number, data: Partial<ProspectCreateInput>) => {
    const r = await api.put<{ success?: boolean; data?: Prospect }>(
      `/prospects/${id}`,
      data
    )
    return unwrap(r.data as { success?: boolean; data?: Prospect })
  },

  delete: async (id: number) => {
    await api.delete(`/prospects/${id}`)
  },
}
