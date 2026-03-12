import { Link, useLocation } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Main } from '@/components/layout/main'
import { InsightsPanel } from './components/insights-panel'

export function AiCoachInsights() {
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
      <InsightsPanel />
    </Main>
  )
}
