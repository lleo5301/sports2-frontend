import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, BarChart3, ClipboardList, Layers, Loader2, User } from 'lucide-react'
import { gamesApi, formatGameDateTime, formatGameLocation } from '@/lib/games-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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

  const { data: lineup, isLoading: lineupLoading } = useQuery({
    queryKey: ['game', gameId, 'lineup'],
    queryFn: () => extendedStatsApi.getGameLineup(gameId),
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
  const statsSource = (gameStats ?? game) as Record<string, unknown>
  const teamStats = game.team_stats ?? statsSource?.team_stats as Record<string, string | number> | undefined
  const opponentStats = game.opponent_stats ?? statsSource?.opponent_stats as Record<string, string | number> | undefined
  const gameDuration = game.game_duration ?? teamStats?.['time']

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
            <OpponentLogo opponent={game.opponent} logoUrl={game.opponent_logo_url} size={56} reserveSpace />
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                vs {game.opponent || `Game #${id}`}
              </h2>
              <CardDescription>
                {dateStr}
                {formatGameLocation(game) && ` • ${formatGameLocation(game)}`}
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
          <CardContent className='p-6'>
            {/* Row 1: Opponent | Venue | Event | Tournament | Date — vertically aligned */}
            <div className='grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 md:grid-cols-5'>
              <div>
                <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>Opponent</p>
                <div className='mt-1 flex items-center gap-2'>
                  <OpponentLogo
                    opponent={game.opponent}
                    logoUrl={game.opponent_logo_url}
                    size={32}
                    reserveSpace
                  />
                  <p className='font-semibold'>{game.opponent || '—'}</p>
                </div>
              </div>
              {formatGameLocation(game) && (
                <div>
                  <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>Venue</p>
                  <p className='mt-1 font-medium'>{formatGameLocation(game)}</p>
                </div>
              )}
              {game.event_type && game.event_type !== 'game' && (
                <div>
                  <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>Event</p>
                  <p className='mt-1 font-medium'>{game.event_type}</p>
                </div>
              )}
              {game.tournament?.name && (
                <div>
                  <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>Tournament</p>
                  <p className='mt-1 font-medium'>{game.tournament.name}</p>
                </div>
              )}
              <div>
                <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>Date & time</p>
                <p className='mt-1 font-medium'>{dateStr || '—'}</p>
                {gameDuration && (
                  <p className='mt-0.5 text-sm text-muted-foreground'>
                    Duration: {String(gameDuration)}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Quick line stats (R–H–AB) when available */}
            {(teamStats || opponentStats) && (
              <div className='mt-6 flex flex-wrap items-center gap-4 rounded-lg bg-muted/50 px-4 py-3'>
                <span className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>Line score</span>
                <div className='flex flex-wrap gap-6'>
                  <span className='font-medium'>
                    Us: {teamStats?.['r'] ?? '—'} R · {teamStats?.['h'] ?? '—'} H · {teamStats?.['ab'] ?? '—'} AB
                  </span>
                  <span className='text-muted-foreground'>|</span>
                  <span className='font-medium'>
                    {game.opponent}: {opponentStats?.['r'] ?? '—'} R · {opponentStats?.['h'] ?? '—'} H · {opponentStats?.['ab'] ?? '—'} AB
                  </span>
                </div>
              </div>
            )}

            {/* Row 3: Score & badges */}
            <div className='mt-6 flex flex-col flex-wrap items-start gap-4 border-t pt-6 sm:flex-row sm:items-center sm:gap-6'>
              {(game.team_score != null || game.opponent_score != null) && (
                <div>
                  <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>Final</p>
                  <p className='text-3xl font-bold tabular-nums sm:text-4xl'>
                    {game.team_score ?? '—'}
                    <span className='mx-2 text-2xl text-muted-foreground'>–</span>
                    {game.opponent_score ?? '—'}
                  </p>
                </div>
              )}
              <div className='flex flex-wrap gap-2'>
                {game.result && (
                  <Badge variant={game.result === 'Win' ? 'default' : 'secondary'} className='text-sm'>
                    {game.result}
                  </Badge>
                )}
                {game.home_away && (
                  <Badge variant='outline'>{game.home_away}</Badge>
                )}
                {game.is_conference && (
                  <Badge variant='outline'>Conference</Badge>
                )}
                {game.is_neutral && (
                  <Badge variant='outline'>Neutral</Badge>
                )}
                {game.is_post_season && (
                  <Badge variant='outline'>Post Season</Badge>
                )}
                {game.tournament && (
                  <Badge variant='secondary'>{game.tournament.name}</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {(gameStats || (game && hasGameStats(game as Record<string, unknown>))) ? (
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
              <GameStatsDisplay
                stats={mergeGameStatsWithGame(normalizeGameStats(gameStats ?? (game as Record<string, unknown>)) ?? {}, game)}
                opponentName={game?.opponent}
              />
            </CardContent>
          </Card>
        ) : gameStats === undefined ? null : (
          <Card>
            <CardContent className='py-8 text-center text-muted-foreground'>
              No game statistics. Run Presto Stats sync to populate box scores.
            </CardContent>
          </Card>
        )}

        {lineupLoading ? (
          <Card>
            <CardContent className='flex justify-center py-12'>
              <Loader2 className='size-8 animate-spin text-muted-foreground' />
            </CardContent>
          </Card>
        ) : lineup?.players?.length ? (
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <ClipboardList className='size-5 text-muted-foreground' />
                <div>
                  <CardTitle>Lineup</CardTitle>
                  <CardDescription>
                    Batting order for this game
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='h-96 overflow-y-auto'>
                <div className='grid gap-3 pr-2 sm:grid-cols-2 lg:grid-cols-3'>
                  {lineup.players.map((p, i) => (
                    <div key={p.player_id ?? i} className='flex items-center gap-4 rounded-lg border p-4'>
                      <Avatar className='size-16 shrink-0 lg:size-20'>
                        <AvatarImage src={p.photo_url ?? undefined} alt={p.name} />
                        <AvatarFallback><User className='size-8 lg:size-10' /></AvatarFallback>
                      </Avatar>
                      <div className='min-w-0 flex-1'>
                        <div className='flex flex-wrap items-center gap-2'>
                          {p.player_id ? (
                            <Link to='/players/$id' params={{ id: p.player_id }} className='font-medium hover:underline'>
                              {p.name}
                            </Link>
                          ) : (
                            <span className='font-medium'>{p.name}</span>
                          )}
                          <span className='text-muted-foreground'>#{p.jersey_number}</span>
                          <span className='rounded bg-muted px-1.5 py-0.5 text-xs font-medium'>{p.position}</span>
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
              </div>
            </CardContent>
          </Card>
        ) : null}
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
  po: 'PO',
  putouts: 'PO',
  a: 'A',
  assists: 'A',
  e: 'E',
  errors: 'E',
  fpct: 'FLD%',
  fielding_percentage: 'FLD%',
  fielding_pct: 'FLD%',
  fieldingpo: 'PO',
  fieldinga: 'A',
  fieldinge: 'E',
  fieldingfldpct: 'FLD%',
  fieldingdp: 'DP',
}

/** Presto short keys for team/opponent stats comparison */
const TEAM_COMPARISON_KEYS: Array<[string, string]> = [
  ['r', 'R'],
  ['h', 'H'],
  ['ab', 'AB'],
  ['hr', 'HR'],
  ['rbi', 'RBI'],
  ['bb', 'BB'],
  ['k', 'SO'],
  ['sb', 'SB'],
  ['avg', 'AVG'],
  ['obp', 'OBP'],
  ['slg', 'SLG'],
  ['ip', 'IP'],
  ['er', 'ER'],
  ['era', 'ERA'],
  ['fpct', 'FLD%'],
]

function hasGameStats(stats: Record<string, unknown>): boolean {
  if (!stats || typeof stats !== 'object') return false
  // Unwrap nested data if API returns { data: { ...stats } }
  const raw = stats?.data != null && typeof stats.data === 'object' && !Array.isArray(stats.data)
    ? (stats.data as Record<string, unknown>)
    : stats
  const teamStats = raw.team_stats ?? raw.teamStats
  const opponentStats = raw.opponent_stats ?? raw.opponentStats
  if (teamStats && typeof teamStats === 'object' && Object.keys(teamStats as object).length > 0) return true
  if (opponentStats && typeof opponentStats === 'object' && Object.keys(opponentStats as object).length > 0) return true
  const keys = Object.keys(raw).filter(
    (k) => !['game', 'id', 'game_id', 'team_id', 'created_at', 'updated_at', 'team', 'team_stats', 'opponent_stats'].includes(k)
  )
  if (keys.length === 0) return false
  const hasScalar = keys.some((k) => {
    const v = raw[k]
    return (
      v !== undefined &&
      v !== null &&
      v !== '' &&
      (typeof v !== 'object' || (Array.isArray(v) && v.length > 0))
    )
  })
  if (hasScalar) return true
  const hasArray = keys.some((k) => Array.isArray(raw[k]) && (raw[k] as unknown[]).length > 0)
  return hasArray
}

/** Derive fielding rows from game_statistics when each row has nested fielding, flat po/a/e, or Presto keys */
function deriveFieldingFromGameStats(rows: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  const result: Array<Record<string, unknown>> = []
  for (const row of rows) {
    const field = (row.fielding ?? row.Fielding) as Record<string, unknown> | undefined
    const po = field && typeof field === 'object'
      ? (field.po ?? field.putouts ?? field.fieldingpo ?? row.putouts ?? row.po ?? row.fieldingpo ?? 0)
      : (row.putouts ?? row.po ?? row.fieldingpo ?? 0)
    const a = field && typeof field === 'object'
      ? (field.a ?? field.assists ?? field.fieldinga ?? row.assists ?? row.a ?? row.fieldinga ?? 0)
      : (row.assists ?? row.a ?? row.fieldinga ?? 0)
    const e = field && typeof field === 'object'
      ? (field.e ?? field.errors ?? field.fieldinge ?? row.errors ?? row.e ?? row.fieldinge ?? 0)
      : (row.errors ?? row.e ?? row.fieldinge ?? 0)
    const fpct = field && typeof field === 'object'
      ? (field.fpct ?? field.fielding_percentage ?? field.fielding_pct ?? field.fieldingfldpct ?? row.fielding_percentage ?? row.fpct ?? row.fieldingfldpct)
      : (row.fielding_percentage ?? row.fpct ?? row.fieldingfldpct ?? null)
    if (Number(po) === 0 && Number(a) === 0 && Number(e) === 0 && fpct == null) continue
    const total = Number(po) + Number(a) + Number(e)
    const computedFpct = total > 0 && !fpct
      ? ((Number(po) + Number(a)) / total).toFixed(3)
      : fpct
    result.push({
      ...row,
      player: row.player ?? row.Player,
      Player: row.Player ?? row.player,
      player_name: row.player_name ?? row.name,
      position: row.position ?? (field && typeof field === 'object' ? field.position : null),
      po: Number(po) || 0,
      a: Number(a) || 0,
      e: Number(e) || 0,
      fpct: computedFpct,
    })
  }
  return result
}

/** Merge game.team_stats, game.opponent_stats into stats when game has them and stats doesn't */
function mergeGameStatsWithGame(
  stats: Record<string, unknown>,
  game: Record<string, unknown> | undefined
): Record<string, unknown> {
  if (!game || typeof game !== 'object') return stats
  const merged = { ...stats }
  if (merged.team_stats == null && game.team_stats != null) merged.team_stats = game.team_stats
  if (merged.opponent_stats == null && game.opponent_stats != null) merged.opponent_stats = game.opponent_stats
  if (merged.team == null && game.team != null) merged.team = game.team
  if (merged.opponent == null && game.opponent != null) merged.opponent = game.opponent
  return merged
}

/** Normalize stats from various backend shapes to { batting, pitching, fielding, player_stats } */
function normalizeGameStats(stats: Record<string, unknown>): Record<string, unknown> | null {
  if (!stats || typeof stats !== 'object') return null
  let raw = stats?.data != null && typeof stats.data === 'object' && !Array.isArray(stats.data)
    ? (stats.data as Record<string, unknown>)
    : stats
  const aggregated = raw.aggregated_stats ?? raw.aggregatedStats
  if (aggregated != null && typeof aggregated === 'object' && !Array.isArray(aggregated)) {
    raw = { ...raw, ...(aggregated as Record<string, unknown>) }
  }
  const batting = (raw.batting ?? raw.Batting) as Array<Record<string, unknown>> | undefined
  const pitching = (raw.pitching ?? raw.Pitching) as Array<Record<string, unknown>> | undefined
  let fielding = (raw.fielding ?? raw.Fielding) as Array<Record<string, unknown>> | undefined
  const playerStats = (raw.player_stats ?? raw.playerStats) as Array<Record<string, unknown>> | undefined
  const gameStats = (raw.game_statistics ?? raw.GameStatistics) as Array<Record<string, unknown>> | undefined
  const players = (raw.players ?? raw.Players) as Array<Record<string, unknown>> | undefined
  const effectivePlayerStats = playerStats ?? gameStats ?? players
  if (!Array.isArray(fielding) && Array.isArray(effectivePlayerStats) && effectivePlayerStats.length > 0) {
    fielding = deriveFieldingFromGameStats(effectivePlayerStats)
  }
  const result = { ...raw } as Record<string, unknown>
  if (Array.isArray(batting)) result.batting = batting
  if (Array.isArray(pitching)) result.pitching = pitching
  if (Array.isArray(fielding) && fielding.length > 0) result.fielding = fielding
  if (Array.isArray(effectivePlayerStats)) result.player_stats = effectivePlayerStats
  return result
}

function TeamComparison({
  teamStats,
  opponentStats,
  teamName,
  opponentName,
}: {
  teamStats: Record<string, unknown>
  opponentStats: Record<string, unknown>
  teamName?: string
  opponentName?: string
}) {
  const team = teamStats as Record<string, string | number>
  const opp = opponentStats as Record<string, string | number>
  return (
    <div>
      <h4 className='mb-2 text-sm font-medium text-muted-foreground'>Team comparison</h4>
      <div className='overflow-x-auto rounded-lg border'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b bg-muted/50'>
              <th className='px-3 py-2 text-left text-muted-foreground'>Stat</th>
              <th className='px-3 py-2 text-right font-medium'>{teamName ?? 'Us'}</th>
              <th className='px-3 py-2 text-right font-medium'>{opponentName ?? 'Opponent'}</th>
            </tr>
          </thead>
          <tbody>
            {TEAM_COMPARISON_KEYS.map(([key, label]) => {
              const tVal = team[key]
              const oVal = opp[key]
              if (tVal == null && oVal == null) return null
              return (
                <tr key={key} className='border-b last:border-0'>
                  <td className='px-3 py-1.5 text-muted-foreground'>{label}</td>
                  <td className='px-3 py-1.5 text-right'>{tVal != null ? String(tVal) : '—'}</td>
                  <td className='px-3 py-1.5 text-right'>{oVal != null ? String(oVal) : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function GameStatsDisplay({ stats, teamName, opponentName }: { stats: Record<string, unknown>; teamName?: string; opponentName?: string }) {
  const batting = stats.batting as Array<Record<string, unknown>> | undefined
  const pitching = stats.pitching as Array<Record<string, unknown>> | undefined
  const fielding = stats.fielding as Array<Record<string, unknown>> | undefined
  const playerStats = stats.player_stats as Array<Record<string, unknown>> | undefined
  const teamStats = (stats.team_stats ?? stats.teamStats) as Record<string, unknown> | undefined
  const opponentStats = (stats.opponent_stats ?? stats.opponentStats) as Record<string, unknown> | undefined
  const hasTeamComparison = teamStats && opponentStats && typeof teamStats === 'object' && typeof opponentStats === 'object' &&
    Object.keys(teamStats).length > 0 && Object.keys(opponentStats).length > 0

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

  if (!hasScalars && !hasBatting && !hasPitching && !hasFielding && !hasPlayerStats && !hasTeamComparison) {
    return (
      <div className='rounded-lg border border-dashed p-6 text-center text-muted-foreground'>
        No game statistics available
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {hasTeamComparison && (
        <TeamComparison
          teamStats={teamStats!}
          opponentStats={opponentStats!}
          teamName={(stats.team as { name?: string })?.name}
          opponentName={(stats.opponent as string) ?? opponentName}
        />
      )}
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
    const p = (row.player ?? row.Player) as Record<string, unknown> | undefined
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
              .filter((c) => !['player', 'Player', 'player_name', 'name'].includes(c))
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
