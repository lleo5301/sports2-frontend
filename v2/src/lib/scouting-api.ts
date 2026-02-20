/**
 * Scouting Reports API.
 * Backend may return { data } or { data, pagination } with or without success flag.
 */

import api from './api'

function getData<T>(res: { success?: boolean; data?: T; [k: string]: unknown }): T | undefined {
  return (res?.success !== false && res?.data !== undefined) ? res.data as T : undefined
}

export const EVENT_TYPES = ['game', 'showcase', 'practice', 'workout', 'video'] as const

/** Grade: 20-80 numeric or letter (B+, A, etc.) */
export type GradeValue = number | string

export interface ScoutingReport {
  id: number
  prospect_id?: number
  player_id?: number
  created_by?: number
  report_date?: string
  event_type?: string
  overall_present?: GradeValue
  overall_future?: GradeValue
  hitting_present?: GradeValue
  hitting_future?: GradeValue
  pitching_present?: GradeValue
  pitching_future?: GradeValue
  fielding_present?: GradeValue
  fielding_future?: GradeValue
  speed_present?: GradeValue
  speed_future?: GradeValue
  sixty_yard_dash?: number
  mlb_comparison?: string
  notes?: string
  created_at?: string
  updated_at?: string
  User?: { id: number; first_name?: string; last_name?: string }
  Prospect?: { id: number; first_name?: string; last_name?: string; primary_position?: string }
  Player?: { id: number; first_name?: string; last_name?: string; position?: string }
}

export interface ScoutingReportCreateInput {
  prospect_id?: number
  player_id?: number
  report_date: string
  event_type: string
  overall_present?: GradeValue
  overall_future?: GradeValue
  hitting_present?: GradeValue
  hitting_future?: GradeValue
  pitching_present?: GradeValue
  pitching_future?: GradeValue
  fielding_present?: GradeValue
  fielding_future?: GradeValue
  speed_present?: GradeValue
  speed_future?: GradeValue
  sixty_yard_dash?: number
  mlb_comparison?: string
  notes?: string
}

export interface ScoutingReportListParams {
  prospect_id?: number
  player_id?: number
  start_date?: string
  end_date?: string
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export const scoutingApi = {
  list: async (params?: ScoutingReportListParams) => {
    const r = await api.get<{
      success?: boolean
      data?: ScoutingReport[]
      pagination?: { page: number; limit: number; total: number; pages: number }
    }>('/reports/scouting', { params })
    const payload = r.data as {
      success?: boolean
      data?: ScoutingReport[]
      pagination?: PaginatedResponse<ScoutingReport>['pagination']
    }
    const data = getData<ScoutingReport[]>(payload) ?? []
    const pagination = payload?.pagination ?? {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0,
    }
    return {
      data: Array.isArray(data) ? data : [],
      pagination,
    } as PaginatedResponse<ScoutingReport>
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: ScoutingReport }>(
      `/reports/scouting/${id}`
    )
    return getData<ScoutingReport>(r.data as { success?: boolean; data?: ScoutingReport })
  },

  create: async (data: ScoutingReportCreateInput) => {
    const payload: Record<string, unknown> = {
      report_date: data.report_date,
      event_type: data.event_type,
    }
    if (data.prospect_id != null) {
      payload.prospect_id = data.prospect_id
    } else if (data.player_id != null) {
      payload.player_id = data.player_id
    }
    const gradeFields = [
      'overall_present', 'overall_future', 'hitting_present', 'hitting_future',
      'pitching_present', 'pitching_future', 'fielding_present', 'fielding_future',
      'speed_present', 'speed_future',
    ] as const
    for (const k of gradeFields) {
      const v = data[k]
      if (v !== undefined && v !== null && v !== '') payload[k] = v
    }
    if (data.sixty_yard_dash != null) payload.sixty_yard_dash = data.sixty_yard_dash
    if (data.mlb_comparison?.trim()) payload.mlb_comparison = data.mlb_comparison.trim()
    if (data.notes?.trim()) payload.notes = data.notes.trim()

    const r = await api.post<{ success?: boolean; data?: ScoutingReport }>(
      '/reports/scouting',
      payload
    )
    return getData<ScoutingReport>(r.data as { success?: boolean; data?: ScoutingReport })
  },

  update: async (id: number, data: Partial<ScoutingReportCreateInput>) => {
    const r = await api.put<{ success?: boolean; data?: ScoutingReport }>(
      `/reports/scouting/${id}`,
      data
    )
    return getData<ScoutingReport>(r.data as { success?: boolean; data?: ScoutingReport })
  },
}
