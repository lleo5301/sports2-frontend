import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Search, Filter, Plus, Eye, Star, Calendar, Phone, Mail, MapPin, Target, Users, Bookmark, TrendingUp, UserCheck, Award } from 'lucide-react'
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
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <UserCheck className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Recruiting Board</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage your recruiting targets and prospects
            </p>
          </div>
        </div>
        <Link
          to="/players/create"
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Recruit
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Total Recruits</h3>
                <p className="text-2xl font-bold">{totalRecruits}</p>
              </div>
              <Target className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-yellow-500 to-yellow-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">High Interest</h3>
                <p className="text-2xl font-bold">{highInterestRecruits}</p>
              </div>
              <Star className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-green-500 to-green-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Scheduled Visits</h3>
                <p className="text-2xl font-bold">{scheduledVisits}</p>
              </div>
              <Calendar className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Scholarship Offers</h3>
                <p className="text-2xl font-bold">{scholarshipOffers}</p>
              </div>
              <Award className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Preference List Tabs */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body">
          <h3 className="text-lg font-semibold mb-4">Preference Lists</h3>
          <div className="flex flex-wrap gap-2">
            {listTypes.map((listType) => (
              <button
                key={listType}
                onClick={() => setSelectedListType(listType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedListType === listType
                    ? 'btn btn-primary'
                    : 'btn btn-outline'
                }`}
              >
                {listType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recruits by name, school, city, state..."
                  className="input input-bordered w-full pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-base-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">School Type</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={filters.school_type || ''}
                    onChange={(e) => handleFilterChange('school_type', e.target.value)}
                  >
                    <option value="">All Types</option>
                    {schoolTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Position</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={filters.position || ''}
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
      </div>

      {/* Recruits Grid */}
      {isLoading ? (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="text-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="mt-4 text-gray-600">Loading recruits...</p>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="text-center py-12">
              <div className="text-error mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Error Loading Recruits</h3>
              <p className="text-gray-600 mb-4">Please try again</p>
              <button onClick={() => refetch()} className="btn btn-primary">
                Retry
              </button>
            </div>
          </div>
        </div>
      ) : recruits.length === 0 ? (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Recruits Found</h3>
              <p className="text-gray-500 mb-4">
                {filters.search || Object.keys(filters).some(key => key !== 'search' && key !== 'page' && filters[key])
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by adding your first recruit.'}
              </p>
              {!filters.search && Object.keys(filters).every(key => key === 'search' || key === 'page') && (
                <Link to="/players/create" className="btn btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Recruit
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recruits.map((recruit) => {
              const preference = preferenceLists.find(p => p.player_id === recruit.id)
              
              return (
                <div key={recruit.id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body">
                    {/* Recruit Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="card-title text-lg">
                          {recruit.first_name} {recruit.last_name}
                        </h3>
                        <p className="text-sm opacity-70">
                          {recruit.position} • {recruit.school_type}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Link
                          to={`/players/${recruit.id}`}
                          className="btn btn-ghost btn-sm btn-circle"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {!preference && (
                          <button
                            onClick={() => handleAddToPreferenceList(recruit.id)}
                            className="btn btn-ghost btn-sm btn-circle text-yellow-600 hover:bg-yellow-100"
                            title="Add to Preference List"
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Recruit Info */}
                    <div className="space-y-2 mb-4">
                      {recruit.school && (
                        <p className="text-sm opacity-70 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {recruit.school}
                        </p>
                      )}
                      {(recruit.city || recruit.state) && (
                        <p className="text-sm opacity-70">
                          {[recruit.city, recruit.state].filter(Boolean).join(', ')}
                        </p>
                      )}
                      {recruit.graduation_year && (
                        <p className="text-sm opacity-70">
                          <span className="font-medium">Grad Year:</span> {recruit.graduation_year}
                        </p>
                      )}
                      {(recruit.height || recruit.weight) && (
                        <p className="text-sm opacity-70">
                          <span className="font-medium">Size:</span> {[recruit.height, recruit.weight && `${recruit.weight} lbs`].filter(Boolean).join(' • ')}
                        </p>
                      )}
                    </div>

                    {/* Stats Preview */}
                    <div className="border-t border-base-300 pt-4 mb-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {recruit.batting_avg && (
                          <div>
                            <span className="opacity-70">AVG:</span>
                            <span className="ml-1 font-semibold">{recruit.batting_avg}</span>
                          </div>
                        )}
                        {recruit.home_runs && (
                          <div>
                            <span className="opacity-70">HR:</span>
                            <span className="ml-1 font-semibold">{recruit.home_runs}</span>
                          </div>
                        )}
                        {recruit.rbi && (
                          <div>
                            <span className="opacity-70">RBI:</span>
                            <span className="ml-1 font-semibold">{recruit.rbi}</span>
                          </div>
                        )}
                        {recruit.stolen_bases && (
                          <div>
                            <span className="opacity-70">SB:</span>
                            <span className="ml-1 font-semibold">{recruit.stolen_bases}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Preference List Status */}
                    {preference ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm opacity-70">Interest Level:</span>
                          <select
                            value={preference.interest_level || 'Unknown'}
                            onChange={(e) => handleUpdateInterestLevel(preference.id, e.target.value)}
                            className="select select-bordered select-xs max-w-xs"
                          >
                            {interestLevels.map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {preference.visit_scheduled && (
                            <div className="badge badge-success badge-sm">
                              <Calendar className="w-3 h-3 mr-1" />
                              Visit Scheduled
                            </div>
                          )}
                          {preference.scholarship_offered && (
                            <div className="badge badge-info badge-sm">
                              <Award className="w-3 h-3 mr-1" />
                              Scholarship Offered
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="opacity-70">Priority:</span>
                          <span className="font-semibold">{preference.priority}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="card-actions">
                        <button
                          onClick={() => handleAddToPreferenceList(recruit.id)}
                          className="btn btn-outline btn-sm w-full"
                        >
                          <Bookmark className="w-3 h-3 mr-1" />
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
              <div className="join">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="join-item btn btn-outline"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`join-item btn ${
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
                  className="join-item btn btn-outline"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="text-center text-sm opacity-70 mt-4">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} recruits
          </div>
        </>
      )}
    </div>
  )
} 