import { createFileRoute } from '@tanstack/react-router'
import { ScoutingList } from '@/features/scouting/scouting-list'

export const Route = createFileRoute('/_authenticated/scouting/')({
  component: ScoutingList,
})
