// ============================================
// Configuration
// ============================================

export interface SynergyConfigureRequest {
  client_id: string
  client_secret: string
  synergy_team_id: string
  api_url?: string
}

// ============================================
// Status
// ============================================

export interface SynergyStatus {
  configured: boolean
  isActive?: boolean
  synergyTeamId?: string | null
  lastRefreshed?: string | null
}

// ============================================
// Sync Results
// ============================================

export interface GameSyncResult {
  created: number
  updated: number
  failed: number
  errors: string[]
}

export interface EventSyncResult {
  created: number
  updated: number
  skipped: number
  failed: number
  errors: string[]
}

export interface PlayerMapSyncResult {
  created: number
  skipped: number
}

export interface FullSyncResult {
  games: GameSyncResult
  events: Array<{
    gameId: string
    created: number
    updated: number
    failed: number
  }>
  playerMaps: PlayerMapSyncResult
  errors: string[]
}

// ============================================
// Sync History
// ============================================

export type SyncStatus = 'running' | 'completed' | 'failed' | 'partial'

export type SyncType =
  | 'synergy_games'
  | 'synergy_events'
  | 'synergy_full'
  | 'synergy_player_maps'

export interface SyncHistoryEntry {
  id: string
  sync_type: SyncType | string
  status: SyncStatus
  started_at: string
  completed_at: string | null
  duration_ms: number | null
  items_created: number | null
  items_updated: number | null
  items_failed: number | null
  response_summary: Record<string, unknown> | null
}

// ============================================
// Analytics
// ============================================

export interface PitchTypeStat {
  pitch_kind: string
  total: number
  pct: number
  avg_mph: number
  min_mph: number
  max_mph: number
  balls: number
  called_strikes: number
  swinging_strikes: number
  fouls: number
  in_play: number
  whiff_rate: number
}

export interface PitchLocation {
  px: number
  pz: number
  pitch_kind: string
  pitch_result: string
  mph: number | null
  batter_side: string | null
  pitcher_name: string | null
  batter_name: string | null
}

export interface PitcherStat {
  pitcher_synergy_id: string
  pitcher_name: string
  pitcher_side: string | null
  total_pitches: number
  avg_mph: number
  games: number
  strikeouts: number
  whiff_pct: number
}

export interface SynergyGame {
  id: string
  synergy_game_id: string
  game_date: string
  home_team_name: string
  away_team_name: string
  home_score: number | null
  away_score: number | null
  status: string
  season: number
  event_count: number
}

// ============================================
// Pagination
// ============================================

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}
