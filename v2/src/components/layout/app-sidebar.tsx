import { useQuery } from '@tanstack/react-query'
import { useLayout } from '@/context/layout-provider'
import { useAuth } from '@/contexts/AuthContext'
import { useBranding } from '@/contexts/BrandingContext'
import { usePermissions } from '@/hooks/use-permissions'
import { teamsApi } from '@/lib/teams-api'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { user } = useAuth()
  const { name: brandName, logoUrl: brandLogoUrl } = useBranding()
  const { has } = usePermissions()

  const { data: teamData } = useQuery({
    queryKey: ['teams', 'me'],
    queryFn: () => teamsApi.getMyTeam() as Promise<Record<string, unknown>>,
  })

  const filterByPermission = (items: { permission?: string }[]) =>
    items.filter((item) => !item.permission || has(item.permission))

  const navGroups: typeof sidebarData.navGroups = sidebarData.navGroups.map((group) => ({
    ...group,
    items: group.items
      .map((item) => {
        if ('items' in item && Array.isArray(item.items)) {
          const filtered = filterByPermission(item.items)
          if (filtered.length === 0) return null
          return { ...item, items: filtered } as (typeof group.items)[number]
        }
        if ('permission' in item && item.permission && !has(item.permission)) return null
        return item
      })
      .filter(Boolean) as (typeof group.items)[number][],
  }))

  // Priority: team name → program name → branding name → fallback
  const teamName =
    (teamData?.name as string) ||
    (teamData?.program_name as string) ||
    brandName ||
    sidebarData.teams[0].name

  // Use program_name as the subtitle if we have a team name, otherwise fallback
  const teamPlan =
    (teamData?.name && teamData?.program_name)
      ? String(teamData.program_name)
      : sidebarData.teams[0].plan

  const teams = [
    {
      ...sidebarData.teams[0],
      name: teamName,
      plan: teamPlan,
      logoUrl: brandLogoUrl || undefined,
    },
  ]

  const displayUser = user
    ? {
        name: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email,
        email: user.email,
        avatar: user.avatar || '',
      }
    : sidebarData.user

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((props) => (
          <NavGroup key={props.title} title={props.title} items={props.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={displayUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
