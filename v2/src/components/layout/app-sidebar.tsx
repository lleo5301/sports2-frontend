import { useLayout } from '@/context/layout-provider'
import { useAuth } from '@/contexts/AuthContext'
import { useBranding } from '@/contexts/BrandingContext'
import { usePermissions } from '@/hooks/use-permissions'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
// import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { user } = useAuth()
  const { name: brandName } = useBranding()
  const { has } = usePermissions()

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

  const teams = [
    {
      ...sidebarData.teams[0],
      name: brandName || sidebarData.teams[0].name,
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

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
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
