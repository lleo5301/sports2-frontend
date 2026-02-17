import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/team-settings/')({
  component: () => (
    <PlaceholderPage
      title='Team Settings'
      description='Branding, users, and permissions'
    />
  ),
})
