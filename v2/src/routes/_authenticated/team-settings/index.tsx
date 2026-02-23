import { createFileRoute } from '@tanstack/react-router'
import { TeamSettingsPage } from '@/features/team-settings'

export const Route = createFileRoute('/_authenticated/team-settings/')({
  component: TeamSettingsPage,
})
