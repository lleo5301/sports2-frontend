import { createFileRoute } from '@tanstack/react-router'
import { VendorDetail } from '@/features/vendors/vendor-detail'

export const Route = createFileRoute('/_authenticated/vendors/$id')({
  component: VendorDetailPage,
})

function VendorDetailPage() {
  const { id } = Route.useParams()
  return <VendorDetail id={id} />
}
