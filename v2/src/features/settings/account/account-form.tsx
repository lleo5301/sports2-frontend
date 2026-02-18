import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Key, Download, Trash2 } from 'lucide-react'
import { settingsApi } from '@/lib/settings-api'
import { getProfile } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'America/Anchorage',
  'Pacific/Honolulu',
  'UTC',
]

const accountFormSchema = z.object({
  timezone: z.string().optional(),
  locale: z.string().optional(),
})

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

type AccountFormValues = z.infer<typeof accountFormSchema>
type ChangePasswordValues = z.infer<typeof changePasswordSchema>

export function AccountForm() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.getAll(),
  })

  const { data: user } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getProfile,
  })

  const account = settings?.account ?? {}

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: { timezone: '', locale: 'en' },
    values: {
      timezone: account.timezone ?? '',
      locale: account.locale ?? 'en',
    },
  })

  const updateAccountMutation = useMutation({
    mutationFn: (data: AccountFormValues) =>
      settingsApi.updateAccount({
        timezone: data.timezone || undefined,
        locale: data.locale || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      toast.success('Account settings updated')
    },
    onError: (err) => toast.error((err as Error).message),
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordValues) =>
      settingsApi.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      }),
    onSuccess: () => {
      toast.success('Password changed')
    },
    onError: (err) => toast.error((err as Error).message),
  })

  const exportMutation = useMutation({
    mutationFn: () => settingsApi.exportData(),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sports2-data-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Data export started')
    },
    onError: (err) => toast.error((err as Error).message),
  })

  const deleteAccountMutation = useMutation({
    mutationFn: () => settingsApi.deleteAccount(),
    onSuccess: () => {
      toast.success('Account deleted')
      navigate({ to: '/login' })
      window.location.reload()
    },
    onError: (err) => toast.error((err as Error).message),
  })

  return (
    <div className='space-y-10'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((d) => updateAccountMutation.mutate(d))}
          className='space-y-6'
        >
          <FormField
            control={form.control}
            name='timezone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timezone</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select timezone' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Times will be shown in this timezone across the app
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='locale'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select language' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='en'>English</SelectItem>
                    <SelectItem value='es'>Spanish</SelectItem>
                    <SelectItem value='fr'>French</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Language for the dashboard</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={updateAccountMutation.isPending}>
            {updateAccountMutation.isPending && (
              <Loader2 className='me-2 size-4 animate-spin' />
            )}
            Save account settings
          </Button>
        </form>
      </Form>

      <div className='border-t pt-8'>
        <h3 className='mb-4 text-lg font-medium'>Security</h3>
        <div className='space-y-4'>
          <div className='flex items-center justify-between rounded-lg border p-4'>
            <div>
              <p className='font-medium'>Change password</p>
              <p className='text-sm text-muted-foreground'>
                Update your password to keep your account secure
              </p>
            </div>
            <ChangePasswordDialog
              onSubmit={(data) => changePasswordMutation.mutateAsync(data)}
              isPending={changePasswordMutation.isPending}
            />
          </div>
          <div className='flex items-center justify-between rounded-lg border p-4'>
            <div>
              <p className='font-medium'>Export data</p>
              <p className='text-sm text-muted-foreground'>
                Download a copy of your data
              </p>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending}
            >
              {exportMutation.isPending ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <Download className='size-4' />
              )}
              Export
            </Button>
          </div>
          <div className='flex items-center justify-between rounded-lg border border-destructive/50 p-4'>
            <div>
              <p className='font-medium text-destructive'>Delete account</p>
              <p className='text-sm text-muted-foreground'>
                Permanently delete your account and all data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='destructive' size='sm'>
                  <Trash2 className='size-4' />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. All your data will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteAccountMutation.mutate()}
                    className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  >
                    {deleteAccountMutation.isPending ? (
                      <Loader2 className='size-4 animate-spin' />
                    ) : null}
                    Delete account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChangePasswordDialog({
  onSubmit,
  isPending,
}: {
  onSubmit: (data: ChangePasswordValues) => Promise<unknown>
  isPending: boolean
}) {
  const [open, setOpen] = useState(false)
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
    form.reset()
    setOpen(false)
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <Key className='size-4' />
          Change
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new one.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <FormField
              control={form.control}
              name='current_password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='new_password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirm_password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit' disabled={isPending}>
                {isPending && <Loader2 className='me-2 size-4 animate-spin' />}
                Change password
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
