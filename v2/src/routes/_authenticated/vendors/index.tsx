import { createFileRoute } from '@tanstack/react-router'
import { VendorsList } from '@/features/vendors/vendors-list'

export const Route = createFileRoute('/_authenticated/vendors/')({
  component: VendorsList,
})
