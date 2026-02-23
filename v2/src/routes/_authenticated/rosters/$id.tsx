import { createFileRoute } from '@tanstack/react-router'
import { RosterDetail } from '@/features/rosters/roster-detail'

export const Route = createFileRoute('/_authenticated/rosters/$id')({
  component: RosterDetailPage,
})

function RosterDetailPage() {
  const { id } = Route.useParams()
  return <RosterDetail id={id} />
}
