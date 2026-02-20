/**
 * Extended Stats API — Coach's Dashboard, team game log, aggregate stats, lineup.
 * Player splits, raw stats, game log.
 * @see docs/api/extended-stats-api.md
 */

import api from './api'

function getData<T>(res: { success?: boolean; data?: T; [k: string]: unknown }): T | undefined {
  return res?.success !== false && res?.data !== undefined ? (res.data as T) : undefined
}

/** Map Presto fielding keys to canonical display keys. Backend may return either format. */
function normalizeFieldingStats(raw: Record<string, string> | undefined): Record<string, string> {
  if (!raw || typeof raw !== 'object') return {}
  const out: Record<string, string> = {}
  const aliases: Record<string, string[]> = {
    fielding_pct: ['fielding_pct', 'fieldingfldpct', 'fpct', 'fielding_percentage'],
    errors: ['errors', 'fieldinge', 'e'],
    putouts: ['putouts', 'fieldingpo', 'po'],
    assists: ['assists', 'fieldinga', 'a'],
    double_plays: ['double_plays', 'fieldingdp', 'dp'],
    stolen_bases_allowed: ['stolen_bases_allowed', 'sba', 'fieldingsba'],
    caught_stealing: ['caught_stealing', 'cs', 'fieldingcs'],
  }
  for (const [canonical, keys] of Object.entries(aliases)) {
    for (const k of keys) {
      const v = raw[k]
      if (v != null && v !== '' && v !== '--') {
        out[canonical] = String(v)
        break
      }
    }
  }
  return out
}

// --- Team Dashboard ---

export interface DashboardRecord {
  wins: number
  losses: number
  ties: number
  conference_wins?: number
  conference_losses?: number
}

export interface DashboardRecentGame {
  id: string
  date: string
  opponent: string
  opponent_logo_url?: string | null
  home_away: 'home' | 'away'
  result: 'W' | 'L' | 'T' | null
  score: string | null
  game_summary: string
  running_record: string | null
  running_conference_record?: string
  location?: string | null
  venue_name?: string | null
}

export interface DashboardLeader {
  player_id: string
  name: string
  value: string
}

export interface CoachDashboardData {
  record: DashboardRecord
  team_batting: Record<string, string>
  team_pitching: Record<string, string>
  team_fielding: Record<string, string>
  recent_games: DashboardRecentGame[]
  leaders: {
    batting_avg?: DashboardLeader[]
    home_runs?: DashboardLeader[]
    rbi?: DashboardLeader[]
    stolen_bases?: DashboardLeader[]
    era?: DashboardLeader[]
    strikeouts?: DashboardLeader[]
  }
  stats_last_synced_at?: string | null
}

// --- Team Game Log ---

export interface TeamGameLogGame {
  id: string
  date: string
  opponent: string
  opponent_logo_url?: string | null
  home_away: 'home' | 'away'
  result: 'W' | 'L' | 'T'
  score: string
  location?: string | null
  venue_name?: string | null
  team_stats?: {
    batting?: Record<string, string | number>
    pitching?: Record<string, string | number>
  }
  game_summary: string
  running_record: string | null
  running_conference_record?: string
}

// --- Team Aggregate Stats ---

export interface TeamAggregateStatsData {
  batting: Record<string, string>
  pitching: Record<string, string>
  fielding: Record<string, string>
  last_synced_at?: string | null
}

// --- Team Lineup ---

export interface LineupPlayer {
  player_id: string | null
  name: string
  jersey_number: string
  position: string
  photo_url?: string | null
  batting?: {
    ab: number
    h: number
    r: number
    rbi: number
    bb: number
  }
}

export interface TeamLineupData {
  source: 'last_game' | 'none'
  game_id?: string
  game_date?: string
  opponent?: string
  players: LineupPlayer[]
  message?: string
}

// --- Player Splits ---

export interface PlayerSplitsData {
  player_id: string
  player_name: string
  season?: string
  season_name?: string
  splits: Record<string, Record<string, string>> | null
  message?: string
}

// --- Player Raw Stats ---

export interface PlayerRawStatsData {
  player_id: string
  player_name: string
  season?: string
  season_name?: string
  raw_stats: Record<string, string> | null
}

// --- Player Game Log ---

