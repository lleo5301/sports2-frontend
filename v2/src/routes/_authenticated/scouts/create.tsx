import { createFileRoute } from '@tanstack/react-router'
import { CreateScoutForm } from '@/features/scouts/create-scout-form'

export const Route = createFileRoute('/_authenticated/scouts/create')({
  component: CreateScoutForm,
})
