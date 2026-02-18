/**
 * User permissions API.
 * Backend may return { data } with or without success flag.
 */

import api from './api'

function getData<T>(res: { success?: boolean; data?: T; [k: string]: unknown }): T | undefined {
  return res?.success !== false && res?.data !== undefined ? (res.data as T) : undefined
}

export const permissionsApi = {
  get: async (): Promise<string[]> => {
    const r = await api.get<{ success?: boolean; data?: string[] }>(
      '/auth/permissions'
    )
    const data = getData<string[]>(r.data as { success?: boolean; data?: string[] })
    return Array.isArray(data) ? data : []
  },
}
