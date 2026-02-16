import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsService } from '../services/teams';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Save,
  Edit,
  Building2,
  MapPin,
  Palette,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';
import { GenericPageSkeleton } from '../components/skeletons';

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch team data
  const { data: teamData, isLoading, error } = useQuery({
    queryKey: ['team', id],
    queryFn: () => teamsService.getTeam(id),
    onSuccess: (data) => {
      setFormData(data.data);
    }
  });

  // Update team mutation
  const updateTeamMutation = useMutation({
    mutationFn: teamsService.updateMyTeam,
    onSuccess: (data) => {
      toast.success('Team updated successfully!');
      queryClient.invalidateQueries(['team', id]);
      queryClient.invalidateQueries(['teams']);
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update team');
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateTeamMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData(teamData.data);
    setIsEditing(false);
  };

  const divisions = ['D1', 'D2', 'D3', 'NAIA', 'JUCO'];
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  if (isLoading) {
    return (
      <GenericPageSkeleton
        contentType="cards"
        showHeader={true}
        showDescription={true}
        showActionButton={true}
        itemCount={3}
        columns={1}
      />
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="alert alert-error">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Failed to load team details</span>
          </div>
        </div>
      </div>
    );
  }

  const team = teamData?.data;

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/teams')}
              className="btn btn-ghost btn-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Teams
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {isEditing ? 'Edit Team' : team?.name}
              </h1>
              <p className="text-foreground/70">
                {isEditing ? 'Update team information' : 'Team details and information'}
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Team
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Basic Information
                </h2>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Team Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Program Name</span>
                    </label>
                    <input
                      type="text"
                      name="program_name"
                      value={formData.program_name || ''}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Conference</span>
                    </label>
                    <input
                      type="text"
                      name="conference"
                      value={formData.conference || ''}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Division</span>
                    </label>
                    <select
                      name="division"
                      value={formData.division || ''}
                      onChange={handleInputChange}
                      className="select select-bordered"
                    >
                      <option value="">Select division...</option>
                      {divisions.map(division => (
                        <option key={division} value={division}>{division}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location Information
                </h2>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">City</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">State</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state || ''}
                      onChange={handleInputChange}
                      className="select select-bordered"
                    >
                      <option value="">Select state...</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Colors */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Team Colors
                </h2>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Primary Color</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name="primary_color"
                        value={formData.primary_color || '#3B82F6'}
                        onChange={handleInputChange}
                        className="w-12 h-12 rounded border cursor-pointer"
                      />
                      <input
                        type="text"
                        name="primary_color"
                        value={formData.primary_color || ''}
                        onChange={handleInputChange}
                        className="input input-bordered flex-1"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Secondary Color</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name="secondary_color"
                        value={formData.secondary_color || '#EF4444'}
                        onChange={handleInputChange}
                        className="w-12 h-12 rounded border cursor-pointer"
                      />
                      <input
                        type="text"
                        name="secondary_color"
                        value={formData.secondary_color || ''}
                        onChange={handleInputChange}
                        className="input input-bordered flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={updateTeamMutation.isLoading}
              >
                {updateTeamMutation.isLoading ? (
                  <>
                    <div className="loading loading-spinner loading-sm"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            {/* Team Overview */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Team Overview
                </h2>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="stat">
                    <div className="stat-title">Team Name</div>
                    <div className="stat-value text-lg">{team?.name}</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Program</div>
                    <div className="stat-value text-lg">{team?.program_name || 'N/A'}</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Division</div>
                    <div className="stat-value text-lg">{team?.division || 'N/A'}</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Conference</div>
                    <div className="stat-value text-lg">{team?.conference || 'N/A'}</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Location</div>
                    <div className="stat-value text-lg">
                      {team?.city && team?.state ? `${team.city}, ${team.state}` : 'N/A'}
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Team Members</div>
                    <div className="stat-value text-lg">{team?.Users?.length || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Colors Preview */}
            {(team?.primary_color || team?.secondary_color) && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Team Colors
                  </h2>
                </div>
                <div className="card-body">
                  <div className="flex gap-4">
                    {team?.primary_color && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: team.primary_color }}
                        ></div>
                        <span>Primary: {team.primary_color}</span>
                      </div>
                    )}
                    {team?.secondary_color && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: team.secondary_color }}
                        ></div>
                        <span>Secondary: {team.secondary_color}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Team Members */}
            {team?.Users && team.Users.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Members
                  </h2>
                </div>
                <div className="card-body">
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {team.Users.map((user) => (
                          <tr key={user.id}>
                            <td className="font-medium">
                              {user.first_name} {user.last_name}
                            </td>
                            <td>{user.email}</td>
                            <td>
                              <span className="badge badge-outline">{user.role}</span>
                            </td>
                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Quick Actions</h2>
              </div>
              <div className="card-body">
                <div className="flex flex-wrap gap-4">
                  <button className="btn btn-outline">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Members
                  </button>
                  <button className="btn btn-outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Schedule
                  </button>
                  <button className="btn btn-outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Team Stats
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetail;
