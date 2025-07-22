import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { 
  Users, 
  Eye, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  MapPin,
  Star,
  Award,
  Shield,
  Zap,
  Heart,
  Brain,
  Search,
  Filter
} from 'lucide-react'
import api from '../services/api'

const positions = [
  { id: 'P', name: 'Pitcher', color: 'bg-red-100 text-red-800', icon: Shield },
  { id: 'C', name: 'Catcher', color: 'bg-blue-100 text-blue-800', icon: Shield },
  { id: '1B', name: 'First Base', color: 'bg-green-100 text-green-800', icon: Target },
  { id: '2B', name: 'Second Base', color: 'bg-yellow-100 text-yellow-800', icon: Target },
  { id: '3B', name: 'Third Base', color: 'bg-purple-100 text-purple-800', icon: Target },
  { id: 'SS', name: 'Shortstop', color: 'bg-indigo-100 text-indigo-800', icon: Target },
  { id: 'LF', name: 'Left Field', color: 'bg-pink-100 text-pink-800', icon: Zap },
  { id: 'CF', name: 'Center Field', color: 'bg-teal-100 text-teal-800', icon: Zap },
  { id: 'RF', name: 'Right Field', color: 'bg-orange-100 text-orange-800', icon: Zap },
  { id: 'OF', name: 'Outfield', color: 'bg-gray-100 text-gray-800', icon: Zap },
  { id: 'DH', name: 'Designated Hitter', color: 'bg-cyan-100 text-cyan-800', icon: Heart }
]

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  injured: 'bg-red-100 text-red-800',
  suspended: 'bg-yellow-100 text-yellow-800'
}

