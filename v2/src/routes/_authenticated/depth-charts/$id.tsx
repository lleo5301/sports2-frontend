import { createFileRoute } from '@tanstack/react-router'
import { DepthChartDetailPage } from '@/features/depth-charts'

export const Route = createFileRoute('/_authenticated/depth-charts/$id')({
  component: DepthChartDetailRoute,
})

function DepthChartDetailRoute() {
  const { id } = Route.useParams()
  const chartId = parseInt(id, 10)
  return <DepthChartDetailPage chartId={chartId} />
}
