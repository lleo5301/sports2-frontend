import { createFileRoute } from '@tanstack/react-router'
import { TeamLineupPage } from '@/features/team-stats/team-lineup-page'

export const Route = createFileRoute('/_authenticated/team-stats/team-lineup')({
  component: TeamLineupPage,
})
