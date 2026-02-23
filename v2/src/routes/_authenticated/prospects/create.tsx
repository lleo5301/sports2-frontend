import { createFileRoute } from '@tanstack/react-router'
import { CreateProspectForm } from '@/features/prospects/create-prospect-form'

export const Route = createFileRoute('/_authenticated/prospects/create')({
  component: CreateProspectForm,
})
