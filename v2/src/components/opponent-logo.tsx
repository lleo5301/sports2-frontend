/**
 * Renders opponent logo from Presto league teams (NJCAA).
 * Falls back to nothing if no match — avoids broken images.
 */
import { useState } from 'react'
import { useLeagueTeams } from '@/hooks/use-league-teams'

interface OpponentLogoProps {
  opponent: string | null | undefined
  className?: string
  size?: number
  /** If true, always reserve space (shows placeholder when no logo) */
  reserveSpace?: boolean
}

export function OpponentLogo({
  opponent,
  className = '',
  size = 32,
  reserveSpace = false,
}: OpponentLogoProps) {
  const { getLogoForOpponent, isLoading } = useLeagueTeams()
  const logoUrl = getLogoForOpponent(opponent)
  const [loadError, setLoadError] = useState(false)

  if (isLoading && reserveSpace) {
    return (
      <div
        className={`shrink-0 animate-pulse rounded bg-muted ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  if (!logoUrl || loadError) {
    if (reserveSpace) {
      return (
        <div
          className={`shrink-0 rounded bg-muted ${className}`}
          style={{ width: size, height: size }}
        />
      )
    }
    return null
  }

  return (
    <img
      src={logoUrl}
      alt=""
      className={`shrink-0 rounded object-contain ${className}`}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setLoadError(true)}
    />
  )
}
