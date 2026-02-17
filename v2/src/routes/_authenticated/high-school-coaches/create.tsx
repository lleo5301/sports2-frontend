import { createFileRoute } from '@tanstack/react-router'
import { CreateHighSchoolCoachForm } from '@/features/high-school-coaches/create-high-school-coach-form'

export const Route = createFileRoute('/_authenticated/high-school-coaches/create')({
  component: CreateHighSchoolCoachForm,
})
