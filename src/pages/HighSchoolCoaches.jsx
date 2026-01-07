import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import highSchoolCoachService from '../services/highSchoolCoaches';
import toast from 'react-hot-toast';
import AccessibleModal from '../components/ui/AccessibleModal';
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Users,
  Trophy,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  Calendar,
  Award
} from 'lucide-react';

const positions = [
  'Head Coach',
  'Assistant Coach', 
  'JV Coach',
  'Freshman Coach',
  'Pitching Coach',
  'Hitting Coach'
];

const relationshipTypes = [
  'Recruiting Contact',
  'Former Player',
  'Coaching Connection',
  'Tournament Contact',
  'Camp Contact',
  'Other'
];

const schoolClassifications = [
  '1A', '2A', '3A', '4A', '5A', '6A', 'Private'
];

const statusOptions = [
  { value: 'active', label: 'Active', color: 'badge-success' },
  { value: 'inactive', label: 'Inactive', color: 'badge-neutral' }
];

export default function HighSchoolCoaches() {
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    position: '',
    relationship_type: '',
    status: 'active',
    page: 1,
    limit: 20
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [coachForm, setCoachForm] = useState({
    first_name: '',
    last_name: '',
    school_name: '',
    school_district: '',
    position: 'Head Coach',
    phone: '',
    email: '',
    city: '',
    state: '',
    region: '',
    years_coaching: '',
    conference: '',
    school_classification: '',
    relationship_type: 'Recruiting Contact',
    notes: '',
    last_contact_date: '',
    next_contact_date: '',
    contact_notes: '',
    players_sent_count: 0
  });

  const queryClient = useQueryClient();

  // Fetch coaches
  const { data: coachesResponse, isLoading, error } = useQuery({
    queryKey: ['high-school-coaches', filters],
    queryFn: () => highSchoolCoachService.getHighSchoolCoaches(filters),
    keepPreviousData: true
  });

  const coaches = coachesResponse?.data || [];
  const pagination = coachesResponse?.pagination || {};

  // Mutations
  const createCoachMutation = useMutation({
    mutationFn: highSchoolCoachService.createHighSchoolCoach,
    onSuccess: () => {
      toast.success('High school coach created successfully!');
      queryClient.invalidateQueries(['high-school-coaches']);
      setShowCreateModal(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create coach');
    }
  });

  const updateCoachMutation = useMutation({
    mutationFn: ({ id, data }) => highSchoolCoachService.updateHighSchoolCoach(id, data),
    onSuccess: () => {
      toast.success('High school coach updated successfully!');
      queryClient.invalidateQueries(['high-school-coaches']);
      setShowEditModal(false);
      setSelectedCoach(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update coach');
    }
  });

  const deleteCoachMutation = useMutation({
    mutationFn: highSchoolCoachService.deleteHighSchoolCoach,
    onSuccess: () => {
      toast.success('High school coach deleted successfully!');
      queryClient.invalidateQueries(['high-school-coaches']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete coach');
    }
  });

  const resetForm = () => {
    setCoachForm({
      first_name: '',
      last_name: '',
      school_name: '',
      school_district: '',
      position: 'Head Coach',
      phone: '',
      email: '',
      city: '',
      state: '',
      region: '',
      years_coaching: '',
      conference: '',
      school_classification: '',
      relationship_type: 'Recruiting Contact',
      notes: '',
      last_contact_date: '',
      next_contact_date: '',
      contact_notes: '',
      players_sent_count: 0
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleCreateCoach = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleEditCoach = (coach) => {
    setSelectedCoach(coach);
    setCoachForm({
      first_name: coach.first_name || '',
      last_name: coach.last_name || '',
      school_name: coach.school_name || '',
      school_district: coach.school_district || '',
      position: coach.position || 'Head Coach',
      phone: coach.phone || '',
      email: coach.email || '',
      city: coach.city || '',
      state: coach.state || '',
      region: coach.region || '',
      years_coaching: coach.years_coaching || '',
      conference: coach.conference || '',
      school_classification: coach.school_classification || '',
      relationship_type: coach.relationship_type || 'Recruiting Contact',
      notes: coach.notes || '',
      last_contact_date: coach.last_contact_date || '',
      next_contact_date: coach.next_contact_date || '',
      contact_notes: coach.contact_notes || '',
      players_sent_count: coach.players_sent_count || 0
    });
    setShowEditModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!coachForm.first_name.trim() || !coachForm.last_name.trim() || !coachForm.school_name.trim()) {
      toast.error('First name, last name, and school name are required');
      return;
    }

    const data = { ...coachForm };
    
    if (showEditModal && selectedCoach) {
      updateCoachMutation.mutate({ id: selectedCoach.id, data });
    } else {
      createCoachMutation.mutate(data);
    }
  };

  const handleDelete = (coach) => {
    if (confirm(`Are you sure you want to delete ${coach.first_name} ${coach.last_name}?`)) {
      deleteCoachMutation.mutate(coach.id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-base-content mb-2">
                High School Coaches
              </h1>
              <p className="text-base-content/70">
                Manage relationships with high school coaches for recruiting
              </p>
            </div>
            <button
              onClick={handleCreateCoach}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Coach
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Search</span>
                </label>
                <input
                  type="text"
                  placeholder="Search coaches..."
                  className="input input-bordered"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">State</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., TX"
                  className="input input-bordered"
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Position</span>
                </label>
                <select
                  className="select select-bordered"
                  value={filters.position}
                  onChange={(e) => handleFilterChange('position', e.target.value)}
                >
                  <option value="">All Positions</option>
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Relationship</span>
                </label>
                <select
                  className="select select-bordered"
                  value={filters.relationship_type}
                  onChange={(e) => handleFilterChange('relationship_type', e.target.value)}
                >
                  <option value="">All Types</option>
                  {relationshipTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  className="select select-bordered"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Status</option>
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Coaches Table */}
        <div className="card">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Coach</th>
                    <th>School</th>
                    <th>Position</th>
                    <th>Location</th>
                    <th>Relationship</th>
                    <th>Players Sent</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coaches.map((coach) => (
                    <tr key={coach.id}>
                      <td>
                        <div>
                          <div className="font-medium">{coach.first_name} {coach.last_name}</div>
                          {coach.email && (
                            <div className="text-sm text-base-content/70 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {coach.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">{coach.school_name}</div>
                          {coach.school_district && (
                            <div className="text-sm text-base-content/70">{coach.school_district}</div>
                          )}
                          {coach.conference && (
                            <div className="text-xs badge badge-outline">{coach.conference}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-outline">{coach.position}</div>
                      </td>
                      <td>
                        <div>
                          {coach.city && coach.state ? `${coach.city}, ${coach.state}` : coach.city || coach.state || 'N/A'}
                          {coach.school_classification && (
                            <div className="text-xs badge badge-secondary mt-1">{coach.school_classification}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-outline">{coach.relationship_type}</div>
                      </td>
                      <td>
                        <div className="flex items-center">
                          <Trophy className="h-4 w-4 mr-1 text-warning" />
                          <span className="font-medium">{coach.players_sent_count}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleEditCoach(coach)}
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline btn-error"
                            onClick={() => handleDelete(coach)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {coaches.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="h-16 w-16 mx-auto mb-4 text-base-content/30" />
                <h3 className="text-lg font-semibold text-base-content mb-2">No High School Coaches Found</h3>
                <p className="text-base-content/70 mb-4">
                  Add your first high school coach contact to start building recruiting relationships.
                </p>
                <button
                  onClick={handleCreateCoach}
                  className="btn btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Coach
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Modal */}
        <AccessibleModal
          isOpen={showCreateModal || showEditModal}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setSelectedCoach(null);
            resetForm();
          }}
          title={showEditModal ? 'Edit High School Coach' : 'Add New High School Coach'}
          size="lg"
        >
          <AccessibleModal.Header
            title={showEditModal ? 'Edit High School Coach' : 'Add New High School Coach'}
            onClose={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              setSelectedCoach(null);
              resetForm();
            }}
          />
          <AccessibleModal.Content>
            <form onSubmit={handleSubmit} id="high-school-coach-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-base-content">Personal Information</h4>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">First Name *</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={coachForm.first_name}
                        onChange={(e) => setCoachForm(prev => ({ ...prev, first_name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Last Name *</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={coachForm.last_name}
                        onChange={(e) => setCoachForm(prev => ({ ...prev, last_name: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Position *</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={coachForm.position}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, position: e.target.value }))}
                      required
                    >
                      {positions.map(position => (
                        <option key={position} value={position}>{position}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered"
                      value={coachForm.email}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone</span>
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered"
                      value={coachForm.phone}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Years Coaching</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      className="input input-bordered"
                      value={coachForm.years_coaching}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, years_coaching: e.target.value }))}
                    />
                  </div>
                </div>

                {/* School Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-base-content">School Information</h4>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">School Name *</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={coachForm.school_name}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, school_name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">School District</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={coachForm.school_district}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, school_district: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">City</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={coachForm.city}
                        onChange={(e) => setCoachForm(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">State</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        placeholder="TX"
                        value={coachForm.state}
                        onChange={(e) => setCoachForm(prev => ({ ...prev, state: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Conference</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={coachForm.conference}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, conference: e.target.value }))}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">School Classification</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={coachForm.school_classification}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, school_classification: e.target.value }))}
                    >
                      <option value="">Select Classification</option>
                      {schoolClassifications.map(classification => (
                        <option key={classification} value={classification}>{classification}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Relationship Type</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={coachForm.relationship_type}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, relationship_type: e.target.value }))}
                    >
                      {relationshipTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Players Sent to Program</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="input input-bordered"
                      value={coachForm.players_sent_count}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, players_sent_count: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Notes</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    rows="3"
                    value={coachForm.notes}
                    onChange={(e) => setCoachForm(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
            </form>
          </AccessibleModal.Content>
          <AccessibleModal.Footer>
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                setSelectedCoach(null);
                resetForm();
              }}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="high-school-coach-form"
              disabled={createCoachMutation.isLoading || updateCoachMutation.isLoading}
              className="btn btn-primary"
            >
              {createCoachMutation.isLoading || updateCoachMutation.isLoading ? (
                <>
                  <div className="loading loading-spinner loading-sm"></div>
                  {showEditModal ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {showEditModal ? 'Update Coach' : 'Create Coach'}
                </>
              )}
            </button>
          </AccessibleModal.Footer>
        </AccessibleModal>
      </div>
    </div>
  );
}
