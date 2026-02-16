import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Trophy,
  Target,
  Users,
  Activity,
  MapPin,
  Star,
  Award,
  Zap,
  BarChart3,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Minus
} from 'lucide-react';
import { teamsService } from '../services/teams';
import { schedulesService } from '../services/schedules';
import { gamesService } from '../services/games';
import { useBranding } from '../contexts/BrandingContext';

// Helper to darken a hex color
const darkenColor = (hex, percent) => {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  r = Math.max(0, Math.floor(r * (1 - percent / 100)));
  g = Math.max(0, Math.floor(g * (1 - percent / 100)));
  b = Math.max(0, Math.floor(b * (1 - percent / 100)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Helper to lighten a hex color
const lightenColor = (hex, percent) => {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Helper to adjust hue of a hex color
const adjustHue = (hex, degrees) => {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
      default: h = 0;
    }
  }

  h = (h + degrees / 360) % 1;
  if (h < 0) h += 1;

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let rOut, gOut, bOut;
  if (s === 0) {
    rOut = gOut = bOut = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    rOut = hue2rgb(p, q, h + 1/3);
    gOut = hue2rgb(p, q, h);
    bOut = hue2rgb(p, q, h - 1/3);
  }

  return `#${Math.round(rOut * 255).toString(16).padStart(2, '0')}${Math.round(gOut * 255).toString(16).padStart(2, '0')}${Math.round(bOut * 255).toString(16).padStart(2, '0')}`;
};

const TeamStatistics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { primaryColor } = useBranding();

  // Generate card colors from primary color
  const cardColors = useMemo(() => {
    const base = primaryColor || '#3B82F6';
    return {
      primary: { start: base, end: darkenColor(base, 20) },
      secondary: { start: adjustHue(base, 15), end: darkenColor(adjustHue(base, 15), 20) },
      accent: { start: lightenColor(base, 20), end: base },
      neutral: { start: adjustHue(base, -10), end: darkenColor(adjustHue(base, -10), 25) }
    };
  }, [primaryColor]);

  // Fetch team statistics
  const { data: teamStats, isLoading: statsLoading } = useQuery({
    queryKey: ['team-stats'],
    queryFn: teamsService.getTeamStats,
    onError: (error) => {
      // Error fetching team stats
    }
  });

  // Fetch schedule statistics
  const { data: scheduleStats, isLoading: scheduleLoading } = useQuery({
    queryKey: ['schedule-stats'],
    queryFn: schedulesService.getScheduleStats,
    onError: (error) => {
      // Error fetching schedule stats
    }
  });

  // Fetch upcoming events
  const { data: upcomingEvents, isLoading: upcomingLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: () => schedulesService.getUpcomingSchedules(5),
    onError: (error) => {
      // Error fetching upcoming events
    }
  });

  // Fetch recent events
  const { data: recentEvents, isLoading: recentLoading } = useQuery({
    queryKey: ['recent-events'],
    queryFn: () => schedulesService.getRecentSchedules(5),
    onError: (error) => {
      // Error fetching recent events
    }
  });

  // Fetch game log
  const { data: gameLog, isLoading: gameLogLoading } = useQuery({
    queryKey: ['game-log'],
    queryFn: () => gamesService.getGameLog(10),
    onError: (error) => {
      // Error fetching game log
    }
  });

  // Fetch team game statistics
  const { data: teamGameStats, isLoading: gameStatsLoading } = useQuery({
    queryKey: ['team-game-stats'],
    queryFn: gamesService.getTeamGameStats,
    onError: (error) => {
      // Error fetching team game stats
    }
  });

  const getGameResultIcon = (result) => {
    switch (result?.toLowerCase()) {
      case 'w':
      case 'win':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'l':
      case 'loss':
        return <XCircle className="w-4 h-4 text-error" />;
      case 't':
      case 'tie':
        return <Minus className="w-4 h-4 text-warning" />;
      default:
        return <Play className="w-4 h-4 text-info" />;
    }
  };

  const getGameResultColor = (result) => {
    switch (result?.toLowerCase()) {
      case 'w':
      case 'win':
        return 'text-success';
      case 'l':
      case 'loss':
        return 'text-error';
      case 't':
      case 'tie':
        return 'text-warning';
      default:
        return 'text-info';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (statsLoading || scheduleLoading || upcomingLoading || recentLoading || gameLogLoading || gameStatsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Statistics</h2>
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'schedule' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </button>
          <button
            className={`tab ${activeTab === 'games' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            <Trophy className="w-4 h-4 mr-2" />
            Games
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Team Statistics Cards - Using computed colors from team branding */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="card text-white"
              style={{ background: `linear-gradient(to bottom right, ${cardColors.primary.start}, ${cardColors.primary.end})` }}
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="card-title text-lg">Win Rate</h3>
                    <p className="text-3xl font-bold">
                      {teamGameStats?.winRate ? `${(teamGameStats.winRate * 100).toFixed(1)}%` : 'N/A'}
                    </p>
                  </div>
                  <Trophy className="w-8 h-8" />
                </div>
                <div className="text-sm opacity-90">
                  {teamGameStats?.wins || 0} W - {teamGameStats?.losses || 0} L
                </div>
              </div>
            </div>

            <div
              className="card text-white"
              style={{ background: `linear-gradient(to bottom right, ${cardColors.secondary.start}, ${cardColors.secondary.end})` }}
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="card-title text-lg">Team ERA</h3>
                    <p className="text-3xl font-bold">
                      {teamGameStats?.era ? teamGameStats.era.toFixed(2) : 'N/A'}
                    </p>
                  </div>
                  <Target className="w-8 h-8" />
                </div>
                <div className="text-sm opacity-90">
                  Pitching Performance
                </div>
              </div>
            </div>

            <div
              className="card text-white"
              style={{ background: `linear-gradient(to bottom right, ${cardColors.accent.start}, ${cardColors.accent.end})` }}
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="card-title text-lg">Team AVG</h3>
                    <p className="text-3xl font-bold">
                      {teamGameStats?.battingAvg ? teamGameStats.battingAvg.toFixed(3) : 'N/A'}
                    </p>
                  </div>
                  <Zap className="w-8 h-8" />
                </div>
                <div className="text-sm opacity-90">
                  Batting Performance
                </div>
              </div>
            </div>

            <div
              className="card text-white"
              style={{ background: `linear-gradient(to bottom right, ${cardColors.neutral.start}, ${cardColors.neutral.end})` }}
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="card-title text-lg">Active Players</h3>
                    <p className="text-3xl font-bold">
                      {teamStats?.activePlayers || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8" />
                </div>
                <div className="text-sm opacity-90">
                  Roster Strength
                </div>
              </div>
            </div>
          </div>

          {/* Recent Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Performance</h3>
                <p className="card-description">Last 10 games</p>
              </div>
              <div className="card-content">
                {gameLog?.data && gameLog.data.length > 0 ? (
                  <div className="space-y-3">
                    {gameLog.data.slice(0, 10).map((game, index) => (
                      <div key={game.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getGameResultIcon(game.result)}
                          <div>
                            <div className="font-medium">
                              {game.opponent} {game.home_away === 'home' ? '(H)' : '(A)'}
                            </div>
                            <div className="text-sm text-base-content/70">
                              {formatDate(game.game_date)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getGameResultColor(game.result)}`}>
                            {game.team_score} - {game.opponent_score}
                          </div>
                          <div className="text-sm text-base-content/70">
                            {game.result}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-base-content/70 py-4">No recent games</p>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Upcoming Schedule</h3>
                <p className="card-description">Next 5 events</p>
              </div>
              <div className="card-content">
                {upcomingEvents?.data && upcomingEvents.data.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.data.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-base-content/70">
                              {formatDate(event.date)} • {event.time && formatTime(event.time)}
                            </div>
                          </div>
                        </div>
                        <div className="badge badge-outline">{event.type}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-base-content/70 py-4">No upcoming events</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Schedule Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="card-body text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="text-lg font-semibold">Total Events</h3>
                <p className="text-3xl font-bold text-primary">
                  {scheduleStats?.totalEvents || 0}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-secondary" />
                <h3 className="text-lg font-semibold">This Week</h3>
                <p className="text-3xl font-bold text-secondary">
                  {scheduleStats?.thisWeek || 0}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <Activity className="w-8 h-8 mx-auto mb-2 text-accent" />
                <h3 className="text-lg font-semibold">This Month</h3>
                <p className="text-3xl font-bold text-accent">
                  {scheduleStats?.thisMonth || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Upcoming Events</h3>
                <p className="card-description">Next scheduled activities</p>
              </div>
              <div className="card-content">
                {upcomingEvents?.data && upcomingEvents.data.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.data.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-base-content/70">
                              {formatDate(event.date)} • {event.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="badge badge-primary">{event.type}</div>
                          {event.time && (
                            <div className="text-sm text-base-content/70 mt-1">
                              {formatTime(event.time)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-base-content/70 py-4">No upcoming events</p>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Events</h3>
                <p className="card-description">Recently completed activities</p>
              </div>
              <div className="card-content">
                {recentEvents?.data && recentEvents.data.length > 0 ? (
                  <div className="space-y-3">
                    {recentEvents.data.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-base-content/70">
                              {formatDate(event.date)} • {event.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="badge badge-success">Completed</div>
                          <div className="text-sm text-base-content/70 mt-1">
                            {event.type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-base-content/70 py-4">No recent events</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Games Tab */}
      {activeTab === 'games' && (
        <div className="space-y-6">
          {/* Game Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="card-body text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-success" />
                <h3 className="text-lg font-semibold">Wins</h3>
                <p className="text-3xl font-bold text-success">
                  {teamGameStats?.wins || 0}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <XCircle className="w-8 h-8 mx-auto mb-2 text-error" />
                <h3 className="text-lg font-semibold">Losses</h3>
                <p className="text-3xl font-bold text-error">
                  {teamGameStats?.losses || 0}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <Minus className="w-8 h-8 mx-auto mb-2 text-warning" />
                <h3 className="text-lg font-semibold">Ties</h3>
                <p className="text-3xl font-bold text-warning">
                  {teamGameStats?.ties || 0}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <Play className="w-8 h-8 mx-auto mb-2 text-info" />
                <h3 className="text-lg font-semibold">Games Played</h3>
                <p className="text-3xl font-bold text-info">
                  {teamGameStats?.gamesPlayed || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Game Log */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Game Log</h3>
              <p className="card-description">Complete game history</p>
            </div>
            <div className="card-content">
              {gameLog?.data && gameLog.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Opponent</th>
                        <th>Location</th>
                        <th>Score</th>
                        <th>Result</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameLog.data.map((game) => (
                        <tr key={game.id}>
                          <td>{formatDate(game.game_date)}</td>
                          <td className="font-medium">{game.opponent}</td>
                          <td>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {game.home_away === 'home' ? 'Home' : 'Away'}
                            </div>
                          </td>
                          <td className="font-bold">
                            {game.team_score} - {game.opponent_score}
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              {getGameResultIcon(game.result)}
                              <span className={`font-medium ${getGameResultColor(game.result)}`}>
                                {game.result}
                              </span>
                            </div>
                          </td>
                          <td>
                            {game.notes && (
                              <span className="text-sm text-base-content/70">
                                {game.notes.length > 30 ? `${game.notes.substring(0, 30)}...` : game.notes}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-base-content/70 py-8">No games recorded</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamStatistics;
