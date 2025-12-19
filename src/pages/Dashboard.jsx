import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { playersService } from '../services/players';
import { teamsService } from '../services/teams';
import { reportsService } from '../services/reports';
import { useAuth } from '../contexts/AuthContext';
import TeamStatistics from '../components/TeamStatistics';

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
  const handleAddPlayer = () => {
    try {
      navigate('/players/create');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleCreateReport = () => {
    try {
      navigate('/scouting/create');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleViewAnalytics = () => {
    try {
      navigate('/reports');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleViewPerformance = () => {
    try {
      navigate('/performance');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2 page-title">
            Dashboard
          </h1>
          <p className="text-base-content/70">
            Welcome back! Here's an overview of your team's data.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-primary">Total Players</h2>
              <p className="text-3xl font-bold">{stats.totalPlayers}</p>
              <div className="text-sm text-success">Active: {stats.activePlayers}</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-secondary">Scouting Reports</h2>
              <p className="text-3xl font-bold">{stats.totalReports}</p>
              <div className="text-sm text-info">Recent: {stats.recentReports}</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-accent">Team Status</h2>
              <p className="text-3xl font-bold">Active</p>
              <div className="text-sm text-success">All systems operational</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-neutral">Quick Actions</h2>
              <p className="text-3xl font-bold">3</p>
              <div className="text-sm text-base-content/70">Available tasks</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Players */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Players</h2>
              <p className="card-description">Latest players added to your roster</p>
            </div>
            <div className="card-content">
              {recentPlayers.length > 0 ? (
                <div className="space-y-4">
                  {recentPlayers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                      <div>
                        <h3 className="font-medium">
                          {player.first_name} {player.last_name}
                        </h3>
                        <p className="text-sm text-base-content/70">
                          {player.position} • {player.school}
                        </p>
                      </div>
                      <div className="badge badge-outline">{player.status}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base-content/70 text-center py-4">No recent players</p>
              )}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Reports</h2>
              <p className="card-description">Latest scouting reports</p>
            </div>
            <div className="card-content">
              {recentReportsData.length > 0 ? (
                <div className="space-y-4">
                  {recentReportsData.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                      <div>
                        <h3 className="font-medium">
                          {report.Player?.first_name} {report.Player?.last_name}
                        </h3>
                        <p className="text-sm text-base-content/70">
                          {report.overall_grade} • {new Date(report.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="badge badge-primary">{report.overall_grade}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base-content/70 text-center py-4">No recent reports</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
              <p className="card-description">Common tasks and shortcuts</p>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  className="btn btn-primary hover:btn-primary-focus" 
                  onClick={handleAddPlayer}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Player
                </button>
                <button 
                  className="btn btn-secondary hover:btn-secondary-focus" 
                  onClick={handleCreateReport}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Create Report
                </button>
                <button 
                  className="btn btn-accent hover:btn-accent-focus" 
                  onClick={handleViewPerformance}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Performance Rankings
                </button>
                <button 
                  className="btn btn-info hover:btn-info-focus" 
                  onClick={handleViewAnalytics}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Team Statistics */}
        <div className="mt-8">
          <TeamStatistics />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 