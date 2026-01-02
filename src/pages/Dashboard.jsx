import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { playersService } from '../services/players';
import { teamsService } from '../services/teams';
import { reportsService } from '../services/reports';
import { useAuth } from '../contexts/AuthContext';
import { useKeyboardClick } from '../hooks/useKeyboardClick';
import TeamStatistics from '../components/TeamStatistics';
import { Users, FileText, Activity, Zap, Plus, ClipboardList, TrendingUp, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch players
  const { data: playersResponse, isLoading: playersLoading, error: playersError } = useQuery({
    queryKey: ['players', { limit: 5 }],
    queryFn: () => playersService.getPlayers({ limit: 5 }),
  });

  // Fetch scouting reports
  const { data: reportsResponse, isLoading: reportsLoading, error: reportsError } = useQuery({
    queryKey: ['scouting-reports', { limit: 5 }],
    queryFn: () => reportsService.getScoutingReports({ limit: 5 }),
  });

  // Fetch user's team if they have a team_id
  const { data: teamResponse, isLoading: teamLoading, error: teamError } = useQuery({
    queryKey: ['team', user?.team_id],
    queryFn: () => teamsService.getTeam(user.team_id),
    enabled: !!user?.team_id,
  });

  // Calculate stats
  const totalPlayers = playersResponse?.pagination?.total || 0;
  const activePlayers = playersResponse?.data?.filter(p => p.status === 'active').length || 0;
  const totalReports = reportsResponse?.pagination?.total || 0;
  const recentReports = reportsResponse?.data?.length || 0;

  const stats = {
    totalPlayers,
    activePlayers,
    totalReports,
    recentReports
  };

  const recentPlayers = playersResponse?.data || [];
  const recentReportsData = reportsResponse?.data || [];
  const loading = playersLoading || reportsLoading || teamLoading;
  const error = playersError || reportsError || teamError;

  // Quick action handlers
  const handleAddPlayer = () => navigate('/players/create');
  const handleCreateReport = () => navigate('/scouting/create');
  const handleViewAnalytics = () => navigate('/reports');
  const handleViewPerformance = () => navigate('/performance');

  if (loading) {
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

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="alert alert-error">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error.message || 'Failed to load dashboard data'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-4xl font-bold text-base-content mb-3 page-title tracking-tight">
            Dashboard
          </h1>
          <p className="text-base-content/60 text-lg">
            Welcome back! Here's an overview of your team's data.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="bento-grid mb-10">
          {/* Total Players - Medium card */}
          <div className="bento-sm card hover-lift animate-fade-in stagger-1">
            <div className="card-body flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <span className="badge badge-primary badge-outline">Players</span>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold tracking-tight">{stats.totalPlayers}</p>
                <p className="text-sm text-base-content/60 mt-1">Total Players</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-success text-sm font-medium">{stats.activePlayers} active</span>
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-gentle-pulse"></span>
              </div>
            </div>
          </div>

          {/* Scouting Reports - Medium card */}
          <div className="bento-sm card hover-lift animate-fade-in stagger-2">
            <div className="card-body flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-secondary/10">
                  <FileText className="w-6 h-6 text-secondary" />
                </div>
                <span className="badge badge-secondary badge-outline">Reports</span>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold tracking-tight">{stats.totalReports}</p>
                <p className="text-sm text-base-content/60 mt-1">Scouting Reports</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-info text-sm font-medium">{stats.recentReports} recent</span>
              </div>
            </div>
          </div>

          {/* Team Status - Medium card */}
          <div className="bento-sm card hover-lift animate-fade-in stagger-3">
            <div className="card-body flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-success/10">
                  <Activity className="w-6 h-6 text-success" />
                </div>
                <span className="badge badge-success badge-outline">Status</span>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold tracking-tight">Active</p>
                <p className="text-sm text-base-content/60 mt-1">Team Status</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-success text-sm font-medium">All systems go</span>
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-gentle-pulse"></span>
              </div>
            </div>
          </div>

          {/* Quick Actions Count - Medium card */}
          <div className="bento-sm card hover-lift animate-fade-in stagger-4">
            <div className="card-body flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-warning/10">
                  <Zap className="w-6 h-6 text-warning" />
                </div>
                <span className="badge badge-warning badge-outline">Actions</span>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold tracking-tight">4</p>
                <p className="text-sm text-base-content/60 mt-1">Quick Actions</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-base-content/60 text-sm font-medium">Available now</span>
              </div>
            </div>
          </div>

          {/* Recent Players - Large card spanning 2 columns */}
          <div className="bento-lg card animate-fade-in stagger-1">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="card-title flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Players
                </h2>
                <button
                  onClick={() => navigate('/players')}
                  className="btn btn-ghost btn-sm"
                >
                  View all
                </button>
              </div>
              <p className="card-description">Latest players added to your roster</p>
            </div>
            <div className="card-content overflow-auto">
              {recentPlayers.length > 0 ? (
                <div className="space-y-3">
                  {recentPlayers.map((player, index) => {
                    const PlayerCard = () => {
                      const keyboardProps = useKeyboardClick(() => navigate(`/players/${player.id}`));

                      return (
                        <div
                          key={player.id}
                          className="flex items-center justify-between p-4 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors cursor-pointer"
                          onClick={() => navigate(`/players/${player.id}`)}
                          aria-label={`View ${player.first_name} ${player.last_name} - ${player.position} at ${player.school}`}
                          {...keyboardProps}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-semibold text-sm">
                                {player.first_name?.[0]}{player.last_name?.[0]}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium">
                                {player.first_name} {player.last_name}
                              </h3>
                              <p className="text-sm text-base-content/60">
                                {player.position} • {player.school}
                              </p>
                            </div>
                          </div>
                          <div className={`badge ${player.status === 'active' ? 'badge-success' : 'badge-outline'}`}>
                            {player.status}
                          </div>
                        </div>
                      );
                    };

                    return <PlayerCard key={player.id} />;
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-base-content/50">
                  <Users className="w-12 h-12 mb-3 opacity-50" />
                  <p>No recent players</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Reports - Large card spanning 2 columns */}
          <div className="bento-lg card animate-fade-in stagger-2">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="card-title flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Reports
                </h2>
                <button
                  onClick={() => navigate('/scouting')}
                  className="btn btn-ghost btn-sm"
                >
                  View all
                </button>
              </div>
              <p className="card-description">Latest scouting reports</p>
            </div>
            <div className="card-content overflow-auto">
              {recentReportsData.length > 0 ? (
                <div className="space-y-3">
                  {recentReportsData.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors cursor-pointer"
                      onClick={() => navigate(`/scouting/${report.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {report.Player?.first_name} {report.Player?.last_name}
                          </h3>
                          <p className="text-sm text-base-content/60">
                            {new Date(report.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="badge badge-primary font-semibold">
                        {report.overall_grade}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-base-content/50">
                  <FileText className="w-12 h-12 mb-3 opacity-50" />
                  <p>No recent reports</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions - Full width card with glass effect */}
        <div className="card card-glass mb-10 animate-fade-in">
          <div className="card-header">
            <h2 className="card-title flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Actions
            </h2>
            <p className="card-description">Common tasks and shortcuts</p>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                className="btn btn-lg justify-start gap-3 h-auto py-4 bg-white hover:bg-base-200 border border-base-300 text-base-content"
                onClick={handleAddPlayer}
              >
                <div className="p-2 rounded-lg bg-base-200">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Add Player</div>
                  <div className="text-xs opacity-60">Create new roster entry</div>
                </div>
              </button>

              <button
                className="btn btn-lg justify-start gap-3 h-auto py-4 bg-white hover:bg-base-200 border border-base-300 text-base-content"
                onClick={handleCreateReport}
              >
                <div className="p-2 rounded-lg bg-base-200">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Create Report</div>
                  <div className="text-xs opacity-60">New scouting report</div>
                </div>
              </button>

              <button
                className="btn btn-lg justify-start gap-3 h-auto py-4 bg-white hover:bg-base-200 border border-base-300 text-base-content"
                onClick={handleViewPerformance}
              >
                <div className="p-2 rounded-lg bg-base-200">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Performance</div>
                  <div className="text-xs opacity-60">View rankings</div>
                </div>
              </button>

              <button
                className="btn btn-lg justify-start gap-3 h-auto py-4 bg-white hover:bg-base-200 border border-base-300 text-base-content"
                onClick={handleViewAnalytics}
              >
                <div className="p-2 rounded-lg bg-base-200">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Analytics</div>
                  <div className="text-xs opacity-60">View insights</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Team Statistics */}
        <div className="animate-fade-in">
          <TeamStatistics />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
