import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/reports/analytics')({
  component: () => (
    <PlaceholderPage
      title='Analytics'
      description='Player performance, team statistics, and scouting analysis'
    />
  ),
})
