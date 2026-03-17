import { Link, useLocation } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AiCoachTabs() {
  const { pathname } = useLocation()

  return (
    <Tabs value={pathname} className='w-full'>
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
  )
}
