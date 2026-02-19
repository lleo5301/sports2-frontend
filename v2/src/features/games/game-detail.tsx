import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, BarChart3, Layers, Loader2 } from 'lucide-react'
import { gamesApi, formatGameDateTime } from '@/lib/games-api'
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
import { extendedStatsApi } from '@/lib/extended-stats-api'
import { OpponentLogo } from '@/components/opponent-logo'
import { depthChartsApi } from '@/lib/depth-charts-api'
import { defaultPositions } from '@/lib/depth-chart-constants'
import { toast } from 'sonner'

interface GameDetailProps {
  id: string
}

export function GameDetail({ id }: GameDetailProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const gameId = parseInt(id, 10)
  const { data: game, isLoading, error } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => gamesApi.getById(gameId),
    enabled: !Number.isNaN(gameId),
  })

  const { data: gameStats } = useQuery({
    queryKey: ['game', gameId, 'stats'],
    queryFn: () => gamesApi.getGameStats(gameId),
    enabled: !Number.isNaN(gameId) && !!game,
  })

  const createFromGameMutation = useMutation({
    mutationFn: async () => {
      const lineup = await extendedStatsApi.getGameLineup(gameId)
      if (!lineup?.players?.length) {
        throw new Error(
          'No lineup data for this game. Sync PrestoSports stats (Stats sync) to populate game box scores.'
        )
      }
      const chart = await depthChartsApi.create(
        `vs ${game?.opponent ?? 'Opponent'} — ${game?.date ?? game?.game_date ?? 'Game'}`
      )
      if (!chart?.id) throw new Error('Failed to create depth chart')
      for (const def of defaultPositions) {
        await depthChartsApi.addPosition(chart.id, {
          position_code: def.position_code,
          position_name: def.position_name,
          color: def.color,
          icon: def.icon,
          sort_order: def.sort_order,
          max_players: def.position_code === 'P' ? 15 : 3,
        })
      }
      const updated = await depthChartsApi.getById(chart.id)
      const positions = updated?.DepthChartPositions ?? []
      const positionByCode = Object.fromEntries(positions.map((p) => [p.position_code, p]))
      let assigned = 0
      for (const lp of lineup.players) {
        const pid =
          lp.player_id != null
            ? typeof lp.player_id === 'number'
              ? lp.player_id
              : parseInt(String(lp.player_id), 10)
            : NaN
        if (Number.isNaN(pid) || !lp.position) continue
        const pos = positionByCode[lp.position]
        if (!pos) continue
        try {
          await depthChartsApi.assignPlayer(pos.id, { player_id: pid, depth_order: 1, rank: 1 })
          assigned++
        } catch {
          // Skip failed assigns; continue with others
        }
      }
      if (assigned === 0 && lineup.players.length > 0) {
        throw new Error(
          'Could not assign players. Player IDs from game stats may not match roster. Ensure PrestoSports roster sync has run.'
        )
      }
      return { chartId: chart.id, assigned }
    },
    onSuccess: ({ chartId, assigned }) => {
      queryClient.invalidateQueries({ queryKey: ['depth-charts'] })
      const msg =
        assigned > 0
          ? `Depth chart created with ${assigned} players from game lineup`
          : 'Depth chart created from game lineup'
      toast.success(msg)
      navigate({ to: '/depth-charts/$id', params: { id: String(chartId) } })
    },
    onError: (err) => toast.error((err as Error).message),
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

  const dateStr = formatGameDateTime(game)

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-center gap-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link to='/games'>
              <ArrowLeft className='size-4' />
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <OpponentLogo opponent={game.opponent} size={56} reserveSpace />
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                vs {game.opponent || `Game #${id}`}
              </h2>
              <CardDescription>
                {dateStr} {game.location && `• ${game.location}`}
              </CardDescription>
            </div>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => createFromGameMutation.mutate()}
            disabled={createFromGameMutation.isPending}
          >
            {createFromGameMutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <>
                <Layers className='size-4' />
                Create depth chart from game
              </>
            )}
          </Button>
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
            <div className="flex items-center gap-3">
              <OpponentLogo opponent={game.opponent} size={48} reserveSpace />
              <div>
                <p className='text-sm text-muted-foreground'>Opponent</p>
                <p className='font-medium'>{game.opponent || '—'}</p>
              </div>
            </div>
            {dateStr && (
              <div>
                <p className='text-sm text-muted-foreground'>Date</p>
                <p className='font-medium'>{dateStr}</p>
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

        {gameStats && hasGameStats(gameStats) && (
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <BarChart3 className='size-5 text-muted-foreground' />
                <div>
                  <CardTitle>Game statistics</CardTitle>
                  <CardDescription>
                    Box score and player stats for this game
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <GameStatsDisplay stats={gameStats} />
            </CardContent>
          </Card>
        )}
      </div>
    </Main>
  )
}

const STAT_LABELS: Record<string, string> = {
  at_bats: 'AB',
  hits: 'H',
  runs: 'R',
  runs_batted_in: 'RBI',
  rbi: 'RBI',
  walks: 'BB',
  strikeouts: 'K',
  doubles: '2B',
  triples: '3B',
  home_runs: 'HR',
  stolen_bases: 'SB',
  batting_average: 'AVG',
  on_base_pct: 'OBP',
  slugging_pct: 'SLG',
  innings_pitched: 'IP',
  earned_runs: 'ER',
  era: 'ERA',
  whip: 'WHIP',
  wins: 'W',
  losses: 'L',
  saves: 'SV',
  player_count: 'Players',
}