export interface PlayerGameLogEntry {
  game: {
    id: string | number
    opponent: string
    opponent_logo_url?: string | null
    date: string
    home_away: string
    result: string
    score: string
    game_summary: string
    running_record: string | null
  }
  batting: {
    ab: number
    r: number
    h: number
    doubles?: number
    triples?: number
    hr?: number
    rbi: number
    bb: number
    so: number
    sb?: number
    hbp?: number
  }
  pitching?: {
    ip: number | string
    h: number
    r: number
    er: number
    bb: number
    so: number
    hr?: number
    pitches?: number
    win?: boolean
    loss?: boolean
    save?: boolean
  } | null
  fielding: {
    po: number
    a: number
    e: number
  }
  position: string
}

export interface PlayerGameLogData {
  player_id: string
  player_name: string
  games: PlayerGameLogEntry[]
}

// --- Lineup derivation from game stats ---

const POSITION_CODES = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'] as const
const POSITION_ALIASES: Record<string, string> = {
  SP: 'P', RP: 'P', RHP: 'P', LHP: 'P',
  '1': '1B', '2': '2B', '3': '3B', '4': '4',
  OF: 'LF', // generic OF → LF for grouping
}

function normalizePosition(pos: unknown): string | null {
  if (!pos || typeof pos !== 'string') return null
  const s = pos.trim().toUpperCase()
  const mapped = POSITION_ALIASES[s] ?? s
  return POSITION_CODES.includes(mapped as (typeof POSITION_CODES)[number]) ? mapped : null
}

function toPlayerId(v: unknown): string | null {
  if (v == null) return null
  if (typeof v === 'number') return String(v)
  if (typeof v === 'string' && /^\d+$/.test(v)) return v
  return null
}

function getPlayerFromRow(row: Record<string, unknown>): Record<string, unknown> | undefined {
  return (row.Player ?? row.player) as Record<string, unknown> | undefined
}

function deriveLineupFromGameStats(stats: Record<string, unknown>): LineupPlayer[] {
  // Unwrap nested { data: { ... } } if present
  const raw =
    stats?.data != null && typeof stats.data === 'object' && !Array.isArray(stats.data)
      ? (stats.data as Record<string, unknown>)
      : stats

  const seen = new Set<string>()
  const result: LineupPlayer[] = []

  const add = (playerId: string | null, name: string, jersey: string, position: string) => {
    const pos = normalizePosition(position)
    if (!pos || !playerId) return
    const key = `${playerId}:${pos}`
    if (seen.has(key)) return
    seen.add(key)
    result.push({ player_id: playerId, name, jersey_number: jersey, position: pos })
  }

  const processRow = (row: Record<string, unknown>) => {
    const p = getPlayerFromRow(row)
    const pid = toPlayerId(
      row.player_id ?? row.playerId ?? p?.id ?? (p && 'id' in p ? p.id : null)
    )
    const pos = row.position ?? row.fielding_position ?? row.position_abbrev ?? row.batting_order
    const name = p
      ? `${(p.first_name ?? p.firstName ?? '')} ${(p.last_name ?? p.lastName ?? '')}`.trim() ||
        (p.name as string) ||
        '—'
      : (row.player_name ?? row.name ?? '—') as string
    const jersey = String(p?.jersey_number ?? row.jersey_number ?? row.jersey ?? '')
    add(pid, name, jersey, String(pos ?? ''))
  }

  const tryArray = (arr: unknown): boolean => {
    if (!Array.isArray(arr) || arr.length === 0) return false
    const first = arr[0] as Record<string, unknown> | undefined
    if (!first || typeof first !== 'object') return false
    const hasPlayer =
      first.player_id != null || first.playerId != null || first.Player != null || first.player != null
    if (!hasPlayer) return false
    for (const item of arr) processRow(item as Record<string, unknown>)
    return true
  }

  tryArray(
    raw.player_stats ??
      raw.playerStats ??
      raw.game_statistics ??
      raw.GameStatistics
  )
  tryArray(raw.fielding ?? raw.Fielding)
  if (result.length === 0) tryArray(raw.batting ?? raw.Batting)
  if (result.length === 0) tryArray(raw.pitching ?? raw.Pitching)
  if (result.length === 0) tryArray(raw.players ?? raw.Players)

  if (result.length === 0) {
    for (const v of Object.values(raw)) {
      if (!Array.isArray(v) || v.length === 0) continue
      const first = v[0] as Record<string, unknown> | undefined
      if (!first || typeof first !== 'object') continue
      if (
        first.player_id == null &&
        first.playerId == null &&
        first.Player == null &&
        first.player == null
      )
        continue
      for (const item of v) processRow(item as Record<string, unknown>)
      if (result.length > 0) break
    }
  }

  if (import.meta.env.DEV && result.length === 0) {
    console.debug('[getGameLineup] deriveLineupFromGameStats got 0 players. Stats keys:', Object.keys(raw))
    const sample =
      raw.batting ?? raw.fielding ?? raw.player_stats ?? raw.playerStats ?? raw.game_statistics
    if (Array.isArray(sample) && sample[0]) {
      console.debug('[getGameLineup] sample row keys:', Object.keys(sample[0] as object))
    }
  }

  return result
}

