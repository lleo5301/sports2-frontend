import { createFileRoute } from '@tanstack/react-router'
import { ProspectDetail } from '@/features/prospects/prospect-detail'

export const Route = createFileRoute('/_authenticated/prospects/$id')({
  component: ProspectDetailPage,
})

function ProspectDetailPage() {
  const { id } = Route.useParams()
  return <ProspectDetail id={id} />
}
