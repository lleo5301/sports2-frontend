/**
 * User permissions API
 */

import api from './api'

function unwrap<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success ? res.data : undefined
}

export const permissionsApi = {
  get: async (): Promise<string[]> => {
    const r = await api.get<{ success?: boolean; data?: string[] }>(
      '/auth/permissions'
    )
    const data = unwrap(r.data as { success?: boolean; data?: string[] })
    return Array.isArray(data) ? data : []
  },
}
