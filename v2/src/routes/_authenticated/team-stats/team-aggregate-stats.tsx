import { createFileRoute } from '@tanstack/react-router'
import { TeamAggregateStatsPage } from '@/features/team-stats/team-aggregate-stats-page'

export const Route = createFileRoute('/_authenticated/team-stats/team-aggregate-stats')({
  component: TeamAggregateStatsPage,
})
