import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/scouting/$id')({
  component: ScoutingDetail,
})

function ScoutingDetail() {
  const { id } = Route.useParams()
  return (
    <PlaceholderPage
      title={`Scouting Report #${id}`}
      description='View and edit scouting report'
    />
  )
}
