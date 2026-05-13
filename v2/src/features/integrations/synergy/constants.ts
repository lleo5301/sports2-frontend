import type { SyncStatus } from './types'

export const SYNC_TYPE_LABELS: Record<string, string> = {
  synergy_games: 'Game Sync',
  synergy_events: 'Event Sync',
  synergy_full: 'Full Sync',
  synergy_player_maps: 'Player Maps',
}

export const SYNC_STATUS_BADGE: Record<
  SyncStatus,
  { label: string; className: string }
> = {
  running: {
    label: 'Running',
    className:
      'bg-blue-50 text-blue-700 border-blue-200 animate-pulse dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  },
  completed: {
    label: 'Completed',
    className:
      'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
  },
  partial: {
    label: 'Partial',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  },
  failed: {
    label: 'Failed',
    className:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  },
}
