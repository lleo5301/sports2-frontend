import { createFileRoute } from '@tanstack/react-router'
import { ScheduleDetail } from '@/features/schedules/schedule-detail'

export const Route = createFileRoute('/_authenticated/schedules/$id')({
  component: ScheduleDetailPage,
})

function ScheduleDetailPage() {
  const { id } = Route.useParams()
  return <ScheduleDetail id={id} />
}
