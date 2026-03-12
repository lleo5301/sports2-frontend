import { createFileRoute } from '@tanstack/react-router'
import { Sports2Dashboard } from '@/features/dashboard/sports2-dashboard'

export const Route = createFileRoute('/_authenticated/')({
  component: Sports2Dashboard,
})
