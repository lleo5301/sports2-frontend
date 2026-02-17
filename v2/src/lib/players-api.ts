/**
 * Players API - roster CRUD.
 */

import api from './api'

function unwrap<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success ? res.data : undefined
}

export interface Player {
  id: number
  first_name?: string
  last_name?: string
  position?: string
  school_type?: string
  school?: string
  city?: string
  state?: string
  graduation_year?: number
  status?: string
  team_id?: number
  created_at?: string
  updated_at?: string
}

export interface PlayerCreateInput {
  first_name: string
  last_name: string
  position: string
  school_type?: string
  school?: string
  city?: string
  state?: string
  graduation_year?: number
  weight?: number
  height?: string
  email?: string
  phone?: string
}

export interface PlayersListParams {
  page?: number
  limit?: number
  school_type?: string
  position?: string
  status?: string
  search?: string
  orderBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export const playersApi = {
  list: async (params?: PlayersListParams) => {
    const r = await api.get<{
      success?: boolean
      data?: Player[]
      pagination?: { page: number; limit: number; total: number; pages: number }
    }>('/players', { params })
    const data = unwrap(r.data as { success?: boolean; data?: Player[] })
    const pagination = (r.data as { pagination?: PaginatedResponse<Player>['pagination'] })
      ?.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 }
    return { data: data ?? [], pagination } as PaginatedResponse<Player>
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: Player }>(
      `/players/byId/${id}`
    )
    return unwrap(r.data as { success?: boolean; data?: Player })
  },

  create: async (data: PlayerCreateInput) => {
    const r = await api.post<{ success?: boolean; data?: Player }>(
      '/players',
      data
    )
    return unwrap(r.data as { success?: boolean; data?: Player })
  },

  update: async (id: number, data: Partial<PlayerCreateInput>) => {
    const r = await api.put<{ success?: boolean; data?: Player }>(
      `/players/byId/${id}`,
      data
    )
    return unwrap(r.data as { success?: boolean; data?: Player })
  },

  delete: async (id: number) => {
    await api.delete(`/players/byId/${id}`)
  },

  bulkDelete: async (playerIds: number[]) => {
    await api.post('/players/bulk-delete', { player_ids: playerIds })
  },
}
