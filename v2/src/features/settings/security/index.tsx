import { useQuery } from '@tanstack/react-query'
import { Loader2, Monitor, Smartphone } from 'lucide-react'
import { formatDateTime } from '@/lib/format-date'
import { settingsApi } from '@/lib/settings-api'
import { ContentSection } from '../components/content-section'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function SettingsSecurity() {
  const { data: loginHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ['settings', 'login-history'],
    queryFn: () => settingsApi.getLoginHistory(),
  })

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['settings', 'sessions'],
    queryFn: () => settingsApi.getSessions(),
  })

  const isLoading = historyLoading || sessionsLoading

  return (
    <ContentSection
      title='Security'
      desc='Login history and active sessions. Change password and export data in Account.'
    >
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Login history</CardTitle>
            <CardDescription>
              Recent sign-in activity for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='flex items-center gap-2 py-6 text-muted-foreground'>
                <Loader2 className='size-4 animate-spin' />
                Loading...
              </div>
            ) : loginHistory.length === 0 ? (
              <p className='py-6 text-sm text-muted-foreground'>
                No login history available.
              </p>
            ) : (
              <div className='space-y-3'>
                {loginHistory.slice(0, 10).map((entry, i) => (
                  <div
                    key={entry.id ?? i}
                    className='flex items-center justify-between rounded-lg border p-3'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='rounded-full bg-muted p-2'>
                        <Monitor className='size-4 text-muted-foreground' />
                      </div>
                      <div>
                        <p className='text-sm font-medium'>
                          {entry.ip_address ?? 'Unknown IP'}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {formatDateTime(entry.created_at) || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active sessions</CardTitle>
            <CardDescription>
              Devices and browsers where you are currently signed in
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className='flex items-center gap-2 py-6 text-muted-foreground'>
                <Loader2 className='size-4 animate-spin' />
                Loading...
              </div>
            ) : sessions.length === 0 ? (
              <p className='py-6 text-sm text-muted-foreground'>
                No active sessions.
              </p>
            ) : (
              <div className='space-y-3'>
                {sessions.map((session, i) => (
                  <div
                    key={session.id ?? i}
                    className='flex items-center justify-between rounded-lg border p-3'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='rounded-full bg-muted p-2'>
                        <Smartphone className='size-4 text-muted-foreground' />
                      </div>
                      <div>
                        <p className='text-sm font-medium'>
                          {session.user_agent ?? session.ip_address ?? 'Unknown device'}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {session.ip_address ?? ''} • Last active:{' '}
                          {formatDateTime(session.last_active)}
                        </p>
                      </div>
                    </div>
                    <Badge variant='secondary'>Active</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ContentSection>
  )
}
