import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/reports/')({
  component: () => (
    <PlaceholderPage
      title='Reports'
      description='Custom reports'
    />
  ),
})
