import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2, Plug, RefreshCw, Unplug } from 'lucide-react'
import { formatDateTime } from '@/lib/format-date'
import { integrationsApi } from '@/lib/integrations-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

function isBaseballTeam(
  team: {
    sportId?: string
    season?: {
      seasonName?: string
      sportName?: string
      sport?: { sportName?: string }
    }
  }
) {
  const sport = (
    team.season?.sport?.sportName ??
    team.season?.sportName ??
    ''
  ).toLowerCase()
  const id = (team.sportId ?? '').toLowerCase()
  const seasonName = (team.season?.seasonName ?? '').toLowerCase()
  return (
    sport.includes('baseball') ||
    id.includes('bsb') ||
    seasonName.includes('baseball')
  )
}

export function IntegrationsPage() {
  const queryClient = useQueryClient()
  const [disconnectOpen, setDisconnectOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [selectedSeasonId, setSelectedSeasonId] = useState('')

  const { data: status, isLoading } = useQuery({
    queryKey: ['integrations', 'presto', 'status'],
    queryFn: () => integrationsApi.getPrestoStatus(),
  })

  const connected = status?.isConfigured ?? status?.configured ?? status?.connected ?? false

  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ['integrations', 'presto', 'teams'],
    queryFn: () => integrationsApi.getPrestoTeams(),
    enabled: connected,
  })
  const prestoTeamId = status?.prestoTeamId
  const prestoSeasonId = status?.prestoSeasonId
  const tokenExpired = status?.tokenStatus === 'expired'
  const lastSync = status?.lastSyncAt ?? status?.last_sync

  useEffect(() => {
    if (prestoSeasonId) setSelectedSeasonId(String(prestoSeasonId))
    if (prestoTeamId) setSelectedTeamId(String(prestoTeamId))
  }, [prestoSeasonId, prestoTeamId])

  const baseballTeams = (teams ?? []).filter((t) => isBaseballTeam(t))

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

  const testMutation = useMutation({
    mutationFn: (creds?: { username: string; password: string }) =>
      integrationsApi.testPrestoConnection(
        creds ?? (username && password ? { username, password } : undefined)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
      toast.success('Connection test successful')
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Connection test failed')
    },
  })

  const configureMutation = useMutation({
    mutationFn: () =>
      integrationsApi.configurePresto({
        username,
        password,
        prestoTeamId: selectedTeamId || null,
        prestoSeasonId: selectedSeasonId || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
      setPassword('')
      toast.success('PrestoSports connected')
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Configuration failed')
    },
  })

  const updateSettingsMutation = useMutation({
    mutationFn: () =>
      integrationsApi.updatePrestoSettings({
        prestoTeamId: selectedTeamId,
        prestoSeasonId: selectedSeasonId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
      toast.success('Settings updated')
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to update settings')
    },
  })

  const disconnectMutation = useMutation({
    mutationFn: () => integrationsApi.disconnectPresto(),
    onSuccess: () => {
      setDisconnectOpen(false)
      setUsername('')
      setPassword('')
      setSelectedTeamId('')
      setSelectedSeasonId('')
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
      toast.success('PrestoSports disconnected')
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Disconnect failed')
    },
  })

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
                <Badge
                  variant={
                    tokenExpired ? 'destructive' : connected ? 'default' : 'secondary'
                  }
                >
                  {tokenExpired
                    ? 'Token expired'
                    : connected
                      ? 'Connected'
                      : 'Not configured'}
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
                {lastSync && (
                  <p className='text-sm text-muted-foreground'>
                    Last sync: {formatDateTime(lastSync)}
                  </p>
                )}
                {connected && (
                  <div className='flex flex-wrap gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => testMutation.mutate(undefined)}
                      disabled={testMutation.isPending}
                    >
                      {testMutation.isPending ? (
                        <Loader2 className='size-4 animate-spin' />
                      ) : (
                        'Test connection'
                      )}
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setDisconnectOpen(true)}
                      disabled={disconnectMutation.isPending}
                      className='text-destructive hover:text-destructive'
                    >
                      <Unplug className='size-4' />
                      Disconnect
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {tokenExpired && (
          <Card className='border-destructive/50'>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <AlertCircle className='size-5 text-destructive' />
                <CardTitle className='text-destructive'>Authentication required</CardTitle>
              </div>
              <CardDescription>
                Your PrestoSports token has expired. Disconnect and reconnect with
                your credentials to continue syncing.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {!connected && !isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>Connect to PrestoSports</CardTitle>
              <CardDescription>
                Enter your PrestoSports credentials to sync schedules, rosters,
                and game statistics.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='presto-username'>Username</Label>
                  <Input
                    id='presto-username'
                    type='text'
                    placeholder='PrestoSports username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='presto-password'>Password</Label>
                  <div className='relative'>
                    <Input
                      id='presto-password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='pr-10'
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground'
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className='size-4' />
                      ) : (
                        <Eye className='size-4' />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    testMutation.mutate({ username, password })
                  }
                  disabled={
                    testMutation.isPending || !username || !password
                  }
                >
                  {testMutation.isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : (
                    'Test connection'
                  )}
                </Button>
                <Button
                  size='sm'
                  onClick={() => configureMutation.mutate()}
                  disabled={
                    configureMutation.isPending || !username || !password
                  }
                >
                  {configureMutation.isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : (
                    <CheckCircle className='size-4' />
                  )}
                  Connect
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {connected && (
          <Card>
            <CardHeader>
              <CardTitle>Sync settings</CardTitle>
              <CardDescription>
                Select the team and season to sync data from.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label>Team & season</Label>
                <p className='text-xs text-muted-foreground'>
                  Select the baseball team and season to sync.
                </p>
                <Select
                  value={selectedTeamId}
                  onValueChange={(val) => {
                    setSelectedTeamId(val)
                    const team = baseballTeams.find(
                      (t) => String(t.teamId ?? t.id) === val
                    )
                    if (team?.seasonId) setSelectedSeasonId(String(team.seasonId))
                  }}
                  disabled={teamsLoading}
                >
                  <SelectTrigger className='w-full max-w-md'>
                    <SelectValue placeholder='Select team & season...' />
                  </SelectTrigger>
                  <SelectContent>
                    {baseballTeams.map((team) => {
                      const id = String(team.teamId ?? team.id ?? '')
                      const name = team.teamName ?? team.name ?? ''
                      const seasonName =
                        (team.season as { seasonName?: string })?.seasonName ?? ''
                      const label = seasonName
                        ? `${name} (${seasonName})`
                        : name || id || 'Unknown'
                      return (
                        <SelectItem key={id} value={id}>
                          {label}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              {(selectedTeamId !== String(prestoTeamId ?? '') ||
                selectedSeasonId !== String(prestoSeasonId ?? '')) &&
                selectedTeamId && (
                  <Button
                    size='sm'
                    onClick={() => updateSettingsMutation.mutate()}
                    disabled={updateSettingsMutation.isPending || !selectedTeamId}
                  >
                    {updateSettingsMutation.isPending ? (
                      <Loader2 className='size-4 animate-spin' />
                    ) : (
                      <CheckCircle className='size-4' />
                    )}
                    Save settings
                  </Button>
                )}
              {(!prestoTeamId || !prestoSeasonId) && !selectedTeamId && (
                <p className='text-sm text-amber-600 dark:text-amber-500 flex items-center gap-2'>
                  <AlertCircle className='size-4 shrink-0' />
                  Select a team to enable syncing.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {connected && prestoTeamId && prestoSeasonId && (
          <Card>
            <CardHeader>
              <CardTitle>Sync data</CardTitle>
              <CardDescription>
                Sync data from PrestoSports to your local database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => syncMutation.mutate('roster')}
                  disabled={syncMutation.isPending}
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
                  disabled={syncMutation.isPending}
                >
                  Sync Schedule
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => syncMutation.mutate('stats')}
                  disabled={syncMutation.isPending}
                >
                  Sync Stats
                </Button>
                <Button
                  size='sm'
                  onClick={() => syncMutation.mutate('all')}
                  disabled={syncMutation.isPending}
                >
                  Full Sync
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <AlertDialog open={disconnectOpen} onOpenChange={setDisconnectOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Disconnect PrestoSports?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the PrestoSports integration. You can reconnect
                and configure it again later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => disconnectMutation.mutate()}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                {disconnectMutation.isPending ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  'Disconnect'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Main>
  )
}
