import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Link2,
  Unlink,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  Users,
  BarChart3,
  Download,
  Eye,
  EyeOff,
  AlertCircle,
  Image,
  Video,
  FileText,
  History,
  Activity,
  UserCircle,
  Newspaper,
  Play
} from 'lucide-react';
import toast from 'react-hot-toast';
import integrationsService from '../../services/integrations';

const PrestoSportsConfig = () => {
  const queryClient = useQueryClient();

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');

  // Get integration status
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['presto-status'],
    queryFn: integrationsService.getPrestoStatus
  });

  const isConfigured = statusData?.data?.isConfigured;
  const prestoTeamId = statusData?.data?.prestoTeamId;
  const prestoSeasonId = statusData?.data?.prestoSeasonId;
  const lastSyncAt = statusData?.data?.lastSyncAt;
  const tokenStatus = statusData?.data?.tokenStatus; // 'valid', 'expired', or null

  // Seasons query disabled - we get season info from teams data now
  // const { data: seasonsData, isLoading: seasonsLoading } = useQuery({
  //   queryKey: ['presto-seasons'],
  //   queryFn: integrationsService.getPrestoSeasons,
  //   enabled: isConfigured
  // });

  // Get teams (only if configured)
  const { data: teamsData, isLoading: teamsLoading } = useQuery({
    queryKey: ['presto-teams'],
    queryFn: integrationsService.getPrestoTeams,
    enabled: isConfigured
  });

  // Initialize selected values from status
  useEffect(() => {
    if (prestoSeasonId) setSelectedSeasonId(prestoSeasonId);
    if (prestoTeamId) setSelectedTeamId(prestoTeamId);
  }, [prestoSeasonId, prestoTeamId]);

  // Test connection mutation
  const testMutation = useMutation({
    mutationFn: integrationsService.testPrestoConnection,
    onSuccess: (data) => {
      toast.success('Connection successful!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Connection failed');
    }
  });

  // Configure mutation
  const configureMutation = useMutation({
    mutationFn: integrationsService.configurePresto,
    onSuccess: () => {
      toast.success('PrestoSports configured successfully!');
      queryClient.invalidateQueries(['presto-status']);
      queryClient.invalidateQueries(['presto-seasons']);
      queryClient.invalidateQueries(['presto-teams']);
      setPassword('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Configuration failed');
    }
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: integrationsService.updatePrestoSettings,
    onSuccess: () => {
      toast.success('Settings updated!');
      queryClient.invalidateQueries(['presto-status']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    }
  });

  // Disconnect mutation
  const disconnectMutation = useMutation({
    mutationFn: integrationsService.disconnectPresto,
    onSuccess: () => {
      toast.success('PrestoSports disconnected');
      queryClient.invalidateQueries(['presto-status']);
      setUsername('');
      setPassword('');
      setSelectedSeasonId('');
      setSelectedTeamId('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to disconnect');
    }
  });

  // Sync mutations
  const syncScheduleMutation = useMutation({
    mutationFn: integrationsService.syncPrestoSchedule,
    onSuccess: (data) => {
      toast.success(data.message || 'Schedule synced!');
      queryClient.invalidateQueries(['presto-status']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to sync schedule');
    }
  });

  const syncRosterMutation = useMutation({
    mutationFn: integrationsService.syncPrestoRoster,
    onSuccess: (data) => {
      toast.success(data.message || 'Roster synced!');
      queryClient.invalidateQueries(['presto-status']);
      queryClient.invalidateQueries(['players']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to sync roster');
    }
  });

  const syncStatsMutation = useMutation({
    mutationFn: integrationsService.syncPrestoStats,
    onSuccess: (data) => {
      toast.success(data.message || 'Stats synced!');
      queryClient.invalidateQueries(['presto-status']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to sync stats');
    }
  });

  const syncAllMutation = useMutation({
    mutationFn: integrationsService.syncPrestoAll,
    onSuccess: (data) => {
      toast.success(data.message || 'All data synced!');
      queryClient.invalidateQueries(['presto-status']);
      queryClient.invalidateQueries(['players']);
      queryClient.invalidateQueries(['games']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to sync');
    }
  });

  // Additional sync mutations
  const syncPlayerDetailsMutation = useMutation({
    mutationFn: integrationsService.syncPrestoPlayerDetails,
    onSuccess: (data) => {
      toast.success(data.message || 'Player details synced!');
      queryClient.invalidateQueries(['players']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to sync player details');
    }
  });

  const syncPlayerPhotosMutation = useMutation({
    mutationFn: integrationsService.syncPrestoPlayerPhotos,
    onSuccess: (data) => {
      toast.success(data.message || 'Player photos synced!');
      queryClient.invalidateQueries(['players']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to sync player photos');
    }
  });

  const syncPlayerVideosMutation = useMutation({
    mutationFn: integrationsService.syncPrestoPlayerVideos,
    onSuccess: (data) => {
      toast.success(data.message || 'Player videos synced!');
      queryClient.invalidateQueries(['players']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to sync player videos');
    }
  });

  const syncHistoricalStatsMutation = useMutation({
    mutationFn: integrationsService.syncPrestoHistoricalStats,
    onSuccess: (data) => {
      toast.success(data.message || 'Historical stats synced!');
      queryClient.invalidateQueries(['players']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to sync historical stats');
    }
  });

  const syncPressReleasesMutation = useMutation({
    mutationFn: integrationsService.syncPrestoPressReleases,
    onSuccess: (data) => {
      toast.success(data.message || 'Press releases synced!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to sync press releases');
    }
  });

  // Live games query
  const { data: liveGamesData, isLoading: liveGamesLoading, refetch: refetchLiveGames } = useQuery({
    queryKey: ['presto-live-games'],
    queryFn: integrationsService.getPrestoLiveGames,
    enabled: isConfigured && !!prestoTeamId && !!prestoSeasonId,
    refetchInterval: 60000 // Refresh every minute
  });

  // Live stats sync mutation
  const syncLiveStatsMutation = useMutation({
    mutationFn: integrationsService.syncPrestoLiveStats,
    onSuccess: (data) => {
      const gameState = data.data?.gameState;
      if (gameState) {
        toast.success(`Live stats updated! ${gameState.inningHalf === 'top' ? 'Top' : 'Bot'} ${gameState.inning} - ${gameState.awayScore}-${gameState.homeScore}`);
      } else {
        toast.success(data.message || 'Live stats synced!');
      }
      queryClient.invalidateQueries(['presto-live-games']);
      queryClient.invalidateQueries(['games']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to sync live stats');
    }
  });

  const handleTestConnection = () => {
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }
    testMutation.mutate({ username, password });
  };

  const handleConfigure = () => {
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }
    configureMutation.mutate({
      username,
      password,
      prestoTeamId: selectedTeamId || null,
      prestoSeasonId: selectedSeasonId || null
    });
  };

  const handleUpdateSettings = () => {
    if (!selectedTeamId) {
      toast.error('Please select a team');
      return;
    }
    // Get seasonId directly from the selected team
    const selectedTeam = teamsData?.data?.find(t => t.teamId === selectedTeamId);
    const seasonId = selectedTeam?.seasonId || selectedSeasonId;

    if (!seasonId) {
      toast.error('Unable to determine season for selected team');
      return;
    }

    updateSettingsMutation.mutate({
      prestoTeamId: selectedTeamId,
      prestoSeasonId: seasonId
    });
  };

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect PrestoSports? This will remove your saved credentials.')) {
      disconnectMutation.mutate();
    }
  };

  const isSyncing = syncScheduleMutation.isPending || syncRosterMutation.isPending ||
                    syncStatsMutation.isPending || syncAllMutation.isPending ||
                    syncPlayerDetailsMutation.isPending || syncPlayerPhotosMutation.isPending ||
                    syncPlayerVideosMutation.isPending || syncHistoricalStatsMutation.isPending ||
                    syncPressReleasesMutation.isPending || syncLiveStatsMutation.isPending;

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Card */}
      <div className="card bg-base-100">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isConfigured ? (tokenStatus === 'expired' ? 'bg-warning/20' : 'bg-success/20') : 'bg-base-200'}`}>
                {isConfigured ? (
                  tokenStatus === 'expired' ? (
                    <AlertCircle className="w-6 h-6 text-warning" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-success" />
                  )
                ) : (
                  <XCircle className="w-6 h-6 text-base-content/50" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">PrestoSports Integration</h3>
                <p className="text-sm text-base-content/70">
                  {isConfigured
                    ? tokenStatus === 'expired'
                      ? 'Token expired - re-authenticate required'
                      : 'Connected'
                    : 'Not configured'}
                </p>
              </div>
            </div>
            {isConfigured && (
              <div className="text-right text-sm text-base-content/70">
                {tokenStatus && (
                  <p className={`badge badge-sm ${tokenStatus === 'valid' ? 'badge-success' : 'badge-warning'} mb-1`}>
                    Token: {tokenStatus}
                  </p>
                )}
                {lastSyncAt && (
                  <>
                    <p>Last synced</p>
                    <p className="font-medium">{new Date(lastSyncAt).toLocaleString()}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Token Expired Warning */}
      {isConfigured && tokenStatus === 'expired' && (
        <div className="alert alert-warning">
          <AlertCircle className="w-5 h-5" />
          <div>
            <h4 className="font-semibold">Authentication Required</h4>
            <p className="text-sm">Your PrestoSports token has expired. Please disconnect and reconnect to refresh your credentials.</p>
          </div>
        </div>
      )}

      {/* Configuration Form */}
      {!isConfigured && (
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-lg">Connect to PrestoSports</h3>
            <p className="text-sm text-base-content/70 mb-4">
              Enter your PrestoSports credentials to sync schedules, rosters, and game statistics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your PrestoSports username"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input input-bordered w-full pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                className="btn btn-outline"
                onClick={handleTestConnection}
                disabled={testMutation.isPending || !username || !password}
              >
                {testMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
                Test Connection
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConfigure}
                disabled={configureMutation.isPending || !username || !password}
              >
                {configureMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team/Season Selection (when configured) */}
      {isConfigured && (
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-lg">Sync Settings</h3>
            <p className="text-sm text-base-content/70 mb-4">
              Select the team and season to sync data from.
            </p>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Team & Season</span>
              </label>
              <p className="text-xs text-base-content/60 mb-2">
                Select the team and season to sync. Only baseball teams are shown.
              </p>
              <select
                className="select select-bordered"
                value={selectedTeamId}
                onChange={(e) => {
                  const teamId = e.target.value;
                  setSelectedTeamId(teamId);
                  // Auto-set the seasonId from the selected team
                  const selectedTeam = teamsData?.data?.find(t => t.teamId === teamId);
                  if (selectedTeam?.seasonId) {
                    setSelectedSeasonId(selectedTeam.seasonId);
                  }
                }}
                disabled={teamsLoading}
              >
                <option value="">Select a team & season...</option>
                {teamsData?.data
                  ?.filter((team) => {
                    // Filter to only show baseball teams
                    const sportName = (team.season?.sport?.sportName || '').toLowerCase();
                    const sportId = (team.sportId || '').toLowerCase();
                    const seasonName = (team.season?.seasonName || '').toLowerCase();
                    return sportName.includes('baseball') || sportId.includes('bsb') || seasonName.includes('baseball');
                  })
                  .map((team) => {
                    const teamId = team.teamId;
                    const teamName = team.teamName || '';
                    const seasonName = team.season?.seasonName || '';
                    const displayName = seasonName ? `${teamName} (${seasonName})` : teamName;
                    return (
                      <option key={teamId} value={teamId}>
                        {displayName}
                      </option>
                    );
                  })}
              </select>
            </div>

            {(!prestoTeamId || !prestoSeasonId ||
              selectedTeamId !== prestoTeamId || selectedSeasonId !== prestoSeasonId) && (
              <div className="mt-4">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleUpdateSettings}
                  disabled={updateSettingsMutation.isPending || !selectedTeamId}
                >
                  {updateSettingsMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Save Settings
                </button>
              </div>
            )}

            {(!prestoTeamId || !prestoSeasonId) && !selectedTeamId && (
              <div className="alert alert-warning mt-4">
                <AlertCircle className="w-5 h-5" />
                <span>Please select a team to enable syncing.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sync Controls (when configured with team/season) */}
      {isConfigured && prestoTeamId && prestoSeasonId && (
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-lg">Sync Data</h3>
            <p className="text-sm text-base-content/70 mb-4">
              Sync data from PrestoSports to your local database.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                className="btn btn-outline"
                onClick={() => syncRosterMutation.mutate()}
                disabled={isSyncing}
              >
                {syncRosterMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Users className="w-4 h-4" />
                )}
                Sync Roster
              </button>

              <button
                className="btn btn-outline"
                onClick={() => syncScheduleMutation.mutate()}
                disabled={isSyncing}
              >
                {syncScheduleMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Calendar className="w-4 h-4" />
                )}
                Sync Schedule
              </button>

              <button
                className="btn btn-outline"
                onClick={() => syncStatsMutation.mutate()}
                disabled={isSyncing}
              >
                {syncStatsMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <BarChart3 className="w-4 h-4" />
                )}
                Sync Stats
              </button>

              <button
                className="btn btn-primary"
                onClick={() => syncAllMutation.mutate()}
                disabled={isSyncing}
              >
                {syncAllMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Sync All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Additional Sync Options (when configured with team/season) */}
      {isConfigured && prestoTeamId && prestoSeasonId && (
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-lg">Additional Sync Options</h3>
            <p className="text-sm text-base-content/70 mb-4">
              Sync additional data like player details, photos, videos, and historical stats.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => syncPlayerDetailsMutation.mutate()}
                disabled={isSyncing}
              >
                {syncPlayerDetailsMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserCircle className="w-4 h-4" />
                )}
                Player Details
              </button>

              <button
                className="btn btn-outline btn-sm"
                onClick={() => syncPlayerPhotosMutation.mutate()}
                disabled={isSyncing}
              >
                {syncPlayerPhotosMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Image className="w-4 h-4" />
                )}
                Player Photos
              </button>

              <button
                className="btn btn-outline btn-sm"
                onClick={() => syncPlayerVideosMutation.mutate()}
                disabled={isSyncing}
              >
                {syncPlayerVideosMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Video className="w-4 h-4" />
                )}
                Player Videos
              </button>

              <button
                className="btn btn-outline btn-sm"
                onClick={() => syncHistoricalStatsMutation.mutate()}
                disabled={isSyncing}
              >
                {syncHistoricalStatsMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <History className="w-4 h-4" />
                )}
                Historical Stats
              </button>

              <button
                className="btn btn-outline btn-sm"
                onClick={() => syncPressReleasesMutation.mutate()}
                disabled={isSyncing}
              >
                {syncPressReleasesMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Newspaper className="w-4 h-4" />
                )}
                Press Releases
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Game Stats (when configured with team/season) */}
      {isConfigured && prestoTeamId && prestoSeasonId && (
        <div className="card bg-base-100">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="card-title text-lg">
                  <Activity className="w-5 h-5 text-success" />
                  Live Game Stats
                </h3>
                <p className="text-sm text-base-content/70">
                  Sync real-time stats for games in progress.
                </p>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => refetchLiveGames()}
                disabled={liveGamesLoading}
              >
                <RefreshCw className={`w-4 h-4 ${liveGamesLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {liveGamesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : liveGamesData?.data?.length > 0 ? (
              <div className="space-y-3">
                {liveGamesData.data.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`badge badge-sm ${game.status === 'in_progress' ? 'badge-success' : 'badge-ghost'}`}>
                          {game.status === 'in_progress' ? 'LIVE' : game.status}
                        </span>
                        <span className="font-medium">
                          {game.home_away === 'home' ? 'vs' : '@'} {game.opponent}
                        </span>
                      </div>
                      <p className="text-sm text-base-content/70">
                        {new Date(game.game_date).toLocaleDateString()} {game.game_time || ''}
                      </p>
                      {game.home_score !== null && game.away_score !== null && (
                        <p className="text-sm font-medium">
                          Score: {game.home_away === 'home' ? game.home_score : game.away_score} - {game.home_away === 'home' ? game.away_score : game.home_score}
                          {game.current_inning && ` (${game.inning_half === 'top' ? 'Top' : 'Bot'} ${game.current_inning})`}
                        </p>
                      )}
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => syncLiveStatsMutation.mutate(game.id)}
                      disabled={syncLiveStatsMutation.isPending}
                    >
                      {syncLiveStatsMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      Sync
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-base-content/50">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No live games available</p>
                <p className="text-xs">Games scheduled for today will appear here</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Disconnect Button */}
      {isConfigured && (
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-lg text-error">Danger Zone</h3>
            <p className="text-sm text-base-content/70 mb-4">
              Disconnect from PrestoSports. This will remove your saved credentials.
            </p>
            <button
              className="btn btn-error btn-outline w-fit"
              onClick={handleDisconnect}
              disabled={disconnectMutation.isPending}
            >
              {disconnectMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Unlink className="w-4 h-4" />
              )}
              Disconnect PrestoSports
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrestoSportsConfig;
