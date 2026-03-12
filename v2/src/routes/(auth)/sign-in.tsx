import { z } from 'zod'
import { createFileRoute, Navigate } from '@tanstack/react-router'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignInRedirect,
  validateSearch: searchSchema,
})

function SignInRedirect() {
  const { redirect } = Route.useSearch()
  return <Navigate to='/login' search={redirect ? { redirect } : {}} replace />
}
