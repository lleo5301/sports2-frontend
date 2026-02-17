import { createFileRoute } from '@tanstack/react-router'
import { CreateVendorForm } from '@/features/vendors/create-vendor-form'

export const Route = createFileRoute('/_authenticated/vendors/create')({
  component: CreateVendorForm,
})
