import api from './api'

/**
 * @description Authenticates a user with email and password.
 *              The JWT token is automatically set as an httpOnly cookie by the backend.
 *
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} User profile data (id, email, first_name, last_name, role, team_id, phone, team)
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  // Backend now returns: { success: true, data: { user profile } }
  // JWT token is set as httpOnly cookie, not in response body
  return response.data.data
}

/**
 * @description Registers a new user account.
 *              The JWT token is automatically set as an httpOnly cookie by the backend.
 *
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {string} userData.first_name - User's first name
 * @param {string} userData.last_name - User's last name
 * @param {string} userData.role - User's role (head_coach or assistant_coach)
 * @param {string} [userData.phone] - User's phone number
 * @returns {Promise<Object>} User profile data (id, email, first_name, last_name, role, team_id, phone)
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData)
  // Backend now returns: { success: true, data: { user profile } }
  // JWT token is set as httpOnly cookie, not in response body
  return response.data.data
}

/**
 * @description Logs out the current user by clearing authentication cookies.
 *              Clears both the JWT authentication token cookie and the CSRF token cookie.
 *
 * @returns {Promise<Object>} Logout success response
 */
export const logout = async () => {
  const response = await api.post('/auth/logout')
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