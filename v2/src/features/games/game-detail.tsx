import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { gamesApi } from '@/lib/games-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface GameDetailProps {
  id: string
}

export function GameDetail({ id }: GameDetailProps) {
  const gameId = parseInt(id, 10)
  const { data: game, isLoading, error } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => gamesApi.getById(gameId),
    enabled: !Number.isNaN(gameId),
  })

  if (Number.isNaN(gameId)) {
    return (
      <Main>
        <div className='py-8 text-center text-destructive'>
          Invalid game ID
        </div>
      </Main>
    )
  }

  if (isLoading) {
    return (
      <Main>
        <div className='flex items-center justify-center py-16'>
          <Loader2 className='size-8 animate-spin text-muted-foreground' />
        </div>
      </Main>
    )
  }

  if (error || !game) {
    return (
      <Main>
        <div className='py-8 text-center'>
          <p className='text-destructive'>
            {(error as Error)?.message ?? 'Game not found'}
          </p>
          <Button asChild className='mt-4' variant='outline'>
            <Link to='/games'>Back to games</Link>
          </Button>
        </div>
      </Main>
    )
  }

  const date = game.date ?? game.game_date

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-center gap-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link to='/games'>
              <ArrowLeft className='size-4' />
            </Link>
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              vs {game.opponent || `Game #${id}`}
            </h2>
            <CardDescription>
              {date} {game.location && `• ${game.location}`}
            </CardDescription>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className='flex flex-wrap gap-2'>
              {game.result && (
                <Badge variant={game.result === 'Win' ? 'default' : 'secondary'}>
                  {game.result}
                </Badge>
              )}
              {game.home_away && (
                <Badge variant='outline'>{game.home_away}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Opponent</p>
              <p className='font-medium'>{game.opponent}</p>
            </div>
            {date && (
              <div>
                <p className='text-sm text-muted-foreground'>Date</p>
                <p className='font-medium'>{date}</p>
              </div>
            )}
            {game.location && (
              <div>
                <p className='text-sm text-muted-foreground'>Location</p>
                <p className='font-medium'>{game.location}</p>
              </div>
            )}
            {(game.team_score != null || game.opponent_score != null) && (
              <div>
                <p className='text-sm text-muted-foreground'>Score</p>
                <p className='text-2xl font-bold'>
                  {game.team_score ?? '—'} – {game.opponent_score ?? '—'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
