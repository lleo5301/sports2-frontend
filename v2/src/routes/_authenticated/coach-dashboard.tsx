import { createFileRoute } from '@tanstack/react-router'
import { CoachDashboardPage } from '@/features/coach-dashboard/coach-dashboard-page'

export const Route = createFileRoute('/_authenticated/coach-dashboard')({
  component: CoachDashboardPage,
})
