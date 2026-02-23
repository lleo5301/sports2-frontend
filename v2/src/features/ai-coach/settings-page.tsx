import { Link, useLocation } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Main } from '@/components/layout/main'
import { ApiKeySettings } from './components/api-key-settings'
import { UsageSummary } from './components/usage-summary'

export function AiCoachSettings() {
  const { pathname } = useLocation()

  return (
    <Main>
      <Tabs value={pathname} className='mb-6 w-full'>
        <TabsList>
          <TabsTrigger value='/ai-coach' asChild>
            <Link to='/ai-coach'>Chat</Link>
          </TabsTrigger>
          <TabsTrigger value='/ai-coach/insights' asChild>
            <Link to='/ai-coach/insights'>Insights</Link>
          </TabsTrigger>
          <TabsTrigger value='/ai-coach/settings' asChild>
            <Link to='/ai-coach/settings'>Settings</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-bold'>AI Coach Settings</h1>
          <p className='text-sm text-muted-foreground'>
            Manage your API key and view usage statistics.
          </p>
        </div>
        <ApiKeySettings />
        <UsageSummary />
      </div>
    </Main>
  )
}
