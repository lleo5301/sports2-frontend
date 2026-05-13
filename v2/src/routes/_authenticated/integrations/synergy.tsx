import { createFileRoute } from '@tanstack/react-router'
import { SynergyIntegrationPage } from '@/features/integrations/synergy'

export const Route = createFileRoute('/_authenticated/integrations/synergy')({
  component: SynergyIntegrationPage,
})
