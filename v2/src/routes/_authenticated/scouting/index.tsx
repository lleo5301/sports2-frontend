import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/scouting/')({
  component: () => (
    <PlaceholderPage
      title='Scouting Reports'
      description='Scouting reports and evaluations'
    />
  ),
})
