import api from './api';

export const settingsService = {
  // Get user settings
  getUserSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Update general settings
  updateGeneralSettings: async (settings) => {
    const response = await api.put('/settings/general', settings);
    return response.data;
  },

  // Update account settings
  updateAccountSettings: async (accountData) => {
    const response = await api.put('/settings/account', accountData);
    return response.data;
  },

  // Update notification settings
  updateNotificationSettings: async (notificationSettings) => {
    const response = await api.put('/settings/notifications', notificationSettings);
    return response.data;
  },

  // Update security settings
  updateSecuritySettings: async (securitySettings) => {
    const response = await api.put('/settings/security', securitySettings);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/settings/change-password', passwordData);
    return response.data;
  },

  // Enable/disable two-factor authentication
  toggleTwoFactor: async (enabled) => {
    const response = await api.put('/settings/two-factor', { enabled });
    return response.data;
  },

  // Get two-factor QR code
  getTwoFactorQR: async () => {
    const response = await api.get('/settings/two-factor/qr');
    return response.data;
  },

  // Verify two-factor code
  verifyTwoFactor: async (code) => {
    const response = await api.post('/settings/two-factor/verify', { code });
    return response.data;
  },

  // Get login history
  getLoginHistory: async () => {
    const response = await api.get('/settings/login-history');
    return response.data;
  },

  // Export user data
  exportUserData: async () => {
    const response = await api.get('/settings/export-data', {
      responseType: 'blob'
    });
    return response.data;
  },

  // Delete account
  deleteAccount: async (confirmation) => {
    const response = await api.delete('/settings/account', {
      data: { confirmation }
    });
    return response.data;
  },

  // Get notification preferences
  getNotificationPreferences: async () => {
    const response = await api.get('/settings/notifications/preferences');
    return response.data;
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    const response = await api.put('/settings/notifications/preferences', preferences);
    return response.data;
  },

  // Test email notification
  testEmailNotification: async () => {
    const response = await api.post('/settings/notifications/test-email');
    return response.data;
  },

  // Get active sessions
  getActiveSessions: async () => {
    const response = await api.get('/settings/sessions');
    return response.data;
  },

  // Revoke session
  revokeSession: async (sessionId) => {
    const response = await api.delete(`/settings/sessions/${sessionId}`);
    return response.data;
  },

  // Revoke all sessions
  revokeAllSessions: async () => {
    const response = await api.delete('/settings/sessions');
    return response.data;
  },

  // Upload profile picture
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

  // Get privacy settings
  getPrivacySettings: async () => {
    const response = await api.get('/settings/privacy');
    return response.data;
  },

  // Update privacy settings
  updatePrivacySettings: async (privacySettings) => {
    const response = await api.put('/settings/privacy', privacySettings);
    return response.data;
  }
};

// Default settings structure
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