import { createFileRoute } from '@tanstack/react-router'
import { CalendarView } from '@/features/schedules/calendar-view'

export const Route = createFileRoute('/_authenticated/schedules/calendar')({
  component: CalendarView,
})
