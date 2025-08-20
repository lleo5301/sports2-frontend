import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  Users,
  Eye,
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
  Filter,
  Plus,
  Edit,
  Trash2,
  Settings,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  UserPlus,
  UserMinus,
  Layers,
  Copy,
  History,
  Lock,
  Unlock,
  Clock,
  Archive,
  RefreshCw,
  CheckCircle
} from 'lucide-react'
import api from '../services/api'
import DepthChartPositionManager from '../components/DepthChartPositionManager'
import EnhancedBaseballFieldView from '../components/EnhancedBaseballFieldView'
import DepthChartSheetView from '../components/DepthChartSheetView'

// Default position configurations
const defaultPositions = [
  { position_code: 'P', position_name: 'Pitcher', color: '#EF4444', icon: 'Shield', sort_order: 1 },
  { position_code: 'C', position_name: 'Catcher', color: '#3B82F6', icon: 'Shield', sort_order: 2 },
  { position_code: '1B', position_name: 'First Base', color: '#10B981', icon: 'Target', sort_order: 3 },
  { position_code: '2B', position_name: 'Second Base', color: '#F59E0B', icon: 'Target', sort_order: 4 },
  { position_code: '3B', position_name: 'Third Base', color: '#8B5CF6', icon: 'Target', sort_order: 5 },
  { position_code: 'SS', position_name: 'Shortstop', color: '#6366F1', icon: 'Target', sort_order: 6 },
  { position_code: 'LF', position_name: 'Left Field', color: '#EC4899', icon: 'Zap', sort_order: 7 },
  { position_code: 'CF', position_name: 'Center Field', color: '#14B8A6', icon: 'Zap', sort_order: 8 },
  { position_code: 'RF', position_name: 'Right Field', color: '#F97316', icon: 'Zap', sort_order: 9 },
  { position_code: 'DH', position_name: 'Designated Hitter', color: '#06B6D4', icon: 'Heart', sort_order: 10 }
]

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  injured: 'bg-red-100 text-red-800',
  suspended: 'bg-yellow-100 text-yellow-800'
}

