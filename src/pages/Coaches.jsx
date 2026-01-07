import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Plus, Search, Filter, Phone, Mail, School, UserCheck, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import coachService from '../services/coaches';
import AccessibleModal from '../components/ui/AccessibleModal';

const Coaches = () => {
  const queryClient = useQueryClient();

  // State for filters and pagination
  const [filters, setFilters] = useState({
    search: '',
    status: 'active',
    position: '',
    page: 1,
    limit: 20
  });

  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    school_name: '',
    position: '',
    phone: '',
    email: '',
    notes: '',
    last_contact_date: '',
    next_contact_date: '',
    contact_notes: ''
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      school_name: '',
      position: '',
      phone: '',
      email: '',
      notes: '',
      last_contact_date: '',
      next_contact_date: '',
      contact_notes: ''
    });
  };

  // Position options
  const positionOptions = [
    'Head Coach',
    'Recruiting Coordinator', 
    'Pitching Coach',
    'Volunteer'
  ];

  // Fetch coaches
  const { data: coachesData, isLoading, error, refetch } = useQuery({
    queryKey: ['coaches', filters],
    queryFn: () => coachService.getCoaches(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 30000
  });

  // Create coach mutation
  const createCoachMutation = useMutation({
    mutationFn: coachService.createCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
      toast.success('Coach added successfully');
      setShowCreateModal(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Create coach error:', error);
      toast.error(error.response?.data?.error || 'Failed to add coach');
    }
  });

  // Update coach mutation
  const updateCoachMutation = useMutation({
    mutationFn: ({ id, data }) => coachService.updateCoach(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
      toast.success('Coach updated successfully');
      setShowEditModal(false);
      setSelectedCoach(null);
      resetForm();
    },
    onError: (error) => {
      console.error('Update coach error:', error);
      toast.error(error.response?.data?.error || 'Failed to update coach');
    }
  });

  // Delete coach mutation
  const deleteCoachMutation = useMutation({
    mutationFn: coachService.deleteCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
      toast.success('Coach deleted successfully');
    },
    onError: (error) => {
      console.error('Delete coach error:', error);
      toast.error(error.response?.data?.error || 'Failed to delete coach');
    }
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: () => coachService.bulkDeleteCoaches(selectedIds),
    onSuccess: (data) => {
      const count = data.data?.deletedCount || selectedIds.length;
      toast.success(`Successfully deleted ${count} coach${count !== 1 ? 'es' : ''}!`);
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
      setSelectedIds([]);
      setShowDeleteConfirm(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete coaches');
    }
  });

  // Clear selection when filters change
  React.useEffect(() => {
    setSelectedIds([]);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCoach) {
      updateCoachMutation.mutate({ id: selectedCoach.id, data: formData });
    } else {
      createCoachMutation.mutate(formData);
    }
  };

  // Handle edit
  const handleEdit = (coach) => {
    setSelectedCoach(coach);
    setFormData({
      first_name: coach.first_name || '',
      last_name: coach.last_name || '',
      school_name: coach.school_name || '',
      position: coach.position || '',
      phone: coach.phone || '',
      email: coach.email || '',
      notes: coach.notes || '',
      last_contact_date: coach.last_contact_date || '',
      next_contact_date: coach.next_contact_date || '',
      contact_notes: coach.contact_notes || ''
    });
    setShowEditModal(true);
  };

  // Handle delete
  const handleDelete = (coach) => {
    if (window.confirm(`Are you sure you want to delete ${coach.first_name} ${coach.last_name}?`)) {
      deleteCoachMutation.mutate(coach.id);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(coaches.map(coach => coach.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Handle select one
  const handleSelectOne = (coachId) => {
    setSelectedIds(prev => {
      if (prev.includes(coachId)) {
        return prev.filter(id => id !== coachId);
      } else {
        return [...prev, coachId];
      }
    });
  };

  // Get coaches array safely
  const coaches = Array.isArray(coachesData?.data) ? coachesData.data : [];
  const pagination = coachesData?.pagination || {};

  // Computed selection states
  const isAllSelected = coaches.length > 0 && selectedIds.length === coaches.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < coaches.length;

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-600">Error loading coaches: {error.message}</p>
          <button 
            onClick={() => refetch()} 
            className="btn btn-primary mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Coaches</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your coaching contacts and relationships
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button
              className="btn btn-error"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Coach
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Total Coaches</h3>
                <p className="text-2xl font-bold">{pagination.total || 0}</p>
              </div>
              <Users className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-r from-green-500 to-green-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Head Coaches</h3>
                <p className="text-2xl font-bold">{coaches.filter(c => c.position === 'Head Coach').length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-r from-yellow-500 to-yellow-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Recruiting Coord.</h3>
                <p className="text-2xl font-bold">{coaches.filter(c => c.position === 'Recruiting Coordinator').length}</p>
              </div>
              <School className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Active Contacts</h3>
                <p className="text-2xl font-bold">{coaches.filter(c => c.status === 'active').length}</p>
              </div>
              <Phone className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search coaches by name, school, or email..."
                  className="input input-bordered w-full pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                className="select select-bordered"
                value={filters.position}
                onChange={(e) => handleFilterChange('position', e.target.value)}
              >
                <option value="">All Positions</option>
                {positionOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <select 
                className="select select-bordered"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Coaches List */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="mt-2">Loading coaches...</p>
            </div>
          ) : coaches.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Coaches Found</h3>
              <p className="text-gray-500 mb-4">
                {filters.search || filters.position 
                  ? 'No coaches match your current filters.'
                  : 'Get started by adding your first coach contact.'
                }
              </p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Coach
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={isAllSelected}
                          onChange={handleSelectAll}
                          disabled={coaches.length === 0}
                        />
                      </label>
                    </th>
                    <th>Name</th>
                    <th>School</th>
                    <th>Position</th>
                    <th>Contact</th>
                    <th>Last Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coaches.map((coach) => (
                    <tr key={coach.id}>
                      <td>
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={selectedIds.includes(coach.id)}
                            onChange={() => handleSelectOne(coach.id)}
                          />
                        </label>
                      </td>
                      <td>
                        <div className="font-semibold">
                          {coach.first_name} {coach.last_name}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-gray-600">
                          {coach.school_name}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-outline">
                          {coach.position}
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          {coach.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3" />
                              {coach.phone}
                            </div>
                          )}
                          {coach.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="w-3 h-3" />
                              {coach.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {coach.last_contact_date ? 
                            new Date(coach.last_contact_date).toLocaleDateString() : 
                            'Never'
                          }
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(coach)}
                            className="btn btn-sm btn-ghost"
                            title="Edit Coach"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(coach)}
                            className="btn btn-sm btn-ghost text-red-600"
                            title="Delete Coach"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
        title={selectedCoach ? 'Edit Coach' : 'Add New Coach'}
        size="md"
      >
        <AccessibleModal.Header
          title={selectedCoach ? 'Edit Coach' : 'Add New Coach'}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setSelectedCoach(null);
            resetForm();
          }}
        />
        <AccessibleModal.Content>
          <form onSubmit={handleSubmit} id="coach-form" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name *</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="Enter first name"
                  className="input input-bordered"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Name *</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Enter last name"
                  className="input input-bordered"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">School Name *</span>
              </label>
              <input
                type="text"
                name="school_name"
                placeholder="Enter school name"
                className="input input-bordered"
                value={formData.school_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Position *</span>
                </label>
                <select
                  name="position"
                  className="select select-bordered"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a position</option>
                  {positionOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  className="input input-bordered"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                className="input input-bordered"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Notes</span>
              </label>
              <textarea
                name="notes"
                placeholder="Enter any additional notes"
                className="textarea textarea-bordered"
                rows="3"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Contact Date</span>
                </label>
                <input
                  type="date"
                  name="last_contact_date"
                  className="input input-bordered"
                  value={formData.last_contact_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Next Contact Date</span>
                </label>
                <input
                  type="date"
                  name="next_contact_date"
                  className="input input-bordered"
                  value={formData.next_contact_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Contact Notes</span>
              </label>
              <textarea
                name="contact_notes"
                placeholder="Enter notes about your last contact"
                className="textarea textarea-bordered"
                rows="3"
                value={formData.contact_notes}
                onChange={handleInputChange}
              />
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
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="coach-form"
            className="btn btn-primary"
            disabled={createCoachMutation.isPending || updateCoachMutation.isPending}
          >
            {createCoachMutation.isPending || updateCoachMutation.isPending ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              selectedCoach ? 'Update Coach' : 'Add Coach'
            )}
          </button>
        </AccessibleModal.Footer>
      </AccessibleModal>

      {/* Delete Confirmation Modal */}
      <AccessibleModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Coaches"
        size="sm"
      >
        <AccessibleModal.Header
          title="Delete Coaches"
          onClose={() => setShowDeleteConfirm(false)}
        />
        <AccessibleModal.Content>
          <p>Are you sure you want to delete {selectedIds.length} coach{selectedIds.length !== 1 ? 'es' : ''}? This action cannot be undone.</p>
        </AccessibleModal.Content>
        <AccessibleModal.Footer>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(false)}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => bulkDeleteMutation.mutate()}
            className="btn btn-error"
            disabled={bulkDeleteMutation.isPending}
          >
            {bulkDeleteMutation.isPending ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </AccessibleModal.Footer>
      </AccessibleModal>
    </div>
  );
};

export default Coaches;