/**
 * Tournaments API — GET /tournaments (paginated) and GET /tournaments/:id/games
 * Tournaments are sync-only (from Presto schedule sync).
 */

import api from './api'
import type { Game } from './games-api'

function getData<T>(res: { success?: boolean; data?: T; [k: string]: unknown }): T | undefined {
  return res?.success !== false && res?.data !== undefined ? (res.data as T) : undefined
}

export interface Tournament {
  id: number
  team_id: number
  season?: string | null
  season_name?: string | null
  name: string
  tournament_type?: 'tournament' | 'invitational' | 'scrimmage' | null
  game_count?: number
  created_at?: string
  updated_at?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export const tournamentsApi = {
  list: async (params?: { page?: number; limit?: number; season?: string }) => {
    const r = await api.get<{
      success?: boolean
      data?: Tournament[]
      pagination?: { page: number; limit: number; total: number; pages: number }
    }>('/tournaments', { params })
    const data = getData(r.data as { success?: boolean; data?: Tournament[] })
    const pagination =
      (r.data as { pagination?: PaginatedResponse<Tournament>['pagination'] })?.pagination ?? {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      }
    return { data: data ?? [], pagination } as PaginatedResponse<Tournament>
  },

  /** Returns { tournament, games } per OpenAPI — games ordered by date */
  getGames: async (id: number) => {
    const r = await api.get<{
      success?: boolean
      data?: { tournament?: Tournament; games?: Game[] }
    }>(`/tournaments/${id}/games`)
    const data = getData(r.data as { success?: boolean; data?: { tournament?: Tournament; games?: Game[] } })
    if (!data) return { tournament: undefined, games: [] }
    const games = Array.isArray(data.games) ? data.games : []
    return { tournament: data.tournament, games }
  },
}
