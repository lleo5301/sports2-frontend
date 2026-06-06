import { toast } from 'sonner'
import { create } from 'zustand'
import { synergyApi } from '@/lib/synergy-api'
import type {
  SynergyStatus,
  SynergyConfigureRequest,
  SyncHistoryEntry,
  Pagination,
  GameSyncResult,
  EventSyncResult,
  FullSyncResult,
} from '@/features/integrations/synergy/types'

type LastSyncResult =
  | { type: 'games'; data: GameSyncResult }
  | { type: 'events'; data: EventSyncResult }
  | { type: 'all'; data: FullSyncResult }
  | null

interface SynergyLoadingState {
  status: boolean
  configure: boolean
  disconnect: boolean
  syncGames: boolean
  syncEvents: boolean
  syncAll: boolean
  history: boolean
}

interface SynergyState {
  status: SynergyStatus | null
  syncHistory: SyncHistoryEntry[]
  historyPagination: Pagination
  lastSyncResult: LastSyncResult
  loading: SynergyLoadingState

  fetchStatus: () => Promise<void>
  configure: (params: SynergyConfigureRequest) => Promise<boolean>
  disconnect: () => Promise<void>
  syncGames: (season?: number) => Promise<void>
  syncGameEvents: (gameId: string) => Promise<void>
  syncAll: (params?: { season?: number; force?: boolean }) => Promise<void>
  fetchHistory: (page?: number) => Promise<void>
  clearLastSyncResult: () => void
}

const defaultLoading: SynergyLoadingState = {
  status: false,
  configure: false,
  disconnect: false,
  syncGames: false,
  syncEvents: false,
  syncAll: false,
  history: false,
}

const defaultPagination: Pagination = {
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
}

export const useSynergyStore = create<SynergyState>()((set, get) => ({
  status: null,
  syncHistory: [],
  historyPagination: defaultPagination,
  lastSyncResult: null,
  loading: defaultLoading,

  fetchStatus: async () => {
    set((s) => ({ loading: { ...s.loading, status: true } }))
    try {
      const status = await synergyApi.getStatus()
      set({ status })
    } catch {
      set({ status: { configured: false } })
    } finally {
      set((s) => ({ loading: { ...s.loading, status: false } }))
    }
  },

  configure: async (params) => {
    set((s) => ({ loading: { ...s.loading, configure: true } }))
    try {
      await synergyApi.configure(params)
      await get().fetchStatus()
      toast.success('Synergy integration configured successfully')
      return true
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error).message ||
        'Configuration failed'
      toast.error(message)
      return false
    } finally {
      set((s) => ({ loading: { ...s.loading, configure: false } }))
    }
  },

  disconnect: async () => {
    set((s) => ({ loading: { ...s.loading, disconnect: true } }))
    try {
      await synergyApi.disconnect()
      set({ status: { configured: false }, lastSyncResult: null })
      toast.success('Synergy integration disconnected')
    } catch {
      toast.error('Failed to disconnect Synergy integration')
    } finally {
      set((s) => ({ loading: { ...s.loading, disconnect: false } }))
    }
  },

  syncGames: async (season) => {
    set((s) => ({ loading: { ...s.loading, syncGames: true } }))
    try {
      const result = await synergyApi.syncGames(season ? { season } : undefined)
      set({ lastSyncResult: { type: 'games', data: result } })
      toast.success(
        `Games synced: ${result.created} created, ${result.updated} updated` +
          (result.failed > 0 ? `, ${result.failed} failed` : '')
      )
      await get().fetchHistory(1)
    } catch (err) {
      toast.error((err as Error).message || 'Failed to sync games')
    } finally {
      set((s) => ({ loading: { ...s.loading, syncGames: false } }))
    }
  },

  syncGameEvents: async (gameId) => {
    set((s) => ({ loading: { ...s.loading, syncEvents: true } }))
    try {
      const result = await synergyApi.syncGameEvents(gameId)
      set({ lastSyncResult: { type: 'events', data: result } })
      toast.success(
        `Events synced: ${result.created} created` +
          (result.failed > 0 ? `, ${result.failed} failed` : '')
      )
      await get().fetchHistory(1)
    } catch (err) {
      toast.error((err as Error).message || 'Failed to sync game events')
    } finally {
      set((s) => ({ loading: { ...s.loading, syncEvents: false } }))
    }
  },

  syncAll: async (params) => {
    set((s) => ({ loading: { ...s.loading, syncAll: true } }))
    try {
      const result = await synergyApi.syncAll(params)
      set({ lastSyncResult: { type: 'all', data: result } })
      const totalCreated =
        result.games.created +
        result.events.reduce((acc, e) => acc + e.created, 0) +
        result.playerMaps.created
      const totalFailed =
        result.games.failed +
        result.events.reduce((acc, e) => acc + e.failed, 0)
      if (totalFailed > 0) {
        toast.warning(
          `Full sync completed with ${totalFailed} failures. Check sync history for details.`
        )
      } else {
        toast.success(
          `Full sync complete: ${totalCreated} total records created`
        )
      }
      await get().fetchHistory(1)
    } catch (err) {
      toast.error((err as Error).message || 'Full sync failed')
    } finally {
      set((s) => ({ loading: { ...s.loading, syncAll: false } }))
    }
  },

  fetchHistory: async (page = 1) => {
    set((s) => ({ loading: { ...s.loading, history: true } }))
    try {
      const result = await synergyApi.getSyncHistory({ page, limit: 20 })
      set({ syncHistory: result.data, historyPagination: result.pagination })
    } catch {
      toast.error('Failed to load sync history')
    } finally {
      set((s) => ({ loading: { ...s.loading, history: false } }))
    }
  },

  clearLastSyncResult: () => set({ lastSyncResult: null }),
}))
