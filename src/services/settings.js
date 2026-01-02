/**
 * @fileoverview User settings management service module providing comprehensive settings operations
 * including general preferences, account management, notifications, security, and privacy controls.
 *
 * This service handles all user settings-related operations including:
 * - General settings (theme, language, timezone, date/time formats)
 * - Account settings (profile information, profile picture uploads)
 * - Notification preferences (email, push, in-app notifications)
 * - Security settings (password changes, two-factor authentication, session management)
 * - Privacy settings (profile visibility, data sharing preferences)
 *
 * The module exports two main objects:
 * - settingsService: API methods for all settings-related operations (21 methods)
 * - defaultSettings: Default settings structure with nested configuration objects
 *
 * Two-Factor Authentication (2FA) Flow:
 * 1. Call getTwoFactorQR() to get QR code and secret for authenticator app setup
 * 2. User scans QR code in authenticator app (e.g., Google Authenticator, Authy)
 * 3. Call verifyTwoFactor(code) with a code from the authenticator to verify setup
 * 4. Call toggleTwoFactor(true) to enable 2FA for the account
 * 5. To disable: Call toggleTwoFactor(false)
 *
 * Session Management:
 * - getActiveSessions() retrieves all active login sessions with device/location info
 * - revokeSession(sessionId) logs out a specific session
 * - revokeAllSessions() logs out all sessions except the current one
 *
 * File Upload Handling:
 * - uploadProfilePicture() uses FormData with 'multipart/form-data' content type
 * - Accepts image files (File object from input[type="file"])
 * - Server validates file type and size, returns updated profile picture URL
 *
 * Blob Response Handling:
 * - exportUserData() returns blob response for downloadable data export file
 * - Use file-saver library or URL.createObjectURL for download handling
 *
 * All async functions return promises that resolve to API response data.
 * Authentication is handled automatically by the api module's interceptors.
 *
 * @module services/settings
 * @requires ./api
 */

import api from './api';

/**
 * Settings management service object containing all settings-related API methods
 *
 * This service provides 21 methods organized into functional categories:
 * - General: getUserSettings, updateGeneralSettings
 * - Account: updateAccountSettings, uploadProfilePicture, deleteAccount
 * - Notifications: updateNotificationSettings, getNotificationPreferences, updateNotificationPreferences, testEmailNotification
 * - Security: updateSecuritySettings, changePassword, toggleTwoFactor, getTwoFactorQR, verifyTwoFactor, getLoginHistory
 * - Sessions: getActiveSessions, revokeSession, revokeAllSessions
 * - Privacy: getPrivacySettings, updatePrivacySettings
 * - Data Export: exportUserData
 *
 * @namespace settingsService
 */
