/**
 * Team branding API
 */

import api from './api'

function unwrap<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success ? res.data : undefined
}

export interface Branding {
  name?: string
  logo_url?: string
  primary_color?: string
  secondary_color?: string
}

export const brandingApi = {
  get: async () => {
    const r = await api.get<{ success?: boolean; data?: Branding }>(
      '/teams/branding'
    )
    return unwrap(r.data as { success?: boolean; data?: Branding })
  },

  updateColors: async (primary_color?: string, secondary_color?: string) => {
    const r = await api.put<{ success?: boolean; data?: Branding }>(
      '/teams/branding',
      { primary_color, secondary_color }
    )
    return unwrap(r.data as { success?: boolean; data?: Branding })
  },
}
