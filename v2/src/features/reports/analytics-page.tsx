import { useQuery } from '@tanstack/react-query'
import {
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

export function AnalyticsPage() {
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
            Player performance and recruitment pipeline
          </p>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center py-16'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <div className='space-y-6'>
            {hasTeamStats ? (
              <Card>
                <CardHeader>
                  <CardTitle>Team Statistics</CardTitle>
                  <CardDescription>
                    Aggregated team stats (batting, pitching)
                  </CardDescription>
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
