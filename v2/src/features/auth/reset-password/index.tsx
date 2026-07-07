import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { ResetPasswordForm } from './components/reset-password-form'

interface ResetPasswordProps {
  token?: string
}

export function ResetPassword({ token }: ResetPasswordProps) {
  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            Reset Password
          </CardTitle>
          <CardDescription>
            {token
              ? 'Choose a new password for your account.'
              : 'This reset link is invalid or incomplete.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <p className='text-sm text-muted-foreground'>
              Request a new link from the{' '}
              <Link
                to='/forgot-password'
                className='underline underline-offset-4 hover:text-primary'
              >
                forgot password
              </Link>{' '}
              page.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <p className='mx-auto px-8 text-center text-sm text-balance text-muted-foreground'>
            Remembered your password?{' '}
            <Link
              to='/login'
              className='underline underline-offset-4 hover:text-primary'
            >
              Sign in
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
