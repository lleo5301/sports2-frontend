import { createFileRoute } from '@tanstack/react-router'
import { CoachesList } from '@/features/coaches/coaches-list'

export const Route = createFileRoute('/_authenticated/coaches/')({
  component: CoachesList,
})
