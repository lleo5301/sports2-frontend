/**
 * Games API
 */

import { format, parse, parseISO } from 'date-fns'
import api from './api'

function getData<T>(res: { success?: boolean; data?: T; [k: string]: unknown }): T | undefined {
  return res?.success !== false && res?.data !== undefined ? (res.data as T) : undefined
}

/** Format game date for display. Handles date, game_date, ISO strings. */
export function formatGameDate(
  game: { date?: string; game_date?: string },
  pattern = 'MMM d, yyyy'
): string {
  const d = game?.date ?? game?.game_date
  if (!d || typeof d !== 'string') return ''
  try {
    const date = parseISO(d)
    return format(date, pattern)
  } catch {
    return d
  }
}

/** Format time string to 12-hour (e.g., 2:00 PM). Handles 24h (14:00, 14:00:00) or 12h passthrough. */
function formatTime12h(timeStr: string): string {
  const t = timeStr.trim()
  if (!t) return ''
  const m = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?$/i)
  if (m) {
    if (m[4]) return t
    const h = parseInt(m[1], 10)
    const min = m[2]
    if (h >= 0 && h <= 23) {
      const period = h >= 12 ? 'PM' : 'AM'
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      return `${h12}:${min} ${period}`
    }
  }
  try {
    const parsed = parse(t, 'HH:mm', new Date())
    return format(parsed, 'h:mm a')
  } catch {
    try {
      const parsed = parse(t, 'HH:mm:ss', new Date())
      return format(parsed, 'h:mm a')
    } catch {
      return t
    }
  }
}

/** Format game date and time. Uses 12-hour time. Uses game_time if present, else extracts from ISO datetime. */
export function formatGameDateTime(
  game: {
    date?: string
    game_date?: string
    game_time?: string
    [k: string]: unknown
  }
): string {
  const d = game?.date ?? game?.game_date
  const timeOnly = game?.game_time as string | undefined
  if (!d || typeof d !== 'string') {
    return timeOnly ? formatTime12h(timeOnly) : '—'
  }
  try {
    const parsed = parseISO(d)
    const dateStr = format(parsed, 'MMM d, yyyy')
    if (timeOnly && typeof timeOnly === 'string') {
      const time12 = formatTime12h(timeOnly)
      return time12 ? `${dateStr} · ${time12}` : dateStr
    }
    const hasTime =
      d.includes('T') &&
      !/T00:00:00(\.000)?Z?$/i.test(d)
    if (hasTime) {
      return `${dateStr} · ${format(parsed, 'h:mm a')}`
    }
    return dateStr
  } catch {
    return timeOnly ? `${d} · ${formatTime12h(timeOnly)}` : d
  }
}

export interface Game {
  id: number
  opponent?: string
  date?: string
  game_date?: string
  game_time?: string
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
    const data = getData(r.data as { success?: boolean; data?: Game[] })
    const pagination = (r.data as { pagination?: PaginatedResponse<Game>['pagination'] })
      ?.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 }
    return { data: data ?? [], pagination } as PaginatedResponse<Game>
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: Game }>(
      `/games/byId/${id}`
    )
    return getData(r.data as { success?: boolean; data?: Game })
  },

  create: async (data: GameCreateInput) => {
    const r = await api.post<{ success?: boolean; data?: Game }>(
      '/games',
      data
    )
    return getData(r.data as { success?: boolean; data?: Game })
  },

  update: async (id: number, data: Partial<GameCreateInput>) => {
    const r = await api.put<{ success?: boolean; data?: Game }>(
      `/games/byId/${id}`,
      data
    )
    return getData(r.data as { success?: boolean; data?: Game })
  },

  delete: async (id: number) => {
    await api.delete(`/games/byId/${id}`)
  },

  getUpcoming: async () => {
    const r = await api.get<{ success?: boolean; data?: Game[] }>(
      '/games/upcoming'
    )
    const data = getData(r.data as { success?: boolean; data?: Game[] })
    return Array.isArray(data) ? data : []
  },

  /** Game log — recent past games, typically with results */
  getGameLog: async (limit = 10) => {
    const r = await api.get<{ success?: boolean; data?: Game[] }>(
      '/games/log',
      { params: { limit } }
    )
    const data = getData(r.data as { success?: boolean; data?: Game[] })
    return Array.isArray(data) ? data : []
  },

  /** Season statistics (wins, losses, etc.) */
  getSeasonStats: async () => {
    const r = await api.get<{ success?: boolean; data?: Record<string, unknown> }>(
      '/games/season-stats'
    )
    return getData(r.data as { success?: boolean; data?: Record<string, unknown> })
  },

  /** Team game statistics */
  getTeamStats: async () => {
    const r = await api.get<{ success?: boolean; data?: Record<string, unknown> }>(
      '/games/team-stats'
    )
    return getData(r.data as { success?: boolean; data?: Record<string, unknown> })
  },

  /** Per-player game statistics */
  getPlayerStats: async (playerId: number) => {
    const r = await api.get<{ success?: boolean; data?: Record<string, unknown> }>(
      `/games/player-stats/${playerId}`
    )
    return getData(r.data as { success?: boolean; data?: Record<string, unknown> })
  },

  /** Single game statistics */
  getGameStats: async (gameId: number) => {
    const r = await api.get<{ success?: boolean; data?: Record<string, unknown> }>(
      `/games/${gameId}/stats`
    )
    return getData(r.data as { success?: boolean; data?: Record<string, unknown> })
  },

  /** Player stat leaderboard (ranked by stat from PlayerSeasonStats) */
  getLeaderboard: async (params: {
    stat: string
    season?: string
    limit?: number
    min_qualifier?: number
  }) => {
    const r = await api.get<{ success?: boolean; data?: LeaderboardResponse }>(
      '/games/leaderboard',
      { params }
    )
    return getData(r.data as { success?: boolean; data?: LeaderboardResponse })
  },
}

export interface LeaderboardResponse {
  stat: string
  season: string | null
  leaders: LeaderEntry[]
}

export interface LeaderEntry {
  rank: number
  player: {
    id: number
    first_name?: string
    last_name?: string
    position?: string
    jersey_number?: number | null
    photo_url?: string | null
  }
  value: number | string
  qualifier_value: number | null
}
