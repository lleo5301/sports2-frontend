import { createFileRoute } from '@tanstack/react-router'
import { AiCoach } from '@/features/ai-coach'

export const Route = createFileRoute('/_authenticated/ai-coach/')({
  component: AiCoach,
})
