import { createFileRoute } from '@tanstack/react-router'
import { HighSchoolCoachDetail } from '@/features/high-school-coaches/high-school-coach-detail'

export const Route = createFileRoute('/_authenticated/high-school-coaches/$id')({
  component: HighSchoolCoachDetailPage,
})

function HighSchoolCoachDetailPage() {
  const { id } = Route.useParams()
  return <HighSchoolCoachDetail id={id} />
}