export const settingsService = {
  /**
   * Retrieves all user settings
   *
   * @async
   * @function getUserSettings
   * @memberof settingsService
   * @returns {Promise<Object>} Response containing all user settings
   * @returns {Object} return.general - General settings (theme, language, timezone, etc.)
   * @returns {string} return.general.theme - UI theme ('light' or 'dark')
   * @returns {string} return.general.language - Language code (e.g., 'en', 'es')
   * @returns {string} return.general.timezone - Timezone identifier (e.g., 'UTC', 'America/New_York')
   * @returns {string} return.general.dateFormat - Date format preference (e.g., 'MM/DD/YYYY')
   * @returns {string} return.general.timeFormat - Time format preference ('12h' or '24h')
   * @returns {Object} return.account - Account settings (name, email, profile info)
   * @returns {Object} return.notifications - Notification preferences (email, push, in-app)
   * @returns {Object} return.security - Security settings (2FA status, session timeout)
   * @returns {Object} return.privacy - Privacy settings (profile visibility, data sharing)
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * const settings = await settingsService.getUserSettings();
   * console.log('Current theme:', settings.general.theme);
   * console.log('2FA enabled:', settings.security.twoFactorEnabled);
   */
  getUserSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  /**
   * Updates general settings (theme, language, timezone, display preferences)
   *
   * @async
   * @function updateGeneralSettings
   * @memberof settingsService
   * @param {Object} settings - General settings to update
   * @param {string} [settings.theme] - UI theme ('light' or 'dark')
   * @param {string} [settings.language] - Language code (e.g., 'en', 'es', 'fr')
   * @param {string} [settings.timezone] - Timezone identifier (e.g., 'UTC', 'America/New_York')
   * @param {string} [settings.dateFormat] - Date format (e.g., 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD')
   * @param {string} [settings.timeFormat] - Time format ('12h' or '24h')
   * @param {boolean} [settings.autoRefresh] - Enable automatic data refresh
   * @param {boolean} [settings.compactView] - Use compact view layout
   * @param {boolean} [settings.showNotifications] - Show notification indicators
   * @returns {Promise<Object>} Updated general settings object
   * @returns {string} return.theme - Updated theme setting
   * @returns {string} return.language - Updated language setting
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws error if validation fails
   *
   * @example
   * const updated = await settingsService.updateGeneralSettings({
   *   theme: 'dark',
   *   language: 'en',
   *   timezone: 'America/New_York',
   *   timeFormat: '12h'
   * });
   */
  updateGeneralSettings: async (settings) => {
    const response = await api.put('/settings/general', settings);
    return response.data;
  },

  /**
   * Updates account settings (name, email, profile information)
   *
   * @async
   * @function updateAccountSettings
   * @memberof settingsService
   * @param {Object} accountData - Account fields to update
   * @param {string} [accountData.firstName] - User's first name
   * @param {string} [accountData.lastName] - User's last name
   * @param {string} [accountData.email] - User's email address
   * @param {string} [accountData.phone] - Phone number
   * @param {string} [accountData.bio] - User biography/description
   * @param {string} [accountData.location] - User's location
   * @param {string} [accountData.website] - User's website URL
   * @returns {Promise<Object>} Updated account information
   * @returns {string} return.firstName - Updated first name
   * @returns {string} return.lastName - Updated last name
   * @returns {string} return.email - Updated email address
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws error if validation fails or email is already in use
   *
   * @example
   * const updated = await settingsService.updateAccountSettings({
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   email: 'john.doe@example.com',
   *   phone: '555-0123'
   * });
   */
  updateAccountSettings: async (accountData) => {
    const response = await api.put('/settings/account', accountData);
    return response.data;
  },

  /**
   * Updates notification settings (email, push, in-app preferences)
   *
   * @async
   * @function updateNotificationSettings
   * @memberof settingsService
   * @param {Object} notificationSettings - Notification preferences to update
   * @param {Object} [notificationSettings.email] - Email notification settings
   * @param {boolean} [notificationSettings.email.enabled] - Enable email notifications
   * @param {string} [notificationSettings.email.frequency] - Email frequency ('immediate', 'daily', 'weekly')
   * @param {Object} [notificationSettings.push] - Push notification settings
   * @param {boolean} [notificationSettings.push.enabled] - Enable push notifications
   * @param {Object} [notificationSettings.inApp] - In-app notification settings
   * @param {boolean} [notificationSettings.inApp.enabled] - Enable in-app notifications
   * @param {boolean} [notificationSettings.inApp.sound] - Enable notification sounds
   * @returns {Promise<Object>} Updated notification settings
   * @returns {Object} return.email - Updated email notification settings
   * @returns {Object} return.push - Updated push notification settings
   * @returns {Object} return.inApp - Updated in-app notification settings
   *
   * @throws {Error} Throws error if validation fails
   *
   * @example
   * const updated = await settingsService.updateNotificationSettings({
   *   email: {
   *     enabled: true,
   *     frequency: 'daily'
   *   },
   *   push: {
   *     enabled: true
   *   },
   *   inApp: {
   *     enabled: true,
   *     sound: false
   *   }
   * });
   */
  updateNotificationSettings: async (notificationSettings) => {
    const response = await api.put('/settings/notifications', notificationSettings);
    return response.data;
  },

  /**
   * Updates security settings (session timeout, password expiry, login notifications)
   *
   * @async
   * @function updateSecuritySettings
   * @memberof settingsService
   * @param {Object} securitySettings - Security preferences to update
   * @param {boolean} [securitySettings.loginNotifications] - Receive notifications for new logins
   * @param {number} [securitySettings.sessionTimeout] - Session timeout in minutes
   * @param {number} [securitySettings.passwordExpiry] - Password expiry in days (0 = never)
   * @param {boolean} [securitySettings.requirePasswordChange] - Require password change on next login
   * @returns {Promise<Object>} Updated security settings
   * @returns {boolean} return.loginNotifications - Updated login notification setting
   * @returns {number} return.sessionTimeout - Updated session timeout
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws error if validation fails
   *
   * @example
   * const updated = await settingsService.updateSecuritySettings({
   *   loginNotifications: true,
   *   sessionTimeout: 60,
   *   passwordExpiry: 90
   * });
   */
  updateSecuritySettings: async (securitySettings) => {
    const response = await api.put('/settings/security', securitySettings);
    return response.data;
  },

  /**
   * Changes user password
   *
   * @async
   * @function changePassword
   * @memberof settingsService
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password (required for verification)
   * @param {string} passwordData.newPassword - New password (must meet complexity requirements)
   * @param {string} passwordData.confirmPassword - Confirmation of new password (must match newPassword)
   * @returns {Promise<Object>} Success confirmation
   * @returns {string} return.message - Success message confirming password change
   * @returns {string} return.updatedAt - ISO timestamp of password change
   *
   * @throws {Error} Throws 401 error if current password is incorrect
   * @throws {Error} Throws error if new password doesn't meet requirements
   * @throws {Error} Throws error if newPassword and confirmPassword don't match
   *
   * @example
   * const result = await settingsService.changePassword({
   *   currentPassword: 'OldPassword123!',
   *   newPassword: 'NewPassword456!',
   *   confirmPassword: 'NewPassword456!'
   * });
   * console.log(result.message); // "Password changed successfully"
   */
  changePassword: async (passwordData) => {
    const response = await api.put('/settings/change-password', passwordData);
    return response.data;
  },

  /**
   * Enables or disables two-factor authentication (2FA)
   *
   * @async
   * @function toggleTwoFactor
   * @memberof settingsService
   * @param {boolean} enabled - Whether to enable (true) or disable (false) 2FA
   * @returns {Promise<Object>} Updated 2FA status
   * @returns {boolean} return.twoFactorEnabled - Current 2FA status after toggle
   * @returns {string} return.message - Confirmation message
   * @returns {string} return.updatedAt - ISO timestamp of this change
   *
   * @throws {Error} Throws error if user hasn't completed 2FA setup (must call getTwoFactorQR and verifyTwoFactor first)
   *
   * @description This is step 4 of the 2FA setup flow. Before enabling 2FA, you must:
   *              1. Call getTwoFactorQR() to get QR code
   *              2. User scans QR code in authenticator app
   *              3. Call verifyTwoFactor(code) to verify setup
   *              4. Call toggleTwoFactor(true) to enable
   *
   * @example
   * // Enable 2FA (after completing setup and verification)
   * const result = await settingsService.toggleTwoFactor(true);
   * console.log('2FA enabled:', result.twoFactorEnabled);
   *
   * @example
   * // Disable 2FA
   * const result = await settingsService.toggleTwoFactor(false);
   * console.log('2FA disabled:', result.twoFactorEnabled);
   */
  toggleTwoFactor: async (enabled) => {
    const response = await api.put('/settings/two-factor', { enabled });
    return response.data;
  },

  /**
   * Retrieves QR code and secret for two-factor authentication setup
   *
   * @async
   * @function getTwoFactorQR
   * @memberof settingsService
   * @returns {Promise<Object>} 2FA setup information
   * @returns {string} return.qrCode - Base64-encoded QR code image (data URL format)
   * @returns {string} return.secret - TOTP secret key (for manual entry in authenticator apps)
   * @returns {string} return.backupCodes - Array of backup codes for account recovery
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @description This is step 1 of the 2FA setup flow. The QR code contains the secret key
   *              and account information formatted for authenticator apps. The user should:
   *              1. Scan the QR code with an authenticator app (Google Authenticator, Authy, etc.)
   *              2. OR manually enter the secret in their authenticator app
   *              3. Save the backup codes in a secure location
   *              4. Verify the setup by calling verifyTwoFactor() with a code from the app
   *
   * @example
   * const setup = await settingsService.getTwoFactorQR();
   * // Display QR code image: <img src={setup.qrCode} />
   * // Show secret for manual entry: setup.secret
   * // Show backup codes: setup.backupCodes.join(', ')
   */
  getTwoFactorQR: async () => {
    const response = await api.get('/settings/two-factor/qr');
    return response.data;
  },

  /**
   * Verifies a two-factor authentication code during setup or login
   *
   * @async
   * @function verifyTwoFactor
   * @memberof settingsService
   * @param {string} code - 6-digit code from authenticator app
   * @returns {Promise<Object>} Verification result
   * @returns {boolean} return.verified - Whether the code was valid
   * @returns {string} return.message - Verification message
   *
   * @throws {Error} Throws error if code is invalid or expired
   *
   * @description This is step 3 of the 2FA setup flow. After scanning the QR code,
   *              the user generates a 6-digit code in their authenticator app and
   *              provides it for verification. This confirms the secret was properly
   *              configured. After successful verification, call toggleTwoFactor(true)
   *              to enable 2FA.
   *
   * @example
   * // User enters code from their authenticator app
   * const result = await settingsService.verifyTwoFactor('123456');
   * if (result.verified) {
   *   // Code is valid, can now enable 2FA
   *   await settingsService.toggleTwoFactor(true);
   * }
   */
  verifyTwoFactor: async (code) => {
    const response = await api.post('/settings/two-factor/verify', { code });
    return response.data;
  },

  /**
   * Retrieves login history for the current user
   *
   * @async
   * @function getLoginHistory
   * @memberof settingsService
   * @returns {Promise<Object>} Response containing login history
   * @returns {Array<Object>} return.history - Array of login event objects
   * @returns {string} return.history[].timestamp - ISO timestamp of login
   * @returns {string} return.history[].ipAddress - IP address of login
   * @returns {string} return.history[].userAgent - Browser/device user agent
   * @returns {string} return.history[].location - Approximate geographic location
   * @returns {boolean} return.history[].successful - Whether login was successful
   * @returns {string} [return.history[].failureReason] - Reason for failed login
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * const loginHistory = await settingsService.getLoginHistory();
   * loginHistory.history.forEach(login => {
   *   console.log(`Login at ${login.timestamp} from ${login.location}`);
   * });
   */
  getLoginHistory: async () => {
    const response = await api.get('/settings/login-history');
    return response.data;
  },

  /**
   * Exports all user data in a downloadable format
   *
   * @async
   * @function exportUserData
   * @memberof settingsService
   * @returns {Promise<Blob>} User data file as a blob for download (typically JSON or ZIP format)
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @description This method sends a GET request with responseType: 'blob' to receive
   *              the data export file as a binary blob. The file typically contains all
   *              user data including profile information, settings, and activity history
   *              in JSON or ZIP format. Use file-saver or URL.createObjectURL to download
   *              or display the file.
   *
   * @example
   * import { saveAs } from 'file-saver';
   *
   * const dataBlob = await settingsService.exportUserData();
   * saveAs(dataBlob, `user-data-export-${new Date().toISOString()}.json`);
   */
  exportUserData: async () => {
    const response = await api.get('/settings/export-data', {
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Deletes the user account (irreversible action)
   *
   * @async
   * @function deleteAccount
   * @memberof settingsService
   * @param {string} confirmation - Confirmation text (user must type "DELETE" or account email to confirm)
   * @returns {Promise<Object>} Deletion confirmation
   * @returns {string} return.message - Success message confirming deletion
   * @returns {string} return.deletedAt - ISO timestamp of deletion
   *
   * @throws {Error} Throws error if confirmation text doesn't match required value
   * @throws {Error} Throws error if server error occurs
   *
   * @description This is a destructive action that permanently deletes the user account
   *              and all associated data. The confirmation parameter is required to prevent
   *              accidental deletion. After successful deletion, the user will be logged out.
   *
   * @example
   * // User types "DELETE" to confirm
   * const result = await settingsService.deleteAccount('DELETE');
   * console.log(result.message); // "Account deleted successfully"
   * // User will be redirected to login page
   */
  deleteAccount: async (confirmation) => {
    const response = await api.delete('/settings/account', {
      data: { confirmation }
    });
    return response.data;
  },

  /**
   * Retrieves detailed notification preferences
   *
   * @async
   * @function getNotificationPreferences
   * @memberof settingsService
   * @returns {Promise<Object>} Detailed notification preferences
   * @returns {Object} return.email - Email notification preferences
   * @returns {boolean} return.email.enabled - Email notifications enabled
   * @returns {string} return.email.frequency - Email frequency ('immediate', 'daily', 'weekly')
   * @returns {Object} return.email.types - Notification types for email
   * @returns {boolean} return.email.types.playerUpdates - Player update notifications
   * @returns {boolean} return.email.types.teamUpdates - Team update notifications
   * @returns {boolean} return.email.types.scoutingReports - Scouting report notifications
   * @returns {boolean} return.email.types.scheduleChanges - Schedule change notifications
   * @returns {boolean} return.email.types.systemUpdates - System update notifications
   * @returns {boolean} return.email.types.marketing - Marketing email notifications
   * @returns {Object} return.push - Push notification preferences
   * @returns {Object} return.inApp - In-app notification preferences
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * const prefs = await settingsService.getNotificationPreferences();
   * console.log('Email notifications enabled:', prefs.email.enabled);
   * console.log('Email frequency:', prefs.email.frequency);
   * console.log('Player updates:', prefs.email.types.playerUpdates);
   */
  getNotificationPreferences: async () => {
    const response = await api.get('/settings/notifications/preferences');
    return response.data;
  },

  /**
   * Updates detailed notification preferences
   *
   * @async
   * @function updateNotificationPreferences
   * @memberof settingsService
   * @param {Object} preferences - Notification preferences to update
   * @param {Object} [preferences.email] - Email notification preferences
   * @param {boolean} [preferences.email.enabled] - Enable email notifications
   * @param {string} [preferences.email.frequency] - Email frequency ('immediate', 'daily', 'weekly')
   * @param {Object} [preferences.email.types] - Notification types for email
   * @param {boolean} [preferences.email.types.playerUpdates] - Player update notifications
   * @param {boolean} [preferences.email.types.teamUpdates] - Team update notifications
   * @param {boolean} [preferences.email.types.scoutingReports] - Scouting report notifications
   * @param {boolean} [preferences.email.types.scheduleChanges] - Schedule change notifications
   * @param {boolean} [preferences.email.types.systemUpdates] - System update notifications
   * @param {boolean} [preferences.email.types.marketing] - Marketing email notifications
   * @param {Object} [preferences.push] - Push notification preferences
   * @param {Object} [preferences.inApp] - In-app notification preferences
   * @returns {Promise<Object>} Updated notification preferences
   *
   * @throws {Error} Throws error if validation fails
   *
   * @example
   * const updated = await settingsService.updateNotificationPreferences({
   *   email: {
   *     enabled: true,
   *     frequency: 'daily',
   *     types: {
   *       playerUpdates: true,
   *       teamUpdates: true,
   *       scoutingReports: true,
   *       scheduleChanges: true,
   *       systemUpdates: false,
   *       marketing: false
   *     }
   *   }
   * });
   */
  updateNotificationPreferences: async (preferences) => {
    const response = await api.put('/settings/notifications/preferences', preferences);
    return response.data;
  },

  /**
   * Sends a test email notification to verify email delivery
   *
   * @async
   * @function testEmailNotification
   * @memberof settingsService
   * @returns {Promise<Object>} Test email result
   * @returns {string} return.message - Success message confirming email was sent
   * @returns {string} return.sentTo - Email address where test was sent
   * @returns {string} return.sentAt - ISO timestamp when email was sent
   *
   * @throws {Error} Throws error if email sending fails
   *
   * @description Sends a test notification email to the user's registered email address
   *              to verify that email delivery is working correctly. Useful for confirming
   *              email settings and troubleshooting delivery issues.
   *
   * @example
   * const result = await settingsService.testEmailNotification();
   * console.log(`Test email sent to ${result.sentTo}`);
   * alert(result.message); // "Test email sent successfully"
   */
  testEmailNotification: async () => {
    const response = await api.post('/settings/notifications/test-email');
    return response.data;
  },

  /**
   * Retrieves all active login sessions for the current user
   *
   * @async
   * @function getActiveSessions
   * @memberof settingsService
   * @returns {Promise<Object>} Response containing active sessions
   * @returns {Array<Object>} return.sessions - Array of active session objects
   * @returns {string} return.sessions[].id - Session unique identifier
   * @returns {string} return.sessions[].device - Device type (e.g., 'Chrome on Windows', 'Safari on iPhone')
   * @returns {string} return.sessions[].ipAddress - IP address of the session
   * @returns {string} return.sessions[].location - Approximate geographic location
   * @returns {string} return.sessions[].createdAt - ISO timestamp when session started
   * @returns {string} return.sessions[].lastActivity - ISO timestamp of last activity
   * @returns {boolean} return.sessions[].isCurrent - Whether this is the current session
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @description Retrieves information about all active login sessions including the current
   *              session and any other devices/browsers where the user is logged in. Sessions
   *              include device information, location data, and activity timestamps for
   *              security monitoring. Use revokeSession() to log out specific sessions or
   *              revokeAllSessions() to log out everywhere except the current session.
   *
   * @example
   * const sessionInfo = await settingsService.getActiveSessions();
   * sessionInfo.sessions.forEach(session => {
   *   console.log(`${session.device} from ${session.location}`);
   *   console.log(`Last active: ${session.lastActivity}`);
   *   if (!session.isCurrent) {
   *     // Can revoke this session if needed
   *   }
   * });
   */
  getActiveSessions: async () => {
    const response = await api.get('/settings/sessions');
    return response.data;
  },

  /**
   * Revokes (logs out) a specific session by ID
   *
   * @async
   * @function revokeSession
   * @memberof settingsService
   * @param {string} sessionId - The unique identifier of the session to revoke
   * @returns {Promise<Object>} Revocation confirmation
   * @returns {string} return.message - Success message confirming session revocation
   * @returns {string} return.revokedSessionId - ID of the revoked session
   * @returns {string} return.revokedAt - ISO timestamp of revocation
   *
   * @throws {Error} Throws 404 error if session not found
   * @throws {Error} Throws error if trying to revoke current session (use logout instead)
   *
   * @description Immediately terminates a specific login session by its ID. This logs out
   *              the user from that specific device/browser. The session ID can be obtained
   *              from getActiveSessions(). Cannot revoke the current session - users should
   *              use the logout function for that instead.
   *
   * @example
   * const sessions = await settingsService.getActiveSessions();
   * const suspiciousSession = sessions.sessions.find(s => s.location === 'Unknown');
   * if (suspiciousSession && !suspiciousSession.isCurrent) {
   *   const result = await settingsService.revokeSession(suspiciousSession.id);
   *   console.log(result.message); // "Session revoked successfully"
   * }
   */
  revokeSession: async (sessionId) => {
    const response = await api.delete(`/settings/sessions/${sessionId}`);
    return response.data;
  },

  /**
   * Revokes all sessions except the current one
   *
   * @async
   * @function revokeAllSessions
   * @memberof settingsService
   * @returns {Promise<Object>} Revocation confirmation
   * @returns {string} return.message - Success message confirming all sessions were revoked
   * @returns {number} return.revokedCount - Number of sessions that were revoked
   * @returns {string} return.revokedAt - ISO timestamp of revocation
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @description Immediately terminates all login sessions except the current one. This logs
   *              out the user from all other devices/browsers while keeping the current session
   *              active. Useful for security purposes when a user suspects their account may
   *              be compromised or wants to ensure they're only logged in on the current device.
   *
   * @example
   * const result = await settingsService.revokeAllSessions();
   * console.log(`Logged out from ${result.revokedCount} other devices`);
   * alert(result.message); // "All other sessions revoked successfully"
   */
  revokeAllSessions: async () => {
    const response = await api.delete('/settings/sessions');
    return response.data;
  },

  /**
   * Uploads a new profile picture
   *
   * @async
   * @function uploadProfilePicture
   * @memberof settingsService
   * @param {File} file - Image file from file input (File object)
   * @returns {Promise<Object>} Upload result with new profile picture URL
   * @returns {string} return.profilePicture - URL of the uploaded profile picture
   * @returns {string} return.message - Success message confirming upload
   * @returns {string} return.uploadedAt - ISO timestamp of upload
   *
   * @throws {Error} Throws error if file type is not supported (must be image/jpeg, image/png, image/gif)
   * @throws {Error} Throws error if file size exceeds limit (typically 5MB)
   *
   * @description Uploads a profile picture image file using multipart/form-data encoding.
   *              The file is sent in a FormData object with the key 'profile_picture'.
   *              Server validates file type (JPEG, PNG, GIF), size, and dimensions.
   *              The uploaded image is typically resized/optimized on the server.
   *              Returns the URL of the uploaded image which can be used in img src.
   *
   * File Upload Handling:
   * - Uses FormData to wrap the file for multipart upload
   * - Sets Content-Type header to 'multipart/form-data'
   * - Server processes and stores the image, returns public URL
   *
   * @example
   * // From file input: <input type="file" accept="image/*" onChange={handleFileChange} />
   * const handleFileChange = async (event) => {
   *   const file = event.target.files[0];
   *   if (file) {
   *     try {
   *       const result = await settingsService.uploadProfilePicture(file);
   *       console.log('New profile picture URL:', result.profilePicture);
   *       // Update UI with new image: <img src={result.profilePicture} />
   *     } catch (error) {
   *       console.error('Upload failed:', error.message);
   *     }
   *   }
   * };
   */
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await api.put('/settings/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Retrieves privacy settings
   *
   * @async
   * @function getPrivacySettings
   * @memberof settingsService
   * @returns {Promise<Object>} Privacy settings
   * @returns {string} return.profileVisibility - Profile visibility level ('public', 'team', 'private')
   * @returns {boolean} return.showEmail - Whether to display email on profile
   * @returns {boolean} return.showPhone - Whether to display phone on profile
   * @returns {boolean} return.allowDataSharing - Allow data sharing with third parties
   * @returns {boolean} return.allowAnalytics - Allow usage analytics tracking
   * @returns {boolean} return.allowMarketing - Allow marketing communications
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * const privacy = await settingsService.getPrivacySettings();
   * console.log('Profile visibility:', privacy.profileVisibility);
   * console.log('Email visible:', privacy.showEmail);
   */
  getPrivacySettings: async () => {
    const response = await api.get('/settings/privacy');
    return response.data;
  },

  /**
   * Updates privacy settings (profile visibility, data sharing preferences)
   *
   * @async
   * @function updatePrivacySettings
   * @memberof settingsService
   * @param {Object} privacySettings - Privacy preferences to update
   * @param {string} [privacySettings.profileVisibility] - Profile visibility level ('public', 'team', 'private')
   * @param {boolean} [privacySettings.showEmail] - Display email on public profile
   * @param {boolean} [privacySettings.showPhone] - Display phone on public profile
   * @param {boolean} [privacySettings.allowDataSharing] - Allow data sharing with third parties
   * @param {boolean} [privacySettings.allowAnalytics] - Allow usage analytics tracking
   * @param {boolean} [privacySettings.allowMarketing] - Allow marketing communications
   * @returns {Promise<Object>} Updated privacy settings
   * @returns {string} return.profileVisibility - Updated profile visibility setting
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws error if validation fails
   *
   * @example
   * const updated = await settingsService.updatePrivacySettings({
   *   profileVisibility: 'team',
   *   showEmail: false,
   *   showPhone: false,
   *   allowDataSharing: false,
   *   allowAnalytics: true,
   *   allowMarketing: false
   * });
   */
  updatePrivacySettings: async (privacySettings) => {
    const response = await api.put('/settings/privacy', privacySettings);
    return response.data;
  }
};

/**
 * Default settings structure with initial values
 *
 * This constant defines the complete default settings configuration for new users
 * or for resetting settings to defaults. It contains nested objects for different
 * settings categories with sensible default values.
 *
 * Settings Categories:
 * - general: UI preferences (theme, language, timezone, formats, display options)
 * - account: User profile information (name, email, contact info, bio)
 * - notifications: Notification preferences (email, push, in-app) with granular type controls
 * - security: Security configuration (2FA, login notifications, session/password policies)
 * - privacy: Privacy controls (visibility, data sharing, analytics preferences)
 *
 * Notification Types:
 * The notifications object includes separate configuration for three notification channels:
 * - email: Can be 'immediate', 'daily', or 'weekly' frequency
 * - push: Real-time push notifications
 * - inApp: In-app notifications with optional sound
 *
 * Each channel supports granular control over notification types:
 * - playerUpdates: Notifications about player changes/updates
 * - teamUpdates: Notifications about team changes/updates
 * - scoutingReports: Notifications about new scouting reports
 * - scheduleChanges: Notifications about schedule modifications
 * - systemUpdates: Notifications about system/app updates
 * - marketing: Marketing and promotional communications (email only)
 *
 * Security Defaults:
 * - twoFactorEnabled: false (user must explicitly enable 2FA)
 * - loginNotifications: true (notify on new logins for security)
 * - sessionTimeout: 30 minutes (auto-logout after inactivity)
 * - passwordExpiry: 90 days (require password change after 90 days)
 * - requirePasswordChange: false (user not required to change on next login)
 *
 * Privacy Defaults:
 * - profileVisibility: 'team' (profile visible to team members only)
 * - showEmail: false (email hidden from profile by default)
 * - showPhone: false (phone hidden from profile by default)
 * - allowDataSharing: false (no third-party data sharing by default)
 * - allowAnalytics: true (usage analytics enabled for product improvement)
 * - allowMarketing: false (marketing communications disabled by default)
 *
 * @constant {Object} defaultSettings
 * @property {Object} general - General UI and display preferences
 * @property {Object} account - User account and profile information
 * @property {Object} notifications - Notification preferences with channel-specific settings
 * @property {Object} security - Security settings and policies
 * @property {Object} privacy - Privacy controls and data sharing preferences
 *
 * @example
 * // Use for initializing new user settings
 * const newUserSettings = { ...defaultSettings, account: { ...defaultSettings.account, email: user.email } };
 *
 * @example
 * // Use for resetting settings to defaults
 * const resetSettings = await settingsService.updateGeneralSettings(defaultSettings.general);
 */
export const defaultSettings = {
  general: {
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    autoRefresh: false,
    compactView: false,
    showNotifications: true
  },
  account: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    profilePicture: null
  },
  notifications: {
    email: {
      enabled: true,
      frequency: 'immediate',
      types: {
        playerUpdates: true,
        teamUpdates: true,
        scoutingReports: true,
        scheduleChanges: true,
        systemUpdates: false,
        marketing: false
      }
    },
    push: {
      enabled: true,
      types: {
        playerUpdates: true,
        teamUpdates: true,
        scoutingReports: true,
        scheduleChanges: true,
        systemUpdates: false
      }
    },
    inApp: {
      enabled: true,
      sound: true,
      types: {
        playerUpdates: true,
        teamUpdates: true,
        scoutingReports: true,
        scheduleChanges: true,
        systemUpdates: true
      }
    }
  },
  security: {
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    requirePasswordChange: false,
    loginHistory: [],
    activeSessions: []
  },
  privacy: {
    profileVisibility: 'team',
    showEmail: false,
    showPhone: false,
    allowDataSharing: false,
    allowAnalytics: true,
    allowMarketing: false
  }
};
