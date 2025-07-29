import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Star,
  Calendar,
  MapPin,
  Target,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F']

const gradeColors = {
  'A+': 'bg-green-100 text-green-800',
  'A': 'bg-green-100 text-green-800',
  'A-': 'bg-green-100 text-green-800',
  'B+': 'bg-blue-100 text-blue-800',
  'B': 'bg-blue-100 text-blue-800',
  'B-': 'bg-blue-100 text-blue-800',
  'C+': 'bg-yellow-100 text-yellow-800',
  'C': 'bg-yellow-100 text-yellow-800',
  'C-': 'bg-yellow-100 text-yellow-800',
  'D+': 'bg-orange-100 text-orange-800',
  'D': 'bg-orange-100 text-orange-800',
  'D-': 'bg-orange-100 text-orange-800',
  'F': 'bg-red-100 text-red-800'
}

export default function ScoutingReports() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    player_id: '',
    created_by: '',
    overall_grade: '',
    page: 1
  })
  const [showFilters, setShowFilters] = useState(false)
  const queryClient = useQueryClient()

  // Fetch scouting reports
  const { data: reportsData, isLoading, error, refetch } = useQuery(
    ['scouting-reports', filters],
    async () => {
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => 
          value !== '' && value !== null && value !== undefined
        )
      )
      const response = await api.get('/reports/scouting', { params: cleanParams })
      return response.data
    },
    {
      keepPreviousData: true,
      staleTime: 30000
    }
  )

  // Fetch players for dropdown
  const { data: playersData } = useQuery(
    ['players-for-scouting'],
    async () => {
      const response = await api.get('/players', { params: { status: 'active', limit: 100 } })
      return response.data
    },
    {
      staleTime: 300000 // 5 minutes
    }
  )

  // Create scouting report mutation
  const createReport = useMutation(
    (data) => api.post('/reports/scouting', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['scouting-reports'])
        setShowCreateForm(false)
        toast.success('Scouting report created successfully')
      },
      onError: (error) => {
        console.error('Create report error:', error)
        const errorMessage = error.response?.data?.error || 'Failed to create scouting report'
        toast.error(errorMessage)
      }
    }
  )

  // Delete scouting report mutation
  const deleteReport = useMutation(
    (id) => api.delete(`/reports/scouting/byId/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['scouting-reports'])
        toast.success('Scouting report deleted')
      },
      onError: () => {
        toast.error('Failed to delete scouting report')
      }
    }
  )

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, page: 1 }
      
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

  const handleDeleteReport = (reportId) => {
    if (!confirm('Are you sure you want to delete this scouting report?')) return
    deleteReport.mutate(reportId)
  }

  const getGradeDisplay = (grade) => {
    if (!grade) return null
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${gradeColors[grade] || 'bg-gray-100 text-gray-800'}`}>
        {grade}
      </span>
    )
  }

  const getOverallGrade = (report) => {
    const grades = [
      report.overall_grade,
      report.hitting_grade,
      report.pitching_grade,
      report.fielding_grade,
      report.speed_grade,
      report.intangibles_grade
    ].filter(Boolean)

    if (grades.length === 0) return null

    // Simple average grade calculation
    const gradeValues = {
      'A+': 13, 'A': 12, 'A-': 11,
      'B+': 10, 'B': 9, 'B-': 8,
      'C+': 7, 'C': 6, 'C-': 5,
      'D+': 4, 'D': 3, 'D-': 2,
      'F': 1
    }

    const total = grades.reduce((sum, grade) => sum + (gradeValues[grade] || 0), 0)
    const average = total / grades.length

    // Convert back to grade
    const gradeMap = Object.entries(gradeValues).sort((a, b) => b[1] - a[1])
    for (const [grade, value] of gradeMap) {
      if (average >= value) return grade
    }
    return 'F'
  }

  const reports = Array.isArray(reportsData?.data) ? reportsData.data : []
  const players = Array.isArray(playersData?.data) ? playersData.data : []
  const pagination = reportsData?.pagination || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scouting Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage detailed scouting reports for players.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Report
        </button>
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
                placeholder="Search reports by notes, player name..."
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Player</label>
                <select
                  className="input"
                  value={filters.player_id}
                  onChange={(e) => handleFilterChange('player_id', e.target.value)}
                >
                  <option value="">All Players</option>
                  {players.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.first_name} {player.last_name} ({player.position})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Overall Grade</label>
                <select
                  className="input"
                  value={filters.overall_grade}
                  onChange={(e) => handleFilterChange('overall_grade', e.target.value)}
                >
                  <option value="">All Grades</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
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

      {/* Create Report Form */}
      {showCreateForm && (
        <div className="card p-8 bg-white shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create Scouting Report</h2>
              <p className="mt-1 text-sm text-gray-600">Fill out the details below to create a comprehensive scouting report</p>
            </div>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            
            // Validate required fields
            const playerId = parseInt(formData.get('player_id'))
            const reportDate = formData.get('report_date')
            
            if (!playerId || isNaN(playerId)) {
              toast.error('Please select a player')
              return
            }
            
            if (!reportDate) {
              toast.error('Please select a report date')
              return
            }
            
            const data = {
              player_id: playerId,
              report_date: reportDate ? new Date(reportDate).toISOString() : null,
              game_date: formData.get('game_date') ? new Date(formData.get('game_date')).toISOString() : null,
              opponent: formData.get('opponent') || null,
              overall_grade: formData.get('overall_grade') || null,
              overall_notes: formData.get('overall_notes') || null,
              hitting_grade: formData.get('hitting_grade') || null,
              hitting_notes: formData.get('hitting_notes') || null,
              pitching_grade: formData.get('pitching_grade') || null,
              pitching_notes: formData.get('pitching_notes') || null,
              fielding_grade: formData.get('fielding_grade') || null,
              fielding_notes: formData.get('fielding_notes') || null,
              speed_grade: formData.get('speed_grade') || null,
              speed_notes: formData.get('speed_notes') || null,
              intangibles_grade: formData.get('intangibles_grade') || null,
              intangibles_notes: formData.get('intangibles_notes') || null
            }
            
            // Clean up empty strings
            Object.keys(data).forEach(key => {
              if (data[key] === '') {
                data[key] = null
              }
            })
            
            console.log('Submitting scouting report data:', data)
            createReport.mutate(data)
          }}>
            {/* Basic Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Player *</label>
                  <select name="player_id" required className="input w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <option value="">Select Player</option>
                    {players.map(player => (
                      <option key={player.id} value={player.id}>
                        {player.first_name} {player.last_name} ({player.position} - {player.school_type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Report Date *</label>
                  <input
                    type="date"
                    name="report_date"
                    required
                    className="input w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Game Date</label>
                  <input
                    type="date"
                    name="game_date"
                    className="input w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Opponent</label>
                  <input
                    type="text"
                    name="opponent"
                    className="input w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g. State University"
                  />
                </div>
              </div>
            </div>

            {/* Overall Evaluation */}
            <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Overall Evaluation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Overall Grade</label>
                  <select name="overall_grade" className="input w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <option value="">Select Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Overall Notes</label>
                  <textarea
                    name="overall_notes"
                    rows="4"
                    className="input w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    placeholder="Provide an overall assessment and summary of the player's performance..."
                  />
                </div>
              </div>
            </div>

            {/* Hitting */}
            <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Hitting Evaluation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hitting Grade</label>
                  <select name="hitting_grade" className="input w-full border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <option value="">Select Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hitting Notes</label>
                  <textarea
                    name="hitting_notes"
                    rows="4"
                    className="input w-full border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
                    placeholder="Evaluate hitting mechanics, power potential, contact ability, plate discipline..."
                  />
                </div>
              </div>
            </div>

            {/* Pitching */}
            <div className="mb-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Pitching Evaluation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pitching Grade</label>
                  <select name="pitching_grade" className="input w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                    <option value="">Select Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pitching Notes</label>
                  <textarea
                    name="pitching_notes"
                    rows="4"
                    className="input w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500 resize-none"
                    placeholder="Evaluate velocity, command, pitch repertoire, mechanics, arm action..."
                  />
                </div>
              </div>
            </div>

            {/* Fielding */}
            <div className="mb-8 p-6 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Fielding Evaluation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fielding Grade</label>
                  <select name="fielding_grade" className="input w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                    <option value="">Select Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fielding Notes</label>
                  <textarea
                    name="fielding_notes"
                    rows="4"
                    className="input w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 resize-none"
                    placeholder="Evaluate range, arm strength, defensive instincts, positioning, glove work..."
                  />
                </div>
              </div>
            </div>

            {/* Speed */}
            <div className="mb-8 p-6 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Speed Evaluation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Speed Grade</label>
                  <select name="speed_grade" className="input w-full border-gray-300 focus:border-red-500 focus:ring-red-500">
                    <option value="">Select Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Speed Notes</label>
                  <textarea
                    name="speed_notes"
                    rows="4"
                    className="input w-full border-gray-300 focus:border-red-500 focus:ring-red-500 resize-none"
                    placeholder="Evaluate base running ability, stolen base potential, home to first time, acceleration..."
                  />
                </div>
              </div>
            </div>

            {/* Intangibles */}
            <div className="mb-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Intangibles Evaluation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Intangibles Grade</label>
                  <select name="intangibles_grade" className="input w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="">Select Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Intangibles Notes</label>
                  <textarea
                    name="intangibles_notes"
                    rows="4"
                    className="input w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                    placeholder="Evaluate work ethic, leadership qualities, baseball IQ, character, coachability..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createReport.isLoading}
                className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {createReport.isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reports List */}
      {isLoading ? (
        <div className="card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading scouting reports...</p>
          </div>
        </div>
      ) : error ? (
        <div className="card p-8">
          <div className="text-center">
            <p className="text-red-600">Error loading scouting reports. Please try again.</p>
            <button onClick={() => refetch()} className="btn btn-primary mt-2">
              Retry
            </button>
          </div>
        </div>
      ) : reports.length === 0 ? (
        <div className="card p-8">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No scouting reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.player_id || filters.overall_grade
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by creating your first scouting report.'}
            </p>
            {!filters.search && !filters.player_id && !filters.overall_grade && (
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Report
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reports.map((report) => {
              const overallGrade = getOverallGrade(report)
              return (
                <div key={report.id} className="card hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {report.Player?.first_name} {report.Player?.last_name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {report.Player?.position} • {report.Player?.school_type} • {report.report_date}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {overallGrade && getGradeDisplay(overallGrade)}
                            <span className="text-sm text-gray-500">
                              {new Date(report.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Game Info */}
                        {(report.game_date || report.opponent) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {report.game_date && (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  Game: {report.game_date}
                                </span>
                              </div>
                            )}
                            {report.opponent && (
                              <div className="flex items-center">
                                <Target className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  vs {report.opponent}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Grades Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
                          {report.overall_grade && (
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Overall</div>
                              {getGradeDisplay(report.overall_grade)}
                            </div>
                          )}
                          {report.hitting_grade && (
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Hitting</div>
                              {getGradeDisplay(report.hitting_grade)}
                            </div>
                          )}
                          {report.pitching_grade && (
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Pitching</div>
                              {getGradeDisplay(report.pitching_grade)}
                            </div>
                          )}
                          {report.fielding_grade && (
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Fielding</div>
                              {getGradeDisplay(report.fielding_grade)}
                            </div>
                          )}
                          {report.speed_grade && (
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Speed</div>
                              {getGradeDisplay(report.speed_grade)}
                            </div>
                          )}
                          {report.intangibles_grade && (
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Intangibles</div>
                              {getGradeDisplay(report.intangibles_grade)}
                            </div>
                          )}
                        </div>

                        {/* Notes Preview */}
                        {report.overall_notes && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Overall Notes</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {report.overall_notes}
                            </p>
                          </div>
                        )}

                        {/* Created By */}
                        <div className="flex items-center">
                          <Info className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            Scouted by {report.Creator?.first_name} {report.Creator?.last_name}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2 ml-4">
                        <Link
                          to={`/players/${report.player_id}`}
                          className="p-2 text-gray-400 hover:text-gray-600"
                          title="View Player"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete Report"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
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
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} reports
          </div>
        </>
      )}
    </div>
  )
}