import api from './api'

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData)
  return response.data
}

export const getProfile = async () => {
  const response = await api.get('/auth/me')
  return response.data.data
}

export const updateProfile = async (profileData) => {
  const response = await api.put('/auth/me', profileData)
  return response.data.data
}

export const changePassword = async (passwordData) => {
  const response = await api.put('/auth/change-password', passwordData)
  return response.data
}

export const logout = async () => {
  try {
    // Call backend logout endpoint to blacklist the token
    await api.post('/auth/logout')
  } catch (error) {
    // Even if the backend call fails, we still clear local storage
    // This ensures the user can always logout from the frontend
  } finally {
    // Clear the token from local storage
    localStorage.removeItem('token')
  }
} 