/**
 * Vendors API - vendor contacts CRUD.
 */

import api from './api'

function unwrap<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success ? res.data : undefined
}

export interface Vendor {
  id: number
  company_name?: string
  contact_name?: string
  email?: string
  phone?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface VendorCreateInput {
  company_name: string
  contact_name?: string
  email?: string
  phone?: string
  notes?: string
}

export interface VendorsListParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export const vendorsApi = {
  list: async (params?: VendorsListParams) => {
    const r = await api.get<{
      success?: boolean
      data?: Vendor[]
      pagination?: { page: number; limit: number; total: number; pages: number }
    }>('/vendors', { params })
    const data = unwrap(r.data as { success?: boolean; data?: Vendor[] })
    const pagination =
      (r.data as { pagination?: PaginatedResponse<Vendor>['pagination'] })
        ?.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 }
    return { data: data ?? [], pagination } as PaginatedResponse<Vendor>
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: Vendor }>(
      `/vendors/${id}`
    )
    return unwrap(r.data as { success?: boolean; data?: Vendor })
  },

  create: async (data: VendorCreateInput) => {
    const r = await api.post<{ success?: boolean; data?: Vendor }>(
      '/vendors',
      data
    )
    return unwrap(r.data as { success?: boolean; data?: Vendor })
  },

  update: async (id: number, data: Partial<VendorCreateInput>) => {
    const r = await api.put<{ success?: boolean; data?: Vendor }>(
      `/vendors/${id}`,
      data
    )
    return unwrap(r.data as { success?: boolean; data?: Vendor })
  },

  delete: async (id: number) => {
    await api.delete(`/vendors/${id}`)
  },
}
