import { createFileRoute } from '@tanstack/react-router'
import { TournamentDetail } from '@/features/tournaments/tournament-detail'

export const Route = createFileRoute('/_authenticated/tournaments/$id')({
  component: TournamentDetailPage,
})

function TournamentDetailPage() {
  const { id } = Route.useParams()
  return <TournamentDetail id={id} />
}
