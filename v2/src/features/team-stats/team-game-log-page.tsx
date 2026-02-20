/**
 * Team Game Log — per-game results from /teams/game-log.
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/format-date'
import { extendedStatsApi, type TeamGameLogGame } from '@/lib/extended-stats-api'
import { Main } from '@/components/layout/main'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OpponentLogo } from '@/components/opponent-logo'

function GameStatsChips({ stats }: { stats?: TeamGameLogGame['team_stats'] }) {
  if (!stats) return null
  const batting = stats.batting ?? stats
  const pitching = stats.pitching
  const entries: Array<[string, string | number]> = []
  if (batting && typeof batting === 'object') {
    for (const [k, v] of Object.entries(batting)) {
      if (v != null && v !== '' && !['batting', 'pitching'].includes(k)) {
        entries.push([k, v])
      }
    }
  }
  if (pitching && typeof pitching === 'object') {
    for (const [k, v] of Object.entries(pitching)) {
      if (v != null && v !== '') {
        entries.push([k, v])
      }
    }
  }
  if (entries.length === 0) return null
  return (
    <div className='mt-2 flex flex-wrap gap-1'>
      {entries.slice(0, 8).map(([k, v]) => (
        <Badge key={k} variant='outline' className='text-xs'>
          {k}: {v}
        </Badge>
      ))}
    </div>
  )
}

export function TeamGameLogPage() {
  const { data: games, isLoading, error } = useQuery({
    queryKey: ['team-game-log'],
    queryFn: () => extendedStatsApi.getTeamGameLog(),
  })

  if (isLoading) {
    return (
      <Main>
        <div className='flex items-center justify-center py-16'>
          <Loader2 className='size-8 animate-spin text-muted-foreground' />
        </div>
      </Main>
    )
  }

  if (error) {
    return (
      <Main>
        <Card>
          <CardContent className='py-8 text-center'>
            <p className='text-destructive'>{(error as Error).message}</p>
            <p className='mt-2 text-sm text-muted-foreground'>
              Connect PrestoSports to sync game log data.
            </p>
          </CardContent>
        </Card>
      </Main>
    )
  }

  return (
    <Main>
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Team game log</h2>
          <CardDescription>Game-by-game results for the season</CardDescription>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Completed games</CardTitle>
            <CardDescription>Newest first</CardDescription>
          </CardHeader>
          <CardContent>
            {games?.length ? (
              <div className='space-y-3'>
                {games.map((g) => (
                  <Link
                    key={g.id}
                    to='/games/$id'
                    params={{ id: g.id }}
                    className='block rounded-lg border p-4 transition-colors hover:bg-muted/50'
                  >
                    <div className='flex flex-wrap items-start justify-between gap-4'>
                      <div className='flex items-center gap-3'>
                        <OpponentLogo opponent={g.opponent} logoUrl={g.opponent_logo_url} size={40} reserveSpace />
                        <div>
                          <span className='font-medium'>
                            {g.home_away === 'home' ? 'vs' : '@'} {g.opponent}
                          </span>
                          <p className='text-sm text-muted-foreground'>
                            {formatDate(g.date)}
                            {g.location && ` · ${g.location}`}
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <Badge
                          variant={
                            g.result === 'W' ? 'default' : g.result === 'L' ? 'secondary' : 'outline'
                          }
                        >
                          {g.game_summary}
                        </Badge>
                        {g.running_record && (
                          <p className='mt-1 text-xs text-muted-foreground'>
                            Record: {g.running_record}
                          </p>
                        )}
                      </div>
                    </div>
                    <GameStatsChips stats={g.team_stats} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className='py-8 text-center text-muted-foreground'>
                No games found. Sync with PrestoSports to populate.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
