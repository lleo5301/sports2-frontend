import { createFileRoute } from '@tanstack/react-router'
import { CreateRosterForm } from '@/features/rosters/create-roster-form'

export const Route = createFileRoute('/_authenticated/rosters/create')({
  component: CreateRosterForm,
})
