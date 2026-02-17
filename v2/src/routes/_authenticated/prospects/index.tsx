import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/prospects/')({
  component: () => (
    <PlaceholderPage
      title='Prospects'
      description='Recruiting prospects'
    />
  ),
})
