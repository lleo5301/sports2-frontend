import { createFileRoute } from '@tanstack/react-router'
import { TeamStatsHub } from '@/features/team-stats/team-stats-hub'

export const Route = createFileRoute('/_authenticated/team-stats/')({
  component: TeamStatsHub,
})
