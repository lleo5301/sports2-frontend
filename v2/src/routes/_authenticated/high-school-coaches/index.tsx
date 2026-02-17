import { createFileRoute } from '@tanstack/react-router'
import { HighSchoolCoachesList } from '@/features/high-school-coaches/high-school-coaches-list'

export const Route = createFileRoute('/_authenticated/high-school-coaches/')({
  component: HighSchoolCoachesList,
})
