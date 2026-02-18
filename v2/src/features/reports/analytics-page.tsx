import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
import { extendedStatsApi, type CoachDashboardData, type DashboardRecentGame } from '@/lib/extended-stats-api'
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
import { Loader2 } from 'lucide-react'

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
function parseRecord(s: string): { wins: number; losses: number } | null {
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

const LEADER_CATEGORIES = [
  { key: 'batting_avg', label: 'Batting Avg', lowerBetter: false },
  { key: 'home_runs', label: 'HR', lowerBetter: false },
  { key: 'rbi', label: 'RBI', lowerBetter: false },
  { key: 'stolen_bases', label: 'SB', lowerBetter: false },
  { key: 'era', label: 'ERA', lowerBetter: true },
  { key: 'strikeouts', label: 'SO', lowerBetter: false },
] as const

export function AnalyticsPage() {
  const { data: dashboard } = useQuery({
    queryKey: ['coach-dashboard'],
    queryFn: () => extendedStatsApi.getCoachDashboard(),
  })

  const { data: aggregateStats } = useQuery({
    queryKey: ['team-aggregate-stats'],
    queryFn: () => extendedStatsApi.getTeamAggregateStats(),
  })
  const { data: playerPerf, isLoading: loadingPerf } = useQuery({
    queryKey: ['reports', 'player-performance'],
    queryFn: () => reportsApi.getPlayerPerformance(),
  })

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

  const isLoading = loadingPerf || loadingPipeline
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

  // Normalize player performance - expect { period, value } or { metric, value } or similar
  const perfChartData = Array.isArray(playerPerf)
    ? playerPerf
        .filter((p) => p != null)
        .map((p) => {
          const label =
            p.period ?? p.metric ?? p.player_name ?? String(p.metric ?? '')
          const val = Number(p.value ?? p.count ?? p.avg ?? 0)
          return { name: label, value: val }
        })
        .slice(0, 12)
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

        {/* Stat Leaders — from extended stats */}
        {dashboard?.leaders && Object.keys(dashboard.leaders).length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Stat leaders</CardTitle>
              <CardDescription>Top performers in key categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {LEADER_CATEGORIES.map(({ key, label }) => {
                  const arr = dashboard.leaders[key as keyof CoachDashboardData['leaders']]
                  if (!arr?.length) return null
                  return (
                    <div key={key} className='rounded-lg border p-3'>
                      <p className='mb-2 text-xs font-medium text-muted-foreground'>{label}</p>
                      <ol className='space-y-1'>
                        {arr.map((l, i) => (
                          <li key={l.player_id} className='flex justify-between text-sm'>
                            <Link
                              to='/players/$id'
                              params={{ id: l.player_id }}
                              className='font-medium hover:underline'
                            >
                              {i + 1}. {l.name}
                            </Link>
                            <span className='tabular-nums'>{l.value}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ) : null}

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
                <CardTitle>Player Performance</CardTitle>
                <CardDescription>
                  Performance metrics over time or by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                {perfChartData.length > 0 ? (
                  <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={perfChartData}>
                      <XAxis
                        dataKey='name'
                        stroke='var(--muted-foreground)'
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke='var(--muted-foreground)'
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip />
                      <Bar
                        dataKey='value'
                        fill='var(--primary)'
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className='flex h-[300px] items-center justify-center text-muted-foreground'>
                    No performance data
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          </div>
        )}
      </div>
    </Main>
  )
}
