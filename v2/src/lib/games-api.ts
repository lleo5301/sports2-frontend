/**
 * Games API
 */

import { parseISO } from 'date-fns'
import api from './api'
import { formatDate } from './format-date'

function getData<T>(res: { success?: boolean; data?: T; [k: string]: unknown }): T | undefined {
  return res?.success !== false && res?.data !== undefined ? (res.data as T) : undefined
}

/** Location: venue_name (stadium) preferred, else location (geographic). */
export function formatGameLocation(game: {
  location?: string
  venue_name?: string
}): string {
  const venue = game?.venue_name?.trim()
  const loc = game?.location?.trim()
  if (venue) return venue
  if (loc) return loc
  return ''
}

/** Format game date for display. Handles date, game_date, ISO strings. Locale-aware. */
export function formatGameDate(game: {
  date?: string
  game_date?: string
}): string {
  const d = game?.date ?? game?.game_date
  if (!d || typeof d !== 'string') return ''
  return formatDate(d)
}

/** Format game date short (MMM d) for compact lists. Locale-aware. */
export function formatGameDateShort(game: {
  date?: string
  game_date?: string
  gameDate?: string
  scheduled_at?: string
  start_date?: string
}): string {
  const d =
    game?.date ??
    game?.game_date ??
    game?.gameDate ??
    game?.scheduled_at ??
    game?.start_date
  if (!d || typeof d !== 'string') return ''
  try {
    const parsed = parseISO(d)
    return parsed.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return formatDate(d)
  }
}

/** Parse time string (HH:mm or HH:mm:ss) into minutes since midnight. */
function parseTimeToMinutes(timeStr: string): number | null {
  const t = timeStr.trim()
  if (!t) return null
  const m = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/)
  if (!m) return null
  const h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  if (h >= 0 && h <= 23 && min >= 0 && min <= 59) {
    return h * 60 + min
  }
  return null
}

/** Format game date and time. Locale-aware (MM/dd/yyyy h:mm a, 12-hour). */
export function formatGameDateTime(game: {
  date?: string
  game_date?: string
  game_time?: string
}): string {
  const d = game?.date ?? game?.game_date
  const timeOnly = (game?.game_time as string)?.trim()
  if (!d || typeof d !== 'string') {
    return timeOnly ? formatTime12h(timeOnly) : '—'
  }
  try {
    const parsed = parseISO(d)
    const mins = timeOnly ? parseTimeToMinutes(timeOnly) : null
    const hasTime =
      d.includes('T') && !/T00:00:00(\.000)?Z?$/i.test(d)
    if (mins != null) {
      const withTime = new Date(parsed)
      withTime.setHours(Math.floor(mins / 60), mins % 60, 0, 0)
      return withTime.toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    }
    if (hasTime) {
      return parsed.toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    }
    return formatDate(parsed)
  } catch {
    return formatDate(d) || d
  }
}

/** Format 24h time string (HH:mm or HH:mm:ss) to 12-hour format (e.g., "6:30 PM"). */
function formatTime12h(timeStr: string): string {
  const mins = parseTimeToMinutes(timeStr)
  if (mins == null) return timeStr
  const h = Math.floor(mins / 60)
  const m = mins % 60
  const pm = h >= 12
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${pm ? 'PM' : 'AM'}`
}

/** Location prefers geographic data; venue_name holds stadium name (backend update) */
export interface GameTournament {
  id: number
  name: string
  season?: string
}

export interface Game {
  id: number
  opponent?: string
  opponent_logo_url?: string | null
  date?: string
  game_date?: string
  game_time?: string
  location?: string
  venue_name?: string
  location_id?: number
  home_away?: string
  result?: string
  team_score?: number
  opponent_score?: number
  team_id?: number
  tournament_id?: number | null
  tournament?: GameTournament | null
  event_type?: string
  is_conference?: boolean
  is_neutral?: boolean
  is_post_season?: boolean
  season?: string | null
  season_name?: string | null
  notes?: string | null
  game_status?: 'scheduled' | 'completed' | 'cancelled' | 'postponed'
  game_summary?: string | null
  running_record?: string | null
  running_conference_record?: string | null
  source_system?: 'manual' | 'presto'
  created_at?: string
  updated_at?: string
  /** Per-game team stats (Presto keys) - from game detail/stats when available */
  team_stats?: Record<string, string | number>
  /** Per-game opponent stats - from game detail/stats when available */
  opponent_stats?: Record<string, string | number>
  /** Game duration (e.g., "2:45" for 2h 45m) */
  game_duration?: string | null
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

  /** Presto live box score (both teams) — for games with presto_event_id */
  getBoxScore: async (gameId: number) => {
    const r = await api.get<{ success?: boolean; data?: { box_score?: Record<string, unknown> } }>(
      `/games/${gameId}/box-score`
    )
    return getData(r.data as { success?: boolean; data?: { box_score?: Record<string, unknown> } })
  },

  /** Single game statistics (box score: batting, pitching, fielding) */
  getGameStats: async (gameId: number) => {
    const paths = [`/games/${gameId}/stats`, `/games/byId/${gameId}/stats`]
    for (const path of paths) {
      try {
        const r = await api.get<{ success?: boolean; data?: Record<string, unknown> }>(path)
        const payload = r.data as { success?: boolean; data?: Record<string, unknown> }
        const data = getData(payload)
        if (data) return data
      } catch {
        continue
      }
    }
    return undefined
  },

  /** Aggregated opponent team stats across all games */
  getOpponentStats: async (params?: { opponent?: string; season?: string }) => {
    const r = await api.get<{ success?: boolean; data?: Record<string, unknown>[] }>(
      '/games/opponent-stats',
      { params }
    )
    return getData(r.data as { success?: boolean; data?: Record<string, unknown>[] }) ?? []
  },

  /** Per-player stats for a specific opponent */
  getOpponentPlayerStats: async (opponent: string, params?: { season?: string }) => {
    const r = await api.get<{ success?: boolean; data?: { opponent?: string; players?: Record<string, unknown>[] } }>(
      `/games/opponent-stats/${encodeURIComponent(opponent)}/players`,
      { params }
    )
    return getData(r.data as { success?: boolean; data?: { opponent?: string; players?: Record<string, unknown>[] } })
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
  season_name?: string | null
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
