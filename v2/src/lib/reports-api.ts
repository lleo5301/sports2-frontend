/**
 * Reports & Analytics API.
 * Backend may return { data } with or without success flag.
 */

import api from './api'

function getData<T>(res: { success?: boolean; data?: T; [k: string]: unknown }): T | undefined {
  return res?.success !== false && res?.data !== undefined ? (res.data as T) : undefined
}

/** Custom report (list/detail) */
export interface Report {
  id: string
  title: string
  type?: string
  description?: string
  status?: 'draft' | 'published' | 'archived'
  data_sources?: string[]
  sections?: string[]
  filters?: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

/** Create report payload */
export interface ReportCreateInput {
  title: string
  type: string
  description?: string
  status?: 'draft' | 'published' | 'archived'
  data_sources?: string[]
  sections?: string[]
  filters?: Record<string, unknown>
}

/** Update report payload (partial) */
export interface ReportUpdateInput {
  title?: string
  description?: string
  status?: 'draft' | 'published' | 'archived'
  data_sources?: string[]
  sections?: string[]
  filters?: Record<string, unknown>
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
  /** List custom reports */
  list: async () => {
    const r = await api.get<{ success?: boolean; data?: Report[] }>('/reports')
    const data = getData<Report[]>(r.data as { success?: boolean; data?: Report[] })
    return (Array.isArray(data) ? data : []) as Report[]
  },

  getById: async (id: string) => {
    const r = await api.get<{ success?: boolean; data?: Report }>(
      `/reports/byId/${id}`
    )
    return getData<Report>(r.data as { success?: boolean; data?: Report })
  },

  create: async (data: ReportCreateInput) => {
    const r = await api.post<{ success?: boolean; data?: Report }>(
      '/reports',
      data
    )
    return getData<Report>(r.data as { success?: boolean; data?: Report })
  },

  update: async (id: string, data: ReportUpdateInput) => {
    const r = await api.put<{ success?: boolean; data?: Report }>(
      `/reports/byId/${id}`,
      data
    )
    return getData<Report>(r.data as { success?: boolean; data?: Report })
  },

  delete: async (id: string) => {
    const r = await api.delete<{ success?: boolean }>(`/reports/byId/${id}`)
    return (r.data as { success?: boolean })?.success ?? true
  },

  generatePdf: async (reportId: string, reportType?: string) => {
    const r = await api.post<{ success?: boolean; data?: { url?: string } }>(
      '/reports/generate-pdf',
      { report_id: reportId, report_type: reportType }
    )
    return getData<{ url?: string }>(r.data as { success?: boolean; data?: { url?: string } })
  },

  exportExcel: async (reportId: string, reportType?: string) => {
    const r = await api.post<{ success?: boolean; data?: { url?: string } }>(
      '/reports/export-excel',
      { report_id: reportId, report_type: reportType }
    )
    return getData<{ url?: string }>(r.data as { success?: boolean; data?: { url?: string } })
  },

  getPlayerPerformance: async () => {
    const r = await api.get<{ success?: boolean; data?: unknown }>(
      '/reports/player-performance'
    )
    const data = getData(r.data as { success?: boolean; data?: unknown })
    return (Array.isArray(data) ? data : []) as PlayerPerformancePoint[]
  },

  getRecruitmentPipeline: async () => {
    const r = await api.get<{ success?: boolean; data?: unknown }>(
      '/reports/recruitment-pipeline'
    )
    const data = getData(r.data as { success?: boolean; data?: unknown })
    return (Array.isArray(data) ? data : []) as RecruitmentPipelinePoint[]
  },

  getTeamStatistics: async () => {
    const r = await api.get<{ success?: boolean; data?: unknown }>(
      '/reports/team-statistics'
    )
    return getData(r.data as { success?: boolean; data?: unknown })
  },

  getScoutingAnalysis: async () => {
    const r = await api.get<{ success?: boolean; data?: unknown }>(
      '/reports/scouting-analysis'
    )
    return getData(r.data as { success?: boolean; data?: unknown })
  },
}
