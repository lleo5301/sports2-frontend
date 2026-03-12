import { createFileRoute, Navigate } from '@tanstack/react-router'

/**
 * /dashboard redirects to / (dashboard index).
 * Handles cases where backend or links send users to /dashboard after login.
 */
export const Route = createFileRoute('/_authenticated/dashboard')({
  component: () => <Navigate to='/' replace />,
})
