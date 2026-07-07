import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import { adminUsersApi } from '@/lib/admin-users-api'
import { Card, CardContent } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const { user } = useAuth()
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const isSuperAdmin = user?.role === 'super_admin'

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminUsersApi.list({ limit: 100 }),
    enabled: isSuperAdmin,
  })

  if (!isSuperAdmin) {
    return (
      <Main>
        <Card>
          <CardContent className='py-12 text-center text-muted-foreground'>
            You need super admin access to manage users.
          </CardContent>
        </Card>
      </Main>
    )
  }

  const users = data?.users ?? []

  return (
    <UsersProvider>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              User Management
            </h2>
            <p className='text-muted-foreground'>
              Manage team members and their roles.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex justify-center py-16'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <UsersTable data={users} search={search} navigate={navigate} />
        )}
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
