import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsService } from '../services/reports';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import MultiPlayerSelector from '../components/MultiPlayerSelector';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Users,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Filter
} from 'lucide-react';

const CreatePerformanceReport = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const preSelectedPlayerId = searchParams.get('player');
  const editReportId = searchParams.get('edit');
  const isEditMode = Boolean(editReportId);
  const [reportData, setReportData] = useState({
    title: '',
    description: '',
    type: 'player-performance',
    date_range: {
      start_date: '',
      end_date: ''
    },
    players: [],
    metrics: {
      batting_avg: true,
      home_runs: true,
      rbi: true,
      era: true,
      wins: true,
      losses: true,
      strikeouts: true
    },
    filters: {
      position: '',
      min_games: '',
      team_id: ''
    },
    analysis: '',
    recommendations: ''
  });

  // Fetch available players
  const { data: playersData = {} } = useQuery({
    queryKey: ['players-for-performance'],
    queryFn: async () => {
      const response = await api.get('/players', { params: { status: 'active', limit: 100 } });
      return response.data;
    },
    staleTime: 300000 // 5 minutes
  });

  const players = useMemo(() => playersData.data || [], [playersData.data]);

  // Fetch existing report data for edit mode
  const { data: existingReportData, isLoading: isLoadingReport } = useQuery({
    queryKey: ['report', editReportId],
    queryFn: () => reportsService.getReport(editReportId),
    enabled: isEditMode
  });

  // Pre-select player and set default title if coming from player page
  useEffect(() => {
    if (preSelectedPlayerId && players.length > 0) {
      const selectedPlayer = players.find(p => p.id === parseInt(preSelectedPlayerId));
      if (selectedPlayer) {
        setReportData(prev => ({
          ...prev,
          players: [preSelectedPlayerId],
          title: prev.title || `Performance Report - ${selectedPlayer.first_name} ${selectedPlayer.last_name}`,
          description: prev.description || `Performance analysis for ${selectedPlayer.first_name} ${selectedPlayer.last_name}`
        }));
      }
    }
  }, [preSelectedPlayerId, players]);

  // Populate form with existing report data in edit mode
  useEffect(() => {
    if (isEditMode && existingReportData?.data) {
      const report = existingReportData.data;
      setReportData(prev => ({
        ...prev,
        title: report.title || '',
        description: report.description || '',
        type: report.type || 'player-performance',
        date_range: {
          start_date: report.filters?.start_date || '',
          end_date: report.filters?.end_date || ''
        },
        players: report.filters?.players || [],
        metrics: report.filters?.metrics || prev.metrics,
        filters: {
          position: report.filters?.position || '',
          min_games: report.filters?.min_games || '',
          team_id: report.filters?.team_id || ''
        },
        analysis: report.sections?.find(s => s.title === 'Analysis')?.content || '',
        recommendations: report.sections?.find(s => s.title === 'Recommendations')?.content || ''
      }));
    }
  }, [isEditMode, existingReportData]);

  // Create/Update report mutation
  const createReportMutation = useMutation({
    mutationFn: async (data) => {
      const reportPayload = {
        title: data.title,
        description: data.description,
        type: 'player-performance',
        data_sources: ['players'],
        sections: [
          {
            title: 'Performance Metrics',
            type: 'table',
            data: data.players.map(playerId => {
              const player = players.find(p => p.id === parseInt(playerId));
              return player ? [
                `${player.first_name} ${player.last_name}`,
                player.position,
                player.batting_avg || 'N/A',
                player.home_runs || 'N/A',
                player.rbi || 'N/A',
                player.era || 'N/A',
                player.wins || 'N/A'
              ] : [];
            }).filter(row => row.length > 0),
            headers: ['Player', 'Position', 'AVG', 'HR', 'RBI', 'ERA', 'Wins']
          },
          {
            title: 'Analysis',
            type: 'text',
            content: data.analysis
          },
          {
            title: 'Recommendations',
            type: 'text',
            content: data.recommendations
          }
        ],
        filters: data.filters,
        schedule: null
      };

      if (isEditMode) {
        return await reportsService.updateReport(editReportId, reportPayload);
      } else {
        return await reportsService.createReport(reportPayload);
      }
    },
    onSuccess: (data) => {
      toast.success(isEditMode ? 'Performance report updated successfully!' : 'Performance report created successfully!');
      queryClient.invalidateQueries(['reports']);
      navigate('/reports');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} performance report`);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reportData.title.trim()) {
      toast.error('Please enter a report title');
      return;
    }
    if (reportData.players.length === 0) {
      toast.error('Please select at least one player');
      return;
    }
    createReportMutation.mutate(reportData);
  };

  const handlePlayerToggle = (playerId) => {
    setReportData(prev => ({
      ...prev,
      players: prev.players.includes(playerId)
        ? prev.players.filter(id => id !== playerId)
        : [...prev.players, playerId]
    }));
  };

  const handleMetricToggle = (metric) => {
    setReportData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [metric]: !prev.metrics[metric]
      }
    }));
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/reports')}
            className="btn btn-ghost btn-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isEditMode ? 'Edit Performance Report' : 'Create Performance Report'}
          </h1>
          <p className="text-foreground/70">
            {isEditMode ? 'Update your player performance analysis report' : 'Create a comprehensive player performance analysis report'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Report Information */}
          <div className="card bg-background shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">
                <Users className="w-5 h-5 mr-2" />
                Report Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Report Title *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder="e.g., Q1 Player Performance Analysis"
                    value={reportData.title}
                    onChange={(e) => setReportData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Date Range</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="input input-bordered flex-1"
                      value={reportData.date_range.start_date}
                      onChange={(e) => setReportData(prev => ({
                        ...prev,
                        date_range: { ...prev.date_range, start_date: e.target.value }
                      }))}
                    />
                    <input
                      type="date"
                      className="input input-bordered flex-1"
                      value={reportData.date_range.end_date}
                      onChange={(e) => setReportData(prev => ({
                        ...prev,
                        date_range: { ...prev.date_range, end_date: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Brief description of the performance report"
                  value={reportData.description}
                  onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Player Selection */}
          <MultiPlayerSelector
            selectedPlayerIds={reportData.players}
            onPlayersChange={(playerIds) => setReportData(prev => ({ ...prev, players: playerIds }))}
            players={players}
            label="Player Selection"
            allowCreate={true}
            positionFilter={reportData.filters.position}
            onPositionFilterChange={(position) => setReportData(prev => ({
              ...prev,
              filters: { ...prev.filters, position }
            }))}
          />

          {/* Additional Filters */}
          <div className="card bg-background shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">
                <Filter className="w-5 h-5 mr-2" />
                Additional Filters
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Min Games Played</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={reportData.filters.min_games}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      filters: { ...prev.filters, min_games: e.target.value }
                    }))}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Team Filter</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder="Team ID or name"
                    value={reportData.filters.team_id}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      filters: { ...prev.filters, team_id: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Selection */}
          <div className="card bg-background shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">
                <TrendingUp className="w-5 h-5 mr-2" />
                Performance Metrics
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(reportData.metrics).map(([metric, enabled]) => (
                  <label key={metric} className="cursor-pointer">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-content1">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={enabled}
                        onChange={() => handleMetricToggle(metric)}
                      />
                      <span className="font-medium capitalize">
                        {metric.replace('_', ' ')}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis & Recommendations */}
          <div className="card bg-background shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">
                <Award className="w-5 h-5 mr-2" />
                Analysis & Recommendations
              </h2>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Performance Analysis</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-32"
                    placeholder="Provide detailed analysis of player performance trends, strengths, and areas for improvement..."
                    value={reportData.analysis}
                    onChange={(e) => setReportData(prev => ({ ...prev, analysis: e.target.value }))}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Recommendations</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-32"
                    placeholder="Provide specific recommendations for training, development, or strategic adjustments..."
                    value={reportData.recommendations}
                    onChange={(e) => setReportData(prev => ({ ...prev, recommendations: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/reports')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createReportMutation.isLoading}
            >
              {createReportMutation.isLoading ? (
                <>
                  <div className="loading loading-spinner loading-sm mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Update Report' : 'Create Report'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePerformanceReport;
