'use client'

import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminUsersApi } from '@/lib/admin-users-api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { type User } from '../data/schema'

type Props = {
  currentRow: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersDeleteDialog({ currentRow, open, onOpenChange }: Props) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => adminUsersApi.remove(currentRow.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success(`Deleted ${currentRow.firstName} ${currentRow.lastName}`)
      onOpenChange(false)
    },
    onError: (err) => {
      const msg =
        err instanceof AxiosError
          ? ((err.response?.data as { error?: string })?.error ??
            'Delete failed')
          : 'Delete failed'
      toast.error(msg)
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes {currentRow.firstName}{' '}
            {currentRow.lastName} ({currentRow.email}). This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={mutation.isPending}
            onClick={(e) => {
              e.preventDefault()
              mutation.mutate()
            }}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
