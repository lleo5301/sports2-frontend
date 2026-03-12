import { createFileRoute } from '@tanstack/react-router'
import { ScoutsList } from '@/features/scouts/scouts-list'

export const Route = createFileRoute('/_authenticated/scouts/')({
  component: ScoutsList,
})
