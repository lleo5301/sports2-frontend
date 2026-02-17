import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plug, RefreshCw } from 'lucide-react'
import { integrationsApi } from '@/lib/integrations-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export function IntegrationsPage() {
  const queryClient = useQueryClient()

  const { data: status, isLoading } = useQuery({
    queryKey: ['integrations', 'presto', 'status'],
    queryFn: () => integrationsApi.getPrestoStatus(),
  })

  const syncMutation = useMutation({
    mutationFn: (type: 'roster' | 'schedule' | 'stats' | 'all') => {
      switch (type) {
        case 'roster':
          return integrationsApi.syncRoster()
        case 'schedule':
          return integrationsApi.syncSchedule()
        case 'stats':
          return integrationsApi.syncStats()
        case 'all':
          return integrationsApi.syncAll()
      }
    },
    onSuccess: (_, type) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
      toast.success(`Sync ${type === 'all' ? 'complete' : type} initiated`)
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Sync failed')
    },
  })

  const connected = status?.connected ?? status?.configured ?? false

  return (
    <Main>
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Integrations</h2>
          <p className='text-muted-foreground'>
            Connect to external data providers
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='flex size-12 items-center justify-center rounded-lg bg-muted'>
                  <Plug className='size-6 text-muted-foreground' />
                </div>
                <div>
                  <CardTitle>PrestoSports</CardTitle>
                  <CardDescription>
                    Sync roster, schedule, and stats from PrestoSports
                  </CardDescription>
                </div>
              </div>
              {!isLoading && (
                <Badge variant={connected ? 'default' : 'secondary'}>
                  {connected ? 'Connected' : 'Not configured'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            {isLoading ? (
              <div className='flex items-center gap-2 py-4 text-muted-foreground'>
                <Loader2 className='size-4 animate-spin' />
                Loading status...
              </div>
            ) : (
              <>
                {status?.last_sync && (
                  <p className='text-sm text-muted-foreground'>
                    Last sync: {String(status.last_sync)}
                  </p>
                )}
                <div className='flex flex-wrap gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => syncMutation.mutate('roster')}
                    disabled={!connected || syncMutation.isPending}
                  >
                    {syncMutation.isPending ? (
                      <Loader2 className='size-4 animate-spin' />
                    ) : (
                      <RefreshCw className='size-4' />
                    )}
                    Sync Roster
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => syncMutation.mutate('schedule')}
                    disabled={!connected || syncMutation.isPending}
                  >
                    Sync Schedule
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => syncMutation.mutate('stats')}
                    disabled={!connected || syncMutation.isPending}
                  >
                    Sync Stats
                  </Button>
                  <Button
                    size='sm'
                    onClick={() => syncMutation.mutate('all')}
                    disabled={!connected || syncMutation.isPending}
                  >
                    Full Sync
                  </Button>
                </div>
                {!connected && (
                  <p className='text-sm text-muted-foreground'>
                    Configure PrestoSports credentials in team settings to enable sync.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
