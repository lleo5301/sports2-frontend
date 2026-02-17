import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/integrations/')({
  component: () => (
    <PlaceholderPage
      title='Integrations'
      description='PrestoSports and other integrations'
    />
  ),
})
