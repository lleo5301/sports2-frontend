/**
 * @fileoverview Authentication service module providing user authentication,
 * registration, profile management, and password change functionality.
 *
 * This service handles all user authentication-related API calls including:
 * - User login with email/password credentials
 * - New user registration
 * - Fetching authenticated user profile data
 * - Updating user profile information
 * - Changing user passwords
 *
 * All functions are async and return promises that resolve to the API response data.
 * Authentication tokens are managed automatically by the api module's interceptors.
 *
 * @module services/auth
 * @requires ./api
 */

import api from './api';

/**
 * Authenticates a user with email and password credentials
 *
 * @async
 * @function login
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Response containing authentication token and user data
 * @returns {string} return.token - JWT authentication token to be stored in localStorage
 * @returns {Object} return.user - Authenticated user object
 * @returns {string} return.user.id - User's unique identifier
 * @returns {string} return.user.email - User's email address
 * @returns {string} return.user.name - User's full name
 * @returns {string} return.user.role - User's role (e.g., 'admin', 'coach', 'player')
 *
 * @throws {Error} Throws error if credentials are invalid or server error occurs
 *
 * @example
 * const result = await login({
 *   email: 'coach@example.com',
 *   password: 'securePassword123'
 * });
 * localStorage.setItem('token', result.token);
 * console.log('Logged in as:', result.user.name);
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  // Backend now returns: { success: true, data: { user profile } }
  // JWT token is set as httpOnly cookie, not in response body
  return response.data.data;
};

/**
 * Registers a new user account
 *
 * @async
 * @function register
 * @param {Object} userData - New user registration data
 * @param {string} userData.email - User's email address (must be unique)
 * @param {string} userData.password - User's password (minimum 6 characters)
 * @param {string} userData.name - User's full name
 * @param {string} [userData.role] - Optional role assignment (defaults to 'player')
 * @param {string} [userData.phone] - Optional phone number
 * @returns {Promise<Object>} Response containing authentication token and created user data
 * @returns {string} return.token - JWT authentication token for the new user
 * @returns {Object} return.user - Newly created user object
 * @returns {string} return.user.id - User's unique identifier
 * @returns {string} return.user.email - User's email address
 * @returns {string} return.user.name - User's full name
 * @returns {string} return.user.role - User's assigned role
 *
 * @throws {Error} Throws error if email already exists or validation fails
 *
 * @example
 * const result = await register({
 *   email: 'newplayer@example.com',
 *   password: 'myPassword123',
 *   name: 'John Doe',
 *   role: 'player'
 * });
 * localStorage.setItem('token', result.token);
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  // Backend now returns: { success: true, data: { user profile } }
  // JWT token is set as httpOnly cookie, not in response body
  return response.data.data;
};

/**
 * Fetches the currently authenticated user's profile information
 *
 * @async
 * @function getProfile
 * @returns {Promise<Object>} The authenticated user's profile data
 * @returns {string} return.id - User's unique identifier
 * @returns {string} return.email - User's email address
 * @returns {string} return.name - User's full name
 * @returns {string} return.role - User's role (e.g., 'admin', 'coach', 'player')
 * @returns {string} [return.phone] - User's phone number (if provided)
 * @returns {string} [return.avatar] - URL to user's avatar image (if uploaded)
 * @returns {string} return.createdAt - ISO timestamp of account creation
 * @returns {string} return.updatedAt - ISO timestamp of last profile update
 *
 * @throws {Error} Throws 401 error if user is not authenticated
 *
 * @example
 * const profile = await getProfile();
 * console.log('User role:', profile.role);
 * console.log('Member since:', new Date(profile.createdAt).toLocaleDateString());
 */
export const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};

/**
 * Updates the authenticated user's profile information
 *
 * @async
 * @function updateProfile
 * @param {Object} profileData - Profile fields to update (only include fields you want to change)
 * @param {string} [profileData.name] - Updated full name
 * @param {string} [profileData.email] - Updated email address (must be unique)
 * @param {string} [profileData.phone] - Updated phone number
 * @param {string} [profileData.avatar] - Updated avatar URL or base64 image data
 * @returns {Promise<Object>} The updated user profile data
 * @returns {string} return.id - User's unique identifier
 * @returns {string} return.email - Updated email address
 * @returns {string} return.name - Updated full name
 * @returns {string} return.role - User's role (unchanged by this endpoint)
 * @returns {string} [return.phone] - Updated phone number
 * @returns {string} [return.avatar] - Updated avatar URL
 * @returns {string} return.updatedAt - ISO timestamp of this update
 *
 * @throws {Error} Throws error if validation fails or email is already taken
 *
 * @example
 * const updatedProfile = await updateProfile({
 *   name: 'John Smith',
 *   phone: '+1-555-0123'
 * });
 * console.log('Profile updated:', updatedProfile.name);
 */
export const updateProfile = async (profileData) => {
  const response = await api.put('/auth/me', profileData);
  return response.data.data;
};

/**
 * Changes the authenticated user's password
 *
 * @async
 * @function changePassword
 * @param {Object} passwordData - Current and new password data
 * @param {string} passwordData.currentPassword - User's current password for verification
 * @param {string} passwordData.newPassword - New password to set (minimum 6 characters)
 * @param {string} [passwordData.confirmPassword] - Confirmation of new password (if required by backend)
 * @returns {Promise<Object>} Success confirmation message
 * @returns {string} return.message - Success message confirming password change
 *
 * @throws {Error} Throws error if current password is incorrect or new password is invalid
 *
 * @example
 * const result = await changePassword({
 *   currentPassword: 'oldPassword123',
 *   newPassword: 'newSecurePassword456'
 * });
 * console.log(result.message); // "Password changed successfully"
 */
export const changePassword = async (passwordData) => {
  const response = await api.put('/auth/change-password', passwordData);
  return response.data;
};

/**
 * Logs out the current user by revoking the session on the backend and clearing local storage
 *
 * @async
 * @function logout
 * @returns {Promise<void>} Resolves when logout is complete
 *
 * @description This function performs a two-step logout process:
 * 1. Calls the backend logout endpoint to blacklist the current JWT token
 * 2. Clears the token from localStorage regardless of backend call success
 *
 * The function is designed to always succeed from the user's perspective - even if the
 * backend call fails (network error, server down), the local token is still cleared,
 * allowing the user to logout from the frontend.
 *
 * @example
 * await logout();
 * // User is now logged out and redirected to login page
 */
export const logout = async () => {
  try {
    // Call backend logout endpoint to blacklist the token
    await api.post('/auth/logout');
  } catch (error) {
    // Even if the backend call fails, we still clear local storage
    // This ensures the user can always logout from the frontend
  } finally {
    // Clear the token from local storage
    localStorage.removeItem('token');
  }
};

export const revokeAllSessions = async (keepCurrent = false) => {
  const response = await api.post('/auth/revoke-all-sessions', { keepCurrent });
  return response.data;
};
