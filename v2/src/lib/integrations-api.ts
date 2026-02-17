/**
 * Integrations API - PrestoSports and others.
 */

import api from './api'

function unwrap<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success ? res.data : undefined
}

export interface PrestoStatus {
  connected?: boolean
  configured?: boolean
  last_sync?: string
  [key: string]: unknown
}

export const integrationsApi = {
  getPrestoStatus: async () => {
    const r = await api.get<{ success?: boolean; data?: PrestoStatus }>(
      '/integrations/presto/status'
    )
    return unwrap(r.data as { success?: boolean; data?: PrestoStatus })
  },

  syncRoster: async () => {
    const r = await api.post<{ success?: boolean }>(
      '/integrations/presto/sync/roster'
    )
    return unwrap(r.data as { success?: boolean })
  },

  syncSchedule: async () => {
    const r = await api.post<{ success?: boolean }>(
      '/integrations/presto/sync/schedule'
    )
    return unwrap(r.data as { success?: boolean })
  },

  syncStats: async () => {
    const r = await api.post<{ success?: boolean }>(
      '/integrations/presto/sync/stats'
    )
    return unwrap(r.data as { success?: boolean })
  },

  syncAll: async () => {
    const r = await api.post<{ success?: boolean }>(
      '/integrations/presto/sync/all'
    )
    return unwrap(r.data as { success?: boolean })
  },

  disconnect: async () => {
    await api.delete('/integrations/presto/disconnect')
  },
}
