/**
 * Schedules API
 *
 * Backend returns { data, pagination } without success wrapper for list,
 * and { data } or { message, data } for get/create/update.
 */

import api from './api'

/** Use data from response - backend may omit success flag */
function getData<T>(res: {
  success?: boolean
  data?: T
  [k: string]: unknown
}): T | undefined {
  return res?.data as T | undefined
}

export interface Schedule {
  id: number
  team_name?: string
  program_name?: string
  date?: string
  team_id?: number
  created_at?: string
  updated_at?: string
  /** Backend returns ScheduleSections (Sequelize default) */
  ScheduleSections?: ScheduleSection[]
  /** Alias for ScheduleSections */
  Sections?: ScheduleSection[]
}

export interface ScheduleSection {
  id: number
  type?: string
  title?: string
  schedule_id?: number
  /** Backend returns ScheduleActivities */
  ScheduleActivities?: ScheduleActivity[]
  Activities?: ScheduleActivity[]
}

export interface ScheduleActivity {
  id: number
  time?: string
  activity?: string
  location?: string
  notes?: string
}

export interface ScheduleCreateInput {
  team_name: string
  program_name: string
  date: string
  sections?: Array<{
    type: string
    title: string
    activities?: Array<{
      time: string
      activity: string
      location?: string
      notes?: string
    }>
  }>
}

/** Schedule section types per OpenAPI enum */
export const SCHEDULE_SECTION_TYPES = [
  'general',
  'position_players',
  'pitchers',
  'grinder_performance',
  'grinder_hitting',
  'grinder_defensive',
  'bullpen',
  'live_bp',
] as const

export type ScheduleSectionType = (typeof SCHEDULE_SECTION_TYPES)[number]

export interface ScheduleStats {
  totalEvents: number
  thisWeek: number
  thisMonth: number
}

export interface AddSectionInput {
  type: ScheduleSectionType | string
  title: string
}

export interface AddActivityInput {
  time: string
  activity: string
  location?: string
  notes?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export const schedulesApi = {
  list: async (params?: { page?: number; limit?: number; date?: string }) => {
    const r = await api.get<{
      data?: Schedule[]
      pagination?: { page: number; limit: number; total: number; pages: number }
    }>('/schedules', { params })
    const payload = r.data as {
      data?: Schedule[]
      pagination?: PaginatedResponse<Schedule>['pagination']
    }
    const data = getData<Schedule[]>(payload) ?? []
    const pagination =
      payload?.pagination ?? {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      }
    return {
      data: Array.isArray(data) ? data : [],
      pagination,
    } as PaginatedResponse<Schedule>
  },

  getById: async (id: number) => {
    const r = await api.get<{ data?: Schedule }>(
      `/schedules/byId/${id}`
    )
    return getData<Schedule>(r.data as { data?: Schedule })
  },

  create: async (data: ScheduleCreateInput) => {
    const r = await api.post<{ data?: Schedule }>(
      '/schedules',
      {
        team_name: data.team_name,
        program_name: data.program_name,
        date: data.date,
        sections: data.sections ?? [],
      }
    )
    return getData<Schedule>(r.data as { data?: Schedule })
  },

  update: async (id: number, data: Partial<ScheduleCreateInput>) => {
    const r = await api.put<{ data?: Schedule }>(
      `/schedules/byId/${id}`,
      data
    )
    return getData<Schedule>(r.data as { data?: Schedule })
  },

  delete: async (id: number) => {
    await api.delete(`/schedules/byId/${id}`)
  },

  /** Schedule statistics (totalEvents, thisWeek, thisMonth) */
  getStats: async () => {
    const r = await api.get<{ data?: ScheduleStats }>('/schedules/stats')
    return getData<ScheduleStats>(r.data as { data?: ScheduleStats })
  },

  /** Add section to schedule - POST /schedules/{id}/sections */
  addSection: async (
    scheduleId: number,
    data: AddSectionInput
  ): Promise<ScheduleSection | undefined> => {
    const r = await api.post<{ data?: ScheduleSection }>(
      `/schedules/${scheduleId}/sections`,
      { type: data.type, title: data.title }
    )
    return getData<ScheduleSection>(r.data as { data?: ScheduleSection })
  },

  /** Add activity to section - POST /schedules/sections/{sectionId}/activities */
  addActivity: async (
    sectionId: number,
    data: AddActivityInput
  ): Promise<ScheduleActivity | undefined> => {
    const r = await api.post<{ data?: ScheduleActivity }>(
      `/schedules/sections/${sectionId}/activities`,
      {
        time: data.time,
        activity: data.activity,
        location: data.location ?? undefined,
        notes: data.notes ?? undefined,
      }
    )
    return getData<ScheduleActivity>(r.data as { data?: ScheduleActivity })
  },

  /** Delete section and its activities */
  deleteSection: async (sectionId: number) => {
    await api.delete(`/schedules/sections/${sectionId}`)
  },

  /** Delete single activity */
  deleteActivity: async (activityId: number) => {
    await api.delete(`/schedules/activities/${activityId}`)
  },

  /**
   * Export schedules as HTML (backend returns printable HTML; browser can print-to-PDF).
   * Opens in new tab for print/save.
   */
  exportPdf: async () => {
    const r = await api.get<string>('/schedules/export-pdf', {
      responseType: 'text',
    })
    const html = typeof r.data === 'string' ? r.data : ''
    if (html) {
      const w = window.open('', '_blank')
      if (w) {
        w.document.write(html)
        w.document.close()
      }
    }
    return html
  },
}
