/**
 * Games API
 */

import api from './api'

function unwrap<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success ? res.data : undefined
}

export interface Game {
  id: number
  opponent?: string
  date?: string
  game_date?: string
  location?: string
  location_id?: number
  home_away?: string
  result?: string
  team_score?: number
  opponent_score?: number
  team_id?: number
  created_at?: string
  updated_at?: string
}

export interface GameCreateInput {
  opponent: string
  date: string
  location_id?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export const gamesApi = {
  list: async (params?: { page?: number; limit?: number }) => {
    const r = await api.get<{
      success?: boolean
      data?: Game[]
      pagination?: { page: number; limit: number; total: number; pages: number }
    }>('/games', { params })
    const data = unwrap(r.data as { success?: boolean; data?: Game[] })
    const pagination = (r.data as { pagination?: PaginatedResponse<Game>['pagination'] })
      ?.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 }
    return { data: data ?? [], pagination } as PaginatedResponse<Game>
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: Game }>(
      `/games/byId/${id}`
    )
    return unwrap(r.data as { success?: boolean; data?: Game })
  },

  create: async (data: GameCreateInput) => {
    const r = await api.post<{ success?: boolean; data?: Game }>(
      '/games',
      data
    )
    return unwrap(r.data as { success?: boolean; data?: Game })
  },

  update: async (id: number, data: Partial<GameCreateInput>) => {
    const r = await api.put<{ success?: boolean; data?: Game }>(
      `/games/byId/${id}`,
      data
    )
    return unwrap(r.data as { success?: boolean; data?: Game })
  },

  delete: async (id: number) => {
    await api.delete(`/games/byId/${id}`)
  },

  getUpcoming: async () => {
    const r = await api.get<{ success?: boolean; data?: Game[] }>(
      '/games/upcoming'
    )
    const data = unwrap(r.data as { success?: boolean; data?: Game[] })
    return Array.isArray(data) ? data : []
  },
}
