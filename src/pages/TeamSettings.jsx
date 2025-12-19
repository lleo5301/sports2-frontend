import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Settings,
  Save,
  Palette,
  Building,
  MapPin,
  Users,
  Shield,
  Award,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  CheckCircle,
  AlertCircle,
  UserPlus,
  UserMinus,
  Lock,
  Unlock,
  Clock,
  Calendar,
  Plus,
  Edit,
  X,
  Image as ImageIcon,
  Link2
} from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useBranding } from '../contexts/BrandingContext'
import LogoUpload from '../components/LogoUpload'
import PrestoSportsConfig from '../components/integrations/PrestoSportsConfig'
import toast from 'react-hot-toast'

const divisions = [
  { value: 'D1', label: 'Division I', color: 'bg-red-100 text-red-800' },
  { value: 'D2', label: 'Division II', color: 'bg-blue-100 text-blue-800' },
  { value: 'D3', label: 'Division III', color: 'bg-green-100 text-green-800' },
  { value: 'NAIA', label: 'NAIA', color: 'bg-purple-100 text-purple-800' },
  { value: 'JUCO', label: 'Junior College', color: 'bg-orange-100 text-orange-800' }
]

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

const permissionTypes = [
  { value: 'depth_chart_view', label: 'View Depth Charts', description: 'Can view depth charts and player assignments' },
  { value: 'depth_chart_create', label: 'Create Depth Charts', description: 'Can create new depth charts' },
  { value: 'depth_chart_edit', label: 'Edit Depth Charts', description: 'Can edit existing depth charts' },
  { value: 'depth_chart_delete', label: 'Delete Depth Charts', description: 'Can delete depth charts' },
  { value: 'depth_chart_manage_positions', label: 'Manage Positions', description: 'Can configure position settings' },
  { value: 'player_assign', label: 'Assign Players', description: 'Can assign players to positions' },
  { value: 'player_unassign', label: 'Unassign Players', description: 'Can remove players from positions' },
  { value: 'schedule_view', label: 'View Schedule', description: 'Can view team schedule' },
  { value: 'schedule_create', label: 'Create Schedule', description: 'Can create new schedule items' },
  { value: 'schedule_edit', label: 'Edit Schedule', description: 'Can edit schedule items' },
  { value: 'schedule_delete', label: 'Delete Schedule', description: 'Can delete schedule items' },
  { value: 'reports_view', label: 'View Reports', description: 'Can view reports and analytics' },
  { value: 'reports_create', label: 'Create Reports', description: 'Can create new reports' },
  { value: 'reports_edit', label: 'Edit Reports', description: 'Can edit existing reports' },
  { value: 'reports_delete', label: 'Delete Reports', description: 'Can delete reports' },
  { value: 'team_settings', label: 'Team Settings', description: 'Can modify team settings' },
  { value: 'user_management', label: 'User Management', description: 'Can manage user accounts and permissions' }
]

