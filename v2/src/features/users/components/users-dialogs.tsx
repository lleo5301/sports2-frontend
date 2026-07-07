import { UsersActionDialog } from './users-action-dialog'
import { UsersDeleteDialog } from './users-delete-dialog'
import { useUsers } from './users-provider'
import { UsersResetPasswordDialog } from './users-reset-password-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()

  const clearRowLater = () => setTimeout(() => setCurrentRow(null), 300)

  return (
    <>
      <UsersActionDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={() => setOpen(open === 'add' ? null : 'add')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen(null)
              clearRowLater()
            }}
            currentRow={currentRow}
          />

          <UsersResetPasswordDialog
            key={`user-reset-${currentRow.id}`}
            open={open === 'reset'}
            onOpenChange={() => {
              setOpen(null)
              clearRowLater()
            }}
            currentRow={currentRow}
          />

          <UsersDeleteDialog
            key={`user-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen(null)
              clearRowLater()
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
