import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { CreateScoutingForm } from '@/features/scouting/create-scouting-form'

const searchSchema = z.object({
  prospectId: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/scouting/create')({
  component: CreateScoutingPage,
  validateSearch: searchSchema,
})

function CreateScoutingPage() {
  const { prospectId } = Route.useSearch()
  return <CreateScoutingForm preselectedProspectId={prospectId} />
}
