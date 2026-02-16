import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile } from '../services/auth';
import api from '../services/api';
import csrfService from '../services/csrf';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Check for existing session on mount
  // With httpOnly cookies, we can't check for a token directly
  // Instead, we try to get the user profile - if a valid cookie exists, it will succeed
  useEffect(() => {
    getProfile()
      .then(userData => {
        setUser(userData);
      })
      .catch(() => {
        // No valid session - user is not authenticated
        // Cookie will be cleared by backend or expired naturally
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (userData) => {
    setUser(userData);
    queryClient.clear(); // Clear any cached data
    // JWT token is now stored in httpOnly cookie by the backend
    // No need to manually store it in localStorage
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to clear httpOnly cookies
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      setUser(null);
      // Error fetching user
    } finally {
      // Clear local state regardless of API call result
      setUser(null);
      queryClient.clear(); // Clear all cached data
      csrfService.clearCsrfToken(); // Clear CSRF token cache
      toast.success('Logged out successfully');
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'super_admin',
    isHeadCoach: user?.role === 'head_coach',
    canModifyBranding: user?.role === 'super_admin' || user?.role === 'head_coach'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
