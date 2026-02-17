/**
 * Schedules API
 */

import api from './api'

function unwrap<T>(res: { success?: boolean; data?: T }): T | undefined {
  return res?.success ? res.data : undefined
}

export interface Schedule {
  id: number
  team_name?: string
  program_name?: string
  date?: string
  team_id?: number
  created_at?: string
  updated_at?: string
  Sections?: ScheduleSection[]
}

export interface ScheduleSection {
  id: number
  type?: string
  title?: string
  schedule_id?: number
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
  sections?: Array<{ type: string; title: string }>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export const schedulesApi = {
  list: async (params?: { page?: number; limit?: number; date?: string }) => {
    const r = await api.get<{
      success?: boolean
      data?: Schedule[]
      pagination?: { page: number; limit: number; total: number; pages: number }
    }>('/schedules', { params })
    const data = unwrap(r.data as { success?: boolean; data?: Schedule[] })
    const pagination = (r.data as { pagination?: PaginatedResponse<Schedule>['pagination'] })
      ?.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 }
    return { data: data ?? [], pagination } as PaginatedResponse<Schedule>
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: Schedule }>(
      `/schedules/byId/${id}`
    )
    return unwrap(r.data as { success?: boolean; data?: Schedule })
  },

  create: async (data: ScheduleCreateInput) => {
    const r = await api.post<{ success?: boolean; data?: Schedule }>(
      '/schedules',
      {
        team_name: data.team_name,
        program_name: data.program_name,
        date: data.date,
        sections: data.sections ?? [],
      }
    )
    return unwrap(r.data as { success?: boolean; data?: Schedule })
  },

  update: async (id: number, data: Partial<ScheduleCreateInput>) => {
    const r = await api.put<{ success?: boolean; data?: Schedule }>(
      `/schedules/byId/${id}`,
      data
    )
    return unwrap(r.data as { success?: boolean; data?: Schedule })
  },

  delete: async (id: number) => {
    await api.delete(`/schedules/byId/${id}`)
  },
}
