import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  Plus,
  Layers,
  Lock
} from 'lucide-react';
import api from '../services/api';
import DepthChartPositionManager from '../components/DepthChartPositionManager';
import EnhancedBaseballFieldView from '../components/EnhancedBaseballFieldView';
import DepthChartSheetView from '../components/DepthChartSheetView';
import DepthChartSheetViewV2 from '../components/DepthChartSheetViewV2';
import {
  CreateDepthChartModal,
  AssignPlayerModal,
  PermissionsRequestModal,
  DepthChartHistoryTab,
  DepthChartPermissionsTab,
  DepthChartListView,
  DepthChartPageHeader,
  DepthChartSelector,
  DepthChartDetailHeader,
  DepthChartViewToggle
} from '../components/depthchart';
import { defaultPositions } from '../constants/depthChartConstants';

export default function DepthChart() {
  const queryClient = useQueryClient();
  const [selectedDepthChart, setSelectedDepthChart] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignPlayerModal, setShowAssignPlayerModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [activeTab, setActiveTab] = useState('chart'); // 'chart', 'positions', 'history', 'permissions'
  const [chartViewMode, setChartViewMode] = useState('list'); // 'list', 'enhanced', 'sheet'
  const [newDepthChart, setNewDepthChart] = useState({
    name: '',
    description: '',
    is_default: false,
    effective_date: '',
    notes: ''
  });

  // Fetch user permissions
  const { data: userPermissions } = useQuery({
    queryKey: ['user-permissions'],
    queryFn: async () => {
      const response = await api.get('/auth/permissions');
      return response.data;
    },
    onError: (_error) => {
      // Error loading permissions
    }
  });

  // Fetch recommended players for the selected position
  const { data: recommendedPlayersData } = useQuery({
    queryKey: ['recommended-players', selectedDepthChart, selectedPosition?.id],
    queryFn: async () => {
      if (!selectedDepthChart || !selectedPosition?.id) return [];
      const response = await api.get(`/depth-charts/byId/${selectedDepthChart}/recommended-players/${selectedPosition.id}`);
      return response.data;
    },
    enabled: !!selectedDepthChart && !!selectedPosition?.id,
    onError: (_error) => {
      // Error loading recommended players
    }
  });

  // Fetch depth charts
  const { data: depthChartsData, isLoading: depthChartsLoading } = useQuery({
    queryKey: ['depth-charts'],
    queryFn: async () => {
      const response = await api.get('/depth-charts');
      return response.data;
    },
    onError: (_error) => {
      toast.error('Failed to load depth charts');
    }
  });

  // Fetch specific depth chart
  const { data: depthChartData } = useQuery({
    queryKey: ['depth-chart', selectedDepthChart],
    queryFn: async () => {
      if (!selectedDepthChart) return null;
      const response = await api.get(`/depth-charts/byId/${selectedDepthChart}`);
      return response.data;
    },
    enabled: !!selectedDepthChart,
    onError: (_error) => {
      toast.error('Failed to load depth chart');
    }
  });

  // Fetch available players for assignment
  const { data: availablePlayersData } = useQuery({
    queryKey: ['available-players', selectedDepthChart],
    queryFn: async () => {
      if (!selectedDepthChart) return [];
      const response = await api.get(`/depth-charts/byId/${selectedDepthChart}/available-players`);
      return response.data;
    },
    enabled: !!selectedDepthChart,
    onError: (_error) => {
      // Error loading available players
    }
  });

  // Fetch depth chart history
  const { data: depthChartHistory } = useQuery({
    queryKey: ['depth-chart-history', selectedDepthChart],
    queryFn: async () => {
      if (!selectedDepthChart) return [];
      const response = await api.get(`/depth-charts/byId/${selectedDepthChart}/history`);
      return response.data;
    },
    enabled: !!selectedDepthChart && activeTab === 'history',
    onError: (_error) => {
      // Error loading depth chart history
    }
  });

  // Mutations
  const createDepthChartMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/depth-charts', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['depth-charts']);
      setShowCreateModal(false);
      setNewDepthChart({
        name: '',
        description: '',
        is_default: false,
        effective_date: '',
        notes: ''
      });
      toast.success('Depth chart created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create depth chart');
    }
  });

  const deleteDepthChartMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/depth-charts/byId/${id}`);
      return response.data;
    },
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries(['depth-charts']);
      if (selectedDepthChart === deletedId) {
        setSelectedDepthChart(null);
      }
      toast.success('Depth chart deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete depth chart');
    }
  });

  const assignPlayerMutation = useMutation({
    mutationFn: async ({ positionId, playerId, depthOrder, notes }) => {
      const response = await api.post(`/depth-charts/positions/byId/${positionId}/players`, {
        player_id: playerId,
        depth_order: depthOrder,
        notes
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['depth-chart', selectedDepthChart]);
      queryClient.invalidateQueries(['available-players', selectedDepthChart]);
      setShowAssignPlayerModal(false);
      toast.success('Player assigned successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to assign player');
    }
  });

  const unassignPlayerMutation = useMutation({
    mutationFn: async (assignmentId) => {
      const response = await api.delete(`/depth-charts/players/byId/${assignmentId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['depth-chart', selectedDepthChart]);
      queryClient.invalidateQueries(['available-players', selectedDepthChart]);
      toast.success('Player unassigned successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to unassign player');
    }
  });

  const duplicateDepthChartMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/depth-charts/byId/${id}/duplicate`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['depth-charts']);
      toast.success('Depth chart duplicated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to duplicate depth chart');
    }
  });

  // Auto-select first depth chart if none selected
  useEffect(() => {
    if (depthChartsData?.data?.length > 0 && !selectedDepthChart) {
      const defaultChart = depthChartsData.data.find(chart => chart.is_default) || depthChartsData.data[0];
      setSelectedDepthChart(defaultChart.id);
    }
  }, [depthChartsData, selectedDepthChart]);

  // Handle invalid view modes (field, fangraphs) by defaulting to list view
  useEffect(() => {
    if (chartViewMode === 'field' || chartViewMode === 'fangraphs') {
      setChartViewMode('list');
    }
  }, [chartViewMode]);

  const handleCreateDepthChart = () => {
    createDepthChartMutation.mutate({
      ...newDepthChart,
      positions: defaultPositions
    });
  };

  const handleAssignPlayer = (playerId, depthOrder = 1, notes = '') => {
    assignPlayerMutation.mutate({
      positionId: selectedPosition.id,
      playerId,
      depthOrder,
      notes
    });
    resetAssignPlayerModal();
  };

  const handleUnassignPlayer = (assignmentId) => {
    unassignPlayerMutation.mutate(assignmentId);
  };

  const handleDuplicateChart = (chartId) => {
    duplicateDepthChartMutation.mutate(chartId);
  };

  const resetAssignPlayerModal = () => {
    setShowAssignPlayerModal(false);
    setSelectedPosition(null);
  };

  const canView = userPermissions?.data?.includes('depth_chart_view');
  const canCreate = userPermissions?.data?.includes('depth_chart_create');
  const canEdit = userPermissions?.data?.includes('depth_chart_edit');
  const canDelete = userPermissions?.data?.includes('depth_chart_delete');
  const canManagePositions = userPermissions?.data?.includes('depth_chart_manage_positions');
  const canAssignPlayers = userPermissions?.data?.includes('player_assign');
  const canUnassignPlayers = userPermissions?.data?.includes('player_unassign');

  const depthCharts = depthChartsData?.data || [];
  const depthChart = depthChartData?.data;
  const availablePlayers = availablePlayersData?.data || [];
  const history = depthChartHistory?.data || [];

  // Filter available players for recommendations
  const recommendedPlayers = recommendedPlayersData?.data || [];

  if (!canView) {
    return (
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          <div className="text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-500">
              You don&apos;t have permission to view depth charts. Please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <DepthChartPageHeader
          canCreate={canCreate}
          canEdit={canEdit}
          selectedDepthChart={selectedDepthChart}
          onCreateClick={() => setShowCreateModal(true)}
          onEditClick={() => {/* TODO: Implement edit functionality */}}
          isCreating={createDepthChartMutation.isLoading}
        />

        {/* Depth Chart Selector */}
        <DepthChartSelector
          depthCharts={depthCharts}
          selectedDepthChart={selectedDepthChart}
          onSelect={setSelectedDepthChart}
          canEdit={canEdit}
          canDelete={canDelete}
          canCreate={canCreate}
          onEdit={() => {/* TODO: Implement edit functionality */}}
          onDelete={(chartId) => deleteDepthChartMutation.mutate(chartId)}
          onDuplicate={handleDuplicateChart}
          isDeleting={deleteDepthChartMutation.isLoading}
          isDuplicating={duplicateDepthChartMutation.isLoading}
        />

        {/* Depth Chart Display */}
        {selectedDepthChart && depthChart && (
          <div className="space-y-6">
            {/* Chart Header */}
            <DepthChartDetailHeader
              depthChart={depthChart}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              canManagePositions={canManagePositions}
            />

            {/* Tab Content */}
            {activeTab === 'chart' && (
              <div className="space-y-6">
                {/* View Toggle */}
                <DepthChartViewToggle
                  chartViewMode={chartViewMode}
                  onViewModeChange={setChartViewMode}
                />

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

                {/* Sheet View V2 */}
                {chartViewMode === 'sheetv2' && (
                  <DepthChartSheetViewV2 depthChart={depthChart} />
                )}

                {/* List View */}
                {chartViewMode === 'list' && (
                  <DepthChartListView
                    positions={depthChart.DepthChartPositions}
                    canAssignPlayers={canAssignPlayers}
                    canUnassignPlayers={canUnassignPlayers}
                    onAddPlayer={(position) => {
                      setSelectedPosition(position);
                      setShowAssignPlayerModal(true);
                    }}
                    onUnassignPlayer={handleUnassignPlayer}
                  />
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
              <DepthChartHistoryTab history={history} />
            )}

            {activeTab === 'permissions' && (
              <DepthChartPermissionsTab
                permissions={{
                  canView,
                  canCreate,
                  canEdit,
                  canDelete,
                  canManagePositions,
                  canAssignPlayers,
                  canUnassignPlayers
                }}
                onRequestPermissions={() => setShowPermissionsModal(true)}
              />
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
      <CreateDepthChartModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        formData={newDepthChart}
        onFormChange={setNewDepthChart}
        onSubmit={handleCreateDepthChart}
        isLoading={createDepthChartMutation.isLoading}
      />

      {/* Assign Player Modal */}
      <AssignPlayerModal
        isOpen={showAssignPlayerModal && !!selectedPosition}
        onClose={resetAssignPlayerModal}
        selectedPosition={selectedPosition}
        availablePlayers={availablePlayers}
        recommendedPlayers={recommendedPlayers}
        onAssignPlayer={(playerId) => handleAssignPlayer(playerId)}
      />

      {/* Permissions Request Modal */}
      <PermissionsRequestModal
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
      />
    </div>
  );
}
