import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getProfile, logout as authLogout, type User } from '@/lib/auth'
import csrfService from '@/lib/csrf'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (userData: User) => void
  logout: () => Promise<void>
  updateUser: (userData: User) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    getProfile()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(
    (userData: User) => {
      setUser(userData)
      queryClient.clear()
    },
    [queryClient]
  )

  const logout = useCallback(async () => {
    try {
      await authLogout()
    } catch {
      // Continue with local logout
    } finally {
      setUser(null)
      queryClient.clear()
      csrfService.clearCsrfToken()
      toast.success('Logged out successfully')
    }
  }, [queryClient])

  const updateUser = useCallback((userData: User) => {
    setUser(userData)
  }, [])

  const value: AuthContextValue = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
