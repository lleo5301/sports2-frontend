import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Star,
  Users,
  GraduationCap,
  TrendingUp,
  Calendar,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useDebounce } from '../hooks/useDebounce';

const listTypes = [
  {
    id: 'new_players',
    name: 'New Players',
    description: 'Recently added players to evaluate',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    id: 'overall_pref_list',
    name: 'Overall Preference List',
    description: 'Top priority recruits across all positions',
    icon: Star,
    color: 'text-yellow-600'
  },
  {
    id: 'hs_pref_list',
    name: 'HS Preference List',
    description: 'High school recruits only',
    icon: GraduationCap,
    color: 'text-green-600'
  },
  {
    id: 'college_transfers',
    name: 'College Transfers',
    description: 'Transfer portal candidates',
    icon: TrendingUp,
    color: 'text-purple-600'
  }
];

const interestLevels = [
  { value: 'High', label: 'High Interest', color: 'bg-green-100 text-green-800' },
  { value: 'Medium', label: 'Medium Interest', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Low', label: 'Low Interest', color: 'bg-red-100 text-red-800' },
  { value: 'Unknown', label: 'Unknown', color: 'bg-gray-100 text-gray-800' }
];

const statuses = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'committed', label: 'Committed', color: 'bg-blue-100 text-blue-800' },
  { value: 'signed', label: 'Signed', color: 'bg-purple-100 text-purple-800' },
  { value: 'lost', label: 'Lost', color: 'bg-red-100 text-red-800' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' }
];

