import { createFileRoute } from '@tanstack/react-router'
import { ReportsList } from '@/features/reports/reports-list'

export const Route = createFileRoute('/_authenticated/reports/')({
  component: ReportsList,
})