export default function DepthChart() {
  const queryClient = useQueryClient()
  const [selectedDepthChart, setSelectedDepthChart] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPositionModal, setShowPositionModal] = useState(false)
  const [showAssignPlayerModal, setShowAssignPlayerModal] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [activeTab, setActiveTab] = useState('chart') // 'chart', 'positions', 'history', 'permissions'
  const [chartViewMode, setChartViewMode] = useState('list') // 'list', 'enhanced', 'sheet'
  const [filters, setFilters] = useState({
    search: '',
    position: '',
    status: 'active',
    school_type: ''
  })
  const [sortBy, setSortBy] = useState('name')
  const [newDepthChart, setNewDepthChart] = useState({
    name: '',
    description: '',
    is_default: false,
    effective_date: '',
    notes: ''
  })

  // State for Assign Player Modal
  const [playerSearch, setPlayerSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [viewMode, setViewMode] = useState('recommended'); // 'recommended' or 'all'

  // Fetch user permissions
  const { data: userPermissions } = useQuery({
    queryKey: ['user-permissions'],
    queryFn: async () => {
      const response = await api.get('/auth/permissions')
      return response.data
    },
    onError: (error) => {
      console.error('Error loading permissions:', error)
    }
  })

  // Fetch recommended players for the selected position
  const { data: recommendedPlayersData } = useQuery({
    queryKey: ['recommended-players', selectedDepthChart, selectedPosition?.id],
    queryFn: async () => {
      if (!selectedDepthChart || !selectedPosition?.id) return []
      const response = await api.get(`/depth-charts/byId/${selectedDepthChart}/recommended-players/${selectedPosition.id}`)
      return response.data
    },
    enabled: !!selectedDepthChart && !!selectedPosition?.id,
    onError: (error) => {
      console.error('Error loading recommended players:', error)
    }
  })

  // Fetch depth charts
  const { data: depthChartsData, isLoading: depthChartsLoading } = useQuery({
    queryKey: ['depth-charts'],
    queryFn: async () => {
      const response = await api.get('/depth-charts')
      return response.data
    },
    onError: (error) => {
      toast.error('Failed to load depth charts')
      console.error('Error loading depth charts:', error)
    }
  })

  // Fetch specific depth chart
  const { data: depthChartData, isLoading: depthChartLoading } = useQuery({
    queryKey: ['depth-chart', selectedDepthChart],
    queryFn: async () => {
      if (!selectedDepthChart) return null
      const response = await api.get(`/depth-charts/byId/${selectedDepthChart}`)
      return response.data
    },
    enabled: !!selectedDepthChart,
    onError: (error) => {
      toast.error('Failed to load depth chart')
      console.error('Error loading depth chart:', error)
    }
  })

  // Fetch available players for assignment
  const { data: availablePlayersData } = useQuery({
    queryKey: ['available-players', selectedDepthChart],
    queryFn: async () => {
      if (!selectedDepthChart) return []
      const response = await api.get(`/depth-charts/byId/${selectedDepthChart}/available-players`)
      return response.data
    },
    enabled: !!selectedDepthChart,
    onError: (error) => {
      console.error('Error loading available players:', error)
    }
  })

  // Fetch depth chart history
  const { data: depthChartHistory } = useQuery({
    queryKey: ['depth-chart-history', selectedDepthChart],
    queryFn: async () => {
      if (!selectedDepthChart) return []
      const response = await api.get(`/depth-charts/byId/${selectedDepthChart}/history`)
      return response.data
    },
    enabled: !!selectedDepthChart && activeTab === 'history',
    onError: (error) => {
      console.error('Error loading depth chart history:', error)
    }
  })

  // Mutations
  const createDepthChartMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/depth-charts', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['depth-charts'])
      setShowCreateModal(false)
      setNewDepthChart({
        name: '',
        description: '',
        is_default: false,
        effective_date: '',
        notes: ''
      })
      toast.success('Depth chart created successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create depth chart')
    }
  })

  const updateDepthChartMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/depth-charts/byId/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['depth-charts'])
      queryClient.invalidateQueries(['depth-chart', selectedDepthChart])
      setShowEditModal(false)
      toast.success('Depth chart updated successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update depth chart')
    }
  })

  const deleteDepthChartMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/depth-charts/byId/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['depth-charts'])
      if (selectedDepthChart === id) {
        setSelectedDepthChart(null)
      }
      toast.success('Depth chart deleted successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete depth chart')
    }
  })

  const assignPlayerMutation = useMutation({
    mutationFn: async ({ positionId, playerId, depthOrder, notes }) => {
      const response = await api.post(`/depth-charts/positions/byId/${positionId}/players`, {
        player_id: playerId,
        depth_order: depthOrder,
        notes
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['depth-chart', selectedDepthChart])
      queryClient.invalidateQueries(['available-players', selectedDepthChart])
      setShowAssignPlayerModal(false)
      toast.success('Player assigned successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to assign player')
    }
  })

  const unassignPlayerMutation = useMutation({
    mutationFn: async (assignmentId) => {
      const response = await api.delete(`/depth-charts/players/byId/${assignmentId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['depth-chart', selectedDepthChart])
      queryClient.invalidateQueries(['available-players', selectedDepthChart])
      toast.success('Player unassigned successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to unassign player')
    }
  })

  const duplicateDepthChartMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/depth-charts/byId/${id}/duplicate`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['depth-charts'])
      toast.success('Depth chart duplicated successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to duplicate depth chart')
    }
  })

  // Auto-select first depth chart if none selected
  useEffect(() => {
    if (depthChartsData?.data?.length > 0 && !selectedDepthChart) {
      const defaultChart = depthChartsData.data.find(chart => chart.is_default) || depthChartsData.data[0]
      setSelectedDepthChart(defaultChart.id)
    }
  }, [depthChartsData, selectedDepthChart])

  // Handle invalid view modes (field, fangraphs) by defaulting to list view
  useEffect(() => {
    if (chartViewMode === 'field' || chartViewMode === 'fangraphs') {
      setChartViewMode('list')
    }
  }, [chartViewMode])

  const handleCreateDepthChart = () => {
    createDepthChartMutation.mutate({
      ...newDepthChart,
      positions: defaultPositions
    })
  }

  const handleAssignPlayer = (playerId, depthOrder = 1, notes = '') => {
    assignPlayerMutation.mutate({
      positionId: selectedPosition.id,
      playerId,
      depthOrder,
      notes
    })
    resetAssignPlayerModal()
  }

  const handleUnassignPlayer = (assignmentId) => {
    unassignPlayerMutation.mutate(assignmentId)
  }

  const handleDuplicateChart = (chartId) => {
    duplicateDepthChartMutation.mutate(chartId)
  }

  const resetAssignPlayerModal = () => {
    setShowAssignPlayerModal(false)
    setSelectedPosition(null)
    setPlayerSearch('')
    setPositionFilter('')
    setViewMode('recommended')
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

  const canView = userPermissions?.data?.includes('depth_chart_view')
  const canCreate = userPermissions?.data?.includes('depth_chart_create')
  const canEdit = userPermissions?.data?.includes('depth_chart_edit')
  const canDelete = userPermissions?.data?.includes('depth_chart_delete')
  const canManagePositions = userPermissions?.data?.includes('depth_chart_manage_positions')
  const canAssignPlayers = userPermissions?.data?.includes('player_assign')
  const canUnassignPlayers = userPermissions?.data?.includes('player_unassign')

  const depthCharts = depthChartsData?.data || []
  const depthChart = depthChartData?.data
  const availablePlayers = availablePlayersData?.data || []
  const history = depthChartHistory?.data || []

  // Filter available players for recommendations
  const recommendedPlayers = recommendedPlayersData?.data || []

  if (!canView) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          <div className="text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-500">
              You don't have permission to view depth charts. Please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Depth Chart</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your team's depth chart configurations and player assignments.
            </p>
          </div>
          <div className="flex gap-2">
            {canCreate && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
                disabled={createDepthChartMutation.isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Depth Chart
              </button>
            )}
            {canEdit && selectedDepthChart && (
              <button
                onClick={() => setShowEditModal(true)}
                className="btn btn-outline"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Depth Chart Selector */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Select Depth Chart</h2>
            <div className="flex gap-2">
              {canEdit && selectedDepthChart && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="btn btn-outline btn-sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              )}
              {canDelete && selectedDepthChart && (
                <button
                  onClick={() => deleteDepthChartMutation.mutate(selectedDepthChart)}
                  className="btn btn-outline btn-sm btn-error"
                  disabled={deleteDepthChartMutation.isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              )}
              {canCreate && selectedDepthChart && (
                <button
                  onClick={() => handleDuplicateChart(selectedDepthChart)}
                  className="btn btn-outline btn-sm"
                  disabled={duplicateDepthChartMutation.isLoading}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Duplicate
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {depthCharts.map((chart) => (
              <div
                key={chart.id}
                className={`card cursor-pointer transition-all ${
                  selectedDepthChart === chart.id
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedDepthChart(chart.id)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{chart.name}</h3>
                    <div className="flex items-center gap-1">
                      {chart.is_default && (
                        <span className="badge badge-primary badge-sm">Default</span>
                      )}
                      {!chart.is_active && (
                        <span className="badge badge-ghost badge-sm">Archived</span>
                      )}
                    </div>
                  </div>
                  {chart.description && (
                    <p className="text-sm text-gray-600 mb-2">{chart.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>v{chart.version}</span>
                    <span>{chart.DepthChartPositions?.length || 0} positions</span>
                  </div>
                  {chart.effective_date && (
                    <div className="text-xs text-gray-400 mt-1">
                      Effective: {new Date(chart.effective_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Depth Chart Display */}
        {selectedDepthChart && depthChart && (
          <div className="space-y-6">
            {/* Chart Header */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">{depthChart.name}</h2>
                  {depthChart.description && (
                    <p className="text-gray-600 mt-1">{depthChart.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Version {depthChart.version}</span>
                  <span>Created by {depthChart.Creator?.first_name} {depthChart.Creator?.last_name}</span>
                  {depthChart.effective_date && (
                    <span>Effective {new Date(depthChart.effective_date).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="tabs tabs-boxed">
                <button
                  className={`tab ${activeTab === 'chart' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('chart')}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Chart
                </button>
                {canManagePositions && (
                  <button
                    className={`tab ${activeTab === 'positions' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('positions')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Positions
                  </button>
                )}
                <button
                  className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('history')}
                >
                  <History className="h-4 w-4 mr-2" />
                  History
                </button>
                <button
                  className={`tab ${activeTab === 'permissions' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('permissions')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Permissions
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'chart' && (
              <div className="space-y-6">
                {/* View Toggle */}
                <div className="flex justify-center">
                  <div className="btn-group">
                    <button
                      className={`btn btn-sm ${chartViewMode === 'list' ? 'btn-active' : 'btn-outline'}`}
                      onClick={() => setChartViewMode('list')}
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      List View
                    </button>
                    <button
                      className={`btn btn-sm ${chartViewMode === 'enhanced' ? 'btn-active' : 'btn-outline'}`}
                      onClick={() => setChartViewMode('enhanced')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Pro View
                    </button>
                    <button
                      className={`btn btn-sm ${chartViewMode === 'sheet' ? 'btn-active' : 'btn-outline'}`}
                      onClick={() => setChartViewMode('sheet')}
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      Sheet View
                    </button>
                  </div>
                </div>



                {/* Enhanced Field View */}
                {chartViewMode === 'enhanced' && (
                  <EnhancedBaseballFieldView
                    positions={depthChart.DepthChartPositions || []}
                    assignedPlayers={depthChart.DepthChartPositions?.flatMap(pos => 
                      pos.DepthChartPlayers?.map(player => ({
                        ...player,
                        position_code: pos.position_code
                      })) || []
                    ) || []}
                    onPositionClick={(positionCode) => {
                      const position = depthChart.DepthChartPositions?.find(p => p.position_code === positionCode);
                      if (position) {
                        setSelectedPosition(position);
                        setShowAssignPlayerModal(true);
                      }
                    }}
                    selectedPosition={selectedPosition?.position_code}
                  />
                )}

                {/* Sheet View */}
                {chartViewMode === 'sheet' && (
                  <DepthChartSheetView depthChart={depthChart} />
                )}



                {/* List View */}
                {chartViewMode === 'list' && (
                  <>
                    {/* Positions */}
                    {depthChart.DepthChartPositions?.map((position) => (
                  <div key={position.id} className="card">
                    <div className="p-6">
                      {/* Position Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded mr-3"
                            style={{ backgroundColor: position.color }}
                          ></div>
                          <h3 className="text-lg font-semibold">{position.position_name}</h3>
                          <span className="ml-3 text-sm text-gray-500">
                            {position.DepthChartPlayers?.length || 0} players
                            {position.max_players && ` / ${position.max_players} max`}
                          </span>
                        </div>
                        {canAssignPlayers && (
                          <button
                            onClick={() => {
                              setSelectedPosition(position)
                              setShowAssignPlayerModal(true)
                            }}
                            className="btn btn-outline btn-sm"
                            disabled={position.max_players && position.DepthChartPlayers?.length >= position.max_players}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Add Player
                          </button>
                        )}
                      </div>

                      {/* Players */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {position.DepthChartPlayers?.map((assignment, index) => {
                          const player = assignment.Player
                          const status = getPlayerStatus(player)
                          const stats = getPlayerStats(player)

                          return (
                            <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-semibold text-gray-900">
                                      {player.first_name} {player.last_name}
                                    </h4>
                                    <span className="text-sm text-gray-500">#{assignment.depth_order}</span>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {player.position} • {player.school_type}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Link
                                    to={`/players/${player.id}`}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                    title="View Details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                  {canUnassignPlayers && (
                                    <button
                                      onClick={() => handleUnassignPlayer(assignment.id)}
                                      className="p-1 text-gray-400 hover:text-red-600"
                                      title="Remove Player"
                                    >
                                      <UserMinus className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Player Details */}
                              <div className="space-y-2 mb-3">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>Grad: {player.graduation_year || 'N/A'}</span>
                                </div>
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

                              {/* Assignment Notes */}
                              {assignment.notes && (
                                <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                                  {assignment.notes}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Empty State */}
                      {(!position.DepthChartPlayers || position.DepthChartPlayers.length === 0) && (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                          <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">No players assigned to this position</p>
                          {canAssignPlayers && (
                            <button
                              onClick={() => {
                                setSelectedPosition(position)
                                setShowAssignPlayerModal(true)
                              }}
                              className="btn btn-outline btn-sm mt-2"
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Add Player
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                  </>
                )}
              </div>
            )}

            {activeTab === 'positions' && canManagePositions && (
              <div className="card p-6">
                <DepthChartPositionManager
                  depthChartId={selectedDepthChart}
                  positions={depthChart.DepthChartPositions || []}
                />
              </div>
            )}

            {activeTab === 'history' && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Depth Chart History</h3>
                <div className="space-y-4">
                  {history.map((entry) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{entry.action}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{entry.description}</p>
                      {entry.User && (
                        <p className="text-xs text-gray-500 mt-1">
                          By: {entry.User.first_name} {entry.User.last_name}
                        </p>
                      )}
                    </div>
                  ))}
                  {history.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <History className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No history available</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'permissions' && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Access Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Your Permissions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {canView ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                        <span className="text-sm">View Depth Charts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {canCreate ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                        <span className="text-sm">Create Depth Charts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {canEdit ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                        <span className="text-sm">Edit Depth Charts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {canDelete ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                        <span className="text-sm">Delete Depth Charts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {canManagePositions ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                        <span className="text-sm">Manage Positions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {canAssignPlayers ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                        <span className="text-sm">Assign Players</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {canUnassignPlayers ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                        <span className="text-sm">Unassign Players</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Need More Access?</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Contact your team administrator to request additional permissions for depth chart management.
                    </p>
                    <button
                      onClick={() => setShowPermissionsModal(true)}
                      className="btn btn-outline btn-sm"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Request Permissions
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {depthChartsLoading && (
          <div className="card p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading depth charts...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!depthChartsLoading && depthCharts.length === 0 && (
          <div className="card p-8">
            <div className="text-center">
              <Layers className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No depth charts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first depth chart.
              </p>
              {canCreate && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Depth Chart
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Depth Chart Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Depth Chart</h3>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Name *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={newDepthChart.name}
                  onChange={(e) => setNewDepthChart(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Spring Training 2024"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={newDepthChart.description}
                  onChange={(e) => setNewDepthChart(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                  rows={3}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Effective Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={newDepthChart.effective_date}
                  onChange={(e) => setNewDepthChart(prev => ({ ...prev, effective_date: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Notes</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={newDepthChart.notes}
                  onChange={(e) => setNewDepthChart(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional notes"
                  rows={2}
                />
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Set as default depth chart</span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={newDepthChart.is_default}
                    onChange={(e) => setNewDepthChart(prev => ({ ...prev, is_default: e.target.checked }))}
                  />
                </label>
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateDepthChart}
                disabled={!newDepthChart.name || createDepthChartMutation.isLoading}
              >
                {createDepthChartMutation.isLoading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Player Modal */}
      {showAssignPlayerModal && selectedPosition && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">
              Assign Player to {selectedPosition.position_name}
            </h3>
            
            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="label">
                    <span className="label-text">Search Players</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, position, or stats..."
                    className="input input-bordered w-full"
                    value={playerSearch}
                    onChange={(e) => setPlayerSearch(e.target.value)}
                  />
                </div>
                <div className="w-48">
                  <label className="label">
                    <span className="label-text">Filter by Position</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={positionFilter}
                    onChange={(e) => setPositionFilter(e.target.value)}
                  >
                    <option value="">All Positions</option>
                    <option value="P">Pitcher</option>
                    <option value="C">Catcher</option>
                    <option value="1B">First Base</option>
                    <option value="2B">Second Base</option>
                    <option value="3B">Third Base</option>
                    <option value="SS">Shortstop</option>
                    <option value="LF">Left Field</option>
                    <option value="CF">Center Field</option>
                    <option value="RF">Right Field</option>
                    <option value="DH">Designated Hitter</option>
                    <option value="UTIL">Utility</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  className={`btn btn-sm ${viewMode === 'recommended' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setViewMode('recommended')}
                >
                  <Star className="h-4 w-4 mr-1" />
                  Recommended
                </button>
                <button
                  className={`btn btn-sm ${viewMode === 'all' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setViewMode('all')}
                >
                  <Users className="h-4 w-4 mr-1" />
                  All Players
                </button>
              </div>
            </div>

            {/* Player Lists */}
            <div className="space-y-6">
              {/* Recommended Players */}
              {viewMode === 'recommended' && (
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Top Recommendations for {selectedPosition.position_name}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {recommendedPlayers
                      .filter(player => 
                        !playerSearch || 
                        `${player.first_name} ${player.last_name}`.toLowerCase().includes(playerSearch.toLowerCase()) ||
                        player.position?.toLowerCase().includes(playerSearch.toLowerCase())
                      )
                      .map((player) => (
                        <div
                          key={player.id}
                          className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 cursor-pointer transition-all"
                          onClick={() => handleAssignPlayer(player.id)}
                        >
                          <div className="card-body p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-bold text-lg">
                                {player.first_name} {player.last_name}
                              </h5>
                              <div className="flex items-center gap-2">
                                <span className="badge badge-primary">{player.position}</span>
                                <span className="text-sm font-bold text-blue-600">
                                  Score: {player.score}
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-4">
                                <span>{player.school_type}</span>
                                {player.graduation_year && (
                                  <span>Grad: {player.graduation_year}</span>
                                )}
                                {player.height && player.weight && (
                                  <span>{player.height} • {player.weight} lbs</span>
                                )}
                              </div>
                            </div>

                            {/* Player Stats */}
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-1">
                                {player.batting_avg && (
                                  <span className="badge badge-outline badge-sm">
                                    AVG: {player.batting_avg}
                                  </span>
                                )}
                                {player.home_runs && (
                                  <span className="badge badge-outline badge-sm">
                                    HR: {player.home_runs}
                                  </span>
                                )}
                                {player.rbi && (
                                  <span className="badge badge-outline badge-sm">
                                    RBI: {player.rbi}
                                  </span>
                                )}
                                {player.stolen_bases && (
                                  <span className="badge badge-outline badge-sm">
                                    SB: {player.stolen_bases}
                                  </span>
                                )}
                                {player.era && (
                                  <span className="badge badge-outline badge-sm">
                                    ERA: {player.era}
                                  </span>
                                )}
                                {player.strikeouts && (
                                  <span className="badge badge-outline badge-sm">
                                    K: {player.strikeouts}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Recommendation Reasons */}
                            <div className="space-y-1">
                              {player.reasons?.map((reason, index) => (
                                <div key={index} className="text-xs text-blue-700 flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {reason}
                                </div>
                              ))}
                            </div>

                            {/* Status Indicators */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-1">
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
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignPlayer(player.id);
                                }}
                              >
                                <UserPlus className="h-3 w-3 mr-1" />
                                Assign
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  {recommendedPlayers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Star className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No recommendations available</p>
                      <p className="text-sm">Try switching to "All Players" view</p>
                    </div>
                  )}
                </div>
              )}

              {/* All Players */}
              {viewMode === 'all' && (
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    All Available Players
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {availablePlayers
                      .filter(player => 
                        (!playerSearch || 
                          `${player.first_name} ${player.last_name}`.toLowerCase().includes(playerSearch.toLowerCase()) ||
                          player.position?.toLowerCase().includes(playerSearch.toLowerCase())) &&
                        (!positionFilter || player.position === positionFilter)
                      )
                      .map((player) => {
                        const status = getPlayerStatus(player);
                        const stats = getPlayerStats(player);
                        
                        return (
                          <div
                            key={player.id}
                            className="card border border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
                            onClick={() => handleAssignPlayer(player.id)}
                          >
                            <div className="card-body p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-bold text-lg">
                                  {player.first_name} {player.last_name}
                                </h5>
                                <span className="badge badge-outline">{player.position}</span>
                              </div>
                              
                              <div className="text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-4">
                                  <span>{player.school_type}</span>
                                  {player.graduation_year && (
                                    <span>Grad: {player.graduation_year}</span>
                                  )}
                                  {player.height && player.weight && (
                                    <span>{player.height} • {player.weight} lbs</span>
                                  )}
                                </div>
                              </div>

                              {/* Player Stats */}
                              {stats.length > 0 && (
                                <div className="mb-3">
                                  <div className="flex flex-wrap gap-1">
                                    {stats.map((stat, statIndex) => (
                                      <span
                                        key={statIndex}
                                        className="badge badge-outline badge-sm"
                                      >
                                        {stat}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Status and Actions */}
                              <div className="flex items-center justify-between">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
                                  {status.label}
                                </span>
                                <div className="flex items-center gap-1">
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
                                  <button
                                    className="btn btn-outline btn-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAssignPlayer(player.id);
                                    }}
                                  >
                                    <UserPlus className="h-3 w-3 mr-1" />
                                    Assign
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  
                  {availablePlayers.filter(player => 
                    (!playerSearch || 
                      `${player.first_name} ${player.last_name}`.toLowerCase().includes(playerSearch.toLowerCase()) ||
                      player.position?.toLowerCase().includes(playerSearch.toLowerCase())) &&
                    (!positionFilter || player.position === positionFilter)
                  ).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No players match your filters</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-action">
              <button
                className="btn"
                onClick={resetAssignPlayerModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Request Modal */}
      {showPermissionsModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Request Permissions</h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                To request additional permissions for depth chart management, please contact your team administrator.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Required Permissions:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• depth_chart_create - Create new depth charts</li>
                  <li>• depth_chart_edit - Edit existing depth charts</li>
                  <li>• depth_chart_delete - Delete depth charts</li>
                  <li>• depth_chart_manage_positions - Manage position configurations</li>
                  <li>• player_assign - Assign players to positions</li>
                  <li>• player_unassign - Remove players from positions</li>
                </ul>
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowPermissionsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}