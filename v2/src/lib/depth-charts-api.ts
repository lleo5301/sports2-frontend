/**
 * Depth Charts API.
 * Backend may return { data } with or without success flag.
 */

import api from './api'

function getData<T>(res: { success?: boolean; data?: T; [k: string]: unknown }): T | undefined {
  return res?.success !== false && res?.data !== undefined ? (res.data as T) : undefined
}

export interface DepthChartPosition {
  id: number
  position_code: string
  position_name: string
  color?: string
  icon?: string
  sort_order?: number
  max_players?: number
  description?: string
  DepthChartPlayers?: DepthChartPlayerAssignment[]
}

export interface DepthChartPlayerAssignment {
  id: number
  depth_order: number
  notes?: string
  Player?: {
    id: number
    first_name?: string
    last_name?: string
    position?: string
    school_type?: string
    graduation_year?: number
    height?: string
    weight?: number
    jersey_number?: string
    batting_avg?: string
    home_runs?: number
    rbi?: number
    stolen_bases?: number
    era?: number
    wins?: number
    losses?: number
    strikeouts?: number
    has_medical_issues?: boolean
    has_comparison?: boolean
    status?: string
  }
}

export interface DepthChart {
  id: number
  name?: string
  team_id?: number
  created_at?: string
  updated_at?: string
  version?: number
  description?: string
  is_default?: boolean
  effective_date?: string
  DepthChartPositions?: DepthChartPosition[]
  Creator?: { first_name?: string; last_name?: string }
}

export interface DepthChartHistoryEntry {
  id: number
  action: string
  description?: string
  created_at: string
  User?: { first_name?: string; last_name?: string }
}

export const depthChartsApi = {
  list: async () => {
    const r = await api.get<{ success?: boolean; data?: DepthChart[] }>(
      '/depth-charts'
    )
    const data = getData<DepthChart[]>(r.data as { success?: boolean; data?: DepthChart[] })
    return Array.isArray(data) ? data : []
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: DepthChart }>(
      `/depth-charts/byId/${id}`
    )
    return getData<DepthChart>(r.data as { success?: boolean; data?: DepthChart })
  },

  create: async (name: string) => {
    const r = await api.post<{ success?: boolean; data?: DepthChart }>(
      '/depth-charts',
      { name }
    )
    return getData<DepthChart>(r.data as { success?: boolean; data?: DepthChart })
  },

  update: async (id: number, data: { name?: string; description?: string }) => {
    const r = await api.put<{ success?: boolean; data?: DepthChart }>(
      `/depth-charts/byId/${id}`,
      data
    )
    return getData<DepthChart>(r.data as { success?: boolean; data?: DepthChart })
  },

  delete: async (id: number) => {
    await api.delete(`/depth-charts/byId/${id}`)
  },

  duplicate: async (id: number) => {
    const r = await api.post<{ success?: boolean; data?: DepthChart }>(
      `/depth-charts/${id}/duplicate`
    )
    return getData<DepthChart>(r.data as { success?: boolean; data?: DepthChart })
  },

  getAvailablePlayers: async (chartId: number) => {
    const r = await api.get<{ success?: boolean; data?: unknown[] }>(
      `/depth-charts/${chartId}/available-players`
    )
    const data = getData(r.data as { success?: boolean; data?: unknown })
    return Array.isArray(data) ? data : []
  },

  getRecommendedPlayers: async (chartId: number, positionId: number) => {
    const r = await api.get<{ success?: boolean; data?: unknown[] }>(
      `/depth-charts/${chartId}/recommended-players/${positionId}`
    )
    const data = getData(r.data as { success?: boolean; data?: unknown })
    return Array.isArray(data) ? data : []
  },

  getHistory: async (chartId: number) => {
    const r = await api.get<{ success?: boolean; data?: DepthChartHistoryEntry[] }>(
      `/depth-charts/${chartId}/history`
    )
    const data = getData(r.data as { success?: boolean; data?: unknown })
    return Array.isArray(data) ? data : []
  },

  addPosition: async (
    chartId: number,
    data: {
      position_code: string
      position_name: string
      color?: string
      icon?: string
      sort_order?: number
      max_players?: number
    }
  ) => {
    const r = await api.post<{ success?: boolean; data?: unknown }>(
      `/depth-charts/${chartId}/positions`,
      data
    )
    return getData(r.data as { success?: boolean; data?: unknown })
  },

  updatePosition: async (
    positionId: number,
    data: Partial<{
      position_code: string
      position_name: string
      color: string
      icon: string
      sort_order: number
      max_players: number
    }>
  ) => {
    const r = await api.put<{ success?: boolean; data?: unknown }>(
      `/depth-charts/positions/${positionId}`,
      data
    )
    return getData(r.data as { success?: boolean; data?: unknown })
  },

  deletePosition: async (positionId: number) => {
    await api.delete(`/depth-charts/positions/${positionId}`)
  },

  assignPlayer: async (
    positionId: number,
    data: { player_id: number; rank?: number; depth_order?: number; notes?: string }
  ) => {
    const r = await api.post<{ success?: boolean; data?: unknown }>(
      `/depth-charts/positions/${positionId}/players`,
      { player_id: data.player_id, rank: data.depth_order ?? data.rank }
    )
    return getData(r.data as { success?: boolean; data?: unknown })
  },

  unassignPlayer: async (assignmentId: number) => {
    await api.delete(`/depth-charts/players/${assignmentId}`)
  },
}
