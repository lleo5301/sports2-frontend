/**
 * Teams API - mirrors parent teamsService.
 * Uses axios (lib/api) for credentials + CSRF.
 * Backend may return { data } with or without success flag.
 */

import api from './api'

function getData<T>(res: { success?: boolean; data?: T; [k: string]: unknown }): T | undefined {
  return res?.success !== false && res?.data !== undefined ? (res.data as T) : undefined
}

export interface TeamUpdateInput {
  name?: string
  program_name?: string
  conference?: string
  division?: string
  city?: string
  state?: string
  primary_color?: string
  secondary_color?: string
}

export interface TeamUser {
  id: number
  email?: string
  name?: string
  role?: string
}

export interface TeamPermission {
  id: number
  user_id: number
  permission_type: string
  is_granted: boolean
  expires_at?: string
  notes?: string
}

export const teamsApi = {
  getMyTeam: async () => {
    const r = await api.get<{ success?: boolean; data?: unknown }>('/teams/me')
    return getData(r.data) ?? r.data
  },

  updateMyTeam: async (data: TeamUpdateInput) => {
    const r = await api.put<{ success?: boolean; data?: unknown }>(
      '/teams/me',
      data
    )
    return getData(r.data) ?? r.data
  },

  getTeamStats: async () => {
    const r = await api.get<{ success?: boolean; data?: unknown }>(
      '/teams/stats'
    )
    return getData(r.data) ?? r.data
  },

  getRecentSchedules: async (limit = 5) => {
    const r = await api.get<{ success?: boolean; data?: unknown }>(
      '/teams/recent-schedules',
      { params: { limit } }
    )
    const data = getData(r.data)
    return Array.isArray(data) ? data : []
  },

  getUpcomingSchedules: async (limit = 5) => {
    const r = await api.get<{ success?: boolean; data?: unknown }>(
      '/teams/upcoming-schedules',
      { params: { limit } }
    )
    const data = getData(r.data)
    return Array.isArray(data) ? data : []
  },

  uploadLogo: async (file: File) => {
    const form = new FormData()
    form.append('logo', file)
    const r = await api.post<{ success?: boolean; data?: unknown }>(
      '/teams/logo',
      form
    )
    return getData(r.data) ?? r.data
  },

  deleteLogo: async () => {
    await api.delete('/teams/logo')
  },

  getUsers: async () => {
    const r = await api.get<{ success?: boolean; data?: TeamUser[] }>(
      '/teams/users'
    )
    const data = getData(r.data)
    return Array.isArray(data) ? data : []
  },

  getPermissions: async () => {
    const r = await api.get<{ success?: boolean; data?: TeamPermission[] }>(
      '/teams/permissions'
    )
    const data = getData(r.data)
    return Array.isArray(data) ? data : []
  },

  grantPermission: async (payload: {
    user_id: number
    permission_type: string
    is_granted?: boolean
    expires_at?: string
    notes?: string
  }) => {
    const r = await api.post<{ success?: boolean; data?: TeamPermission }>(
      '/teams/permissions',
      payload
    )
    return getData(r.data)
  },

  updatePermission: async (
    id: number,
    payload: { is_granted?: boolean; expires_at?: string; notes?: string }
  ) => {
    const r = await api.put<{ success?: boolean; data?: TeamPermission }>(
      `/teams/permissions/${id}`,
      payload
    )
    return getData(r.data)
  },

  revokePermission: async (id: number) => {
    await api.delete(`/teams/permissions/${id}`)
  },
}
