import { createFileRoute } from '@tanstack/react-router'
import { TeamGameLogPage } from '@/features/team-stats/team-game-log-page'

export const Route = createFileRoute('/_authenticated/team-stats/team-game-log')({
  component: TeamGameLogPage,
})
