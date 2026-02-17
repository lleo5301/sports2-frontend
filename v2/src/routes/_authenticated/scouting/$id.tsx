import { createFileRoute } from '@tanstack/react-router'
import { ScoutingDetail } from '@/features/scouting/scouting-detail'

export const Route = createFileRoute('/_authenticated/scouting/$id')({
  component: ScoutingDetailPage,
})

function ScoutingDetailPage() {
  const { id } = Route.useParams()
  return <ScoutingDetail id={id} />
}
