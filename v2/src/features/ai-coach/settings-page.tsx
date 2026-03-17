import { Main } from '@/components/layout/main'
import { AiCoachTabs } from './components/ai-coach-tabs'
import { ApiKeySettings } from './components/api-key-settings'
import { UsageSummary } from './components/usage-summary'

export function AiCoachSettings() {
  return (
    <Main>
      <div className='mb-6'>
        <AiCoachTabs />
      </div>
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
