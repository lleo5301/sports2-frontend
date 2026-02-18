/**
 * User settings API. Backend may return { data } with or without success flag.
 */

import api from './api'

function getData<T>(res: { success?: boolean; data?: T; [k: string]: unknown }): T | undefined {
  return res?.success !== false && res?.data !== undefined ? (res.data as T) : undefined
}

export interface UserSettings {
  account?: {
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
    timezone?: string
    locale?: string
  }
  notifications?: NotificationPreferences
  general?: Record<string, unknown>
  privacy?: Record<string, unknown>
}

export interface NotificationPreferences {
  email_scouting?: boolean
  email_reports?: boolean
  email_schedule?: boolean
  email_security?: boolean
  [key: string]: unknown
}

export interface LoginHistoryEntry {
  id?: number
  ip_address?: string
  user_agent?: string
  created_at?: string
  [key: string]: unknown
}

export interface SessionEntry {
  id?: string
  ip_address?: string
  user_agent?: string
  last_active?: string
  [key: string]: unknown
}

export const settingsApi = {
  getAll: async (): Promise<UserSettings | undefined> => {
    const r = await api.get<{ success?: boolean; data?: UserSettings }>('/settings')
    return getData<UserSettings>(r.data as { success?: boolean; data?: UserSettings })
  },

  updateAccount: async (data: {
    first_name?: string
    last_name?: string
    phone?: string
    timezone?: string
    locale?: string
  }) => {
    await api.put('/settings/account', data)
  },

  updateGeneral: async (data: Record<string, unknown>) => {
    await api.put('/settings/general', data)
  },

  updateNotifications: async (data: Record<string, unknown>) => {
    await api.put('/settings/notifications', data)
  },

  getNotificationPreferences: async (): Promise<NotificationPreferences | undefined> => {
    const r = await api.get<{ success?: boolean; data?: NotificationPreferences }>(
      '/settings/notifications/preferences'
    )
    return getData<NotificationPreferences>(
      r.data as { success?: boolean; data?: NotificationPreferences }
    )
  },

  updateNotificationPreferences: async (data: Record<string, unknown>) => {
    await api.put('/settings/notifications/preferences', data)
  },

  sendTestEmail: async () => {
    await api.post('/settings/notifications/test-email')
  },

  changePassword: async (data: {
    current_password: string
    new_password: string
  }) => {
    await api.put('/settings/change-password', data)
  },

  getLoginHistory: async (): Promise<LoginHistoryEntry[]> => {
    const r = await api.get<{ success?: boolean; data?: LoginHistoryEntry[] }>(
      '/settings/login-history'
    )
    const data = getData<LoginHistoryEntry[]>(
      r.data as { success?: boolean; data?: LoginHistoryEntry[] }
    )
    return Array.isArray(data) ? data : []
  },

  getSessions: async (): Promise<SessionEntry[]> => {
    const r = await api.get<{ success?: boolean; data?: SessionEntry[] }>('/settings/sessions')
    const data = getData<SessionEntry[]>(r.data as { success?: boolean; data?: SessionEntry[] })
    return Array.isArray(data) ? data : []
  },

  exportData: async (): Promise<Blob> => {
    const r = await api.get<Blob>('/settings/export-data', {
      responseType: 'blob',
    })
    return r.data
  },

  deleteAccount: async () => {
    await api.delete('/settings/account')
  },
}
