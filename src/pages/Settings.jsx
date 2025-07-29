import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../contexts/ThemeContext';
import { settingsService, defaultSettings } from '../services/settings';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Bell, 
  Shield, 
  Settings as SettingsIcon,
  Save,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Lock,
  Key,
  Clock,
  Globe,
  Palette,
  Monitor,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Settings = () => {
  const { theme, changeTheme } = useTheme();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Fetch user settings
  const { data: userSettings, isLoading } = useQuery({
    queryKey: ['user-settings'],
    queryFn: settingsService.getUserSettings,
    onError: (error) => {
      console.error('Error fetching settings:', error);
    }
  });

  const settings = userSettings?.data || defaultSettings;

  // Mutations
  const updateGeneralMutation = useMutation({
    mutationFn: settingsService.updateGeneralSettings,
    onSuccess: () => {
      toast.success('General settings updated successfully!');
      queryClient.invalidateQueries(['user-settings']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update general settings');
    }
  });

  const updateAccountMutation = useMutation({
    mutationFn: settingsService.updateAccountSettings,
    onSuccess: () => {
      toast.success('Account settings updated successfully!');
      queryClient.invalidateQueries(['user-settings']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update account settings');
    }
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: settingsService.updateNotificationSettings,
    onSuccess: () => {
      toast.success('Notification settings updated successfully!');
      queryClient.invalidateQueries(['user-settings']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update notification settings');
    }
  });

  const updateSecurityMutation = useMutation({
    mutationFn: settingsService.updateSecuritySettings,
    onSuccess: () => {
      toast.success('Security settings updated successfully!');
      queryClient.invalidateQueries(['user-settings']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update security settings');
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: settingsService.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  });

  const toggleTwoFactorMutation = useMutation({
    mutationFn: settingsService.toggleTwoFactor,
    onSuccess: () => {
      toast.success('Two-factor authentication updated successfully!');
      queryClient.invalidateQueries(['user-settings']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update two-factor authentication');
    }
  });

  const uploadProfilePictureMutation = useMutation({
    mutationFn: settingsService.uploadProfilePicture,
    onSuccess: () => {
      toast.success('Profile picture updated successfully!');
      setShowProfilePictureModal(false);
      setSelectedFile(null);
      queryClient.invalidateQueries(['user-settings']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
    }
  });

  const deleteAccountMutation = useMutation({
    mutationFn: settingsService.deleteAccount,
    onSuccess: () => {
      toast.success('Account deleted successfully!');
      // Redirect to logout or home page
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    }
  });

  // Handlers
  const handleThemeChange = (e) => {
    changeTheme(e.target.value);
    updateGeneralMutation.mutate({ theme: e.target.value });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    changePasswordMutation.mutate(passwordData);
  };

  const handleTwoFactorToggle = () => {
    toggleTwoFactorMutation.mutate(!settings.security.twoFactorEnabled);
  };

  const handleProfilePictureUpload = (e) => {
    e.preventDefault();
    if (selectedFile) {
      uploadProfilePictureMutation.mutate(selectedFile);
    }
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    if (deleteConfirmation === 'DELETE') {
      deleteAccountMutation.mutate(deleteConfirmation);
    } else {
      toast.error('Please type DELETE to confirm account deletion');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Settings
          </h1>
          <p className="text-base-content/70">
            Manage your account and application preferences
          </p>
        </div>

        {/* Settings Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button 
            className={`tab ${activeTab === 'general' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            General
          </button>
          <button 
            className={`tab ${activeTab === 'account' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <User className="w-4 h-4 mr-2" />
            Account
          </button>
          <button 
            className={`tab ${activeTab === 'notifications' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </button>
          <button 
            className={`tab ${activeTab === 'security' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Security
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <>
              {/* Theme Settings */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Theme
                  </h2>
                  <p className="card-description">Choose your preferred theme</p>
                </div>
                <div className="card-body">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Theme</span>
                    </label>
                    
                    {/* Theme Preview */}
                    <div className="mb-4 p-4 rounded-lg border bg-base-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Current Theme Preview</span>
                        <span className="text-xs opacity-70">{theme}</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded bg-primary"></div>
                        <div className="w-8 h-8 rounded bg-secondary"></div>
                        <div className="w-8 h-8 rounded bg-accent"></div>
                        <div className="w-8 h-8 rounded bg-neutral"></div>
                        <div className="w-8 h-8 rounded bg-success"></div>
                        <div className="w-8 h-8 rounded bg-warning"></div>
                        <div className="w-8 h-8 rounded bg-error"></div>
                      </div>
                    </div>
                    
                    <select 
                      className="select select-bordered"
                      value={theme}
                      onChange={handleThemeChange}
                    >
                      <optgroup label="🎨 Custom Themes">
                        <option value="ocean-breeze">🌊 Ocean Breeze</option>
                        <option value="sunset-glow">🌅 Sunset Glow</option>
                        <option value="forest-mist">🌲 Forest Mist</option>
                        <option value="lavender-dreams">💜 Lavender Dreams</option>
                        <option value="tropical">🌴 Tropical</option>
                      </optgroup>
                      <optgroup label="📦 Built-in Themes">
                        <option value="light">☀️ Light</option>
                        <option value="dark">🌙 Dark</option>
                        <option value="cupcake">🧁 Cupcake</option>
                        <option value="bumblebee">🐝 Bumblebee</option>
                        <option value="emerald">💎 Emerald</option>
                        <option value="corporate">🏢 Corporate</option>
                        <option value="synthwave">🎸 Synthwave</option>
                        <option value="retro">📺 Retro</option>
                        <option value="cyberpunk">🤖 Cyberpunk</option>
                        <option value="valentine">💕 Valentine</option>
                        <option value="halloween">🎃 Halloween</option>
                        <option value="garden">🌱 Garden</option>
                        <option value="forest">🌳 Forest</option>
                        <option value="aqua">💧 Aqua</option>
                        <option value="lofi">🎧 Lo-Fi</option>
                        <option value="pastel">🎨 Pastel</option>
                        <option value="fantasy">🧚 Fantasy</option>
                        <option value="wireframe">📐 Wireframe</option>
                        <option value="black">⚫ Black</option>
                        <option value="luxury">💎 Luxury</option>
                        <option value="dracula">🧛 Dracula</option>
                        <option value="cmyk">🖨️ CMYK</option>
                        <option value="autumn">🍂 Autumn</option>
                        <option value="business">💼 Business</option>
                        <option value="acid">⚗️ Acid</option>
                        <option value="lemonade">🍋 Lemonade</option>
                        <option value="night">🌃 Night</option>
                        <option value="coffee">☕ Coffee</option>
                        <option value="winter">❄️ Winter</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>

              {/* Display Settings */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Display
                  </h2>
                  <p className="card-description">Customize your display preferences</p>
                </div>
                <div className="card-body space-y-4">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Show notifications</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary" 
                        checked={settings.general.showNotifications}
                        onChange={(e) => updateGeneralMutation.mutate({ showNotifications: e.target.checked })}
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Auto-refresh data</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary" 
                        checked={settings.general.autoRefresh}
                        onChange={(e) => updateGeneralMutation.mutate({ autoRefresh: e.target.checked })}
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Compact view</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary" 
                        checked={settings.general.compactView}
                        onChange={(e) => updateGeneralMutation.mutate({ compactView: e.target.checked })}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Data Settings */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Data Management
                  </h2>
                  <p className="card-description">Manage your data and exports</p>
                </div>
                <div className="card-body space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Export Data</h3>
                      <p className="text-sm text-base-content/70">Download your data as CSV or JSON</p>
                    </div>
                    <button className="btn btn-outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Clear Cache</h3>
                      <p className="text-sm text-base-content/70">Clear cached data to free up space</p>
                    </div>
                    <button className="btn btn-outline">Clear</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Account Settings Tab */}
          {activeTab === 'account' && (
            <>
              {/* Profile Information */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </h2>
                  <p className="card-description">Update your personal information</p>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">First Name</span>
                      </label>
                      <input 
                        type="text" 
                        className="input input-bordered" 
                        defaultValue={settings.account.firstName}
                        onChange={(e) => updateAccountMutation.mutate({ firstName: e.target.value })}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Last Name</span>
                      </label>
                      <input 
                        type="text" 
                        className="input input-bordered" 
                        defaultValue={settings.account.lastName}
                        onChange={(e) => updateAccountMutation.mutate({ lastName: e.target.value })}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input 
                        type="email" 
                        className="input input-bordered" 
                        defaultValue={settings.account.email}
                        onChange={(e) => updateAccountMutation.mutate({ email: e.target.value })}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Phone</span>
                      </label>
                      <input 
                        type="tel" 
                        className="input input-bordered" 
                        defaultValue={settings.account.phone}
                        onChange={(e) => updateAccountMutation.mutate({ phone: e.target.value })}
                      />
                    </div>
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text">Bio</span>
                      </label>
                      <textarea 
                        className="textarea textarea-bordered h-24" 
                        defaultValue={settings.account.bio}
                        onChange={(e) => updateAccountMutation.mutate({ bio: e.target.value })}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Location</span>
                      </label>
                      <input 
                        type="text" 
                        className="input input-bordered" 
                        defaultValue={settings.account.location}
                        onChange={(e) => updateAccountMutation.mutate({ location: e.target.value })}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Website</span>
                      </label>
                      <input 
                        type="url" 
                        className="input input-bordered" 
                        defaultValue={settings.account.website}
                        onChange={(e) => updateAccountMutation.mutate({ website: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Picture */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Profile Picture
                  </h2>
                  <p className="card-description">Upload a new profile picture</p>
                </div>
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-20 h-20 rounded-full">
                        <img src={settings.account.profilePicture || '/default-avatar.png'} alt="Profile" />
                      </div>
                    </div>
                    <div>
                      <button 
                        className="btn btn-outline"
                        onClick={() => setShowProfilePictureModal(true)}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New Picture
                      </button>
                      <p className="text-sm text-base-content/70 mt-2">
                        Recommended: Square image, 200x200 pixels or larger
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Account Actions
                  </h2>
                  <p className="card-description">Dangerous actions - use with caution</p>
                </div>
                <div className="card-body space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-error">Delete Account</h3>
                      <p className="text-sm text-base-content/70">Permanently delete your account and all data</p>
                    </div>
                    <button 
                      className="btn btn-error btn-outline"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notifications Settings Tab */}
          {activeTab === 'notifications' && (
            <>
              {/* Email Notifications */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Notifications
                  </h2>
                  <p className="card-description">Configure email notification preferences</p>
                </div>
                <div className="card-body space-y-4">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Enable email notifications</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary" 
                        checked={settings.notifications.email.enabled}
                        onChange={(e) => updateNotificationsMutation.mutate({ 
                          email: { ...settings.notifications.email, enabled: e.target.checked }
                        })}
                      />
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email Frequency</span>
                    </label>
                    <select 
                      className="select select-bordered"
                      value={settings.notifications.email.frequency}
                      onChange={(e) => updateNotificationsMutation.mutate({ 
                        email: { ...settings.notifications.email, frequency: e.target.value }
                      })}
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Notification Types</h4>
                    {Object.entries(settings.notifications.email.types).map(([key, value]) => (
                      <div key={key} className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                          <input 
                            type="checkbox" 
                            className="checkbox checkbox-primary" 
                            checked={value}
                            onChange={(e) => updateNotificationsMutation.mutate({ 
                              email: { 
                                ...settings.notifications.email, 
                                types: { ...settings.notifications.email.types, [key]: e.target.checked }
                              }
                            })}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Push Notifications */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Push Notifications
                  </h2>
                  <p className="card-description">Configure push notification preferences</p>
                </div>
                <div className="card-body space-y-4">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Enable push notifications</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary" 
                        checked={settings.notifications.push.enabled}
                        onChange={(e) => updateNotificationsMutation.mutate({ 
                          push: { ...settings.notifications.push, enabled: e.target.checked }
                        })}
                      />
                    </label>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Notification Types</h4>
                    {Object.entries(settings.notifications.push.types).map(([key, value]) => (
                      <div key={key} className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                          <input 
                            type="checkbox" 
                            className="checkbox checkbox-primary" 
                            checked={value}
                            onChange={(e) => updateNotificationsMutation.mutate({ 
                              push: { 
                                ...settings.notifications.push, 
                                types: { ...settings.notifications.push.types, [key]: e.target.checked }
                              }
                            })}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* In-App Notifications */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    In-App Notifications
                  </h2>
                  <p className="card-description">Configure in-app notification preferences</p>
                </div>
                <div className="card-body space-y-4">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Enable in-app notifications</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary" 
                        checked={settings.notifications.inApp.enabled}
                        onChange={(e) => updateNotificationsMutation.mutate({ 
                          inApp: { ...settings.notifications.inApp, enabled: e.target.checked }
                        })}
                      />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Play notification sounds</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary" 
                        checked={settings.notifications.inApp.sound}
                        onChange={(e) => updateNotificationsMutation.mutate({ 
                          inApp: { ...settings.notifications.inApp, sound: e.target.checked }
                        })}
                      />
                    </label>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Notification Types</h4>
                    {Object.entries(settings.notifications.inApp.types).map(([key, value]) => (
                      <div key={key} className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                          <input 
                            type="checkbox" 
                            className="checkbox checkbox-primary" 
                            checked={value}
                            onChange={(e) => updateNotificationsMutation.mutate({ 
                              inApp: { 
                                ...settings.notifications.inApp, 
                                types: { ...settings.notifications.inApp.types, [key]: e.target.checked }
                              }
                            })}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Security Settings Tab */}
          {activeTab === 'security' && (
            <>
              {/* Password */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Password
                  </h2>
                  <p className="card-description">Change your account password</p>
                </div>
                <div className="card-body">
                  <button 
                    className="btn btn-outline"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Two-Factor Authentication
                  </h2>
                  <p className="card-description">Add an extra layer of security to your account</p>
                </div>
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-base-content/70">
                        {settings.security.twoFactorEnabled 
                          ? 'Enabled - Your account is protected with 2FA' 
                          : 'Disabled - Enable 2FA for enhanced security'
                        }
                      </p>
                    </div>
                    <button 
                      className={`btn ${settings.security.twoFactorEnabled ? 'btn-error' : 'btn-success'}`}
                      onClick={handleTwoFactorToggle}
                    >
                      {settings.security.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                    </button>
                  </div>
                </div>
              </div>

              {/* Session Management */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Session Management
                  </h2>
                  <p className="card-description">Manage your active sessions and login history</p>
                </div>
                <div className="card-body space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Session Timeout (minutes)</span>
                    </label>
                    <input 
                      type="number" 
                      className="input input-bordered" 
                      min="5"
                      max="1440"
                      defaultValue={settings.security.sessionTimeout}
                      onChange={(e) => updateSecurityMutation.mutate({ sessionTimeout: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Login notifications</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary" 
                        checked={settings.security.loginNotifications}
                        onChange={(e) => updateSecurityMutation.mutate({ loginNotifications: e.target.checked })}
                      />
                    </label>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Active Sessions</h3>
                      <p className="text-sm text-base-content/70">Manage your current login sessions</p>
                    </div>
                    <button className="btn btn-outline btn-sm">
                      View Sessions
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Privacy
                  </h2>
                  <p className="card-description">Control your privacy and data sharing preferences</p>
                </div>
                <div className="card-body space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Profile Visibility</span>
                    </label>
                    <select 
                      className="select select-bordered"
                      defaultValue={settings.privacy.profileVisibility}
                      onChange={(e) => updateSecurityMutation.mutate({ 
                        privacy: { ...settings.privacy, profileVisibility: e.target.value }
                      })}
                    >
                      <option value="public">Public</option>
                      <option value="team">Team Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Show email address</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary" 
                        checked={settings.privacy.showEmail}
                        onChange={(e) => updateSecurityMutation.mutate({ 
                          privacy: { ...settings.privacy, showEmail: e.target.checked }
                        })}
                      />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Show phone number</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary" 
                        checked={settings.privacy.showPhone}
                        onChange={(e) => updateSecurityMutation.mutate({ 
                          privacy: { ...settings.privacy, showPhone: e.target.checked }
                        })}
                      />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Allow data sharing</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary" 
                        checked={settings.privacy.allowDataSharing}
                        onChange={(e) => updateSecurityMutation.mutate({ 
                          privacy: { ...settings.privacy, allowDataSharing: e.target.checked }
                        })}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modals */}
        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Password</span>
                  </label>
                  <input 
                    type="password" 
                    className="input input-bordered" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">New Password</span>
                  </label>
                  <input 
                    type="password" 
                    className="input input-bordered" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Confirm New Password</span>
                  </label>
                  <input 
                    type="password" 
                    className="input input-bordered" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-action">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={changePasswordMutation.isLoading}
                  >
                    {changePasswordMutation.isLoading ? (
                      <>
                        <div className="loading loading-spinner loading-sm"></div>
                        Changing...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Profile Picture Upload Modal */}
        {showProfilePictureModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Upload Profile Picture</h3>
              <form onSubmit={handleProfilePictureUpload} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Select Image</span>
                  </label>
                  <input 
                    type="file" 
                    className="file-input file-input-bordered w-full" 
                    accept="image/*"
                    onChange={handleFileSelect}
                    required
                  />
                </div>
                {selectedFile && (
                  <div className="text-sm text-base-content/70">
                    Selected: {selectedFile.name}
                  </div>
                )}
                <div className="modal-action">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={uploadProfilePictureMutation.isLoading || !selectedFile}
                  >
                    {uploadProfilePictureMutation.isLoading ? (
                      <>
                        <div className="loading loading-spinner loading-sm"></div>
                        Uploading...
                      </>
                    ) : (
                      'Upload Picture'
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => setShowProfilePictureModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4 text-error">Delete Account</h3>
              <div className="alert alert-error mb-4">
                <AlertTriangle className="w-5 h-5" />
                <span>This action cannot be undone. All your data will be permanently deleted.</span>
              </div>
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Type "DELETE" to confirm</span>
                  </label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="DELETE"
                    required
                  />
                </div>
                <div className="modal-action">
                  <button 
                    type="submit" 
                    className="btn btn-error"
                    disabled={deleteAccountMutation.isLoading || deleteConfirmation !== 'DELETE'}
                  >
                    {deleteAccountMutation.isLoading ? (
                      <>
                        <div className="loading loading-spinner loading-sm"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings; 