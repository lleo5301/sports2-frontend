import { Navigate, Outlet, useLocation } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { BrandingProvider } from '@/contexts/BrandingContext'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SkipToMain } from '@/components/skip-to-main'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const defaultOpen = getCookie('sidebar_state') !== 'false'

  if (loading) {
    return (
      <div className='flex h-svh items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (!user) {
    return (
      <Navigate
        to='/login'
        search={{ redirect: location.pathname + location.search }}
        replace
      />
    )
  }
  return (
    <BrandingProvider>
      <SearchProvider>
        <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <SidebarInset
            className={cn(
              // Set content container, so we can use container queries
              '@container/content',

              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              'has-data-[layout=fixed]:h-svh',

              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - spacing (total margins) to prevent overflow
              'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
            )}
          >
            {children ?? <Outlet />}
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
    </BrandingProvider>
  )
}
