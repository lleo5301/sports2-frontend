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
import AccessibleModal from '../components/ui/AccessibleModal';

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
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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

  const bulkDeleteMutation = useMutation({
    mutationFn: () => vendorService.bulkDeleteVendors(selectedIds),
    onSuccess: (data) => {
      const count = data.data?.deletedCount || selectedIds.length;
      toast.success(`Successfully deleted ${count} vendor${count !== 1 ? 's' : ''}!`);
      queryClient.invalidateQueries(['vendors']);
      setSelectedIds([]);
      setShowDeleteConfirm(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete vendors');
    }
  });

  // Clear selection when filters change
  React.useEffect(() => {
    setSelectedIds([]);
  }, [filters]);

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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(vendors.map(vendor => vendor.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (vendorId) => {
    setSelectedIds(prev => {
      if (prev.includes(vendorId)) {
        return prev.filter(id => id !== vendorId);
      } else {
        return [...prev, vendorId];
      }
    });
  };

  const isAllSelected = vendors.length > 0 && selectedIds.length === vendors.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < vendors.length;

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
            <div className="flex gap-2">
              {selectedIds.length > 0 && (
                <button
                  className="btn btn-error"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedIds.length})
                </button>
              )}
              <button
                onClick={handleCreateVendor}
                className="btn btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </button>
            </div>
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
                    <th>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={isAllSelected}
                          onChange={handleSelectAll}
                          disabled={vendors.length === 0}
                        />
                      </label>
                    </th>
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
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={selectedIds.includes(vendor.id)}
                            onChange={() => handleSelectOne(vendor.id)}
                          />
                        </label>
                      </td>
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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-lg shadow-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-base-content mb-4">
                Delete {selectedIds.length} Vendor{selectedIds.length !== 1 ? 's' : ''}?
              </h3>
              <p className="text-base-content/70 mb-6">
                This action cannot be undone. All selected vendors will be permanently deleted.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => bulkDeleteMutation.mutate()}
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
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        <AccessibleModal
          isOpen={showCreateModal || showEditModal}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setSelectedVendor(null);
            resetForm();
          }}
          title={showEditModal ? 'Edit Vendor' : 'Add New Vendor'}
          size="xl"
        >
          <AccessibleModal.Header
            title={showEditModal ? 'Edit Vendor' : 'Add New Vendor'}
            onClose={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              setSelectedVendor(null);
              resetForm();
            }}
          />
          <AccessibleModal.Content>
            <form onSubmit={handleSubmit} id="vendor-form">
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
                      <span className="label-text">Vendor Type</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={vendorForm.vendor_type}
                      onChange={(e) => setVendorForm(prev => ({ ...prev, vendor_type: e.target.value }))}
                    >
                      {vendorTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-base-content">Address</h4>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Street Address</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={vendorForm.address}
                      onChange={(e) => setVendorForm(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>

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

                  <div className="grid grid-cols-2 gap-2">
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

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">ZIP Code</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={vendorForm.zip_code}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, zip_code: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              {/* Contract Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-base-content">Contract Information</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Services Provided</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered"
                      value={vendorForm.services_provided}
                      onChange={(e) => setVendorForm(prev => ({ ...prev, services_provided: e.target.value }))}
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Contract Value</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="input input-bordered"
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
                        value={vendorForm.payment_terms}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, payment_terms: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

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
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Notes</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    value={vendorForm.notes}
                    onChange={(e) => setVendorForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div className="divider"></div>

              {/* Contact History */}
              <div className="space-y-4">
                <h4 className="font-semibold text-base-content">Contact History</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Last Contact Date</span>
                    </label>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={vendorForm.last_contact_date}
                      onChange={(e) => setVendorForm(prev => ({ ...prev, last_contact_date: e.target.value }))}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Next Contact Date</span>
                    </label>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={vendorForm.next_contact_date}
                      onChange={(e) => setVendorForm(prev => ({ ...prev, next_contact_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Contact Notes</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    value={vendorForm.contact_notes}
                    onChange={(e) => setVendorForm(prev => ({ ...prev, contact_notes: e.target.value }))}
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </form>
          </AccessibleModal.Content>
          <AccessibleModal.Footer>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                setSelectedVendor(null);
                resetForm();
              }}
            >
              Cancel
            </button>
            <button
              form="vendor-form"
              type="submit"
              className="btn btn-primary"
              disabled={createVendorMutation.isPending || updateVendorMutation.isPending}
            >
              {(createVendorMutation.isPending || updateVendorMutation.isPending) && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              {showEditModal ? 'Update Vendor' : 'Create Vendor'}
            </button>
          </AccessibleModal.Footer>
        </AccessibleModal>
      </div>
    </div>
  );
}