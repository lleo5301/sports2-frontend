import { useQuery } from '@tanstack/react-query'
import { permissionsApi } from '@/lib/permissions-api'

export function usePermissions() {
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['auth', 'permissions'],
    queryFn: () => permissionsApi.get(),
  })

  const has = (permission: string | RegExp) => {
    if (typeof permission === 'string')
      return permissions.includes(permission)
    return permissions.some((p) => permission.test(p))
  }

  const hasAny = (...perms: string[]) => perms.some(has)

  return { permissions, isLoading, has, hasAny }
}
