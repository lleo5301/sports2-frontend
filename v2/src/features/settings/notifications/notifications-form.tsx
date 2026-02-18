import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Mail } from 'lucide-react'
import { settingsApi } from '@/lib/settings-api'
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
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

const notificationsFormSchema = z.object({
  email_scouting: z.boolean(),
  email_reports: z.boolean(),
  email_schedule: z.boolean(),
  email_security: z.boolean(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

export function NotificationsForm() {
  const queryClient = useQueryClient()

  const { data: prefs, isLoading } = useQuery({
    queryKey: ['settings', 'notifications', 'preferences'],
    queryFn: () => settingsApi.getNotificationPreferences(),
  })

  const updateMutation = useMutation({
    mutationFn: (data: NotificationsFormValues) =>
      settingsApi.updateNotificationPreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      toast.success('Notification preferences updated')
    },
    onError: (err) => toast.error((err as Error).message),
  })

  const testEmailMutation = useMutation({
    mutationFn: () => settingsApi.sendTestEmail(),
    onSuccess: () => toast.success('Test email sent'),
    onError: (err) => toast.error((err as Error).message),
  })

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      email_scouting: false,
      email_reports: false,
      email_schedule: false,
      email_security: true,
    },
    values: prefs
      ? {
          email_scouting: Boolean(prefs.email_scouting),
          email_reports: Boolean(prefs.email_reports),
          email_schedule: Boolean(prefs.email_schedule),
          email_security: prefs.email_security !== false,
        }
      : undefined,
  })

  if (isLoading) {
    return (
      <div className='flex items-center gap-2 py-8 text-muted-foreground'>
        <Loader2 className='size-4 animate-spin' />
        Loading preferences...
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((d) => updateMutation.mutate(d))}
        className='space-y-8'
      >
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='email_scouting'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>Scouting emails</FormLabel>
                  <FormDescription>
                    Receive emails about scouting reports and updates
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email_reports'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>Reports emails</FormLabel>
                  <FormDescription>
                    Receive emails about reports and analytics
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email_schedule'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>Schedule emails</FormLabel>
                  <FormDescription>
                    Receive emails about schedule changes and game reminders
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email_security'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>Security emails</FormLabel>
                  <FormDescription>
                    Receive emails about login activity and security alerts
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-wrap gap-3'>
          <Button type='submit' disabled={updateMutation.isPending}>
            {updateMutation.isPending && (
              <Loader2 className='me-2 size-4 animate-spin' />
            )}
            Update notifications
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => testEmailMutation.mutate()}
            disabled={testEmailMutation.isPending}
          >
            {testEmailMutation.isPending ? (
              <Loader2 className='me-2 size-4 animate-spin' />
            ) : (
              <Mail className='me-2 size-4' />
            )}
            Send test email
          </Button>
        </div>
      </form>
    </Form>
  )
}
