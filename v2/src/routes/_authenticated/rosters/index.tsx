import { createFileRoute } from '@tanstack/react-router'
import { RostersList } from '@/features/rosters/rosters-list'

export const Route = createFileRoute('/_authenticated/rosters/')({
  component: RostersList,
})
