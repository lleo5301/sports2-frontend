import { createFileRoute } from '@tanstack/react-router'
import { PlayerDetail } from '@/features/players/player-detail'

export const Route = createFileRoute('/_authenticated/players/$id')({
  component: PlayerDetailPage,
})

function PlayerDetailPage() {
  const { id } = Route.useParams()
  return <PlayerDetail id={id} />
}
