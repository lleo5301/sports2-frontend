import { createFileRoute } from '@tanstack/react-router'
import { ScoutDetail } from '@/features/scouts/scout-detail'

export const Route = createFileRoute('/_authenticated/scouts/$id')({
  component: ScoutDetailPage,
})

function ScoutDetailPage() {
  const { id } = Route.useParams()
  return <ScoutDetail id={id} />
}
