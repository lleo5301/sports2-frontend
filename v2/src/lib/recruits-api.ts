/**
 * Recruits API — recruiting board and preference lists.
 * See docs/api/preference-lists-api.md for full reference.
 */

import api from './api'

function getData<T>(res: { success?: boolean; data?: T; [k: string]: unknown }): T | undefined {
  return (res?.success !== false && res?.data !== undefined) ? (res.data as T) : undefined
}

export const LIST_TYPES = [
  'new_players',
  'overall_pref_list',
  'hs_pref_list',
  'college_transfers',
  'pitchers_pref_list',
] as const

export type ListType = (typeof LIST_TYPES)[number]

export const PREF_LIST_STATUSES = [
  'active',
  'inactive',
  'committed',
  'signed',
  'lost',
] as const

export type PrefListStatus = (typeof PREF_LIST_STATUSES)[number]

export const INTEREST_LEVELS = ['High', 'Medium', 'Low', 'Unknown'] as const

export type InterestLevel = (typeof INTEREST_LEVELS)[number]

export const LIST_TYPE_LABELS: Record<ListType, string> = {
  new_players: 'New Players',
  overall_pref_list: 'Overall Preference List',
  hs_pref_list: 'High School Preference List',
  college_transfers: 'College Transfers',
  pitchers_pref_list: 'Pitchers Preference List',
}

export interface RecruitProspect {
  id: number
  first_name?: string
  last_name?: string
  primary_position?: string
  school_type?: string
  school_name?: string
  city?: string
  state?: string
  graduation_year?: number
  status?: string
  PreferenceLists?: Array<{
    list_type: string
    priority?: number
    status?: string
    interest_level?: string
  }>
}

export interface PreferenceListEntry {
  id: number
  player_id: number | null
  prospect_id: number | null
  team_id?: number
  list_type: string
  priority: number
  status: string
  interest_level?: string
  notes?: string
  contact_notes?: string
  visit_scheduled?: boolean
  visit_date?: string
  scholarship_offered?: boolean
  scholarship_amount?: number | null
  last_contact_date?: string
  next_contact_date?: string
  added_date?: string
  added_by?: number
  Player: { id: number; first_name?: string; last_name?: string; [k: string]: unknown } | null
  Prospect: {
    id: number
    first_name?: string
    last_name?: string
    primary_position?: string
    school_type?: string
    school_name?: string
    city?: string
    state?: string
    graduation_year?: number
    [k: string]: unknown
  } | null
  AddedBy?: { id: number; first_name?: string; last_name?: string }
}

export interface AddToPreferenceListInput {
  prospect_id?: number
  player_id?: number
  list_type: ListType | string
  priority?: number
  interest_level?: InterestLevel | string
  notes?: string
  visit_scheduled?: boolean
  visit_date?: string
  scholarship_offered?: boolean
  scholarship_amount?: number
}

export interface UpdatePreferenceListInput {
  priority?: number
  status?: PrefListStatus | string
  interest_level?: InterestLevel | string
  notes?: string
  contact_notes?: string
  visit_scheduled?: boolean
  visit_date?: string
  scholarship_offered?: boolean
  scholarship_amount?: number
  last_contact_date?: string
  next_contact_date?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export interface RecruitsListParams {
  page?: number
  limit?: number
  school_type?: string
  position?: string
  search?: string
}

export interface PreferenceListsParams {
  page?: number
  limit?: number
  list_type?: ListType | string
  status?: PrefListStatus | string
}

export const recruitsApi = {
  /** Browse all prospects with their preference list memberships */
  listRecruits: async (params?: RecruitsListParams) => {
    const r = await api.get<{
      success?: boolean
      data?: RecruitProspect[]
      pagination?: PaginatedResponse<RecruitProspect>['pagination']
    }>('/recruits', { params })
    const payload = r.data as {
      success?: boolean
      data?: RecruitProspect[]
      pagination?: PaginatedResponse<RecruitProspect>['pagination']
    }
    const data = getData<RecruitProspect[]>(payload) ?? []
    const pagination =
      payload?.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 }
    return {
      data: Array.isArray(data) ? data : [],
      pagination,
    } as PaginatedResponse<RecruitProspect>
  },

  /** List preference list entries (filter by list_type, status) */
  listPreferenceLists: async (params?: PreferenceListsParams) => {
    const r = await api.get<{
      success?: boolean
      data?: PreferenceListEntry[]
      pagination?: PaginatedResponse<PreferenceListEntry>['pagination']
    }>('/recruits/preference-lists', { params })
    const payload = r.data as {
      success?: boolean
      data?: PreferenceListEntry[]
      pagination?: PaginatedResponse<PreferenceListEntry>['pagination']
    }
    const data = getData<PreferenceListEntry[]>(payload) ?? []
    const pagination =
      payload?.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 }
    return {
      data: Array.isArray(data) ? data : [],
      pagination,
    } as PaginatedResponse<PreferenceListEntry>
  },

  /** Add prospect or player to a preference list */
  addToPreferenceList: async (input: AddToPreferenceListInput) => {
    const r = await api.post<{ success?: boolean; data?: PreferenceListEntry }>(
      '/recruits/preference-lists',
      input
    )
    return getData<PreferenceListEntry>(r.data as { success?: boolean; data?: PreferenceListEntry })
  },

  /** Update preference list entry */
  updatePreferenceList: async (id: number, input: UpdatePreferenceListInput) => {
    const r = await api.put<{ success?: boolean; data?: PreferenceListEntry }>(
      `/recruits/preference-lists/${id}`,
      input
    )
    return getData<PreferenceListEntry>(r.data as { success?: boolean; data?: PreferenceListEntry })
  },

  /** Remove from preference list */
  removeFromPreferenceList: async (id: number) => {
    await api.delete(`/recruits/preference-lists/${id}`)
  },
}
