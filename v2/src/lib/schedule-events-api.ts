/**
 * Schedule Events API - calendar events (date range).
 */

import api from './api'

function unwrap<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success ? res.data : undefined
}

export interface ScheduleEvent {
  id: number
  title?: string
  start_date?: string
  end_date?: string
  location_id?: number
  created_at?: string
  updated_at?: string
}

export interface ScheduleEventsListParams {
  start_date?: string
  end_date?: string
}

export const scheduleEventsApi = {
  list: async (params?: ScheduleEventsListParams) => {
    const r = await api.get<{ success?: boolean; data?: ScheduleEvent[] }>(
      '/schedule-events',
      { params }
    )
    const data = unwrap(r.data as { success?: boolean; data?: ScheduleEvent[] })
    return data ?? []
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: ScheduleEvent }>(
      `/schedule-events/${id}`
    )
    return unwrap(r.data as { success?: boolean; data?: ScheduleEvent })
  },
}
