import { Loader2 } from 'lucide-react'
import { useSynergyStore } from '@/stores/synergy-store'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SynergyStatusCard() {
  const { status, loading, disconnect } = useSynergyStore()

  if (!status?.configured) return null

  const lastRefreshedFormatted = status.lastRefreshed
    ? new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(status.lastRefreshed))
    : 'Never'

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle>Synergy Sports</CardTitle>
        <Badge
          variant='outline'
          className='border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300'
        >
          Connected
        </Badge>
      </CardHeader>
      <CardContent className='space-y-3'>
        <dl className='grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm'>
          <dt className='font-medium text-muted-foreground'>Team ID</dt>
          <dd className='font-mono'>{status.synergyTeamId ?? 'Not set'}</dd>
          <dt className='font-medium text-muted-foreground'>Last refreshed</dt>
          <dd>{lastRefreshedFormatted}</dd>
        </dl>

        <div className='flex justify-end pt-2'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='outline' size='sm' disabled={loading.disconnect}>
                {loading.disconnect && (
                  <Loader2 className='mr-2 size-4 animate-spin' />
                )}
                Disconnect
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Disconnect Synergy integration?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will deactivate the integration. Existing synced data
                  will not be deleted. You can reconnect at any time by
                  re-entering your credentials.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => disconnect()}>
                  Disconnect
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
