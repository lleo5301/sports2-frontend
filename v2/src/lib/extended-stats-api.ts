/**
 * Extended Stats API — Coach's Dashboard, team game log, aggregate stats, lineup.
 * Player splits, raw stats, game log.
 * @see docs/api/extended-stats-api.md
 */

import api from './api'

function getData<T>(res: { success?: boolean; data?: T; [k: string]: unknown }): T | undefined {
  return res?.success !== false && res?.data !== undefined ? (res.data as T) : undefined
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
  home_away: 'home' | 'away'
  result: 'W' | 'L' | 'T' | null
  score: string | null
  game_summary: string
  running_record: string
  running_conference_record?: string
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
  home_away: 'home' | 'away'
  result: 'W' | 'L' | 'T'
  score: string
  location?: string | null
  team_stats?: {
    batting?: Record<string, string | number>
    pitching?: Record<string, string | number>
  }
  game_summary: string
  running_record: string
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
    id: string
    opponent: string
    date: string
    home_away: string
    result: string
    score: string
    game_summary: string
    running_record: string
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
    ip: number
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

// --- API exports ---

export const extendedStatsApi = {
  /** Coach's dashboard: record, leaders, recent games, team stats */
  getCoachDashboard: async () => {
    const r = await api.get<{ success?: boolean; data?: CoachDashboardData }>(
      '/teams/dashboard'
    )
    return getData(r.data as { success?: boolean; data?: CoachDashboardData })
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
    return getData(r.data as { success?: boolean; data?: TeamAggregateStatsData })
  },

  /** Most recent lineup from last completed game */
  getTeamLineup: async () => {
    const r = await api.get<{ success?: boolean; data?: TeamLineupData }>(
      '/teams/lineup'
    )
    return getData(r.data as { success?: boolean; data?: TeamLineupData })
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
