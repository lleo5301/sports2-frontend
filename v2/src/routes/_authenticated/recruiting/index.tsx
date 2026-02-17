import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/recruiting/')({
  component: () => (
    <PlaceholderPage
      title='Recruiting Board'
      description='Pipeline and recruiting board view'
    />
  ),
})
