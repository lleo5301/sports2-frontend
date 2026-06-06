import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useSynergyStore } from '@/stores/synergy-store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Main } from '@/components/layout/main'
import { PitchAnalytics } from './components/pitch-analytics'
import { SyncControlPanel } from './components/sync-control-panel'
import { SyncHistoryTable } from './components/sync-history-table'
import { SynergyConfigForm } from './components/synergy-config-form'
import { SynergyStatusCard } from './components/synergy-status-card'

export function SynergyIntegrationPage() {
  const { status, loading, fetchStatus, fetchHistory } = useSynergyStore()
  const user = useAuthStore((s) => s.auth.user)

  useEffect(() => {
    fetchStatus()
    fetchHistory(1)
  }, [fetchStatus, fetchHistory])

  const allowedRoles = ['head_coach', 'super_admin']
  const hasAccess = user?.role?.some((r) => allowedRoles.includes(r)) ?? false

  if (user && !hasAccess) {
    return (
      <Main>
        <div className='mx-auto max-w-5xl space-y-6 p-6'>
          <div>
            <h2 className='font-display text-2xl font-extrabold tracking-tight'>
              Synergy Sports Integration
            </h2>
            <p className='text-sm text-muted-foreground'>
              You do not have permission to manage integrations. Contact your
              head coach or administrator.
            </p>
          </div>
        </div>
      </Main>
    )
  }

  const isConnected = status?.configured && status?.isActive

  return (
    <Main>
      <div className='mx-auto max-w-5xl space-y-6 p-6'>
        <div>
          <h2 className='font-display text-2xl font-extrabold tracking-tight'>
            Synergy Sports
          </h2>
          <p className='text-sm text-muted-foreground'>
            Pitch-by-pitch data, repertoire analysis, and strike zone charts.
          </p>
        </div>

        {loading.status ? (
          <div className='flex justify-center py-16'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : isConnected ? (
          <Tabs defaultValue='analytics'>
            <TabsList>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='settings'>Settings</TabsTrigger>
            </TabsList>

            <TabsContent value='analytics' className='mt-6'>
              <PitchAnalytics />
            </TabsContent>

            <TabsContent value='settings' className='mt-6 space-y-6'>
              <SynergyStatusCard />
              <SyncControlPanel />
              <SyncHistoryTable />
            </TabsContent>
          </Tabs>
        ) : (
          <SynergyConfigForm />
        )}
      </div>
    </Main>
  )
}
