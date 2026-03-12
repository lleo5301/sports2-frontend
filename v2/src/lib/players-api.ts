/**
 * Players API - roster CRUD and stats.
 */

import api from './api'

function getData<T>(res: { success?: boolean; data?: T; [k: string]: unknown }): T | undefined {
  return res?.success !== false && res?.data !== undefined ? (res.data as T) : undefined
}

export interface Player {
  id: number
  first_name?: string
  last_name?: string
  position?: string
  jersey_number?: number | string | null
  school_type?: string
  school?: string
  city?: string
  state?: string
  graduation_year?: number
  status?: string
  team_id?: number
  email?: string
  phone?: string
  height?: string | null
  weight?: number | null
  class_year?: string | null
  bats?: string | null
  throws?: string | null
  photo_url?: string | null
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
    const data = getData(r.data as { success?: boolean; data?: Player[] })
    const pagination = (r.data as { pagination?: PaginatedResponse<Player>['pagination'] })
      ?.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 }
    return { data: data ?? [], pagination } as PaginatedResponse<Player>
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: Player }>(
      `/players/byId/${id}`
    )
    return getData(r.data as { success?: boolean; data?: Player })
  },

  create: async (data: PlayerCreateInput) => {
    const r = await api.post<{ success?: boolean; data?: Player }>(
      '/players',
      data
    )
    return getData(r.data as { success?: boolean; data?: Player })
  },

  update: async (id: number, data: Partial<PlayerCreateInput>) => {
    const r = await api.put<{ success?: boolean; data?: Player }>(
      `/players/byId/${id}`,
      data
    )
    return getData(r.data as { success?: boolean; data?: Player })
  },

  delete: async (id: number) => {
    await api.delete(`/players/byId/${id}`)
  },

  bulkDelete: async (playerIds: number[]) => {
    await api.post('/players/bulk-delete', { player_ids: playerIds })
  },

  /** Player season & career statistics (from PlayerSeasonStats/PlayerCareerStats) */
  getStats: async (id: number, params?: { season?: string }) => {
    const r = await api.get<{ success?: boolean; data?: PlayerStatsResponse }>(
      `/players/byId/${id}/stats`,
      { params }
    )
    return getData(r.data as { success?: boolean; data?: PlayerStatsResponse })
  },

  /** Player video library (paginated) */
  getVideos: async (
    id: number,
    params?: { video_type?: string; page?: number; limit?: number }
  ) => {
    const r = await api.get<{
      success?: boolean
      data?: PlayerVideo[]
      pagination?: { page: number; limit: number; total: number; pages: number }
    }>(`/players/byId/${id}/videos`, { params })
    const data = getData(r.data as { success?: boolean; data?: PlayerVideo[] })
    const pagination =
      (r.data as { pagination?: PaginatedResponse<PlayerVideo>['pagination'] })
        ?.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 }
    return { data: data ?? [], pagination } as PaginatedResponse<PlayerVideo>
  },

  /** Team-level stats summary across all players */
  getStatsSummary: async () => {
    const r = await api.get<{ success?: boolean; data?: StatsSummary }>(
      '/players/stats/summary'
    )
    return getData(r.data as { success?: boolean; data?: StatsSummary })
  },

  /** Player performance rankings/data */
  getPerformance: async () => {
    const r = await api.get<{ success?: boolean; data?: PerformanceData }>(
      '/players/performance'
    )
    return getData(r.data as { success?: boolean; data?: PerformanceData })
  },
}

/** Player stats response (from /players/byId/:id/stats) */
export interface PlayerStatsResponse {
  player: {
    id: number
    first_name?: string
    last_name?: string
    position?: string
    jersey_number?: number | null
    class_year?: string | null
    bats?: string | null
    throws?: string | null
    photo_url?: string | null
  }
  current_season: PlayerSeasonStats | null
  seasons: PlayerSeasonStats[]
  career: PlayerCareerStats | null
}

export interface PlayerSeasonStats {
  id?: number
  player_id?: number
  team_id?: number
  season?: string
  season_name?: string
  games_played?: number
  games_started?: number
  at_bats?: number
  runs?: number
  hits?: number
  doubles?: number
  triples?: number
  home_runs?: number
  rbi?: number
  walks?: number
  strikeouts?: number
  stolen_bases?: number
  caught_stealing?: number
  hit_by_pitch?: number
  sacrifice_flies?: number
  sacrifice_bunts?: number
  batting_average?: string | null
  on_base_percentage?: string | null
  slugging_percentage?: string | null
  ops?: string | null
  pitching_appearances?: number
  pitching_starts?: number
  innings_pitched?: string
  pitching_wins?: number
  pitching_losses?: number
  saves?: number
  holds?: number
  hits_allowed?: number
  runs_allowed?: number
  earned_runs?: number
  walks_allowed?: number
  strikeouts_pitching?: number
  home_runs_allowed?: number
  era?: string | null
  whip?: string | null
  k_per_9?: string | null
  bb_per_9?: string | null
  fielding_games?: number
  putouts?: number
  assists?: number
  errors?: number
  fielding_percentage?: string | null
  source_system?: string
  last_synced_at?: string | null
  /** Raw Presto stats (short keys: gp, ab, ip, era, etc.) */
  raw_stats?: Record<string, string> | null
  split_stats?: Record<string, Record<string, string>> | null
  [key: string]: unknown
}

export interface PlayerCareerStats {
  id?: number
  player_id?: number
  seasons_played?: number
  career_games?: number
  career_at_bats?: number
  career_runs?: number
  career_hits?: number
  career_doubles?: number
  career_triples?: number
  career_home_runs?: number
  career_rbi?: number
  career_walks?: number
  career_strikeouts?: number
  career_stolen_bases?: number
  career_batting_average?: string | null
  career_obp?: string | null
  career_slg?: string | null
  career_ops?: string | null
  career_pitching_appearances?: number
  career_innings_pitched?: string
  career_wins?: number
  career_losses?: number
  career_saves?: number
  career_earned_runs?: number
  career_strikeouts_pitching?: number
  career_era?: string | null
  career_whip?: string | null
  source_system?: string
  [key: string]: unknown
}

export interface PlayerVideo {
  id: number
  player_id: number
  team_id: number
  title?: string | null
  description?: string | null
  url: string
  thumbnail_url?: string | null
  embed_url?: string | null
  duration?: number | null
  video_type?: 'highlight' | 'game' | 'interview' | 'training' | 'promotional' | 'other' | null
  provider?: string | null
  provider_video_id?: string | null
  published_at?: string | null
  view_count?: number | null
  source_system?: string
  created_at?: string
  updated_at?: string
}

/** @deprecated Use PlayerStatsResponse instead. Legacy flat shape no longer returned. */
export interface PlayerStats {
  batting_avg?: string
  era?: string
  home_runs?: number
  rbi?: number
  stolen_bases?: number
  wins?: number
  losses?: number
  strikeouts?: number
  [key: string]: unknown
}

/** Team stats summary */
export interface StatsSummary {
  total_players?: number
  batting_avg?: string
  era?: string
  [key: string]: unknown
}

/** Performance rankings */
export interface PerformanceData {
  players?: Array<Record<string, unknown>>
  [key: string]: unknown
}
