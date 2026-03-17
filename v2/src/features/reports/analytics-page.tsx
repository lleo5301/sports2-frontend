/**
 * Analytics — charts and trends unique to this page.
 * Stat leaders → Leaderboard page. Team stats → Coach Dashboard.
 */
import { useQueries, useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ChevronRight, Loader2 } from 'lucide-react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'
import {
  extendedStatsApi,
  type DashboardRecentGame,
  type PlayerGameLogEntry,
} from '@/lib/extended-stats-api'
import { gamesApi } from '@/lib/games-api'
import { reportsApi } from '@/lib/reports-api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Main } from '@/components/layout/main'

/** Parse "15-8" or "15-8-1" to { wins, losses } */
function parseRecord(
  s: string | null
): { wins: number; losses: number } | null {
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
      }
    })
    .filter(Boolean) as Array<{
    index: number
    date: string
    opponent: string
    result: string | null
    wins: number
    losses: number
  }>
}

/** Rolling AVG per game (newest first → chronological for chart) */
function rollingAvgFromGameLog(
  games: PlayerGameLogEntry[],
  maxGames: number
): Array<{ game: number; avg: number; opponent: string }> {
  const withBatting = games
    .filter((g) => g.batting?.ab != null && g.batting.ab > 0)
    .slice(0, maxGames)
  let cumH = 0
  let cumAB = 0
  return withBatting.map((g, i) => {
    cumH += g.batting?.h ?? 0
    cumAB += g.batting?.ab ?? 0
    return {
      game: i + 1,
      avg: cumAB > 0 ? Math.round((cumH / cumAB) * 1000) / 1000 : 0,
      opponent: g.game?.opponent ?? `G${i + 1}`,
    }
  })
}

