/**
 * Scouting Reports API.
 * Backend may return { data } or { data, pagination } with or without success flag.
 */
import api from './api'

function getData<T>(res: {
  success?: boolean
  data?: T
  [k: string]: unknown
}): T | undefined {
  if (!res) return undefined
  // Standard envelope: { success: true, data: ... }
  if (res.success !== false && res.data !== undefined) return res.data as T
  // Fallback: response itself might be the data (no envelope)
  if (
    res.success === undefined &&
    res.data === undefined &&
    typeof res === 'object'
  ) {
    return res as unknown as T
  }
  return undefined
}

export const EVENT_TYPES = [
  'game',
  'showcase',
  'practice',
  'workout',
  'video',
] as const

/** Grade: 20-80 numeric or letter (B+, A, etc.) */
export type GradeValue = number | string

/* ── Tool Grades (JSONB) ── */

export interface PresentFutureGrade {
  present?: number
  future?: number
  description?: string
}

export interface GradeWithDescription {
  grade?: number
  description?: string
}

export interface FuturePositionEntry {
  position: string
  pct?: number
  grade?: number
  description?: string
}

export interface ToolGrades {
  body?: { grade?: number; projection?: string; description?: string }
  athleticism?: { grade?: number; description?: string }
  bat?: {
    hit?: PresentFutureGrade
    power?: PresentFutureGrade
    raw_power?: PresentFutureGrade
    bat_speed?: PresentFutureGrade
    contact?: string
    swing_decisions?: string
    contact_quality?: string
  }
  field?: {
    arm_strength?: PresentFutureGrade
    arm_accuracy?: PresentFutureGrade
    current_position?: string
    defense_present?: number
    pop_times?: string
    fielding_grade?: number
    fielding_description?: string
    future_positions?: FuturePositionEntry[]
  }
  run?: {
    speed?: GradeWithDescription
    times_to_first?: string
    baserunning?: GradeWithDescription
    instincts?: GradeWithDescription
    compete?: GradeWithDescription
  }
  pitching?: {
    fastball?: PresentFutureGrade
    slider?: PresentFutureGrade
    curveball?: PresentFutureGrade
    changeup?: PresentFutureGrade
    command?: number
    control?: number
    delivery?: string
    description?: string
  }
}

export type ReportType = 'hitter' | 'pitcher'

export const REPORT_CONFIDENCE_OPTIONS = ['High', 'Medium', 'Low'] as const
export const BODY_PROJECTION_OPTIONS = [
  'Positive Projection',
  'Neutral Projection',
  'Negative Projection',
] as const
export const QUALITY_SCALE_OPTIONS = [
  'Well Below Average',
  'Below Average',
  'Average',
  'Above Average',
  'Well Above Average',
] as const
export const GRADE_SCALE = [
  20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80,
] as const

export interface ScoutingReport {
  id: number
  prospect_id?: number
  player_id?: number
  created_by?: number
  report_date?: string
  event_type?: string
  // Legacy flat grade columns (backward compat)
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
  arm_present?: GradeValue
  arm_future?: GradeValue
  power_present?: GradeValue
  power_future?: GradeValue
  sixty_yard_dash?: number
  mlb_comparison?: string
  notes?: string
  // New expanded fields
  report_type?: ReportType
  role?: number
  round_would_take?: string
  money_save?: boolean
  overpay?: boolean
  dollar_amount?: string
  report_confidence?: string
  impact_statement?: string
  summary?: string
  look_recommendation?: number
  look_recommendation_desc?: string
  player_comparison?: string
  date_seen_start?: string
  date_seen_end?: string
  video_report?: boolean
  tool_grades?: ToolGrades
  // Timestamps & relations
  created_at?: string
  updated_at?: string
  User?: { id: number; first_name?: string; last_name?: string }
  Prospect?: {
    id: number
    first_name?: string
    last_name?: string
    primary_position?: string
  }
  Player?: {
    id: number
    first_name?: string
    last_name?: string
    position?: string
  }
}

export interface ScoutingReportCreateInput {
  prospect_id?: number
  player_id?: number
  report_date: string
  event_type: string
  // Legacy flat grade fields
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
  arm_present?: GradeValue
  arm_future?: GradeValue
  power_present?: GradeValue
  power_future?: GradeValue
  sixty_yard_dash?: number
  mlb_comparison?: string
  notes?: string
  // New expanded fields
  report_type?: ReportType
  role?: number
  round_would_take?: string
  money_save?: boolean
  overpay?: boolean
  dollar_amount?: string
  report_confidence?: string
  impact_statement?: string
  summary?: string
  look_recommendation?: number
  look_recommendation_desc?: string
  player_comparison?: string
  date_seen_start?: string
  date_seen_end?: string
  video_report?: boolean
  tool_grades?: ToolGrades
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
    return getData<ScoutingReport>(
      r.data as { success?: boolean; data?: ScoutingReport }
    )
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
    // Legacy flat grade fields
    const gradeFields = [
      'overall_present',
      'overall_future',
      'hitting_present',
      'hitting_future',
      'pitching_present',
      'pitching_future',
      'fielding_present',
      'fielding_future',
      'speed_present',
      'speed_future',
      'arm_present',
      'arm_future',
      'power_present',
      'power_future',
    ] as const
    for (const k of gradeFields) {
      const v = data[k]
      if (v !== undefined && v !== null && v !== '') payload[k] = v
    }
    if (data.sixty_yard_dash != null)
      payload.sixty_yard_dash = data.sixty_yard_dash
    if (data.mlb_comparison?.trim())
      payload.mlb_comparison = data.mlb_comparison.trim()
    if (data.notes?.trim()) payload.notes = data.notes.trim()
    // New expanded fields
    const expandedStringFields = [
      'report_type',
      'round_would_take',
      'dollar_amount',
      'report_confidence',
      'impact_statement',
      'summary',
      'look_recommendation_desc',
      'player_comparison',
      'date_seen_start',
      'date_seen_end',
    ] as const
    for (const k of expandedStringFields) {
      const v = data[k]
      if (v !== undefined && v !== null && v !== '') payload[k] = v
    }
    if (data.role != null) payload.role = data.role
    if (data.look_recommendation != null)
      payload.look_recommendation = data.look_recommendation
    if (data.money_save != null) payload.money_save = data.money_save
    if (data.overpay != null) payload.overpay = data.overpay
    if (data.video_report != null) payload.video_report = data.video_report
    if (data.tool_grades != null && Object.keys(data.tool_grades).length > 0)
      payload.tool_grades = data.tool_grades

    const r = await api.post<{ success?: boolean; data?: ScoutingReport }>(
      '/reports/scouting',
      payload
    )
    return getData<ScoutingReport>(
      r.data as { success?: boolean; data?: ScoutingReport }
    )
  },

  update: async (id: number, data: Partial<ScoutingReportCreateInput>) => {
    const r = await api.put<{ success?: boolean; data?: ScoutingReport }>(
      `/reports/scouting/${id}`,
      data
    )
    return getData<ScoutingReport>(
      r.data as { success?: boolean; data?: ScoutingReport }
    )
  },
}
