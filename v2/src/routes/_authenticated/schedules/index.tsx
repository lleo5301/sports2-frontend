import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/schedules/')({
  component: () => (
    <PlaceholderPage
      title='Schedules'
      description='Team schedules and calendar'
    />
  ),
})