function hasGameStats(stats: Record<string, unknown>): boolean {
  if (!stats || typeof stats !== 'object') return false
  const keys = Object.keys(stats).filter(
    (k) =>
      !['game', 'id', 'game_id', 'team_id', 'created_at', 'updated_at'].includes(
        k
      )
  )
  if (keys.length === 0) return false
  const hasScalar = keys.some((k) => {
    const v = stats[k]
    return (
      v !== undefined &&
      v !== null &&
      v !== '' &&
      (typeof v !== 'object' || (Array.isArray(v) && v.length > 0))
    )
  })
  if (hasScalar) return true
  const hasArray = keys.some((k) => Array.isArray(stats[k]) && (stats[k] as unknown[]).length > 0)
  return hasArray
}

function GameStatsDisplay({ stats }: { stats: Record<string, unknown> }) {
  const batting = stats.batting as Array<Record<string, unknown>> | undefined
  const pitching = stats.pitching as Array<Record<string, unknown>> | undefined
  const fielding = stats.fielding as Array<Record<string, unknown>> | undefined
  const playerStats = stats.player_stats as Array<Record<string, unknown>> | undefined

  const scalarKeys = [
    'player_count',
    'team_runs',
    'opponent_runs',
    'total_hits',
    'total_runs',
  ]
  const scalarEntries = Object.entries(stats).filter(
    ([k, v]) =>
      v !== undefined &&
      v !== null &&
      v !== '' &&
      typeof v !== 'object' &&
      !['id', 'game_id', 'team_id'].includes(k)
  )

  const hasScalars = scalarEntries.length > 0
  const hasBatting = Array.isArray(batting) && batting.length > 0
  const hasPitching = Array.isArray(pitching) && pitching.length > 0
  const hasFielding = Array.isArray(fielding) && fielding.length > 0
  const hasPlayerStats = Array.isArray(playerStats) && playerStats.length > 0

  if (!hasScalars && !hasBatting && !hasPitching && !hasFielding && !hasPlayerStats) {
    return (
      <div className='rounded-lg border border-dashed p-6 text-center text-muted-foreground'>
        No game statistics available
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {hasScalars && (
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
          {scalarEntries.map(([key, value]) => (
            <div key={key} className='rounded-lg border bg-muted/30 p-2'>
              <p className='text-xs text-muted-foreground'>
                {STAT_LABELS[key] ?? key.replace(/_/g, ' ')}
              </p>
              <p className='font-semibold'>{String(value)}</p>
            </div>
          ))}
        </div>
      )}

      {hasBatting && (
        <div>
          <h4 className='mb-2 text-sm font-medium text-muted-foreground'>
            Batting
          </h4>
          <StatsTable rows={batting} type='batting' />
        </div>
      )}

      {hasPitching && (
        <div>
          <h4 className='mb-2 text-sm font-medium text-muted-foreground'>
            Pitching
          </h4>
          <StatsTable rows={pitching} type='pitching' />
        </div>
      )}

      {hasFielding && (
        <div>
          <h4 className='mb-2 text-sm font-medium text-muted-foreground'>
            Fielding
          </h4>
          <StatsTable rows={fielding} type='fielding' />
        </div>
      )}

      {hasPlayerStats && !hasBatting && !hasPitching && (
        <div>
          <h4 className='mb-2 text-sm font-medium text-muted-foreground'>
            Player statistics
          </h4>
          <StatsTable rows={playerStats} type='player' />
        </div>
      )}
    </div>
  )
}

function StatsTable({
  rows,
  type,
}: {
  rows: Array<Record<string, unknown>>
  type: 'batting' | 'pitching' | 'fielding' | 'player'
}) {
  if (!rows || rows.length === 0) return null
  const first = rows[0]
  const excludeKeys = ['id', 'game_id', 'player_id', 'created_at', 'updated_at']
  const cols = Object.keys(first).filter(
    (k) =>
      !excludeKeys.includes(k) &&
      first[k] !== undefined &&
      first[k] !== null &&
      first[k] !== ''
  )
  if (cols.length === 0) return null

  const getPlayerName = (row: Record<string, unknown>): string => {
    const p = row.player as Record<string, unknown> | undefined
    if (p && typeof p === 'object') {
      const first = (p.first_name ?? p.firstName ?? '') as string
      const last = (p.last_name ?? p.lastName ?? '') as string
      return ([first, last].filter(Boolean).join(' ') || (p.name as string)) ?? '—'
    }
    return (row.player_name ?? row.name ?? row.jersey_number ?? '—') as string
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b'>
            {(type === 'batting' || type === 'pitching' || type === 'fielding' || type === 'player') && (
              <th className='px-2 py-1.5 text-left text-muted-foreground'>
                Player
              </th>
            )}
            {cols
              .filter((c) => !['player', 'player_name', 'name'].includes(c))
              .map((c) => (
                <th key={c} className='px-2 py-1.5 text-left text-muted-foreground'>
                  {STAT_LABELS[c] ?? c.replace(/_/g, ' ')}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className='border-b last:border-0'>
              {(type === 'batting' || type === 'pitching' || type === 'fielding' || type === 'player') && (
                <td className='px-2 py-1.5 font-medium'>
                  {getPlayerName(row)}
                </td>
              )}
              {cols
                .filter((c) => !['player', 'player_name', 'name'].includes(c))
                .map((c) => (
                  <td key={c} className='px-2 py-1.5'>
                    {row[c] != null && row[c] !== ''
                      ? String(row[c])
                      : '—'}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
