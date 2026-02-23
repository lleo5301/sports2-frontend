import { createFileRoute } from '@tanstack/react-router'
import { AiCoachInsights } from '@/features/ai-coach/insights-page'

export const Route = createFileRoute('/_authenticated/ai-coach/insights')({
  component: AiCoachInsights,
})