export function AnalyticsPage() {
  const { data: dashboard } = useQuery({
    queryKey: ['coach-dashboard'],
    queryFn: () => extendedStatsApi.getCoachDashboard(),
  })

  const { data: battingLeaders } = useQuery({
    queryKey: ['leaderboard', 'batting_average', 5],
    queryFn: () =>
      gamesApi.getLeaderboard({ stat: 'batting_average', limit: 5 }),
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

  const { data: pipeline } = useQuery({
    queryKey: ['reports', 'recruitment-pipeline'],
    queryFn: () => reportsApi.getRecruitmentPipeline(),
  })

  const pipelineData = Array.isArray(pipeline)
    ? pipeline
        .filter((p) => p?.status != null)
        .map((p) => ({
          name: String(p.status).replace(/_/g, ' '),
          count: Number(p.count) || 0,
        }))
        .filter((p) => p.count > 0)
    : []
  const pipelineTotal = pipelineData.reduce((sum, p) => sum + p.count, 0)

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Analytics</h2>
            <p className='text-muted-foreground'>
              Record progression, batting trends, and recruitment pipeline
            </p>
          </div>
          <div className='flex gap-2'>
            <Button variant='ghost' size='sm' asChild>
              <Link to='/coach-dashboard'>
                Coach Dashboard <ChevronRight className='ml-0.5 size-3' />
              </Link>
            </Button>
            <Button variant='ghost' size='sm' asChild>
              <Link to='/games/leaderboard'>
                Leaderboard <ChevronRight className='ml-0.5 size-3' />
              </Link>
            </Button>
          </div>
        </div>

        {/* ── Record Progression ── */}
        {dashboard?.recent_games?.length ? (
          <Card>
            <CardHeader>
              <CardTitle>Record progression</CardTitle>
              <CardDescription>
                Wins over the season (last {dashboard.recent_games.length}{' '}
                games)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const chartData = buildRecordProgression(dashboard.recent_games)
                if (chartData.length === 0)
                  return <p className='text-muted-foreground'>No record data</p>
                return (
                  <ResponsiveContainer width='100%' height={220}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id='winsGrad'
                          x1='0'
                          y1='0'
                          x2='0'
                          y2='1'
                        >
                          <stop
                            offset='0%'
                            stopColor='var(--primary)'
                            stopOpacity={0.4}
                          />
                          <stop
                            offset='100%'
                            stopColor='var(--primary)'
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey='index'
                        stroke='var(--muted-foreground)'
                        fontSize={11}
                        tickLine={false}
                        tickFormatter={(i) => `G${i}`}
                      />
                      <YAxis
                        stroke='var(--muted-foreground)'
                        fontSize={11}
                        tickLine={false}
                        width={28}
                      />
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

        <div className='grid gap-6 lg:grid-cols-2'>
          {/* ── Batting Trends ── */}
          <Card>
            <CardHeader>
              <CardTitle>Batting trends</CardTitle>
              <CardDescription>
                Cumulative AVG over last 10 games — top 3 leaders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gameLogQueries.some((q) => q.isLoading) ? (
                <div className='flex h-[280px] items-center justify-center'>
                  <Loader2 className='size-8 animate-spin text-muted-foreground' />
                </div>
              ) : (
                (() => {
                  const playerSeries: Array<{
                    key: string
                    name: string
                    points: Array<{
                      game: number
                      avg: number
                      opponent: string
                    }>
                  }> = []
                  topBatterIds.slice(0, 3).forEach((id, i) => {
                    const log = gameLogs[i]
                    const leaders = battingLeaders?.leaders ?? []
                    const leader = leaders.find((l) => l.player.id === id)
                    const name = leader
                      ? [leader.player.first_name, leader.player.last_name]
                          .filter(Boolean)
                          .join(' ') || `Player ${id}`
                      : `Player ${id}`
                    const points = log?.games?.length
                      ? rollingAvgFromGameLog(log.games, 10)
                      : []
                    if (points.length > 0)
                      playerSeries.push({ key: `p${id}`, name, points })
                  })
                  if (playerSeries.length === 0)
                    return (
                      <div className='flex h-[280px] items-center justify-center text-muted-foreground'>
                        No game log data. Sync with PrestoSports.
                      </div>
                    )
                  const maxGames = Math.max(
                    ...playerSeries.map((s) => s.points.length),
                    1
                  )
                  const chartData = Array.from({ length: maxGames }, (_, i) => {
                    const game = i + 1
                    const row: Record<string, number | string> = { game }
                    playerSeries.forEach((s) => {
                      const pt = s.points[i]
                      row[s.key] = pt ? pt.avg : 0
                    })
                    return row
                  })
                  const chartColors = [
                    'var(--chart-1)',
                    'var(--chart-2)',
                    'var(--chart-3)',
                  ]
                  return (
                    <ResponsiveContainer width='100%' height={280}>
                      <AreaChart
                        data={chartData}
                        margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                      >
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
                              <stop
                                offset='0%'
                                stopColor={chartColors[i]}
                                stopOpacity={0.4}
                              />
                              <stop
                                offset='100%'
                                stopColor={chartColors[i]}
                                stopOpacity={0}
                              />
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
                          tickFormatter={(v) =>
                            typeof v === 'number' ? v.toFixed(2) : String(v)
                          }
                          domain={[0, 0.5]}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            const gameIdx =
                              (payload[0]?.payload?.game as number) ?? 0
                            const p0 = playerSeries[0]?.points[gameIdx - 1]
                            return (
                              <div className='rounded-lg border bg-background p-3 shadow-md'>
                                <p className='mb-2 text-xs text-muted-foreground'>
                                  Game {gameIdx}
                                  {p0?.opponent ? ` · vs ${p0.opponent}` : ''}
                                </p>
                                {payload
                                  .filter((p) => p.value != null)
                                  .map((p) => (
                                    <div
                                      key={p.dataKey}
                                      className='flex justify-between gap-4 text-sm'
                                    >
                                      <span className='font-medium'>
                                        {p.name}
                                      </span>
                                      <span className='tabular-nums'>
                                        {(p.value as number).toFixed(3)}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            )
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
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
                })()
              )}
            </CardContent>
          </Card>

          {/* ── Recruitment Pipeline — compact inline stats ── */}
          <Card>
            <CardHeader>
              <CardTitle>Recruitment pipeline</CardTitle>
              <CardDescription>Prospects by status</CardDescription>
            </CardHeader>
            <CardContent>
              {pipelineData.length > 0 ? (
                <div className='space-y-3'>
                  {pipelineData.map((p) => {
                    const pct =
                      pipelineTotal > 0 ? (p.count / pipelineTotal) * 100 : 0
                    return (
                      <div key={p.name}>
                        <div className='mb-1 flex items-baseline justify-between text-sm'>
                          <span className='font-medium capitalize'>
                            {p.name}
                          </span>
                          <span className='text-muted-foreground tabular-nums'>
                            {p.count}
                          </span>
                        </div>
                        <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
                          <div
                            className='h-full rounded-full bg-primary transition-all'
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                  <p className='pt-1 text-xs text-muted-foreground'>
                    {pipelineTotal} total prospects
                  </p>
                </div>
              ) : (
                <p className='py-8 text-center text-muted-foreground'>
                  No pipeline data
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Main>
  )
}