export default function PreferenceLists() {
  const [selectedListType, setSelectedListType] = useState('overall_pref_list');
  const [filters, setFilters] = useState({
    search: '',
    interest_level: '',
    status: 'active',
    page: 1
  });
  const [showFilters, setShowFilters] = useState(false);
  const queryClient = useQueryClient();

  // Debounce the search input to avoid excessive API calls
  const debouncedSearch = useDebounce(filters.search, 300);

  // Create filters object with debounced search for API calls
  const queryFilters = {
    ...filters,
    search: debouncedSearch
  };

  // Fetch preference lists
  const { data: preferenceListsData, isLoading, error, refetch } = useQuery({
    queryKey: ['preference-lists', selectedListType, queryFilters],
    queryFn: () => {
      const cleanParams = Object.fromEntries(
        Object.entries({ ...queryFilters, list_type: selectedListType }).filter(([key, value]) =>
          value !== '' && value !== null && value !== undefined
        )
      );
      return api.get('/recruits/preference-lists', { params: cleanParams });
    },
    placeholderData: (previousData) => previousData,
    staleTime: 30000
  });

  // Update preference list mutation
  const updatePreferenceList = useMutation({
    mutationFn: ({ id, data }) => api.put(`/recruits/preference-lists/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preference-lists'] });
      toast.success('Preference list updated');
    },
    onError: () => {
      toast.error('Failed to update preference list');
    }
  });

  // Delete from preference list mutation
  const deleteFromPreferenceList = useMutation({
    mutationFn: (id) => api.delete(`/recruits/preference-lists/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preference-lists'] });
      toast.success('Removed from preference list');
    },
    onError: () => {
      toast.error('Failed to remove from preference list');
    }
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, page: 1 };

      if (value && value !== '') {
        newFilters[key] = value;
      } else {
        delete newFilters[key];
      }

      return newFilters;
    });
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleUpdateInterestLevel = (preferenceId, interestLevel) => {
    updatePreferenceList.mutate({
      id: preferenceId,
      data: { interest_level: interestLevel }
    });
  };

  const handleUpdateStatus = (preferenceId, status) => {
    updatePreferenceList.mutate({
      id: preferenceId,
      data: { status: status }
    });
  };

  const handleUpdatePriority = (preferenceId, newPriority) => {
    updatePreferenceList.mutate({
      id: preferenceId,
      data: { priority: newPriority }
    });
  };

  const handleDeleteFromList = (preferenceId) => {
    if (!confirm('Are you sure you want to remove this player from the preference list?')) return;
    deleteFromPreferenceList.mutate(preferenceId);
  };

  const preferenceLists = preferenceListsData?.data || [];
  const pagination = preferenceListsData?.pagination || {};
  const currentListType = listTypes.find(lt => lt.id === selectedListType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Preference Lists</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your preference lists for recruiting and player evaluation.
          </p>
        </div>
        <Link
          to="/recruiting"
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Players
        </Link>
      </div>

      {/* List Type Tabs */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {listTypes.map((listType) => {
            const Icon = listType.icon;
            const isActive = selectedListType === listType.id;
            const count = preferenceLists.filter(p => p.list_type === listType.id).length;

            return (
              <button
                key={listType.id}
                onClick={() => setSelectedListType(listType.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon className={`h-6 w-6 mr-3 ${listType.color}`} />
                    <div className="text-left">
                      <h3 className={`font-medium ${isActive ? 'text-primary-900' : 'text-gray-900'}`}>
                        {listType.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{listType.description}</p>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search players by name, school, city, state..."
                className="input pl-10 w-full"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Level</label>
                <select
                  className="input"
                  value={filters.interest_level}
                  onChange={(e) => handleFilterChange('interest_level', e.target.value)}
                >
                  <option value="">All Levels</option>
                  {interestLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="input"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({
                    search: '',
                    status: 'active',
                    page: 1
                  })}
                  className="btn btn-secondary w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current List Info */}
      {currentListType && (
        <div className="card p-4">
          <div className="flex items-center">
            <currentListType.icon className={`h-8 w-8 mr-3 ${currentListType.color}`} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{currentListType.name}</h2>
              <p className="text-sm text-gray-500">{currentListType.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Preference Lists */}
      {isLoading ? (
        <div className="card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading preference lists...</p>
          </div>
        </div>
      ) : error ? (
        <div className="card p-8">
          <div className="text-center">
            <p className="text-red-600">Error loading preference lists. Please try again.</p>
            <button onClick={() => refetch()} className="btn btn-primary mt-2">
              Retry
            </button>
          </div>
        </div>
      ) : preferenceLists.length === 0 ? (
        <div className="card p-8">
          <div className="text-center">
            <Bookmark className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No players in this list</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.interest_level || filters.status !== 'active'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by adding players to your preference list.'}
            </p>
            {!filters.search && !filters.interest_level && filters.status === 'active' && (
              <div className="mt-6">
                <Link to="/recruiting" className="btn btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Players
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {preferenceLists.map((preference) => (
              <div key={preference.id} className="card hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    {/* Player Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {preference.Player?.first_name} {preference.Player?.last_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {preference.Player?.position} • {preference.Player?.school_type}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-500">
                            Priority: {preference.priority}
                          </span>
                          <button
                            onClick={() => handleUpdatePriority(preference.id, preference.priority - 1)}
                            disabled={preference.priority <= 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            title="Move Up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUpdatePriority(preference.id, preference.priority + 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Move Down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Player Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          {preference.Player?.school && (
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {preference.Player.school}
                            </p>
                          )}
                          {(preference.Player?.city || preference.Player?.state) && (
                            <p className="text-sm text-gray-600">
                              {[preference.Player.city, preference.Player.state].filter(Boolean).join(', ')}
                            </p>
                          )}
                          {preference.Player?.graduation_year && (
                            <p className="text-sm text-gray-600 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Grad Year: {preference.Player.graduation_year}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          {preference.notes && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Notes:</span> {preference.notes}
                            </p>
                          )}
                          {preference.added_date && (
                            <p className="text-sm text-gray-500">
                              Added: {new Date(preference.added_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status and Interest Level */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <select
                          value={preference.interest_level || 'Unknown'}
                          onChange={(e) => handleUpdateInterestLevel(preference.id, e.target.value)}
                          className="text-xs px-2 py-1 rounded-full border"
                        >
                          {interestLevels.map(level => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                          ))}
                        </select>
                        <select
                          value={preference.status || 'active'}
                          onChange={(e) => handleUpdateStatus(preference.id, e.target.value)}
                          className="text-xs px-2 py-1 rounded-full border"
                        >
                          {statuses.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <Link
                        to={`/players/${preference.player_id}`}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteFromList(preference.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Remove from List"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn btn-outline btn-sm disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`btn btn-sm ${
                        page === pagination.page ? 'btn-primary' : 'btn-outline'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="btn btn-outline btn-sm disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}

          {/* Results Summary */}
          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} players
          </div>
        </>
      )}
    </div>
  );
}
