import { Link, useMatchRoute } from '@tanstack/react-router'
import { LayoutDashboard, Users, Trophy, FileSearch } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/players', icon: Users, label: 'Players' },
  { to: '/games', icon: Trophy, label: 'Games' },
  { to: '/scouting', icon: FileSearch, label: 'Scouting' },
] as const

export function MobileBottomNav() {
  const matchRoute = useMatchRoute()

  return (
    <nav className='fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg md:hidden'>
      <div className='flex h-16 items-center justify-around px-2'>
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = matchRoute({ to, fuzzy: true })
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs transition-colors',
                isActive ? 'font-medium text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className='size-5' />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
