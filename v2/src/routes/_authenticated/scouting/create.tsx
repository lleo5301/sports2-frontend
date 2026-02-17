import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/scouting/create')({
  component: () => (
    <PlaceholderPage
      title='Create Scouting Report'
      description='Create a new scouting report with grades'
    />
  ),
})
