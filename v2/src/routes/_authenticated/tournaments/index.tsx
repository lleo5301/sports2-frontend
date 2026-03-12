import { createFileRoute } from '@tanstack/react-router'
import { TournamentsList } from '@/features/tournaments/tournaments-list'

export const Route = createFileRoute('/_authenticated/tournaments/')({
  component: TournamentsList,
})
