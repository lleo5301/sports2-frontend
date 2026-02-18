import { createFileRoute } from '@tanstack/react-router'
import { ReportDetail } from '@/features/reports/report-detail'

export const Route = createFileRoute('/_authenticated/reports/$id')({
  component: ReportDetailPage,
})

function ReportDetailPage() {
  const { id } = Route.useParams()
  return <ReportDetail id={id} />
}
