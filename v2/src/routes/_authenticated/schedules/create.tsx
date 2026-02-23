import { createFileRoute } from '@tanstack/react-router'
import { CreateScheduleForm } from '@/features/schedules/create-schedule-form'

export const Route = createFileRoute('/_authenticated/schedules/create')({
  component: CreateScheduleForm,
})
