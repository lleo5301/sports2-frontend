import { createFileRoute } from '@tanstack/react-router'
import { LeaderboardPage } from '@/features/games/leaderboard-page'

export const Route = createFileRoute('/_authenticated/games/leaderboard')({
  component: LeaderboardPage,
})
