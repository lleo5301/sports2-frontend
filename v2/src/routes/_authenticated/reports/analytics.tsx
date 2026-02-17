import { createFileRoute } from '@tanstack/react-router'
import { AnalyticsPage } from '@/features/reports/analytics-page'

export const Route = createFileRoute('/_authenticated/reports/analytics')({
  component: AnalyticsPage,
})
