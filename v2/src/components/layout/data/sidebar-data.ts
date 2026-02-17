import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileSearch,
  ClipboardList,
  Calendar,
  Trophy,
  BarChart3,
  Contact,
  Settings,
  Plug,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'User',
    email: 'user@example.com',
    avatar: '',
  },
  teams: [
    {
      name: 'Sports2',
      logo: LayoutDashboard,
      plan: 'Team Management',
    },
  ],
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Overview',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Roster',
          icon: Users,
          items: [
            { title: 'Players', url: '/players', icon: Users },
            { title: 'Create Player', url: '/players/create', icon: UserPlus },
          ],
        },
        {
          title: 'Recruiting',
          icon: UserPlus,
          items: [
            { title: 'Prospects', url: '/prospects', icon: Users },
            { title: 'Recruiting Board', url: '/recruiting', icon: ClipboardList },
            { title: 'Preference Lists', url: '/preference-lists', icon: ClipboardList },
          ],
        },
        {
          title: 'Scouting',
          icon: FileSearch,
          items: [
            { title: 'Reports', url: '/scouting', icon: FileSearch },
            { title: 'Create Report', url: '/scouting/create', icon: FileSearch },
          ],
        },
        {
          title: 'Operations',
          icon: Calendar,
          items: [
            { title: 'Schedules', url: '/schedules', icon: Calendar, permission: 'schedule_view' },
            { title: 'Games', url: '/games', icon: Trophy },
            { title: 'Depth Charts', url: '/depth-charts', icon: ClipboardList, permission: 'depth_chart_view' },
          ],
        },
        {
          title: 'Reports',
          icon: BarChart3,
          items: [
            { title: 'Reports', url: '/reports', icon: BarChart3, permission: 'reports_view' },
            { title: 'Analytics', url: '/reports/analytics', icon: BarChart3, permission: 'reports_view' },
          ],
        },
        {
          title: 'Contacts',
          icon: Contact,
          items: [
            { title: 'Coaches', url: '/coaches', icon: Contact },
            { title: 'Scouts', url: '/scouts', icon: Contact },
            { title: 'Vendors', url: '/vendors', icon: Contact },
            { title: 'High School Coaches', url: '/high-school-coaches', icon: Contact },
          ],
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            { title: 'Team Settings', url: '/team-settings', icon: Settings },
            { title: 'User Settings', url: '/settings', icon: Settings },
          ],
        },
        {
          title: 'Integrations',
          url: '/integrations',
          icon: Plug,
        },
      ],
    },
  ],
}
