'use client'

import { useState } from 'react'
import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminUsersApi } from '@/lib/admin-users-api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'
import { type User } from '../data/schema'

type Props = {
  currentRow: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersResetPasswordDialog({
  currentRow,
  open,
  onOpenChange,
}: Props) {
  const queryClient = useQueryClient()
  const [customPassword, setCustomPassword] = useState('')
  const [result, setResult] = useState<{
    temporaryPassword?: string
    emailSent: boolean
  } | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      adminUsersApi.resetPassword(
        currentRow.id,
        customPassword.trim() ? customPassword.trim() : undefined
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setResult(data)
      toast.success(
        data.emailSent
          ? 'Password reset and emailed to the user'
          : 'Password reset (email not sent)'
      )
    },
    onError: (err) => {
      const msg =
        err instanceof AxiosError
          ? ((err.response?.data as { error?: string })?.error ??
            'Reset failed')
          : 'Reset failed'
      toast.error(msg)
    },
  })

  const close = (state: boolean) => {
    if (!state) {
      setCustomPassword('')
      setResult(null)
    }
    onOpenChange(state)
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>
            Reset the password for {currentRow.firstName} {currentRow.lastName}.
            Leave blank to auto-generate one. The new password is emailed to the
            user.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className='space-y-2 text-sm'>
            {result.temporaryPassword ? (
              <p>
                Temporary password:{' '}
                <code className='rounded bg-muted px-2 py-1 font-mono'>
                  {result.temporaryPassword}
                </code>
              </p>
            ) : (
              <p>The password was set to the value you provided.</p>
            )}
            <p className='text-muted-foreground'>
              {result.emailSent
                ? 'An email with the new password was sent to the user.'
                : 'Email delivery failed — share the password manually.'}
            </p>
          </div>
        ) : (
          <div className='space-y-2'>
            <Label htmlFor='custom-password'>Custom password (optional)</Label>
            <PasswordInput
              id='custom-password'
              placeholder='Leave blank to auto-generate'
              value={customPassword}
              onChange={(e) => setCustomPassword(e.target.value)}
            />
          </div>
        )}

        <DialogFooter>
          {result ? (
            <Button onClick={() => close(false)}>Done</Button>
          ) : (
            <Button
              disabled={mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              Reset password
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
