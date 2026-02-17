import { createFileRoute } from '@tanstack/react-router'
import { DepthChartsList } from '@/features/depth-charts/depth-charts-list'

export const Route = createFileRoute('/_authenticated/depth-charts/')({
  component: DepthChartsList,
})
