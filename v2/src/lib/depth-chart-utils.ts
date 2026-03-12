/**
 * Depth Chart Utility Functions
 */

import { statusColors } from './depth-chart-constants'

export interface PlayerWithStats {
  batting_avg?: string | number
  home_runs?: number
  rbi?: number
  stolen_bases?: number
  era?: number
  wins?: number
  losses?: number
  strikeouts?: number
  has_medical_issues?: boolean
  status?: string
}

export function getPlayerStats(player: PlayerWithStats): string[] {
  const stats: string[] = []
  if (player.batting_avg) stats.push(`AVG: ${player.batting_avg}`)
  if (player.home_runs) stats.push(`HR: ${player.home_runs}`)
  if (player.rbi) stats.push(`RBI: ${player.rbi}`)
  if (player.stolen_bases) stats.push(`SB: ${player.stolen_bases}`)
  if (player.era) stats.push(`ERA: ${player.era}`)
  if (player.wins != null && player.losses != null)
    stats.push(`W-L: ${player.wins}-${player.losses}`)
  if (player.strikeouts) stats.push(`K: ${player.strikeouts}`)
  return stats
}

export function getPlayerStatus(player: PlayerWithStats): {
  label: string
  color: string
} {
  if (player.has_medical_issues)
    return { label: 'Injured', color: statusColors.injured }
  if (player.status === 'inactive')
    return { label: 'Inactive', color: statusColors.inactive }
  return { label: 'Active', color: statusColors.active }
}
