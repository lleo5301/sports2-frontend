/**
 * Hook to fetch Presto league teams and resolve opponent name → logo URL.
 * Used to show opponent logos on game cards, game log, etc.
 */
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { integrationsApi, type PrestoLeagueTeam } from '@/lib/integrations-api'

function normalize(name: string): string {
  return name.trim().toLowerCase()
}

function buildLookup(teams: PrestoLeagueTeam[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const t of teams) {
    const n = (t.name ?? t.teamName)?.trim()
    const url = (t.logo ?? t.logo_url ?? t.logoUrl)?.trim()
    if (n && url) {
      map.set(normalize(n), url)
      // Also try without "College" / "University" for loose matching
      const short = n.replace(/\s+(College|University|Univ\.?)$/i, '').trim()
      if (short && short !== n && !map.has(normalize(short))) {
        map.set(normalize(short), url)
      }
    }
  }
  return map
}

export function useLeagueTeams(seasonId?: string) {
  const result = useQuery({
    queryKey: ['presto-league-teams', seasonId ?? 'default'],
    queryFn: async () => {
      const result = await integrationsApi.getPrestoLeagueTeams(seasonId)
      if (import.meta.env.DEV && result.length > 0) {
        console.debug('[league-teams] loaded', result.length, 'teams, sample:', result[0])
      }
      return result
    },
    retry: 0,
    staleTime: 5 * 60 * 1000,
  })
  const { data: teams, isLoading, error } = result

  if (import.meta.env.DEV && error) {
    console.warn('[league-teams] fetch failed (logos will not appear):', (error as Error).message)
  }

  const getLogoForOpponent = useMemo(() => {
    if (!teams?.length) return () => undefined as string | undefined
    const lookup = buildLookup(teams)
    return (opponent: string | null | undefined): string | undefined => {
      if (!opponent?.trim()) return undefined
      const key = normalize(opponent)
      return lookup.get(key) ?? lookup.get(key.replace(/\s+(College|University|Univ\.?)$/i, '').trim())
    }
  }, [teams])

  return { teams: teams ?? [], getLogoForOpponent, isLoading, error }
}
