import { createFileRoute } from '@tanstack/react-router'
import { GameDetail } from '@/features/games/game-detail'

export const Route = createFileRoute('/_authenticated/games/$id')({
  component: GameDetailPage,
})

function GameDetailPage() {
  const { id } = Route.useParams()
  return <GameDetail id={id} />
}
