import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/prospects/$id')({
  component: ProspectDetail,
})

function ProspectDetail() {
  const { id } = Route.useParams()
  return (
    <PlaceholderPage
      title={`Prospect #${id}`}
      description='Prospect detail and scouting'
    />
  )
}
