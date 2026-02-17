import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/players/$id')({
  component: PlayerDetail,
})

function PlayerDetail() {
  const { id } = Route.useParams()
  return (
    <PlaceholderPage
      title={`Player #${id}`}
      description='Player detail view'
    />
  )
}
