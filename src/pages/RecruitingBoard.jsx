import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { Search, Filter, Plus, Eye, Star, Calendar, Phone, Mail, MapPin, Target, Users, Bookmark, TrendingUp } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const positions = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'OF']
const schoolTypes = ['HS', 'COLL']
const interestLevels = ['High', 'Medium', 'Low', 'Unknown']
const listTypes = ['new_players', 'overall_pref_list', 'hs_pref_list', 'college_transfers']

export default function RecruitingBoard() {
  const [filters, setFilters] = useState({
    search: '',
    page: 1
  })

  const [showFilters, setShowFilters] = useState(false)
  const [selectedListType, setSelectedListType] = useState('overall_pref_list')
  const queryClient = useQueryClient()

  // Fetch recruits with filters
  const { data: recruitsData, isLoading, error, refetch } = useQuery(
    ['recruits', filters],
    () => {
      // Filter out empty values to avoid validation errors
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => 
          value !== '' && value !== null && value !== undefined
        )
      )
      return api.get('/recruits', { params: cleanParams })
    },
    {
      keepPreviousData: true,
      staleTime: 30000
    }
  )

  // Fetch preference lists
  const { data: preferenceListsData } = useQuery(
    ['preference-lists', selectedListType],
    () => api.get('/recruits/preference-lists', { 
      params: { list_type: selectedListType } 
    }),
    {
      staleTime: 30000
    }
  )

  // Add to preference list mutation
  const addToPreferenceList = useMutation(
    (data) => api.post('/recruits/preference-lists', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['preference-lists'])
        queryClient.invalidateQueries(['recruits'])
        toast.success('Added to preference list')
      },
      onError: () => {
        toast.error('Failed to add to preference list')
      }
    }
  )

  // Update preference list mutation
  const updatePreferenceList = useMutation(
    ({ id, data }) => api.put(`/recruits/preference-lists/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['preference-lists'])
        toast.success('Preference list updated')
      },
      onError: () => {
        toast.error('Failed to update preference list')
      }
    }
  )

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, page: 1 } // Reset to first page when filters change
      
      // Only add the filter if it has a value, otherwise remove it
      if (value && value !== '') {
        newFilters[key] = value
      } else {
        delete newFilters[key]
      }
      
      return newFilters
    })
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleAddToPreferenceList = (playerId) => {
    addToPreferenceList.mutate({
      player_id: playerId,
      list_type: selectedListType,
      priority: 999,
      interest_level: 'Unknown'
    })
  }

  const handleUpdateInterestLevel = (preferenceId, interestLevel) => {
    updatePreferenceList.mutate({
      id: preferenceId,
      data: { interest_level: interestLevel }
    })
  }

  const recruits = recruitsData?.data || []
  const pagination = recruitsData?.pagination || {}
  const preferenceLists = preferenceListsData?.data || []

  // Get recruit stats
  const totalRecruits = recruits.length
  const highInterestRecruits = preferenceLists.filter(p => p.interest_level === 'High').length
  const scheduledVisits = preferenceLists.filter(p => p.visit_scheduled).length
  const scholarshipOffers = preferenceLists.filter(p => p.scholarship_offered).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiting Board</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your recruiting targets and prospects.
          </p>
        </div>
        <Link
          to="/players/create"
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Recruit
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Recruits</p>
              <p className="text-2xl font-bold text-gray-900">{totalRecruits}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">High Interest</p>
              <p className="text-2xl font-bold text-gray-900">{highInterestRecruits}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Scheduled Visits</p>
              <p className="text-2xl font-bold text-gray-900">{scheduledVisits}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Scholarship Offers</p>
              <p className="text-2xl font-bold text-gray-900">{scholarshipOffers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preference List Tabs */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          {listTypes.map((listType) => (
            <button
              key={listType}
              onClick={() => setSelectedListType(listType)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedListType === listType
                  ? 'bg-primary-100 text-primary-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {listType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
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
                placeholder="Search recruits by name, school, city, state..."
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
                <label className="block text-sm font-medium text-gray-700 mb-1">School Type</label>
                <select
                  className="input"
                  value={filters.school_type}
                  onChange={(e) => handleFilterChange('school_type', e.target.value)}
                >
                  <option value="">All Types</option>
                  {schoolTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <select
                  className="input"
                  value={filters.position}
                  onChange={(e) => handleFilterChange('position', e.target.value)}
                >
                  <option value="">All Positions</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({
                    search: '',
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

      {/* Recruits Grid */}
      {isLoading ? (
        <div className="card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading recruits...</p>
          </div>
        </div>
      ) : error ? (
        <div className="card p-8">
          <div className="text-center">
            <p className="text-red-600">Error loading recruits. Please try again.</p>
            <button onClick={() => refetch()} className="btn btn-primary mt-2">
              Retry
            </button>
          </div>
        </div>
      ) : recruits.length === 0 ? (
        <div className="card p-8">
          <div className="text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recruits found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || Object.keys(filters).some(key => key !== 'search' && key !== 'page' && filters[key])
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by adding your first recruit.'}
            </p>
            {!filters.search && Object.keys(filters).every(key => key === 'search' || key === 'page') && (
              <div className="mt-6">
                <Link to="/players/create" className="btn btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recruit
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recruits.map((recruit) => {
              const preference = preferenceLists.find(p => p.player_id === recruit.id)
              
              return (
                <div key={recruit.id} className="card hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Recruit Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {recruit.first_name} {recruit.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {recruit.position} • {recruit.school_type}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <Link
                          to={`/players/${recruit.id}`}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {!preference && (
                          <button
                            onClick={() => handleAddToPreferenceList(recruit.id)}
                            className="p-1 text-gray-400 hover:text-yellow-600"
                            title="Add to Preference List"
                          >
                            <Bookmark className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Recruit Info */}
                    <div className="space-y-2 mb-4">
                      {recruit.school && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {recruit.school}
                        </p>
                      )}
                      {(recruit.city || recruit.state) && (
                        <p className="text-sm text-gray-600">
                          {[recruit.city, recruit.state].filter(Boolean).join(', ')}
                        </p>
                      )}
                      {recruit.graduation_year && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Grad Year:</span> {recruit.graduation_year}
                        </p>
                      )}
                      {(recruit.height || recruit.weight) && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Size:</span> {[recruit.height, recruit.weight && `${recruit.weight} lbs`].filter(Boolean).join(' • ')}
                        </p>
                      )}
                    </div>

                    {/* Stats Preview */}
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {recruit.batting_avg && (
                          <div>
                            <span className="text-gray-500">AVG:</span>
                            <span className="ml-1 font-medium">{recruit.batting_avg}</span>
                          </div>
                        )}
                        {recruit.home_runs && (
                          <div>
                            <span className="text-gray-500">HR:</span>
                            <span className="ml-1 font-medium">{recruit.home_runs}</span>
                          </div>
                        )}
                        {recruit.rbi && (
                          <div>
                            <span className="text-gray-500">RBI:</span>
                            <span className="ml-1 font-medium">{recruit.rbi}</span>
                          </div>
                        )}
                        {recruit.stolen_bases && (
                          <div>
                            <span className="text-gray-500">SB:</span>
                            <span className="ml-1 font-medium">{recruit.stolen_bases}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Preference List Status */}
                    {preference ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Interest Level:</span>
                          <select
                            value={preference.interest_level || 'Unknown'}
                            onChange={(e) => handleUpdateInterestLevel(preference.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            {interestLevels.map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                        {preference.visit_scheduled && (
                          <div className="flex items-center text-xs text-green-600">
                            <Calendar className="h-3 w-3 mr-1" />
                            Visit Scheduled
                          </div>
                        )}
                        {preference.scholarship_offered && (
                          <div className="flex items-center text-xs text-blue-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Scholarship Offered
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Priority:</span>
                          <span className="font-medium">{preference.priority}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <button
                          onClick={() => handleAddToPreferenceList(recruit.id)}
                          className="btn btn-outline btn-sm w-full"
                        >
                          <Bookmark className="h-3 w-3 mr-1" />
                          Add to List
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
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
                  const page = i + 1
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
                  )
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
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} recruits
          </div>
        </>
      )}
    </div>
  )
} 