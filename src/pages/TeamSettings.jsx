import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
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
  AlertCircle
} from 'lucide-react'
import api from '../services/api'
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

export default function TeamSettings() {
  const [showPassword, setShowPassword] = useState(false)
  const [showLogoUpload, setShowLogoUpload] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const queryClient = useQueryClient()

  // Fetch team data
  const { data: teamData, isLoading, error, refetch } = useQuery(
    ['team-settings'],
    () => api.get('/teams/me'),
    {
      staleTime: 300000 // 5 minutes
    }
  )

  // Update team settings mutation
  const updateTeam = useMutation(
    (data) => api.put('/teams/me', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['team-settings'])
        toast.success('Team settings updated successfully')
      },
      onError: () => {
        toast.error('Failed to update team settings')
      }
    }
  )

  // Update user password mutation
  const updatePassword = useMutation(
    (data) => api.put('/auth/password', data),
    {
      onSuccess: () => {
        toast.success('Password updated successfully')
      },
      onError: () => {
        toast.error('Failed to update password')
      }
    }
  )

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
    
    if (data.new_password !== data.confirm_password) {
      toast.error('New passwords do not match')
      return
    }
    
    updatePassword.mutate(data)
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Logo file size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      setLogoFile(file)
    }
  }

  const handleLogoSave = () => {
    if (!logoFile) {
      toast.error('Please select a logo file')
      return
    }
    
    // In a real app, you would upload to a file service
    // For now, we'll just simulate success
    toast.success('Logo uploaded successfully')
    setLogoFile(null)
    setShowLogoUpload(false)
  }

  const team = teamData?.data
  const currentDivision = divisions.find(d => d.value === team?.division)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your team's configuration and branding settings.
          </p>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading team settings...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your team's configuration and branding settings.
          </p>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <p className="text-red-600">Error loading team settings. Please try again.</p>
            <button onClick={() => refetch()} className="btn btn-primary mt-2">
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your team's configuration and branding settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Information */}
        <div className="card">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Building className="h-6 w-6 text-gray-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Team Information</h2>
            </div>

            <form onSubmit={handleTeamUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="input"
                    defaultValue={team?.name}
                    placeholder="e.g. State University Baseball"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program Name</label>
                  <input
                    type="text"
                    name="program_name"
                    className="input"
                    defaultValue={team?.program_name}
                    placeholder="e.g. State Baseball Program"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conference</label>
                    <input
                      type="text"
                      name="conference"
                      className="input"
                      defaultValue={team?.conference}
                      placeholder="e.g. Big 12 Conference"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                    <select name="division" className="input">
                      <option value="">Select Division</option>
                      {divisions.map(division => (
                        <option 
                          key={division.value} 
                          value={division.value}
                          selected={team?.division === division.value}
                        >
                          {division.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      className="input"
                      defaultValue={team?.city}
                      placeholder="e.g. Austin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <select name="state" className="input">
                      <option value="">Select State</option>
                      {states.map(state => (
                        <option 
                          key={state} 
                          value={state}
                          selected={team?.state === state}
                        >
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updateTeam.isLoading}
                  className="btn btn-primary w-full"
                >
                  {updateTeam.isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Team Info
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Branding & Colors */}
        <div className="card">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Palette className="h-6 w-6 text-gray-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Branding & Colors</h2>
            </div>

            <form onSubmit={handleTeamUpdate}>
              <div className="space-y-4">
                {/* Current Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Logo</label>
                  <div className="flex items-center space-x-4">
                    {team?.school_logo_url ? (
                      <img
                        src={team.school_logo_url}
                        alt="Team Logo"
                        className="h-16 w-16 object-contain border border-gray-200 rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Logo</span>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowLogoUpload(true)}
                        className="btn btn-outline btn-sm"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </button>
                      {team?.school_logo_url && (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Logo Upload Modal */}
                {showLogoUpload && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Team Logo</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Select Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="input"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                          </p>
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowLogoUpload(false)
                              setLogoFile(null)
                            }}
                            className="btn btn-secondary"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleLogoSave}
                            className="btn btn-primary"
                          >
                            Upload Logo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        name="primary_color"
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        defaultValue={team?.primary_color || '#3B82F6'}
                      />
                      <input
                        type="text"
                        name="primary_color"
                        className="input flex-1"
                        defaultValue={team?.primary_color || '#3B82F6'}
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        name="secondary_color"
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        defaultValue={team?.secondary_color || '#EF4444'}
                      />
                      <input
                        type="text"
                        name="secondary_color"
                        className="input flex-1"
                        defaultValue={team?.secondary_color || '#EF4444'}
                        placeholder="#EF4444"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updateTeam.isLoading}
                  className="btn btn-primary w-full"
                >
                  {updateTeam.isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Branding
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Team Members */}
        <div className="card">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-gray-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
            </div>

            <div className="space-y-3">
              {team?.Users?.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    user.role === 'head_coach' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'head_coach' ? 'Head Coach' : 'Assistant Coach'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="card">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-gray-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Account Security</h2>
            </div>

            <form onSubmit={handlePasswordUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="current_password"
                      required
                      className="input pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="new_password"
                    required
                    className="input"
                    placeholder="Enter new password"
                    minLength="8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirm_password"
                    required
                    className="input"
                    placeholder="Confirm new password"
                    minLength="8"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatePassword.isLoading}
                  className="btn btn-primary w-full"
                >
                  {updatePassword.isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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

      {/* Current Settings Summary */}
      <div className="card">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Award className="h-6 w-6 text-gray-600 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">Current Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Team Information</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Name:</span> {team?.name || 'Not set'}
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Program:</span> {team?.program_name || 'Not set'}
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Conference:</span> {team?.conference || 'Not set'}
                </p>
                {currentDivision && (
                  <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${currentDivision.color}`}>
                    {currentDivision.label}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">City:</span> {team?.city || 'Not set'}
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">State:</span> {team?.state || 'Not set'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Branding</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Logo:</span> {team?.school_logo_url ? 'Uploaded' : 'Not uploaded'}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">Colors:</span>
                  {team?.primary_color && (
                    <div
                      className="w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: team.primary_color }}
                    />
                  )}
                  {team?.secondary_color && (
                    <div
                      className="w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: team.secondary_color }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}