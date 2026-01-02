import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Target, Plus, Search, Filter, Phone, Mail, Building2, UserCheck, Edit, Trash2, Eye, MapPin, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import scoutService from '../services/scouts';
import { useDebounce } from '../hooks/useDebounce';

const Scouts = () => {
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
  const [selectedScout, setSelectedScout] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    organization_name: '',
    position: '',
    phone: '',
    email: '',
    notes: '',
    last_contact_date: '',
    next_contact_date: '',
    contact_notes: '',
    coverage_area: '',
    specialization: ''
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      organization_name: '',
      position: '',
      phone: '',
      email: '',
      notes: '',
      last_contact_date: '',
      next_contact_date: '',
      contact_notes: '',
      coverage_area: '',
      specialization: ''
    });
  };

  // Position options
  const positionOptions = [
    'Area Scout',
    'Cross Checker',
    'National Cross Checker',
    'Scouting Director'
  ];

  // Debounce the search input to avoid excessive API calls
  const debouncedSearch = useDebounce(filters.search, 300);

  // Create filters object with debounced search for API calls
  const queryFilters = {
    ...filters,
    search: debouncedSearch
  };

  // Fetch scouts
  const { data: scoutsData, isLoading, error, refetch } = useQuery({
    queryKey: ['scouts', queryFilters],
    queryFn: () => scoutService.getScouts(queryFilters),
    placeholderData: (previousData) => previousData,
    staleTime: 30000
  });

  // Create scout mutation
  const createScoutMutation = useMutation({
    mutationFn: scoutService.createScout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scouts'] });
      toast.success('Scout added successfully');
      setShowCreateModal(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to add scout');
    }
  });

  // Update scout mutation
  const updateScoutMutation = useMutation({
    mutationFn: ({ id, data }) => scoutService.updateScout(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scouts'] });
      toast.success('Scout updated successfully');
      setShowEditModal(false);
      setSelectedScout(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update scout');
    }
  });

  // Delete scout mutation
  const deleteScoutMutation = useMutation({
    mutationFn: scoutService.deleteScout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scouts'] });
      toast.success('Scout deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete scout');
    }
  });

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
    if (selectedScout) {
      updateScoutMutation.mutate({ id: selectedScout.id, data: formData });
    } else {
      createScoutMutation.mutate(formData);
    }
  };

  // Handle edit
  const handleEdit = (scout) => {
    setSelectedScout(scout);
    setFormData({
      first_name: scout.first_name || '',
      last_name: scout.last_name || '',
      organization_name: scout.organization_name || '',
      position: scout.position || '',
      phone: scout.phone || '',
      email: scout.email || '',
      notes: scout.notes || '',
      last_contact_date: scout.last_contact_date || '',
      next_contact_date: scout.next_contact_date || '',
      contact_notes: scout.contact_notes || '',
      coverage_area: scout.coverage_area || '',
      specialization: scout.specialization || ''
    });
    setShowEditModal(true);
  };

  // Handle delete
  const handleDelete = (scout) => {
    if (window.confirm(`Are you sure you want to delete ${scout.first_name} ${scout.last_name}?`)) {
      deleteScoutMutation.mutate(scout.id);
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

  // Get scouts array safely
  const scouts = Array.isArray(scoutsData?.data) ? scoutsData.data : [];
  const pagination = scoutsData?.pagination || {};

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-600">Error loading scouts: {error.message}</p>
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
          <Target className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Scouts</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your professional scout contacts and networks
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Scout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Total Scouts</h3>
                <p className="text-2xl font-bold">{pagination.total || 0}</p>
              </div>
              <Target className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-r from-green-500 to-green-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Area Scouts</h3>
                <p className="text-2xl font-bold">{scouts.filter(s => s.position === 'Area Scout').length}</p>
              </div>
              <MapPin className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-r from-yellow-500 to-yellow-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Cross Checkers</h3>
                <p className="text-2xl font-bold">{scouts.filter(s => s.position === 'Cross Checker' || s.position === 'National Cross Checker').length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Directors</h3>
                <p className="text-2xl font-bold">{scouts.filter(s => s.position === 'Scouting Director').length}</p>
              </div>
              <Award className="w-8 h-8 text-white/60" />
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
                  placeholder="Search scouts by name, organization, area, or specialization..."
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

      {/* Scouts List */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="mt-2">Loading scouts...</p>
            </div>
          ) : scouts.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Scouts Found</h3>
              <p className="text-gray-500 mb-4">
                {filters.search || filters.position 
                  ? 'No scouts match your current filters.'
                  : 'Get started by adding your first scout contact.'
                }
              </p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Scout
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Organization</th>
                    <th>Position</th>
                    <th>Coverage/Specialization</th>
                    <th>Contact</th>
                    <th>Last Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scouts.map((scout) => (
                    <tr key={scout.id}>
                      <td>
                        <div className="font-semibold">
                          {scout.first_name} {scout.last_name}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-gray-600">
                          {scout.organization_name}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-outline">
                          {scout.position}
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          {scout.coverage_area && (
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="w-3 h-3" />
                              {scout.coverage_area}
                            </div>
                          )}
                          {scout.specialization && (
                            <div className="flex items-center gap-1 text-sm">
                              <Award className="w-3 h-3" />
                              {scout.specialization}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          {scout.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3" />
                              {scout.phone}
                            </div>
                          )}
                          {scout.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="w-3 h-3" />
                              {scout.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {scout.last_contact_date ? 
                            new Date(scout.last_contact_date).toLocaleDateString() : 
                            'Never'
                          }
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(scout)}
                            className="btn btn-sm btn-ghost"
                            title="Edit Scout"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(scout)}
                            className="btn btn-sm btn-ghost text-red-600"
                            title="Delete Scout"
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
      {(showCreateModal || showEditModal) && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              {selectedScout ? 'Edit Scout' : 'Add New Scout'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name *</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
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
                    className="input input-bordered"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Organization Name *</span>
                </label>
                <input
                  type="text"
                  name="organization_name"
                  placeholder="e.g. MLB, Perfect Game, Travel Ball Team"
                  className="input input-bordered"
                  value={formData.organization_name}
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
                    <option value="">Select Position</option>
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
                  className="input input-bordered"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Coverage Area</span>
                  </label>
                  <input
                    type="text"
                    name="coverage_area"
                    placeholder="e.g. Southeast Region, Texas, California"
                    className="input input-bordered"
                    value={formData.coverage_area}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Specialization</span>
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    placeholder="e.g. Pitchers, Catchers, Power Hitters"
                    className="input input-bordered"
                    value={formData.specialization}
                    onChange={handleInputChange}
                  />
                </div>
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
                  <span className="label-text">Notes</span>
                </label>
                <textarea
                  name="notes"
                  className="textarea textarea-bordered h-24"
                  placeholder="Any additional notes about this scout..."
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Contact Notes</span>
                </label>
                <textarea
                  name="contact_notes"
                  className="textarea textarea-bordered h-24"
                  placeholder="Notes about recent communications..."
                  value={formData.contact_notes}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setSelectedScout(null);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createScoutMutation.isPending || updateScoutMutation.isPending}
                >
                  {createScoutMutation.isPending || updateScoutMutation.isPending ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    selectedScout ? 'Update Scout' : 'Add Scout'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scouts;
