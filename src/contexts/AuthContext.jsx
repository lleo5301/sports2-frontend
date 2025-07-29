import { createContext, useContext, useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfile } from '../services/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Token exists, try to get user profile
      getProfile()
        .then(userData => {
          setUser(userData)
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem('token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    localStorage.setItem('token', token)
    queryClient.clear() // Clear any cached data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    queryClient.clear() // Clear all cached data
    toast.success('Logged out successfully')
  }

  const updateUser = (userData) => {
    setUser(userData)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isHeadCoach: user?.role === 'head_coach'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 