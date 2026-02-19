/**
 * Integrations API - PrestoSports and others.
 */

import api from './api'

function getData<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success !== false && res?.data !== undefined ? res.data : undefined
}

export interface PrestoStatus {
  connected?: boolean
  configured?: boolean
  isConfigured?: boolean
  last_sync?: string
  lastSyncAt?: string
  prestoTeamId?: string | null
  prestoSeasonId?: string | null
  tokenStatus?: 'valid' | 'expired' | null
  [key: string]: unknown
}

export interface PrestoSeason {
  id?: string
  seasonId?: string
  name?: string
  seasonName?: string
  [key: string]: unknown
}

export interface PrestoTeam {
  id?: string
  teamId?: string
  name?: string
  teamName?: string
  seasonId?: string
  season?: { seasonName?: string; sportName?: string; sport?: { sportName?: string }; [k: string]: unknown }
  sportId?: string
  [key: string]: unknown
}

/** NJCAA league team from Presto — teamId, name, logo (CDN, use in <img>) */
export interface PrestoLeagueTeam {
  teamId: string
  name: string
  logo?: string | null
  logo_url?: string | null
  logoUrl?: string | null
  teamName?: string
}

export const integrationsApi = {
  /** Get Presto integration status */
  getPrestoStatus: async () => {
    const r = await api.get<{ success?: boolean; data?: PrestoStatus }>(
      '/integrations/presto/status'
    )
    return getData(r.data as { success?: boolean; data?: PrestoStatus })
  },

  /** Configure Presto credentials and optionally team/season */
  configurePresto: async (params: {
    username: string
    password: string
    prestoTeamId?: string | null
    prestoSeasonId?: string | null
  }) => {
    const r = await api.post<{ success?: boolean }>(
      '/integrations/presto/configure',
      {
        username: params.username,
        password: params.password,
        prestoTeamId: params.prestoTeamId ?? undefined,
        prestoSeasonId: params.prestoSeasonId ?? undefined,
      }
    )
    return getData(r.data as { success?: boolean })
  },

  /** Test Presto connection with credentials */
  testPrestoConnection: async (params?: { username: string; password: string }) => {
    const body = params
      ? { username: params.username, password: params.password }
      : {}
    const r = await api.post<{ success?: boolean; data?: { ok?: boolean } }>(
      '/integrations/presto/test',
      body
    )
    return getData(r.data as { success?: boolean; data?: { ok?: boolean } })
  },

  /** Disconnect Presto integration */
  disconnectPresto: async () => {
    await api.delete('/integrations/presto/disconnect')
  },

  /** List available Presto seasons */
  getPrestoSeasons: async () => {
    const r = await api.get<{ success?: boolean; data?: PrestoSeason[] }>(
      '/integrations/presto/seasons'
    )
    const data = getData(r.data as { success?: boolean; data?: PrestoSeason[] })
    return Array.isArray(data) ? data : []
  },

  /** List available Presto teams */
  getPrestoTeams: async () => {
    const r = await api.get<{ success?: boolean; data?: PrestoTeam[] }>(
      '/integrations/presto/teams'
    )
    const data = getData(r.data as { success?: boolean; data?: PrestoTeam[] })
    return Array.isArray(data) ? data : []
  },

  /**
   * NJCAA league teams — teamId, name, logo_url.
   * Auto-detects Presto season; pass ?seasonId= to override.
   * Logo URLs are static.prestosports.com CDN links, use directly in <img>.
   */
  getPrestoLeagueTeams: async (seasonId?: string) => {
    const r = await api.get<{
      success?: boolean
      data?: PrestoLeagueTeam[] | { teams?: PrestoLeagueTeam[] }
      teams?: PrestoLeagueTeam[]
    }>(
      '/integrations/presto/league-teams',
      seasonId
        ? { params: { seasonId }, skipErrorToast: true }
        : { skipErrorToast: true }
    )
    const body = r.data as Record<string, unknown>
    let arr: PrestoLeagueTeam[] | undefined
    if (Array.isArray(body?.data)) arr = body.data as PrestoLeagueTeam[]
    else if (Array.isArray((body?.data as Record<string, unknown>)?.teams))
      arr = (body.data as { teams: PrestoLeagueTeam[] }).teams
    else if (Array.isArray(body?.teams)) arr = body.teams
    return Array.isArray(arr) ? arr : []
  },

  /** Update Presto settings */
  updatePrestoSettings: async (settings: Record<string, unknown>) => {
    const r = await api.put<{ success?: boolean }>(
      '/integrations/presto/settings',
      settings
    )
    return getData(r.data as { success?: boolean })
  },

  syncRoster: async () => {
    const r = await api.post<{ success?: boolean }>(
      '/integrations/presto/sync/roster'
    )
    return getData(r.data as { success?: boolean })
  },

  syncSchedule: async () => {
    const r = await api.post<{ success?: boolean }>(
      '/integrations/presto/sync/schedule'
    )
    return getData(r.data as { success?: boolean })
  },

  syncStats: async () => {
    const r = await api.post<{ success?: boolean }>(
      '/integrations/presto/sync/stats'
    )
    return getData(r.data as { success?: boolean })
  },

  syncAll: async () => {
    const r = await api.post<{ success?: boolean }>(
      '/integrations/presto/sync/all'
    )
    return getData(r.data as { success?: boolean })
  },

  /** @deprecated Use disconnectPresto */
  disconnect: async () => {
    await api.delete('/integrations/presto/disconnect')
  },
}
