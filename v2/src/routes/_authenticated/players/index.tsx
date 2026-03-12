import { createFileRoute } from '@tanstack/react-router'
import { PlayersList } from '@/features/players/players-list'

export const Route = createFileRoute('/_authenticated/players/')({
  component: PlayersList,
})
