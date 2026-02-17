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

  const isLoading = loadingPerf || loadingPipeline

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
        )}
      </div>
    </Main>
  )
}
