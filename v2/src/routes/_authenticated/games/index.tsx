import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/games/')({
  component: () => (
    <PlaceholderPage
      title='Games'
      description='Games and results'
    />
  ),
})
