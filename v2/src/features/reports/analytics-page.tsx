import { useQueries, useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  Area,
  AreaChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatDateTime } from '@/lib/format-date'
import {
  extendedStatsApi,
  type DashboardRecentGame,
  type PlayerGameLogEntry,
} from '@/lib/extended-stats-api'
import { gamesApi, type LeaderEntry } from '@/lib/games-api'
import { playersApi } from '@/lib/players-api'
import { reportsApi } from '@/lib/reports-api'
import { Main } from '@/components/layout/main'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, User } from 'lucide-react'

const STAT_LABELS: Record<string, string> = {
  avg: 'AVG',
  batting_avg: 'AVG',
  era: 'ERA',
  home_runs: 'HR',
  hr: 'HR',
  rbi: 'RBI',
  stolen_bases: 'SB',
  sb: 'SB',
  obp: 'OBP',
  slg: 'SLG',
  ops: 'OPS',
  wins: 'W',
  w: 'W',
  losses: 'L',
  l: 'L',
  strikeouts: 'K',
  k: 'K',
  whip: 'WHIP',
  innings_pitched: 'IP',
  ip: 'IP',
}

function flattenStats(obj: Record<string, unknown>, prefix = ''): Array<[string, unknown]> {
  const out: Array<[string, unknown]> = []
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'id' || v === undefined || v === null || v === '') continue
    if (v !== null && typeof v === 'object' && !Array.isArray(v) && typeof (v as object) !== 'function') {
      out.push(...flattenStats(v as Record<string, unknown>, prefix ? `${prefix}_${k}` : k))
    } else {
      out.push([prefix ? `${prefix}_${k}` : k, v])
    }
  }
  return out
}

function TeamStatsGrid({ stats }: { stats: Record<string, unknown> }) {
  const entries = flattenStats(stats).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  )
  if (entries.length === 0)
    return (
      <div className='rounded-lg border border-dashed p-6 text-center text-muted-foreground'>
        No team statistics available
      </div>
    )
  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
      {entries.map(([key, value]) => (
        <div key={key} className='rounded-lg border bg-muted/30 p-3'>
          <p className='text-xs text-muted-foreground'>
            {STAT_LABELS[key] ?? key.replace(/_/g, ' ')}
          </p>
          <p className='text-lg font-semibold'>{String(value)}</p>
        </div>
      ))}
    </div>
  )
}

const PIPELINE_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--primary)',
  'var(--muted-foreground)',
]

/** Parse "15-8" or "15-8-1" to { wins, losses, ties } */
function parseRecord(s: string | null): { wins: number; losses: number } | null {
  if (!s) return null
  const m = s.match(/^(\d+)-(\d+)(?:-(\d+))?$/)
  if (!m) return null
  return { wins: parseInt(m[1], 10), losses: parseInt(m[2], 10) }
}

/** Build record progression from recent games (newest first) for chart (oldest first) */
function buildRecordProgression(games: DashboardRecentGame[]) {
  const reversed = [...games].reverse()
  return reversed
    .map((g, i) => {
      const r = parseRecord(g.running_record)
      if (!r) return null
      return {
        index: i + 1,
        date: g.date,
        opponent: g.opponent,
        result: g.result,
        wins: r.wins,
        losses: r.losses,
        label: `Game ${i + 1}`,
      }
    })
    .filter(Boolean) as Array<{
    index: number
    date: string
    opponent: string
    result: string | null
    wins: number
    losses: number
    label: string
  }>
}

const STAT_LEADER_CATEGORIES = [
  { stat: 'batting_average', label: 'Batting Avg' },
  { stat: 'home_runs', label: 'HR' },
  { stat: 'rbi', label: 'RBI' },
  { stat: 'stolen_bases', label: 'SB' },
  { stat: 'era', label: 'ERA' },
  { stat: 'strikeouts_pitching', label: 'SO' },
] as const

/** Rolling AVG per game (newest first → chronological for chart) */
function rollingAvgFromGameLog(games: PlayerGameLogEntry[], maxGames: number): Array<{ game: number; avg: number; opponent: string }> {
  const withBatting = games
    .filter((g) => g.batting?.ab != null && g.batting.ab > 0)
    .slice(0, maxGames)
  let cumH = 0
  let cumAB = 0
  return withBatting
    .map((g, i) => {
      cumH += g.batting?.h ?? 0
      cumAB += g.batting?.ab ?? 0
      return {
        game: i + 1,
        avg: cumAB > 0 ? Math.round((cumH / cumAB) * 1000) / 1000 : 0,
        opponent: g.game?.opponent ?? `G${i + 1}`,
      }
    })
}

