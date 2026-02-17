/**
 * Teams API - mirrors parent teamsService.
 * Uses axios (lib/api) for credentials + CSRF.
 * API returns { success, data }; we unwrap to data.
 */

import api from './api'

function unwrap<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success ? res.data : undefined
}

export const teamsApi = {
  getMyTeam: async () => {
    const r = await api.get<{ success?: boolean; data?: unknown }>('/teams/me')
    return unwrap(r.data) ?? r.data
  },

  getTeamStats: async () => {
    const r = await api.get<{ success?: boolean; data?: unknown }>('/teams/stats')
    return unwrap(r.data) ?? r.data
  },

  getRecentSchedules: async (limit = 5) => {
    const r = await api.get<{ success?: boolean; data?: unknown }>(
      '/teams/recent-schedules',
      { params: { limit } }
    )
    const data = unwrap(r.data)
    return Array.isArray(data) ? data : []
  },

  getUpcomingSchedules: async (limit = 5) => {
    const r = await api.get<{ success?: boolean; data?: unknown }>(
      '/teams/upcoming-schedules',
      { params: { limit } }
    )
    const data = unwrap(r.data)
    return Array.isArray(data) ? data : []
  },
}
