/**
 * Synergy Sports API — configure, status, disconnect, sync operations, sync history.
 *
 * All state-changing methods (POST, DELETE) require CSRF token handling.
 * The api instance (axios) already includes the CSRF token via its request interceptor.
 */
import type {
  SynergyConfigureRequest,
  SynergyStatus,
  GameSyncResult,
  EventSyncResult,
  FullSyncResult,
  SyncHistoryEntry,
  Pagination,
  PitchTypeStat,
  PitchLocation,
  PitcherStat,
  SynergyGame,
} from '@/features/integrations/synergy/types'
import api from './api'

function getData<T>(res: {
  success?: boolean
  data?: T
  [k: string]: unknown
}): T | undefined {
  return res?.success !== false && res?.data !== undefined
    ? (res.data as T)
    : undefined
}

const defaultPagination: Pagination = {
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
}

export const synergyApi = {
  /**
   * Configure OAuth2 credentials and Synergy team ID.
   * The backend tests the connection before saving; throws on failure.
   */
  configure: async (params: SynergyConfigureRequest): Promise<void> => {
    await api.post('/integrations/synergy/configure', params)
  },

  /**
   * Fetch current integration status.
   * Always resolves — returns { configured: false } if not set up.
   */
  getStatus: async (): Promise<SynergyStatus> => {
    const r = await api.get<{ success?: boolean; data?: SynergyStatus }>(
      '/integrations/synergy/status'
    )
    return (
      getData(r.data as { success?: boolean; data?: SynergyStatus }) ?? {
        configured: false,
      }
    )
  },

  /**
   * Deactivate the integration. Credentials are marked inactive, not deleted.
   */
  disconnect: async (): Promise<void> => {
    await api.delete('/integrations/synergy/disconnect')
  },

  /** Sync games for a given season (or current season if omitted). */
  syncGames: async (params?: { season?: number }): Promise<GameSyncResult> => {
    const r = await api.post<{ success?: boolean; data?: GameSyncResult }>(
      '/integrations/synergy/sync/games',
      params ?? {}
    )
    const data = getData(r.data as { success?: boolean; data?: GameSyncResult })
    if (!data) throw new Error('Unexpected response from sync/games')
    return data
  },

  /** Sync pitch events for a single game (Synergy game UUID). */
  syncGameEvents: async (gameId: string): Promise<EventSyncResult> => {
    const r = await api.post<{ success?: boolean; data?: EventSyncResult }>(
      `/integrations/synergy/sync/events/${gameId}`
    )
    const data = getData(
      r.data as { success?: boolean; data?: EventSyncResult }
    )
    if (!data) throw new Error('Unexpected response from sync/events')
    return data
  },

  /**
   * Full sync: games + pitch events + player identity maps.
   * Can take 30–120s depending on season size.
   */
  syncAll: async (params?: {
    season?: number
    force?: boolean
  }): Promise<FullSyncResult> => {
    const r = await api.post<{ success?: boolean; data?: FullSyncResult }>(
      '/integrations/synergy/sync/all',
      params ?? {}
    )
    const data = getData(r.data as { success?: boolean; data?: FullSyncResult })
    if (!data) throw new Error('Unexpected response from sync/all')
    return data
  },

  // ─── Analytics ──────────────────────────────────────────────────────────────

  /** Pitch repertoire stats (grouped by pitch type). */
  getPitchRepertoire: async (params?: {
    pitcher_id?: string
    game_id?: string
    season?: number
  }): Promise<{ data: PitchTypeStat[]; total_pitches: number }> => {
    const r = await api.get<{
      success?: boolean
      data?: PitchTypeStat[]
      total_pitches?: number
    }>('/integrations/synergy/analytics/pitches', { params })
    return {
      data:
        getData(r.data as { success?: boolean; data?: PitchTypeStat[] }) ?? [],
      total_pitches: (r.data as { total_pitches?: number })?.total_pitches ?? 0,
    }
  },

  /** Pitch location points for strike zone charts. */
  getPitchLocations: async (params?: {
    pitcher_id?: string
    pitch_kind?: string
    game_id?: string
  }): Promise<PitchLocation[]> => {
    const r = await api.get<{ success?: boolean; data?: PitchLocation[] }>(
      '/integrations/synergy/analytics/locations',
      { params }
    )
    return (
      getData(r.data as { success?: boolean; data?: PitchLocation[] }) ?? []
    )
  },

  /** Pitcher leaderboard (all pitchers with ≥1 pitch). */
  getPitchers: async (): Promise<PitcherStat[]> => {
    const r = await api.get<{ success?: boolean; data?: PitcherStat[] }>(
      '/integrations/synergy/analytics/pitchers'
    )
    return getData(r.data as { success?: boolean; data?: PitcherStat[] }) ?? []
  },

  /** List of synced games with event counts. */
  getGames: async (): Promise<SynergyGame[]> => {
    const r = await api.get<{ success?: boolean; data?: SynergyGame[] }>(
      '/integrations/synergy/games'
    )
    return getData(r.data as { success?: boolean; data?: SynergyGame[] }) ?? []
  },

  /** Paginated list of past sync operations. */
  getSyncHistory: async (params?: {
    page?: number
    limit?: number
  }): Promise<{ data: SyncHistoryEntry[]; pagination: Pagination }> => {
    const r = await api.get<{
      success?: boolean
      data?: SyncHistoryEntry[]
      pagination?: Pagination
    }>('/integrations/synergy/sync/history', { params })
    const data = getData(
      r.data as { success?: boolean; data?: SyncHistoryEntry[] }
    )
    const pagination =
      (r.data as { pagination?: Pagination })?.pagination ?? defaultPagination
    return { data: data ?? [], pagination }
  },
}
