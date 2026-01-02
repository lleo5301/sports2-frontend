import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import vendorService from '../services/vendors';
import toast from 'react-hot-toast';
import { useDebounce } from '../hooks/useDebounce';
import {
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  DollarSign,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  Save
} from 'lucide-react';

const vendorTypes = [
  'Equipment',
  'Apparel', 
  'Technology',
  'Food Service',
  'Transportation',
  'Medical',
  'Facilities',
  'Other'
];

const statusOptions = [
  { value: 'active', label: 'Active', color: 'badge-success' },
  { value: 'inactive', label: 'Inactive', color: 'badge-neutral' },
  { value: 'pending', label: 'Pending', color: 'badge-warning' },
  { value: 'expired', label: 'Expired', color: 'badge-error' }
];

export default function Vendors() {
  const [filters, setFilters] = useState({
    search: '',
    vendor_type: '',
    status: 'active',
    page: 1,
    limit: 20
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorForm, setVendorForm] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    website: '',
    vendor_type: 'Equipment',
    services_provided: '',
    contract_start_date: '',
    contract_end_date: '',
    contract_value: '',
    payment_terms: '',
    notes: '',
    last_contact_date: '',
    next_contact_date: '',
    contact_notes: ''
  });

  const queryClient = useQueryClient();

  // Debounce the search input to avoid excessive API calls
  const debouncedSearch = useDebounce(filters.search, 300);

  // Create filters object with debounced search for API calls
  const queryFilters = {
    ...filters,
    search: debouncedSearch
  };

  // Fetch vendors
  const { data: vendorsResponse, isLoading, error } = useQuery({
    queryKey: ['vendors', queryFilters],
    queryFn: () => vendorService.getVendors(queryFilters),
    keepPreviousData: true
  });

  const vendors = vendorsResponse?.data || [];
  const pagination = vendorsResponse?.pagination || {};

  // Mutations
  const createVendorMutation = useMutation({
    mutationFn: vendorService.createVendor,
    onSuccess: () => {
      toast.success('Vendor created successfully!');
      queryClient.invalidateQueries(['vendors']);
      setShowCreateModal(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create vendor');
    }
  });

  const updateVendorMutation = useMutation({
    mutationFn: ({ id, data }) => vendorService.updateVendor(id, data),
    onSuccess: () => {
      toast.success('Vendor updated successfully!');
      queryClient.invalidateQueries(['vendors']);
      setShowEditModal(false);
      setSelectedVendor(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update vendor');
    }
  });

  const deleteVendorMutation = useMutation({
    mutationFn: vendorService.deleteVendor,
    onSuccess: () => {
      toast.success('Vendor deleted successfully!');
      queryClient.invalidateQueries(['vendors']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete vendor');
    }
  });

  const resetForm = () => {
    setVendorForm({
      company_name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      website: '',
      vendor_type: 'Equipment',
      services_provided: '',
      contract_start_date: '',
      contract_end_date: '',
      contract_value: '',
      payment_terms: '',
      notes: '',
      last_contact_date: '',
      next_contact_date: '',
      contact_notes: ''
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleCreateVendor = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleEditVendor = (vendor) => {
    setSelectedVendor(vendor);
    setVendorForm({
      company_name: vendor.company_name || '',
      contact_person: vendor.contact_person || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      address: vendor.address || '',
      city: vendor.city || '',
      state: vendor.state || '',
      zip_code: vendor.zip_code || '',
      website: vendor.website || '',
      vendor_type: vendor.vendor_type || 'Equipment',
      services_provided: vendor.services_provided || '',
      contract_start_date: vendor.contract_start_date || '',
      contract_end_date: vendor.contract_end_date || '',
      contract_value: vendor.contract_value || '',
      payment_terms: vendor.payment_terms || '',
      notes: vendor.notes || '',
      last_contact_date: vendor.last_contact_date || '',
      next_contact_date: vendor.next_contact_date || '',
      contact_notes: vendor.contact_notes || ''
    });
    setShowEditModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!vendorForm.company_name.trim()) {
      toast.error('Company name is required');
      return;
    }

    const data = { ...vendorForm };
    
    if (showEditModal && selectedVendor) {
      updateVendorMutation.mutate({ id: selectedVendor.id, data });
    } else {
      createVendorMutation.mutate(data);
    }
  };

  const handleDelete = (vendor) => {
    if (confirm(`Are you sure you want to delete ${vendor.company_name}?`)) {
      deleteVendorMutation.mutate(vendor.id);
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
                Vendors
              </h1>
              <p className="text-base-content/70">
                Manage your team's vendor relationships and contracts
              </p>
            </div>
            <button
              onClick={handleCreateVendor}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Search</span>
                </label>
                <input
                  type="text"
                  placeholder="Search vendors..."
                  className="input input-bordered"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Vendor Type</span>
                </label>
                <select
                  className="select select-bordered"
                  value={filters.vendor_type}
                  onChange={(e) => handleFilterChange('vendor_type', e.target.value)}
                >
                  <option value="">All Types</option>
                  {vendorTypes.map(type => (
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

        {/* Vendors Table */}
        <div className="card">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Contact</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Contract</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr key={vendor.id}>
                      <td>
                        <div>
                          <div className="font-medium">{vendor.company_name}</div>
                          {vendor.contact_person && (
                            <div className="text-sm text-base-content/70">{vendor.contact_person}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          {vendor.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1" />
                              {vendor.email}
                            </div>
                          )}
                          {vendor.phone && (
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1" />
                              {vendor.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-outline">{vendor.vendor_type}</div>
                      </td>
                      <td>
                        {vendor.city && vendor.state ? `${vendor.city}, ${vendor.state}` : vendor.city || vendor.state || 'N/A'}
                      </td>
                      <td>
                        <div className={`badge ${statusOptions.find(s => s.value === vendor.status)?.color || 'badge-neutral'}`}>
                          {vendor.status}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {vendor.contract_value && (
                            <div className="font-medium">${parseFloat(vendor.contract_value).toLocaleString()}</div>
                          )}
                          {vendor.contract_end_date && (
                            <div className="text-base-content/70">
                              Expires: {new Date(vendor.contract_end_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleEditVendor(vendor)}
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline btn-error"
                            onClick={() => handleDelete(vendor)}
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

            {vendors.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-base-content/30" />
                <h3 className="text-lg font-semibold text-base-content mb-2">No Vendors Found</h3>
                <p className="text-base-content/70 mb-4">
                  Add your first vendor to start managing vendor relationships.
                </p>
                <button
                  onClick={handleCreateVendor}
                  className="btn btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vendor
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Modal */}
        {(showCreateModal || showEditModal) && (
          <div className="modal modal-open">
            <div className="modal-box max-w-4xl">
              <h3 className="font-bold text-lg mb-4">
                {showEditModal ? 'Edit Vendor' : 'Add New Vendor'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base-content">Company Information</h4>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Company Name *</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={vendorForm.company_name}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, company_name: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Contact Person</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={vendorForm.contact_person}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, contact_person: e.target.value }))}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Vendor Type *</span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={vendorForm.vendor_type}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, vendor_type: e.target.value }))}
                        required
                      >
                        {vendorTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Services Provided</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered"
                        rows="3"
                        value={vendorForm.services_provided}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, services_provided: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Contact & Location */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base-content">Contact & Location</h4>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        className="input input-bordered"
                        value={vendorForm.email}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Phone</span>
                      </label>
                      <input
                        type="tel"
                        className="input input-bordered"
                        value={vendorForm.phone}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Website</span>
                      </label>
                      <input
                        type="url"
                        className="input input-bordered"
                        value={vendorForm.website}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Address</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered"
                        rows="2"
                        value={vendorForm.address}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, address: e.target.value }))}
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
                          value={vendorForm.city}
                          onChange={(e) => setVendorForm(prev => ({ ...prev, city: e.target.value }))}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">State</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={vendorForm.state}
                          onChange={(e) => setVendorForm(prev => ({ ...prev, state: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract Information */}
                <div className="mt-6">
                  <h4 className="font-semibold text-base-content mb-4">Contract Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Contract Start Date</span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered"
                        value={vendorForm.contract_start_date}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, contract_start_date: e.target.value }))}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Contract End Date</span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered"
                        value={vendorForm.contract_end_date}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, contract_end_date: e.target.value }))}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Contract Value</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="input input-bordered"
                        placeholder="0.00"
                        value={vendorForm.contract_value}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, contract_value: e.target.value }))}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Payment Terms</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        placeholder="e.g., Net 30"
                        value={vendorForm.payment_terms}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, payment_terms: e.target.value }))}
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
                      value={vendorForm.notes}
                      onChange={(e) => setVendorForm(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setSelectedVendor(null);
                      resetForm();
                    }}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createVendorMutation.isLoading || updateVendorMutation.isLoading}
                    className="btn btn-primary"
                  >
                    {createVendorMutation.isLoading || updateVendorMutation.isLoading ? (
                      <>
                        <div className="loading loading-spinner loading-sm"></div>
                        {showEditModal ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {showEditModal ? 'Update Vendor' : 'Create Vendor'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
