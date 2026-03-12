import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsService } from '../services/teams';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Save,
  Building2,
  MapPin,
  Palette,
  Users
} from 'lucide-react';
import { Spinner, Button } from '@heroui/react';

const CreateTeam = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    program_name: '',
    conference: '',
    division: '',
    city: '',
    state: '',
    primary_color: '#3B82F6',
    secondary_color: '#EF4444'
  });

  // Create team mutation
  const createTeamMutation = useMutation({
    mutationFn: teamsService.createTeam,
    onSuccess: (data) => {
      toast.success('Team created successfully!');
      queryClient.invalidateQueries(['teams']);
      navigate('/teams');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create team');
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

    if (!formData.name) {
      toast.error('Please enter a team name');
      return;
    }

    createTeamMutation.mutate(formData);
  };

  const divisions = ['D1', 'D2', 'D3', 'NAIA', 'JUCO'];
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={() => navigate('/teams')} size="sm" variant="light">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Teams
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create New Team
          </h1>
          <p className="text-foreground/70">
            Add a new team to the system
          </p>
        </div>

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
                    <span className="label-text">Team Name *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Los Angeles Angels"
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Program Name</span>
                  </label>
                  <input
                    type="text"
                    name="program_name"
                    value={formData.program_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Arizona Bridge Program"
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
                    value={formData.conference}
                    onChange={handleInputChange}
                    placeholder="e.g., American League West"
                    className="input input-bordered"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Division</span>
                  </label>
                  <select
                    name="division"
                    value={formData.division}
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
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., Los Angeles"
                    className="input input-bordered"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">State</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
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
                      value={formData.primary_color}
                      onChange={handleInputChange}
                      className="w-12 h-12 rounded border cursor-pointer"
                    />
                    <input
                      type="text"
                      name="primary_color"
                      value={formData.primary_color}
                      onChange={handleInputChange}
                      className="input input-bordered flex-1"
                      placeholder="#3B82F6"
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
                      value={formData.secondary_color}
                      onChange={handleInputChange}
                      className="w-12 h-12 rounded border cursor-pointer"
                    />
                    <input
                      type="text"
                      name="secondary_color"
                      value={formData.secondary_color}
                      onChange={handleInputChange}
                      className="input input-bordered flex-1"
                      placeholder="#EF4444"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" onClick={() => navigate('/teams')} variant="bordered">
              Cancel
            </Button>
            <Button type="submit" disabled={createTeamMutation.isLoading} color="primary">
              {createTeamMutation.isLoading ? (
                <>
                  <Spinner size="sm" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Team
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
