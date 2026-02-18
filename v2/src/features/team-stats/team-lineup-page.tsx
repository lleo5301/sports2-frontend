/**
 * Team Lineup — last game lineup from /teams/lineup.
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Loader2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format-date'
import { extendedStatsApi } from '@/lib/extended-stats-api'
import { Main } from '@/components/layout/main'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function TeamLineupPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['team-lineup'],
    queryFn: () => extendedStatsApi.getTeamLineup(),
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
              Connect PrestoSports to sync lineup data.
            </p>
          </CardContent>
        </Card>
      </Main>
    )
  }

  if (!data || data.source === 'none' || !data.players?.length) {
    return (
      <Main>
        <div className='space-y-6'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Team lineup</h2>
            <CardDescription>Most recent lineup from last completed game</CardDescription>
          </div>
          <Card>
            <CardContent className='py-8 text-center'>
              <p className='text-muted-foreground'>
                {data?.message ?? 'No completed games found. Sync with PrestoSports to populate.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </Main>
    )
  }

  return (
    <Main>
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Team lineup</h2>
          <CardDescription>From last game vs {data.opponent ?? 'opponent'}</CardDescription>
        </div>

        {data.game_id && (
          <Card>
            <CardHeader className='flex flex-row items-center justify-between gap-4'>
              <CardDescription>
                {data.game_date && formatDate(data.game_date)}
                {data.game_date && data.opponent ? ' · ' : ''}
                {data.opponent ? `vs ${data.opponent}` : ''}
              </CardDescription>
              <Button asChild variant='outline' size='sm'>
                <Link to='/games/$id' params={{ id: data.game_id }}>
                  View game
                </Link>
              </Button>
            </CardHeader>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Batting order</CardTitle>
            <CardDescription>Derived from last completed game box score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {data.players.map((p, i) => (
                <div
                  key={p.player_id ?? i}
                  className='flex items-center gap-4 rounded-lg border p-3'
                >
                  <Avatar className='size-10'>
                    <AvatarImage src={p.photo_url ?? undefined} alt={p.name} />
                    <AvatarFallback>
                      <User className='size-5' />
                    </AvatarFallback>
                  </Avatar>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      {p.player_id ? (
                        <Link
                          to='/players/$id'
                          params={{ id: p.player_id }}
                          className='font-medium hover:underline'
                        >
                          {p.name}
                        </Link>
                      ) : (
                        <span className='font-medium'>{p.name}</span>
                      )}
                      <span className='text-muted-foreground'>#{p.jersey_number}</span>
                      <span className='rounded bg-muted px-1.5 py-0.5 text-xs font-medium'>
                        {p.position}
                      </span>
                    </div>
                    {p.batting && (
                      <p className='mt-1 text-sm text-muted-foreground'>
                        AB {p.batting.ab} · H {p.batting.h} · R {p.batting.r} · RBI {p.batting.rbi}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
