import { Main } from '@/components/layout/main'
import { AiCoachTabs } from './components/ai-coach-tabs'
import { InsightsPanel } from './components/insights-panel'

export function AiCoachInsights() {
  return (
    <Main>
      <div className='mb-6'>
        <AiCoachTabs />
      </div>
      <InsightsPanel />
    </Main>
  )
}