// --- API exports ---

export const extendedStatsApi = {
  /** Coach's dashboard: record, leaders, recent games, team stats */
  getCoachDashboard: async () => {
    const r = await api.get<{ success?: boolean; data?: CoachDashboardData }>(
      '/teams/dashboard'
    )
    const data = getData(r.data as { success?: boolean; data?: CoachDashboardData })
    if (!data) return undefined
    const normFielding = normalizeFieldingStats(data.team_fielding)
    return {
      ...data,
      team_fielding: Object.keys(normFielding).length > 0 ? normFielding : (data.team_fielding ?? {}),
    }
  },

  /** Team game log — completed games, newest first */
  getTeamGameLog: async () => {
    const r = await api.get<{
      success?: boolean
      data?: { games: TeamGameLogGame[] }
    }>('/teams/game-log')
    const data = getData(r.data as { success?: boolean; data?: { games: TeamGameLogGame[] } })
    return data?.games ?? []
  },

  /** Team aggregate batting/pitching/fielding stats */
  getTeamAggregateStats: async () => {
    const r = await api.get<{ success?: boolean; data?: TeamAggregateStatsData }>(
      '/teams/aggregate-stats'
    )
    const data = getData(r.data as { success?: boolean; data?: TeamAggregateStatsData })
    if (!data) return undefined
    const normFielding = normalizeFieldingStats(data.fielding)
    return {
      ...data,
      fielding: Object.keys(normFielding).length > 0 ? normFielding : (data.fielding ?? {}),
    }
  },

  /** Most recent lineup from last completed game */
  getTeamLineup: async () => {
    const r = await api.get<{ success?: boolean; data?: TeamLineupData }>(
      '/teams/lineup'
    )
    return getData(r.data as { success?: boolean; data?: TeamLineupData })
  },

  /** Lineup for a specific game (for depth chart backfill).
   * Prefers game stats (local integer player_ids) over teams/lineup (Presto UUIDs).
   * Depth chart assign requires integer player IDs, so game stats work; lineup UUIDs do not. */
  getGameLineup: async (gameId: number): Promise<TeamLineupData | null> => {
    let stats: Record<string, unknown> | undefined
    const paths = [`/games/${gameId}/stats`, `/games/byId/${gameId}/stats`]
    for (const path of paths) {
      try {
        const r = await api.get<{ success?: boolean; data?: Record<string, unknown> }>(path)
        const body = r.data as Record<string, unknown>
        stats = (getData(body) ?? body) as Record<string, unknown> | undefined
        break
      } catch {
        continue
      }
    }
    if (stats) {
      const players = deriveLineupFromGameStats(stats)
      if (players.length > 0) {
        return {
          source: 'last_game',
          game_id: String(gameId),
          players,
        }
      }
    }

    try {
      const r = await api.get<{ success?: boolean; data?: TeamLineupData }>(
        '/teams/lineup',
        { params: { game_id: gameId } }
      )
      const data = getData(r.data as { success?: boolean; data?: TeamLineupData })
      if (data?.players?.length) return data
    } catch {
      /* no lineup available */
    }
    return null
  },

  /** Player split stats (home/away, vs LHP/RHP, situational) */
  getPlayerSplits: async (playerId: number) => {
    const r = await api.get<{ success?: boolean; data?: PlayerSplitsData }>(
      `/players/byId/${playerId}/splits`
    )
    return getData(r.data as { success?: boolean; data?: PlayerSplitsData })
  },

  /** Player raw Presto stats (214 keys) */
  getPlayerRawStats: async (playerId: number) => {
    const r = await api.get<{ success?: boolean; data?: PlayerRawStatsData }>(
      `/players/byId/${playerId}/stats/raw`
    )
    return getData(r.data as { success?: boolean; data?: PlayerRawStatsData })
  },

  /** Player per-game stats */
  getPlayerGameLog: async (playerId: number) => {
    const r = await api.get<{ success?: boolean; data?: PlayerGameLogData }>(
      `/players/byId/${playerId}/game-log`
    )
    return getData(r.data as { success?: boolean; data?: PlayerGameLogData })
  },
}
