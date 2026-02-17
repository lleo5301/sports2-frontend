/**
 * Depth Charts API
 */

import api from './api'

function unwrap<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success ? res.data : undefined
}

export interface DepthChart {
  id: number
  name?: string
  team_id?: number
  created_at?: string
  updated_at?: string
}

export const depthChartsApi = {
  list: async () => {
    const r = await api.get<{ success?: boolean; data?: DepthChart[] }>(
      '/depth-charts'
    )
    const data = unwrap(r.data as { success?: boolean; data?: DepthChart[] })
    return Array.isArray(data) ? data : []
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: DepthChart }>(
      `/depth-charts/byId/${id}`
    )
    return unwrap(r.data as { success?: boolean; data?: DepthChart })
  },

  create: async (name: string) => {
    const r = await api.post<{ success?: boolean; data?: DepthChart }>(
      '/depth-charts',
      { name }
    )
    return unwrap(r.data as { success?: boolean; data?: DepthChart })
  },

  duplicate: async (id: number) => {
    const r = await api.post<{ success?: boolean; data?: DepthChart }>(
      `/depth-charts/${id}/duplicate`
    )
    return unwrap(r.data as { success?: boolean; data?: DepthChart })
  },
}