export default function TeamSettings() {
  const { user, canModifyBranding } = useAuth();
  const { logoUrl, primaryColor, secondaryColor, refreshBranding, updateBranding } = useBranding();
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [showAddPermissionModal, setShowAddPermissionModal] = useState(false)
  const [editingPermission, setEditingPermission] = useState(null)
  const [brandingColors, setBrandingColors] = useState({
    primary_color: primaryColor || '#3B82F6',
    secondary_color: secondaryColor || '#EF4444'
  })
  const [newPermission, setNewPermission] = useState({
    user_id: '',
    permission_type: '',
    expires_at: '',
    notes: ''
  })
  const queryClient = useQueryClient()

  // Fetch team data
  const { data: teamData, isLoading, error, refetch } = useQuery({
    queryKey: ['team-settings', user?.team_id],
    queryFn: () => api.get(`/teams/${user.team_id}`),
    staleTime: 300000, // 5 minutes
    enabled: !!user?.team_id
  })

  // Fetch team users
  const { data: teamUsers } = useQuery({
    queryKey: ['team-users'],
    queryFn: () => api.get('/teams/users'),
    staleTime: 300000
  })

  // Fetch user permissions
  const { data: userPermissions } = useQuery({
    queryKey: ['user-permissions'],
    queryFn: () => api.get('/teams/permissions'),
    staleTime: 300000
  })

  // Update team settings mutation
  const updateTeam = useMutation({
    mutationFn: (data) => api.put(`/teams/${user.team_id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-settings', user?.team_id] })
      toast.success('Team settings updated successfully')
    },
    onError: () => {
      toast.error('Failed to update team settings')
    }
  })

  // Update user password mutation
  const updatePassword = useMutation({
    mutationFn: (data) => api.put('/auth/password', data),
    onSuccess: () => {
      toast.success('Password updated successfully')
    },
    onError: () => {
      toast.error('Failed to update password')
    }
  })

  // Add permission mutation
  const addPermission = useMutation({
    mutationFn: (data) => api.post('/teams/permissions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] })
      setShowAddPermissionModal(false)
      setNewPermission({
        user_id: '',
        permission_type: '',
        expires_at: '',
        notes: ''
      })
      toast.success('Permission added successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add permission')
    }
  })

  // Update permission mutation
  const updatePermission = useMutation({
    mutationFn: ({ permissionId, data }) => api.put(`/teams/permissions/${permissionId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] })
      setEditingPermission(null)
      toast.success('Permission updated successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update permission')
    }
  })

  // Delete permission mutation
  const deletePermission = useMutation({
    mutationFn: (permissionId) => api.delete(`/teams/permissions/${permissionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] })
      toast.success('Permission removed successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove permission')
    }
  })

  // Update branding mutation
  const updateBrandingMutation = useMutation({
    mutationFn: (data) => api.put('/teams/branding', data),
    onSuccess: () => {
      refreshBranding()
      toast.success('Branding updated successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update branding')
    }
  })

  const handleTeamUpdate = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      name: formData.get('name'),
      program_name: formData.get('program_name'),
      conference: formData.get('conference'),
      division: formData.get('division'),
      city: formData.get('city'),
      state: formData.get('state'),
      primary_color: formData.get('primary_color'),
      secondary_color: formData.get('secondary_color')
    }
    updateTeam.mutate(data)
  }

  const handlePasswordUpdate = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      current_password: formData.get('current_password'),
      new_password: formData.get('new_password'),
      confirm_password: formData.get('confirm_password')
    }
    updatePassword.mutate(data)
  }

  const handleAddPermission = () => {
    addPermission.mutate(newPermission)
  }

  const handleUpdatePermission = () => {
    updatePermission.mutate({
      permissionId: editingPermission.id,
      data: editingPermission
    })
  }

  const handleDeletePermission = (permissionId) => {
    if (window.confirm('Are you sure you want to remove this permission?')) {
      deletePermission.mutate(permissionId)
    }
  }

  const handleBrandingUpdate = (e) => {
    e.preventDefault()
    updateBrandingMutation.mutate(brandingColors)
  }

  const handleLogoChange = (newLogoUrl) => {
    updateBranding({ logoUrl: newLogoUrl })
    refreshBranding()
  }

  const team = teamData?.data
  const users = teamUsers?.data || []
  const permissions = userPermissions?.data || []

  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your team configuration and user permissions.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${activeTab === 'general' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Settings className="h-4 w-4 mr-2" />
            General
          </button>
          {canModifyBranding && (
            <button
              className={`tab ${activeTab === 'branding' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('branding')}
            >
              <Palette className="h-4 w-4 mr-2" />
              Branding
            </button>
          )}
          <button
            className={`tab ${activeTab === 'permissions' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('permissions')}
          >
            <Shield className="h-4 w-4 mr-2" />
            Permissions
          </button>
          {canModifyBranding && (
            <button
              className={`tab ${activeTab === 'integrations' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('integrations')}
            >
              <Link2 className="h-4 w-4 mr-2" />
              Integrations
            </button>
          )}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Team Information */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Team Information</h2>
                <p className="card-description">Update your team's basic information</p>
              </div>
              <div className="card-content">
                <form onSubmit={handleTeamUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Team Name *</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="input input-bordered w-full"
                        defaultValue={team?.name}
                        required
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Program Name</span>
                      </label>
                      <input
                        type="text"
                        name="program_name"
                        className="input input-bordered w-full"
                        defaultValue={team?.program_name}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Conference</span>
                      </label>
                      <input
                        type="text"
                        name="conference"
                        className="input input-bordered w-full"
                        defaultValue={team?.conference}
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Division</span>
                      </label>
                      <select name="division" className="select select-bordered w-full">
                        <option value="">Select Division</option>
                        {divisions.map(division => (
                          <option key={division.value} value={division.value} selected={team?.division === division.value}>
                            {division.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">State</span>
                      </label>
                      <select name="state" className="select select-bordered w-full">
                        <option value="">Select State</option>
                        {states.map(state => (
                          <option key={state} value={state} selected={team?.state === state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">City</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      className="input input-bordered w-full"
                      defaultValue={team?.city}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Primary Color</span>
                      </label>
                      <input
                        type="color"
                        name="primary_color"
                        className="input input-bordered w-full h-12"
                        defaultValue={team?.primary_color || '#3B82F6'}
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Secondary Color</span>
                      </label>
                      <input
                        type="color"
                        name="secondary_color"
                        className="input input-bordered w-full h-12"
                        defaultValue={team?.secondary_color || '#EF4444'}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updateTeam.isLoading}
                    >
                      {updateTeam.isLoading ? (
                        <>
                          <div className="loading loading-spinner loading-sm"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Password Change */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Change Password</h2>
                <p className="card-description">Update your account password</p>
              </div>
              <div className="card-content">
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Current Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="current_password"
                        className="input input-bordered w-full pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">New Password</span>
                      </label>
                      <input
                        type="password"
                        name="new_password"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Confirm New Password</span>
                      </label>
                      <input
                        type="password"
                        name="confirm_password"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updatePassword.isLoading}
                    >
                      {updatePassword.isLoading ? (
                        <>
                          <div className="loading loading-spinner loading-sm"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Branding Settings (Super Admin or Head Coach) */}
        {activeTab === 'branding' && canModifyBranding && (
          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Team Logo
                </h2>
                <p className="card-description">
                  Upload your team logo to display in the sidebar and on reports
                </p>
              </div>
              <div className="card-content">
                <LogoUpload
                  currentLogoUrl={logoUrl}
                  onLogoChange={handleLogoChange}
                />
              </div>
            </div>

            {/* Color Scheme */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Scheme
                </h2>
                <p className="card-description">
                  Customize your team colors to match your branding
                </p>
              </div>
              <div className="card-content">
                <form onSubmit={handleBrandingUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Primary Color</span>
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="color"
                          value={brandingColors.primary_color}
                          onChange={(e) => setBrandingColors(prev => ({ ...prev, primary_color: e.target.value }))}
                          className="w-16 h-16 rounded-lg cursor-pointer border-2 border-base-300"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={brandingColors.primary_color}
                            onChange={(e) => setBrandingColors(prev => ({ ...prev, primary_color: e.target.value }))}
                            className="input input-bordered w-full font-mono"
                            pattern="^#[0-9A-Fa-f]{6}$"
                            placeholder="#3B82F6"
                          />
                          <p className="text-xs text-base-content/50 mt-1">
                            Used for buttons, links, and accents
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Secondary Color</span>
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="color"
                          value={brandingColors.secondary_color}
                          onChange={(e) => setBrandingColors(prev => ({ ...prev, secondary_color: e.target.value }))}
                          className="w-16 h-16 rounded-lg cursor-pointer border-2 border-base-300"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={brandingColors.secondary_color}
                            onChange={(e) => setBrandingColors(prev => ({ ...prev, secondary_color: e.target.value }))}
                            className="input input-bordered w-full font-mono"
                            pattern="^#[0-9A-Fa-f]{6}$"
                            placeholder="#EF4444"
                          />
                          <p className="text-xs text-base-content/50 mt-1">
                            Used for secondary elements and highlights
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Preview</h4>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="btn"
                        style={{ backgroundColor: brandingColors.primary_color, borderColor: brandingColors.primary_color, color: 'white' }}
                      >
                        Primary Button
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={{ backgroundColor: brandingColors.secondary_color, borderColor: brandingColors.secondary_color, color: 'white' }}
                      >
                        Secondary Button
                      </button>
                      <div
                        className="px-4 py-2 rounded-lg font-medium"
                        style={{ backgroundColor: brandingColors.primary_color + '20', color: brandingColors.primary_color }}
                      >
                        Badge Style
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updateBrandingMutation.isLoading}
                    >
                      {updateBrandingMutation.isLoading ? (
                        <>
                          <div className="loading loading-spinner loading-sm"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Colors
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Permissions Management */}
        {activeTab === 'permissions' && (
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">User Permissions</h2>
                <p className="card-description">Manage access permissions for team members</p>
                <button
                  onClick={() => setShowAddPermissionModal(true)}
                  className="btn btn-primary btn-sm"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Permission
                </button>
              </div>
              <div className="card-content">
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Permission</th>
                        <th>Status</th>
                        <th>Expires</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissions.map((permission) => {
                        const user = users.find(u => u.id === permission.user_id)
                        const permissionType = permissionTypes.find(p => p.value === permission.permission_type)
                        const isExpired = permission.expires_at && new Date() > new Date(permission.expires_at)
                        
                        return (
                          <tr key={permission.id}>
                            <td>
                              <div className="flex items-center space-x-3">
                                <div className="avatar placeholder">
                                  <div className="bg-neutral text-neutral-content rounded-full w-8">
                                    <span className="text-xs">
                                      {user ? `${user.first_name[0]}${user.last_name[0]}` : '??'}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <div className="font-bold">
                                    {user ? `${user.first_name} ${user.last_name}` : 'Unknown User'}
                                  </div>
                                  <div className="text-sm opacity-50">{user?.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="font-medium">{permissionType?.label || permission.permission_type}</div>
                                <div className="text-sm text-gray-500">{permissionType?.description}</div>
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                {permission.is_granted ? (
                                  <span className="badge badge-success gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Granted
                                  </span>
                                ) : (
                                  <span className="badge badge-error gap-1">
                                    <X className="h-3 w-3" />
                                    Denied
                                  </span>
                                )}
                                {isExpired && (
                                  <span className="badge badge-warning gap-1">
                                    <Clock className="h-3 w-3" />
                                    Expired
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              {permission.expires_at ? (
                                <div className="text-sm">
                                  <div>{new Date(permission.expires_at).toLocaleDateString()}</div>
                                  <div className="text-gray-500">
                                    {new Date(permission.expires_at).toLocaleTimeString()}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">Never</span>
                              )}
                            </td>
                            <td>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setEditingPermission(permission)}
                                  className="btn btn-ghost btn-xs"
                                  title="Edit Permission"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleDeletePermission(permission.id)}
                                  className="btn btn-ghost btn-xs text-red-600"
                                  title="Remove Permission"
                                  disabled={deletePermission.isLoading}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {permissions.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No permissions configured</p>
                    <button
                      onClick={() => setShowAddPermissionModal(true)}
                      className="btn btn-outline btn-sm mt-2"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add First Permission
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Integrations (Head Coach only) */}
        {activeTab === 'integrations' && canModifyBranding && (
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  External Integrations
                </h2>
                <p className="card-description">
                  Connect to external services to sync schedules, rosters, and statistics
                </p>
              </div>
              <div className="card-content">
                <PrestoSportsConfig />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Permission Modal */}
      {showAddPermissionModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add User Permission</h3>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">User *</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={newPermission.user_id}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, user_id: e.target.value }))}
                >
                  <option value="">Select a user...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Permission Type *</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={newPermission.permission_type}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, permission_type: e.target.value }))}
                >
                  <option value="">Select permission...</option>
                  {permissionTypes.map((permission) => (
                    <option key={permission.value} value={permission.value}>
                      {permission.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Expires At</span>
                </label>
                <input
                  type="datetime-local"
                  className="input input-bordered w-full"
                  value={newPermission.expires_at}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, expires_at: e.target.value }))}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Leave empty for permanent permission
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Notes</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={newPermission.notes}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional notes about this permission"
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowAddPermissionModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddPermission}
                disabled={!newPermission.user_id || !newPermission.permission_type || addPermission.isLoading}
              >
                {addPermission.isLoading ? 'Adding...' : 'Add Permission'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Permission Modal */}
      {editingPermission && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Permission</h3>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">User</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={users.find(u => u.id === editingPermission.user_id)?.email || 'Unknown User'}
                  disabled
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Permission Type</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={permissionTypes.find(p => p.value === editingPermission.permission_type)?.label || editingPermission.permission_type}
                  disabled
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={editingPermission.is_granted ? 'true' : 'false'}
                  onChange={(e) => setEditingPermission(prev => ({ ...prev, is_granted: e.target.value === 'true' }))}
                >
                  <option value="true">Granted</option>
                  <option value="false">Denied</option>
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Expires At</span>
                </label>
                <input
                  type="datetime-local"
                  className="input input-bordered w-full"
                  value={editingPermission.expires_at ? editingPermission.expires_at.slice(0, 16) : ''}
                  onChange={(e) => setEditingPermission(prev => ({ ...prev, expires_at: e.target.value }))}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Notes</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={editingPermission.notes || ''}
                  onChange={(e) => setEditingPermission(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional notes about this permission"
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setEditingPermission(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleUpdatePermission}
                disabled={updatePermission.isLoading}
              >
                {updatePermission.isLoading ? 'Updating...' : 'Update Permission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}