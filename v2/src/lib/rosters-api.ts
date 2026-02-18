/**
 * Named Rosters API - per docs/api/roster-api.md
 *
 * Rosters are named, typed collections of players (game-day, travel, practice, etc.)
 */

import api from './api'

function getData<T>(res: { success?: boolean; data?: T; [k: string]: unknown }): T | undefined {
  return res?.success !== false && res?.data !== undefined ? (res.data as T) : undefined
}

export const ROSTER_TYPES = ['game_day', 'travel', 'practice', 'season', 'custom'] as const
export type RosterType = (typeof ROSTER_TYPES)[number]

export const ROSTER_TYPE_LABELS: Record<RosterType, string> = {
  game_day: 'Game Day',
  travel: 'Travel',
  practice: 'Practice',
  season: 'Season',
  custom: 'Custom',
}

export const ROSTER_SOURCES = ['manual', 'presto'] as const
export type RosterSource = (typeof ROSTER_SOURCES)[number]

export const ENTRY_STATUSES = ['active', 'injured', 'suspended', 'inactive'] as const
export type EntryStatus = (typeof ENTRY_STATUSES)[number]

export const POSITIONS = [
  'P',
  'C',
  '1B',
  '2B',
  '3B',
  'SS',
  'LF',
  'CF',
  'RF',
  'OF',
  'DH',
  'UTL',
] as const

export interface RosterEntryPlayer {
  id: number
  first_name?: string
  last_name?: string
  primary_position?: string
  position?: string
  height?: string
  weight?: number
  class_year?: string
  photo_url?: string
  bats?: string
  throws?: string
}

export interface RosterEntry {
  id: number
  roster_id: number
  player_id: number
  position?: string
  jersey_number?: number
  order?: number
  status: EntryStatus
  notes?: string
  Player?: RosterEntryPlayer
}

export interface Roster {
  id: number
  team_id?: number
  name: string
  roster_type: RosterType
  source: RosterSource
  description?: string
  game_id?: number
  effective_date?: string
  is_active: boolean
  created_by?: number
  created_at?: string
  updated_at?: string
  entries?: RosterEntry[]
  total_entries?: number
  entry_count?: number
  CreatedBy?: { id: number; first_name?: string; last_name?: string }
  Game?: { id: number; opponent?: string; game_date?: string; home_away?: string }
}

export interface RosterCreateInput {
  name: string
  roster_type: RosterType
  game_id?: number
  effective_date?: string
  description?: string
}

export interface RosterListParams {
  roster_type?: RosterType
  source?: RosterSource
  is_active?: boolean
  game_id?: number
  page?: number
  limit?: number
}

export interface AddPlayersInput {
  players: Array<{
    player_id: number
    position?: string
    jersey_number?: number
    order?: number
    status?: EntryStatus
  }>
}

export interface UpdateEntryInput {
  position?: string
  jersey_number?: number
  order?: number
  status?: EntryStatus
  notes?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export const rostersApi = {
  list: async (params?: RosterListParams) => {
    const r = await api.get<{
      success?: boolean
      data?: Roster[]
      pagination?: { page: number; limit: number; total: number; pages: number }
    }>('/rosters', { params })
    const payload = r.data as {
      success?: boolean
      data?: Roster[]
      pagination?: PaginatedResponse<Roster>['pagination']
    }
    const data = getData<Roster[]>(payload) ?? []
    const pagination = payload?.pagination ?? {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0,
    }
    return { data: Array.isArray(data) ? data : [], pagination } as PaginatedResponse<Roster>
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: Roster }>(`/rosters/${id}`)
    return getData<Roster>(r.data as { success?: boolean; data?: Roster })
  },

  create: async (data: RosterCreateInput) => {
    const r = await api.post<{ success?: boolean; data?: Roster }>('/rosters', data)
    return getData<Roster>(r.data as { success?: boolean; data?: Roster })
  },

  update: async (id: number, data: Partial<RosterCreateInput>) => {
    const r = await api.put<{ success?: boolean; data?: Roster }>(`/rosters/${id}`, data)
    return getData<Roster>(r.data as { success?: boolean; data?: Roster })
  },

  delete: async (id: number) => {
    await api.delete(`/rosters/${id}`)
  },

  addPlayers: async (rosterId: number, input: AddPlayersInput) => {
    const r = await api.post<{
      success?: boolean
      data?: { added: number; entries: RosterEntry[] }
    }>(`/rosters/${rosterId}/players`, input)
    return getData<{ added: number; entries: RosterEntry[] }>(
      r.data as { success?: boolean; data?: { added: number; entries: RosterEntry[] } }
    )
  },

  updateEntry: async (
    rosterId: number,
    playerId: number,
    input: UpdateEntryInput
  ) => {
    const r = await api.put<{ success?: boolean; data?: RosterEntry }>(
      `/rosters/${rosterId}/players/${playerId}`,
      input
    )
    return getData<RosterEntry>(r.data as { success?: boolean; data?: RosterEntry })
  },

  removePlayer: async (rosterId: number, playerId: number) => {
    await api.delete(`/rosters/${rosterId}/players/${playerId}`)
  },

  backfill: async (input: { game_ids?: number[]; all?: boolean }) => {
    const r = await api.post<{
      success?: boolean
      data?: {
        created: number
        skipped: number
        errors: string[]
        rosters: Array<{ id: number; name: string; game_id?: number; entries?: number }>
      }
    }>('/rosters/backfill', input)
    const payload = r.data as {
      success?: boolean
      data?: {
        created: number
        skipped: number
        errors: string[]
        rosters: Array<{ id: number; name: string; game_id?: number; entries?: number }>
      }
    }
    return getData(payload)
  },
}
