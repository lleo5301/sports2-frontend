import { createFileRoute } from '@tanstack/react-router'
import { ProspectsList } from '@/features/prospects/prospects-list'

export const Route = createFileRoute('/_authenticated/prospects/')({
  component: ProspectsList,
})
