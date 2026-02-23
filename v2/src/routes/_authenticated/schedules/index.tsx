import { createFileRoute } from '@tanstack/react-router'
import { SchedulesList } from '@/features/schedules/schedules-list'

export const Route = createFileRoute('/_authenticated/schedules/')({
  component: SchedulesList,
})
