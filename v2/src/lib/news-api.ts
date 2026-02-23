/**
 * News releases API - synced from PrestoSports.
 */

import api from './api'

function getData<T>(res: { success?: boolean; data?: T; [k: string]: unknown }): T | undefined {
  return res?.success !== false && res?.data !== undefined ? (res.data as T) : undefined
}

export interface NewsReleaseSummary {
  id: number
  team_id: number
  title: string
  summary?: string | null
  author?: string | null
  publish_date?: string | null
  category?: string | null
  image_url?: string | null
  source_url?: string | null
  player_id?: number | null
  player?: { id: number; first_name?: string; last_name?: string } | null
  source_system?: string
  createdAt?: string
  updatedAt?: string
}

export interface NewsRelease extends NewsReleaseSummary {
  content?: string | null
}

export interface NewsListParams {
  category?: string
  player_id?: number
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export const newsApi = {
  list: async (params?: NewsListParams) => {
    const r = await api.get<{
      success?: boolean
      data?: NewsReleaseSummary[]
      pagination?: { page: number; limit: number; total: number; pages: number }
    }>('/news', { params })
    const data = getData(r.data as { success?: boolean; data?: NewsReleaseSummary[] })
    const pagination =
      (r.data as { pagination?: PaginatedResponse<NewsReleaseSummary>['pagination'] })?.pagination ??
      { page: 1, limit: 20, total: 0, pages: 0 }
    return { data: data ?? [], pagination } as PaginatedResponse<NewsReleaseSummary>
  },

  getById: async (id: number) => {
    const r = await api.get<{ success?: boolean; data?: NewsRelease }>(
      `/news/byId/${id}`
    )
    return getData(r.data as { success?: boolean; data?: NewsRelease })
  },
}
