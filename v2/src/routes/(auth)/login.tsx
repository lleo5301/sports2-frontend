import { z } from 'zod'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
            Enter your email and password to sign in to Sports2
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm redirectTo={redirect} />
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <Link to='/register' className='underline underline-offset-4 hover:text-primary'>
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