export default function DepthChart() {
  const [filters, setFilters] = useState({
    search: '',
    position: '',
    status: 'active',
    school_type: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('name') // name, position, school_type, graduation_year

  // Fetch players for depth chart
  const { data: playersData, isLoading, error, refetch } = useQuery(
    ['depth-chart-players', filters],
    async () => {
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => 
          value !== '' && value !== null && value !== undefined
        )
      )
      const response = await api.get('/players', { params: { ...cleanParams, limit: 100 } })
      
      // Ensure the response has the expected structure
      if (!response.data || !Array.isArray(response.data.data)) {
        console.warn('Unexpected API response structure:', response.data)
        return { data: [] }
      }
      
      return response.data
    },
    {
      keepPreviousData: true,
      staleTime: 30000
    }
  )

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      
      if (value && value !== '') {
        newFilters[key] = value
      } else {
        delete newFilters[key]
      }
      
      return newFilters
    })
  }

  const getPositionPlayers = (positionId) => {
    if (!Array.isArray(playersData?.data)) return []
    
    return playersData.data
      .filter(player => player.position === positionId)
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
          case 'position':
            return a.position.localeCompare(b.position)
          case 'school_type':
            return a.school_type.localeCompare(b.school_type)
          case 'graduation_year':
            return (a.graduation_year || 0) - (b.graduation_year || 0)
          default:
            return 0
        }
      })
  }

  const getPlayerStats = (player) => {
    const stats = []
    
    if (player.batting_avg) {
      stats.push(`AVG: ${player.batting_avg}`)
    }
    if (player.home_runs) {
      stats.push(`HR: ${player.home_runs}`)
    }
    if (player.rbi) {
      stats.push(`RBI: ${player.rbi}`)
    }
    if (player.stolen_bases) {
      stats.push(`SB: ${player.stolen_bases}`)
    }
    if (player.era) {
      stats.push(`ERA: ${player.era}`)
    }
    if (player.wins !== null && player.losses !== null) {
      stats.push(`W-L: ${player.wins}-${player.losses}`)
    }
    if (player.strikeouts) {
      stats.push(`K: ${player.strikeouts}`)
    }
    
    return stats
  }

  const getPlayerStatus = (player) => {
    if (player.has_medical_issues) {
      return { label: 'Injured', color: statusColors.injured }
    }
    if (player.status === 'inactive') {
      return { label: 'Inactive', color: statusColors.inactive }
    }
    return { label: 'Active', color: statusColors.active }
  }

  const players = Array.isArray(playersData?.data) ? playersData.data : []
  const totalPlayers = players.length
  const activePlayers = players.filter(p => p.status === 'active').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Depth Chart</h1>
          <p className="mt-1 text-sm text-gray-500">
            View your team's current roster organized by position.
          </p>
        </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Players</p>
              <p className="text-2xl font-bold text-gray-900">{totalPlayers}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Active Players</p>
              <p className="text-2xl font-bold text-gray-900">{activePlayers}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Positions</p>
              <p className="text-2xl font-bold text-gray-900">{positions.length}</p>
            </div>
          </div>
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
                placeholder="Search players by name, school..."
                className="input pl-10 w-full"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="sm:w-48">
            <select
              className="input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="position">Sort by Position</option>
              <option value="school_type">Sort by School Type</option>
              <option value="graduation_year">Sort by Grad Year</option>
            </select>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <select
                  className="input"
                  value={filters.position}
                  onChange={(e) => handleFilterChange('position', e.target.value)}
                >
                  <option value="">All Positions</option>
                  {positions.map(pos => (
                    <option key={pos.id} value={pos.id}>{pos.name}</option>
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
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Type</label>
                <select
                  className="input"
                  value={filters.school_type}
                  onChange={(e) => handleFilterChange('school_type', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="HS">High School</option>
                  <option value="COLL">College</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setFilters({
                  search: '',
                  status: 'active'
                })}
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Depth Chart */}
      {isLoading ? (
        <div className="card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading depth chart...</p>
          </div>
        </div>
      ) : error ? (
        <div className="card p-8">
          <div className="text-center">
            <p className="text-red-600">Error loading depth chart. Please try again.</p>
            <button onClick={() => refetch()} className="btn btn-primary mt-2">
              Retry
            </button>
          </div>
        </div>
      ) : players.length === 0 ? (
        <div className="card p-8">
          <div className="text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No players found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.position || filters.status !== 'active' || filters.school_type
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by adding your first player.'}
            </p>
            {!filters.search && !filters.position && filters.status === 'active' && !filters.school_type && (
              <div className="mt-6">
                <Link to="/players/create" className="btn btn-primary">
                  Add Player
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {positions.map((position) => {
            const positionPlayers = getPositionPlayers(position.id)
            const Icon = position.icon
            
            if (positionPlayers.length === 0) return null

            return (
              <div key={position.id} className="card">
                <div className="p-6">
                  {/* Position Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Icon className="h-6 w-6 mr-3 text-gray-600" />
                      <h2 className="text-xl font-semibold text-gray-900">{position.name}</h2>
                      <span className={`ml-3 text-xs px-2 py-1 rounded-full font-medium ${position.color}`}>
                        {positionPlayers.length} player{positionPlayers.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Players Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {positionPlayers.map((player, index) => {
                      const status = getPlayerStatus(player)
                      const stats = getPlayerStats(player)
                      
                      return (
                        <div key={player.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {player.first_name} {player.last_name}
                                </h3>
                                <span className="text-sm text-gray-500">#{index + 1}</span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {player.position} • {player.school_type}
                              </p>
                            </div>
                            <Link
                              to={`/players/${player.id}`}
                              className="p-1 text-gray-400 hover:text-gray-600 ml-2"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </div>

                          {/* Player Details */}
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Grad: {player.graduation_year || 'N/A'}</span>
                            </div>
                            {(player.school || player.city || player.state) && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>
                                  {[player.school, player.city, player.state].filter(Boolean).join(', ')}
                                </span>
                              </div>
                            )}
                            {player.height && player.weight && (
                              <div className="text-sm text-gray-600">
                                {player.height} • {player.weight} lbs
                              </div>
                            )}
                          </div>

                          {/* Stats */}
                          {stats.length > 0 && (
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-1">
                                {stats.map((stat, statIndex) => (
                                  <span
                                    key={statIndex}
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                  >
                                    {stat}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Status and Special Indicators */}
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
                              {status.label}
                            </span>
                            <div className="flex items-center space-x-1">
                              {player.has_medical_issues && (
                                <span className="text-red-500" title="Medical Issues">
                                  <Heart className="h-3 w-3" />
                                </span>
                              )}
                              {player.has_comparison && (
                                <span className="text-blue-500" title="Comparison Player">
                                  <Star className="h-3 w-3" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Empty Positions */}
          {positions.filter(pos => getPositionPlayers(pos.id).length === 0).length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Empty Positions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {positions
                  .filter(pos => getPositionPlayers(pos.id).length === 0)
                  .map((position) => {
                    const Icon = position.icon
                    return (
                      <div key={position.id} className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                        <Icon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-500">{position.name}</p>
                        <p className="text-xs text-gray-400">No players</p>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  )
}