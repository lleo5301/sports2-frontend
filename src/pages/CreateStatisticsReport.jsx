import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsService } from '../services/reports';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Filter,
  Users
} from 'lucide-react';

const CreateStatisticsReport = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const preSelectedPlayerId = searchParams.get('player');
  const [reportData, setReportData] = useState({
    title: '',
    description: '',
    type: 'team-statistics',
    date_range: {
      start_date: '',
      end_date: ''
    },
    scope: preSelectedPlayerId ? 'player' : 'team', // 'player' or 'team'
    players: preSelectedPlayerId ? [preSelectedPlayerId] : [],
    statistics: {
      batting_stats: true,
      pitching_stats: true,
      fielding_stats: true,
      team_performance: true,
      comparative_analysis: true
    },
    comparisons: {
      previous_period: false,
      league_average: false,
      team_goals: false
    },
    filters: {
      position: '',
      min_games: '',
      home_away: ''
    },
    analysis: '',
    recommendations: ''
  });

  // Fetch available players
  const { data: playersData = {} } = useQuery({
    queryKey: ['players-for-statistics'],
    queryFn: async () => {
      const response = await api.get('/players', { params: { status: 'active', limit: 100 } });
      return response.data;
    },
    staleTime: 300000 // 5 minutes
  });

  const players = playersData.data || [];

  // Pre-select player and set default title if coming from player page
  useEffect(() => {
    if (preSelectedPlayerId && players.length > 0) {
      const selectedPlayer = players.find(p => p.id === parseInt(preSelectedPlayerId));
      if (selectedPlayer) {
        setReportData(prev => ({
          ...prev,
          scope: 'player',
          players: [preSelectedPlayerId],
          title: prev.title || `Statistics Report - ${selectedPlayer.first_name} ${selectedPlayer.last_name}`,
          description: prev.description || `Statistical analysis for ${selectedPlayer.first_name} ${selectedPlayer.last_name}`
        }));
      }
    }
  }, [preSelectedPlayerId, players]);

  // Create report mutation
  const createReportMutation = useMutation({
    mutationFn: async (data) => {
      const reportPayload = {
        title: data.title,
        description: data.description,
        type: 'team-statistics',
        data_sources: data.scope === 'player' ? ['players'] : ['teams', 'players'],
        sections: [
          {
            title: data.scope === 'player' ? 'Player Statistics' : 'Team Statistics',
            type: 'table',
            data: data.scope === 'player' 
              ? data.players.map(playerId => {
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
                }).filter(row => row.length > 0)
              : [['Team Total', 'All', '0.250', '45', '120', '3.50', '25']], // Sample team data
            headers: data.scope === 'player' 
              ? ['Player', 'Position', 'AVG', 'HR', 'RBI', 'ERA', 'Wins']
              : ['Category', 'Position', 'AVG', 'HR', 'RBI', 'ERA', 'Wins']
          },
          {
            title: 'Statistical Analysis',
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
      
      return await reportsService.createReport(reportPayload);
    },
    onSuccess: (data) => {
      toast.success('Statistics report created successfully!');
      queryClient.invalidateQueries(['reports']);
      navigate('/reports');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create statistics report');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reportData.title.trim()) {
      toast.error('Please enter a report title');
      return;
    }
    if (reportData.scope === 'player' && reportData.players.length === 0) {
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

  const handleStatisticToggle = (statistic) => {
    setReportData(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        [statistic]: !prev.statistics[statistic]
      }
    }));
  };

  const handleComparisonToggle = (comparison) => {
    setReportData(prev => ({
      ...prev,
      comparisons: {
        ...prev.comparisons,
        [comparison]: !prev.comparisons[comparison]
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
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Create Statistics Report
          </h1>
          <p className="text-base-content/70">
            Create a comprehensive statistical analysis report
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Report Information */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">
                <BarChart3 className="w-5 h-5 mr-2" />
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
                    placeholder="e.g., Q1 Team Statistics Analysis"
                    value={reportData.title}
                    onChange={(e) => setReportData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Report Scope</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={reportData.scope}
                    onChange={(e) => setReportData(prev => ({ 
                      ...prev, 
                      scope: e.target.value,
                      players: e.target.value === 'team' ? [] : prev.players
                    }))}
                  >
                    <option value="team">Team Statistics</option>
                    <option value="player">Player Statistics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Start Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={reportData.date_range.start_date}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      date_range: { ...prev.date_range, start_date: e.target.value }
                    }))}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">End Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={reportData.date_range.end_date}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      date_range: { ...prev.date_range, end_date: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Brief description of the statistics report"
                  value={reportData.description}
                  onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Player Selection (only if scope is player) */}
          {reportData.scope === 'player' && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">
                  <Users className="w-5 h-5 mr-2" />
                  Player Selection
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Position Filter</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={reportData.filters.position}
                      onChange={(e) => setReportData(prev => ({
                        ...prev,
                        filters: { ...prev.filters, position: e.target.value }
                      }))}
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
                    </select>
                  </div>
                  
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
                      <span className="label-text">Selected Players</span>
                    </label>
                    <div className="text-sm text-base-content/70">
                      {reportData.players.length} player(s) selected
                    </div>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {players.map(player => (
                      <label key={player.id} className="cursor-pointer">
                        <div className="flex items-center space-x-3 p-2 rounded hover:bg-base-200">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={reportData.players.includes(player.id.toString())}
                            onChange={() => handlePlayerToggle(player.id.toString())}
                          />
                          <div className="flex-1">
                            <div className="font-medium">
                              {player.first_name} {player.last_name}
                            </div>
                            <div className="text-sm text-base-content/70">
                              {player.position} • {player.school || 'No school'}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Selection */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">
                <TrendingUp className="w-5 h-5 mr-2" />
                Statistics Categories
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(reportData.statistics).map(([statistic, enabled]) => (
                  <label key={statistic} className="cursor-pointer">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-base-200">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={enabled}
                        onChange={() => handleStatisticToggle(statistic)}
                      />
                      <span className="font-medium capitalize">
                        {statistic.replace('_', ' ')}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Comparisons */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">
                <Target className="w-5 h-5 mr-2" />
                Comparative Analysis
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(reportData.comparisons).map(([comparison, enabled]) => (
                  <label key={comparison} className="cursor-pointer">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-base-200">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-secondary"
                        checked={enabled}
                        onChange={() => handleComparisonToggle(comparison)}
                      />
                      <span className="font-medium capitalize">
                        {comparison.replace('_', ' ')}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis & Recommendations */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">
                <Award className="w-5 h-5 mr-2" />
                Analysis & Insights
              </h2>
              
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Statistical Analysis</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-32"
                    placeholder="Provide detailed analysis of statistical trends, patterns, and key insights..."
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
                    placeholder="Provide specific recommendations based on statistical findings..."
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
                  Create Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStatisticsReport;
