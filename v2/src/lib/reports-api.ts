/**
 * Reports & Analytics API.
 */

import api from './api'

function unwrap<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success ? res.data : undefined
}

export interface PlayerPerformancePoint {
  period?: string
  player_name?: string
  metric?: string
  value?: number
  avg?: number
  [key: string]: unknown
}

export interface RecruitmentPipelinePoint {
  status: string
  count: number
  [key: string]: unknown
}

export const reportsApi = {
  getPlayerPerformance: async () => {
    const r = await api.get<{ success?: boolean; data?: unknown }>(
      '/reports/player-performance'
    )
    const data = unwrap(r.data as { success?: boolean; data?: unknown })
    return (Array.isArray(data) ? data : []) as PlayerPerformancePoint[]
  },

  getRecruitmentPipeline: async () => {
    const r = await api.get<{ success?: boolean; data?: unknown }>(
      '/reports/recruitment-pipeline'
    )
    const data = unwrap(r.data as { success?: boolean; data?: unknown })
    return (Array.isArray(data) ? data : []) as RecruitmentPipelinePoint[]
  },

  getTeamStatistics: async () => {
    const r = await api.get<{ success?: boolean; data?: unknown }>(
      '/reports/team-statistics'
    )
    return unwrap(r.data as { success?: boolean; data?: unknown })
  },

  getScoutingAnalysis: async () => {
    const r = await api.get<{ success?: boolean; data?: unknown }>(
      '/reports/scouting-analysis'
    )
    return unwrap(r.data as { success?: boolean; data?: unknown })
  },
}
