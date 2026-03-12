import { createFileRoute } from '@tanstack/react-router'
import { AiCoachSettings } from '@/features/ai-coach/settings-page'

export const Route = createFileRoute('/_authenticated/ai-coach/settings')({
  component: AiCoachSettings,
})
