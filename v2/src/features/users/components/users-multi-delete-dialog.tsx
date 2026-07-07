'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import { useAuth } from '@/contexts/AuthContext'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { adminUsersApi } from '@/lib/admin-users-api'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type User } from '../data/schema'

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function UsersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: UserMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const mutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const deletable = ids.filter((id) => String(id) !== String(user?.id))
      await Promise.all(deletable.map((id) => adminUsersApi.remove(id)))
      return { attempted: ids.length, deleted: deletable.length }
    },
    onSuccess: ({ attempted, deleted }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      if (deleted < attempted) {
        toast.success(
          `Deleted ${deleted} user(s); your own account was skipped.`
        )
      } else {
        toast.success(`Deleted ${deleted} user(s)`)
      }
      setValue('')
      table.resetRowSelection()
      onOpenChange(false)
    },
    onError: () => toast.error('Bulk delete failed'),
  })

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }

    const ids = selectedRows.map((row) => (row.original as User).id)
    mutation.mutate(ids)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD || mutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete {selectedRows.length}{' '}
          {selectedRows.length > 1 ? 'users' : 'user'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete the selected users? <br />
            This action cannot be undone.
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span className=''>Confirm by typing "{CONFIRM_WORD}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
