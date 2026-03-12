import { createFileRoute } from '@tanstack/react-router'
import { GamesList } from '@/features/games/games-list'

export const Route = createFileRoute('/_authenticated/games/')({
  component: GamesList,
})
