import { createFileRoute } from '@tanstack/react-router'
import { CoachDetail } from '@/features/coaches/coach-detail'

export const Route = createFileRoute('/_authenticated/coaches/$id')({
  component: CoachDetailPage,
})

function CoachDetailPage() {
  const { id } = Route.useParams()
  return <CoachDetail id={id} />
}
