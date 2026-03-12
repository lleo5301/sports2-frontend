import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { parseISO } from 'date-fns'
import { ArrowLeft, Loader2, Trophy } from 'lucide-react'
import { tournamentsApi } from '@/lib/tournaments-api'
import { gamesApi, formatGameDateTime, formatGameLocation, type Game } from '@/lib/games-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OpponentLogo } from '@/components/opponent-logo'

interface TournamentDetailProps {
  id: string
}

function getGameDate(game: Game): Date | null {
  const d = game.date ?? game.game_date
  if (!d || typeof d !== 'string') return null
  try {
    return parseISO(d)
  } catch {
    return null
  }
}

export function TournamentDetail({ id }: TournamentDetailProps) {
  const navigate = useNavigate()
  const tournamentId = parseInt(id, 10)

  const { data: tournamentGames, isLoading, error } = useQuery({
    queryKey: ['tournament', tournamentId, 'games'],
    queryFn: () => tournamentsApi.getGames(tournamentId),
    enabled: !Number.isNaN(tournamentId),
  })

  const tournament = tournamentGames?.tournament ?? undefined
  const sortedGames = useMemo(() => {
    const list = tournamentGames?.games ?? []
    return [...list].sort((a, b) => {
      const da = getGameDate(a)?.getTime() ?? 0
      const db = getGameDate(b)?.getTime() ?? 0
      return da - db
    })
  }, [tournamentGames?.games])

  if (Number.isNaN(tournamentId)) {
    return (
      <Main>
        <div className='py-8 text-center text-destructive'>Invalid tournament ID</div>
      </Main>
    )
  }

  if (isLoading) {
    return (
      <Main>
        <div className='flex justify-center py-16'>
          <Loader2 className='size-8 animate-spin text-muted-foreground' />
        </div>
      </Main>
    )
  }

  if (error) {
    return (
      <Main>
        <div className='py-8 text-center text-destructive'>
          {(error as Error).message}
        </div>
        <Button asChild variant='outline' className='mt-4'>
          <Link to='/tournaments'>Back to tournaments</Link>
        </Button>
      </Main>
    )
  }

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link to='/tournaments'>
              <ArrowLeft className='size-4' />
            </Link>
          </Button>
          <div className='flex items-center gap-3'>
            <Trophy className='size-8 text-muted-foreground' />
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                {tournament?.name ?? `Tournament #${id}`}
              </h2>
              <CardDescription>
                {tournament?.season_name && `Season: ${tournament.season_name}`}
                {sortedGames.length > 0 && ` · ${sortedGames.length} game${sortedGames.length !== 1 ? 's' : ''}`}
              </CardDescription>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Games</CardTitle>
            <CardDescription>
              Schedule for this tournament (chronological)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedGames.length === 0 ? (
              <p className='py-8 text-center text-muted-foreground'>
                No games in this tournament.
              </p>
            ) : (
              <div className='space-y-2'>
                {sortedGames.map((g) => (
                  <div
                    key={g.id}
                    className='flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50'
                    onClick={() => navigate({ to: '/games/$id', params: { id: String(g.id) } })}
                  >
                    <div className='flex items-center gap-3'>
                      <OpponentLogo opponent={g.opponent} logoUrl={g.opponent_logo_url} size={32} reserveSpace />
                      <div>
                        <p className='font-medium'>vs {g.opponent || 'Opponent'}</p>
                        <p className='text-sm text-muted-foreground'>
                          {formatGameDateTime(g)}
                          {formatGameLocation(g) && ` · ${formatGameLocation(g)}`}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {g.result && (
                        <Badge variant={g.result === 'Win' ? 'default' : 'secondary'}>
                          {g.result}
                        </Badge>
                      )}
                      {(g.team_score != null && g.opponent_score != null) && (
                        <span className='text-sm font-medium'>
                          {g.team_score}–{g.opponent_score}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