function StatLeaderCard({
  label,
  leaders,
}: {
  label: string
  leaders: LeaderEntry[]
}) {
  if (!leaders.length)
    return (
      <div className='rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground'>
        No leaders yet
      </div>
    )
  return (
    <div className='rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md'>
      <p className='mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
        {label}
      </p>
      <div className='space-y-3'>
        {leaders.slice(0, 3).map((l, i) => {
          const name = [l.player.first_name, l.player.last_name].filter(Boolean).join(' ') || `Player ${l.player.id}`
          const initials = [l.player.first_name?.[0], l.player.last_name?.[0]].filter(Boolean).join('').toUpperCase() || '?'
          return (
            <Link
              key={l.player.id}
              to='/players/$id'
              params={{ id: String(l.player.id) }}
              className='flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50'
            >
              <Avatar className='size-10 shrink-0'>
                <AvatarImage src={l.player.photo_url ?? undefined} alt={name} />
                <AvatarFallback className='bg-muted text-xs font-medium'>
                  {initials || <User className='size-5' />}
                </AvatarFallback>
              </Avatar>
              <div className='min-w-0 flex-1'>
                <p className='truncate font-medium'>{name}</p>
                {l.player.position && (
                  <p className='text-xs text-muted-foreground'>{l.player.position}</p>
                )}
              </div>
              <span className='shrink-0 text-lg font-bold tabular-nums'>
                {String(l.value)}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function AnalyticsPage() {
  const { data: dashboard } = useQuery({
    queryKey: ['coach-dashboard'],
    queryFn: () => extendedStatsApi.getCoachDashboard(),
  })

  const { data: aggregateStats } = useQuery({
    queryKey: ['team-aggregate-stats'],
    queryFn: () => extendedStatsApi.getTeamAggregateStats(),
  })
  const leaderboardQueries = useQueries({
    queries: STAT_LEADER_CATEGORIES.map(({ stat }) => ({
      queryKey: ['leaderboard', stat],
      queryFn: () => gamesApi.getLeaderboard({ stat, limit: 3 }),
    })),
  })
  const leaderboards = leaderboardQueries.map((q) => q.data)

  const { data: battingLeaders } = useQuery({
    queryKey: ['leaderboard', 'batting_average', 5],
    queryFn: () => gamesApi.getLeaderboard({ stat: 'batting_average', limit: 5 }),
  })
  const topBatterIds = (battingLeaders?.leaders ?? []).map((l) => l.player.id)
  const gameLogQueries = useQueries({
    queries: topBatterIds.slice(0, 3).map((playerId) => ({
      queryKey: ['player', playerId, 'game-log'],
      queryFn: () => extendedStatsApi.getPlayerGameLog(playerId),
      enabled: !!playerId,
    })),
  })
  const gameLogs = gameLogQueries.map((q) => q.data)

  const { data: pipeline, isLoading: loadingPipeline } = useQuery({
    queryKey: ['reports', 'recruitment-pipeline'],
    queryFn: () => reportsApi.getRecruitmentPipeline(),
  })

  const { data: teamStats } = useQuery({
    queryKey: ['players', 'stats-summary'],
    queryFn: () => playersApi.getStatsSummary(),
  })

  const { data: teamReportStats } = useQuery({
    queryKey: ['reports', 'team-statistics'],
    queryFn: () => reportsApi.getTeamStatistics(),
  })

  const isLoading = loadingPipeline
  const hasTeamStats =
    (teamStats && typeof teamStats === 'object' && Object.keys(teamStats).length > 0) ||
    (teamReportStats &&
      typeof teamReportStats === 'object' &&
      Object.keys(teamReportStats).length > 0)

  // Normalize pipeline data for charts (status -> count)
  const pipelineChartData = Array.isArray(pipeline)
    ? pipeline
        .filter((p) => p?.status != null)
        .map((p) => ({
          name: String(p.status).replace(/_/g, ' '),
          value: Number(p.count) || 0,
        }))
        .filter((p) => p.value > 0)
    : []

  return (
    <Main>
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Analytics</h2>
          <p className='text-muted-foreground'>
            Team stats, record progression, stat leaders, and performance insights
          </p>
        </div>

        {/* Record Progression — from extended stats */}
        {dashboard?.recent_games?.length ? (
          <Card>
            <CardHeader>
              <CardTitle>Record progression</CardTitle>
              <CardDescription>
                Wins over the season (last {dashboard.recent_games.length} games)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const chartData = buildRecordProgression(dashboard.recent_games)
                if (chartData.length === 0) return <p className='text-muted-foreground'>No record data</p>
                return (
                  <ResponsiveContainer width='100%' height={220}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id='winsGrad' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='0%' stopColor='var(--primary)' stopOpacity={0.4} />
                          <stop offset='100%' stopColor='var(--primary)' stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey='index'
                        stroke='var(--muted-foreground)'
                        fontSize={11}
                        tickLine={false}
                        tickFormatter={(i) => `G${i}`}
                      />
                      <YAxis stroke='var(--muted-foreground)' fontSize={11} tickLine={false} width={28} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.[0]) return null
                          const d = payload[0].payload
                          return (
                            <div className='rounded-lg border bg-background p-3 shadow-md'>
                              <p className='text-sm font-medium'>
                                {d.opponent} · {d.result ?? '—'}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                {d.wins}-{d.losses}
                              </p>
                            </div>
                          )
                        }}
                      />
                      <Area
                        type='monotone'
                        dataKey='wins'
                        stroke='var(--primary)'
                        fill='url(#winsGrad)'
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )
              })()}
            </CardContent>
          </Card>
        ) : null}

        {/* Stat Leaders — from leaderboard API with headshots */}
        <Card>
          <CardHeader className='flex flex-row items-start justify-between space-y-0'>
            <div>
              <CardTitle>Stat leaders</CardTitle>
              <CardDescription>Top performers in key categories</CardDescription>
            </div>
            <Button variant='ghost' size='sm' asChild>
              <Link to='/games/leaderboard'>Full leaderboard</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {leaderboardQueries.some((q) => q.isLoading) ? (
              <div className='flex justify-center py-12'>
                <Loader2 className='size-8 animate-spin text-muted-foreground' />
              </div>
            ) : (
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {STAT_LEADER_CATEGORIES.map(({ stat, label }, i) => (
                  <StatLeaderCard
                    key={stat}
                    label={label}
                    leaders={leaderboards[i]?.leaders ?? []}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team aggregate stats — extended stats API */}
        {aggregateStats &&
        (Object.keys(aggregateStats.batting ?? {}).length > 0 ||
          Object.keys(aggregateStats.pitching ?? {}).length > 0 ||
          Object.keys(aggregateStats.fielding ?? {}).length > 0) ? (
          <Card>
            <CardHeader>
              <CardTitle>Team statistics</CardTitle>
              <CardDescription>
                Season batting, pitching, and fielding totals · Last synced {formatDateTime(aggregateStats.last_synced_at) || '—'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeamStatsGrid
                stats={
                  {
                    ...aggregateStats.batting,
                    ...aggregateStats.pitching,
                    ...aggregateStats.fielding,
                  } as Record<string, unknown>
                }
              />
            </CardContent>
          </Card>
        ) : null}

        {isLoading ? (
          <div className='flex items-center justify-center py-16'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <div className='space-y-6'>
            {/* Fallback Team Stats — when extended stats unavailable */}
            {!aggregateStats &&
            hasTeamStats ? (
              <Card>
                <CardHeader>
                  <CardTitle>Team statistics</CardTitle>
                  <CardDescription>Aggregated team stats (batting, pitching)</CardDescription>
                </CardHeader>
                <CardContent>
                  <TeamStatsGrid
                    stats={
                      (teamStats && typeof teamStats === 'object'
                        ? teamStats
                        : teamReportStats ?? {}) as Record<string, unknown>
                    }
                  />
                </CardContent>
              </Card>
            ) : null}
            <div className='grid gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Pipeline</CardTitle>
                <CardDescription>
                  Prospects by pipeline status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pipelineChartData.length > 0 ? (
                  <ResponsiveContainer width='100%' height={300}>
                    <PieChart>
                      <Pie
                        data={pipelineChartData}
                        dataKey='value'
                        nameKey='name'
                        cx='50%'
                        cy='50%'
                        outerRadius={100}
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                      >
                        {pipelineChartData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIPELINE_COLORS[i % PIPELINE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className='flex h-[300px] items-center justify-center text-muted-foreground'>
                    No pipeline data
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Batting trends</CardTitle>
                <CardDescription>
                  Cumulative batting average over last 10 games — top 3 AVG leaders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {gameLogQueries.some((q) => q.isLoading) ? (
                  <div className='flex h-[280px] items-center justify-center'>
                    <Loader2 className='size-8 animate-spin text-muted-foreground' />
                  </div>
                ) : (() => {
                  const playerSeries: Array<{ key: string; name: string; points: Array<{ game: number; avg: number; opponent: string }> }> = []
                  topBatterIds.slice(0, 3).forEach((id, i) => {
                    const log = gameLogs[i]
                    const leaders = battingLeaders?.leaders ?? []
                    const leader = leaders.find((l) => l.player.id === id)
                    const name = leader
                      ? [leader.player.first_name, leader.player.last_name].filter(Boolean).join(' ') || `Player ${id}`
                      : `Player ${id}`
                    const points = log?.games?.length ? rollingAvgFromGameLog(log.games, 10) : []
                    if (points.length > 0) playerSeries.push({ key: `p${id}`, name, points })
                  })
                  if (playerSeries.length === 0)
                    return (
                      <div className='flex h-[280px] items-center justify-center text-muted-foreground'>
                        No game log data. Sync with PrestoSports.
                      </div>
                    )
                  const maxGames = Math.max(...playerSeries.map((s) => s.points.length), 1)
                  const chartData = Array.from({ length: maxGames }, (_, i) => {
                    const game = i + 1
                    const row: Record<string, number | string> = { game }
                    playerSeries.forEach((s) => {
                      const pt = s.points[i]
                      row[s.key] = pt ? pt.avg : 0
                    })
                    return row
                  })
                  const chartColors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)']
                  return (
                    <ResponsiveContainer width='100%' height={280}>
                      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                        <defs>
                          {playerSeries.map((_, i) => (
                            <linearGradient
                              key={i}
                              id={`avgGrad-${i}`}
                              x1='0'
                              y1='0'
                              x2='0'
                              y2='1'
                            >
                              <stop offset='0%' stopColor={chartColors[i]} stopOpacity={0.4} />
                              <stop offset='100%' stopColor={chartColors[i]} stopOpacity={0} />
                            </linearGradient>
                          ))}
                        </defs>
                        <XAxis
                          dataKey='game'
                          stroke='var(--muted-foreground)'
                          fontSize={11}
                          tickLine={false}
                          tickFormatter={(g) => `G${g}`}
                        />
                        <YAxis
                          stroke='var(--muted-foreground)'
                          fontSize={11}
                          tickLine={false}
                          width={36}
                          tickFormatter={(v) => (typeof v === 'number' ? v.toFixed(2) : String(v))}
                          domain={[0, 0.5]}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            const gameIdx = (payload[0]?.payload?.game as number) ?? 0
                            const p0 = playerSeries[0]?.points[gameIdx - 1]
                            return (
                              <div className='rounded-lg border bg-background p-3 shadow-md'>
                                <p className='mb-2 text-xs text-muted-foreground'>
                                  Game {gameIdx}{p0?.opponent ? ` · vs ${p0.opponent}` : ''}
                                </p>
                                {payload
                                  .filter((p) => p.value != null)
                                  .map((p) => (
                                    <div key={p.dataKey} className='flex justify-between gap-4 text-sm'>
                                      <span className='font-medium'>{p.name}</span>
                                      <span className='tabular-nums'>
                                        {(p.value as number).toFixed(3)}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            )
                          }}
                        />
                        <Legend />
                        {playerSeries.map((s, i) => (
                          <Area
                            key={s.key}
                            type='monotone'
                            dataKey={s.key}
                            name={s.name}
                            stroke={chartColors[i]}
                            fill={`url(#avgGrad-${i})`}
                            strokeWidth={2}
                          />
                        ))}
                      </AreaChart>
                    </ResponsiveContainer>
                  )
                })()}
              </CardContent>
            </Card>
            </div>
          </div>
        )}
      </div>
    </Main>
  )
}
