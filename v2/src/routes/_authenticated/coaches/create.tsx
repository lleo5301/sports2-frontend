import { createFileRoute } from '@tanstack/react-router'
import { CreateCoachForm } from '@/features/coaches/create-coach-form'

export const Route = createFileRoute('/_authenticated/coaches/create')({
  component: CreateCoachForm,
})
