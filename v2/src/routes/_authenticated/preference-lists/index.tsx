import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/preference-lists/')({
  component: () => (
    <PlaceholderPage
      title='Preference Lists'
      description='Preference list board view'
    />
  ),
})
