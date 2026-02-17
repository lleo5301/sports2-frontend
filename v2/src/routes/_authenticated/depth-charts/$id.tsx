import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { depthChartsApi } from '@/lib/depth-charts-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/depth-charts/$id')({
  component: DepthChartDetail,
})

function DepthChartDetail() {
  const { id } = Route.useParams()
  const chartId = parseInt(id, 10)

  const { data: chart, isLoading, error } = useQuery({
    queryKey: ['depth-chart', chartId],
    queryFn: () => depthChartsApi.getById(chartId),
  })

  if (isLoading) {
    return (
      <Main>
        <p className='py-8 text-center text-muted-foreground'>Loading...</p>
      </Main>
    )
  }

  if (error || !chart) {
    return (
      <Main>
        <Card>
          <CardContent className='py-8'>
            <p className='text-center text-destructive'>
              {(error as Error)?.message ?? 'Depth chart not found'}
            </p>
            <Button asChild className='mt-4'>
              <Link to='/depth-charts'>Back to list</Link>
            </Button>
          </CardContent>
        </Card>
      </Main>
    )
  }

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <Button variant='outline' asChild>
            <Link to='/depth-charts'>← Back</Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{chart.name || `Depth Chart #${chart.id}`}</CardTitle>
            <p className='text-sm text-muted-foreground'>
              Field view and position manager — full component port in progress.
            </p>
          </CardHeader>
          <CardContent>
            <div className='rounded-lg border border-dashed p-8 text-center text-muted-foreground'>
              <p>Baseball field view coming soon.</p>
              <p className='mt-2 text-sm'>
                EnhancedBaseballFieldView and DepthChartPositionManager will be ported from the parent app.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
