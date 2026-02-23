import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '@/features/auth/auth-layout'
import { LoginForm } from '@/features/auth/login-form'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
  validateSearch: searchSchema,
})

function LoginPage() {
  const { redirect } = Route.useSearch()

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm redirectTo={redirect} />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
