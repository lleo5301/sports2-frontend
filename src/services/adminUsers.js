import api from './api'

/**
 * Admin User Management Service
 * Provides methods for super_admin users to manage team members
 */
export const adminUsersService = {
  /**
   * List all users in the team with pagination, search, and filters
   * @param {Object} params - Query parameters
   * @param {string} [params.search] - Search by name or email
   * @param {string} [params.role] - Filter by role
   * @param {boolean} [params.is_active] - Filter by active status
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=20] - Items per page
   * @returns {Promise<Object>} Paginated user list
   */
  getUsers: async (params = {}) => {
    const response = await api.get('/auth/admin/users', { params })
    return response.data
  },

  /**
   * Get a single user's details
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User details
   */
  getUser: async (userId) => {
    const response = await api.get(`/auth/admin/users/${userId}`)
    return response.data
  },

  /**
   * Create a new user in the team
   * @param {Object} userData - User data
   * @param {string} userData.email - User email (required)
   * @param {string} userData.password - User password (required)
   * @param {string} userData.first_name - First name (required)
   * @param {string} userData.last_name - Last name (required)
   * @param {string} userData.role - User role (required)
   * @param {string} [userData.phone] - Phone number
   * @returns {Promise<Object>} Created user
   */
  createUser: async (userData) => {
    const response = await api.post('/auth/admin/users', userData)
    return response.data
  },

  /**
   * Update a user's information
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user
   */
  updateUser: async (userId, userData) => {
    const response = await api.put(`/auth/admin/users/${userId}`, userData)
    return response.data
  },

  /**
   * Delete a user from the team
   * @param {string} userId - User ID (cannot delete self)
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteUser: async (userId) => {
    const response = await api.delete(`/auth/admin/users/${userId}`)
    return response.data
  },

  /**
   * Reset a user's password
   * @param {string} userId - User ID
   * @param {string} [newPassword] - Optional custom password, auto-generates if not provided
   * @returns {Promise<Object>} Contains temporary password if auto-generated
   */
  resetPassword: async (userId, newPassword = null) => {
    const response = await api.put(`/auth/admin/users/${userId}/reset-password`, {
      new_password: newPassword
    })
    return response.data
  }
}

/**
 * Available user roles (must match database ENUM)
 */
export const USER_ROLES = [
  { value: 'super_admin', label: 'Super Admin', description: 'Full access to all features and user management' },
  { value: 'head_coach', label: 'Head Coach', description: 'Full access to team features, can manage branding' },
  { value: 'assistant_coach', label: 'Assistant Coach', description: 'Can manage players, schedules, and reports' }
]

export default adminUsersService
