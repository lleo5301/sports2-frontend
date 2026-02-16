import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  Trophy,
  Target,
  Users,
  Activity,
  MapPin,
  Zap,
  Play,
  CheckCircle,
  XCircle,
  Minus
} from 'lucide-react';
import { teamsService } from '../services/teams';
import { schedulesService } from '../services/schedules';
import { gamesService } from '../services/games';
import { Spinner, Tabs, Tab, Card } from '@heroui/react';

const TeamStatistics = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch team statistics
  const { data: teamStats, isLoading: statsLoading } = useQuery({
    queryKey: ['team-stats'],
    queryFn: teamsService.getTeamStats
  });

  // Fetch schedule statistics
  const { data: scheduleStats, isLoading: scheduleLoading } = useQuery({
    queryKey: ['schedule-stats'],
    queryFn: schedulesService.getScheduleStats
  });

  // Fetch upcoming events
  const { data: upcomingEvents, isLoading: upcomingLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: () => schedulesService.getUpcomingSchedules(5)
  });

  // Fetch recent events
  const { data: recentEvents, isLoading: recentLoading } = useQuery({
    queryKey: ['recent-events'],
    queryFn: () => schedulesService.getRecentSchedules(5)
  });

  // Fetch game log
  const { data: gameLog, isLoading: gameLogLoading } = useQuery({
    queryKey: ['game-log'],
    queryFn: () => gamesService.getGameLog(10)
  });

  // Fetch team game statistics
  const { data: teamGameStats, isLoading: gameStatsLoading } = useQuery({
    queryKey: ['team-game-stats'],
    queryFn: gamesService.getTeamGameStats
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

  if (
    statsLoading ||
    scheduleLoading ||
    upcomingLoading ||
    recentLoading ||
    gameLogLoading ||
    gameStatsLoading
  ) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          variant="bordered"
          size="sm"
          classNames={{
            base: 'bg-content2/30 p-1 border border-divider rounded-xl',
            tabList: 'gap-2',
            cursor: 'w-full bg-primary',
            tab: 'max-w-fit px-4 h-8',
            tabContent:
              'group-data-[selected=true]:text-primary-foreground font-medium'
          }}
        >
          <Tabs.List>
            <Tab key="overview" id="overview">Overview</Tab>
            <Tab key="performance" id="performance">Performance</Tab>
            <Tab key="roster" id="roster">Roster</Tab>
          </Tabs.List>
        </Tabs>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Team Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-primary to-primary/80 border-white/10 text-white shadow-lg shadow-primary/30">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs opacity-70 font-bold uppercase tracking-wider text-white">
                      Win Rate
                    </h3>
                    <p className="text-3xl font-black text-white mt-1">
                      {teamGameStats?.winRate
                        ? `${(teamGameStats.winRate * 100).toFixed(1)}%`
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-white/70">
                  <span className="px-2 py-0.5 bg-white/20 rounded-md">
                    {teamGameStats?.wins || 0}W
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 rounded-md">
                    {teamGameStats?.losses || 0}L
                  </span>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-br from-secondary to-secondary/80 border-white/10 text-white shadow-lg shadow-secondary/20">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs opacity-70 font-bold uppercase tracking-wider text-white">
                      Team ERA
                    </h3>
                    <p className="text-3xl font-black text-white mt-1">
                      {teamGameStats?.era
                        ? teamGameStats.era.toFixed(2)
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 text-xs font-medium text-white/70">
                  Pitching Performance
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-br from-brand to-brand-hover border-white/10 text-white shadow-lg shadow-brand/20">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs opacity-70 font-bold uppercase tracking-wider text-white">
                      Team AVG
                    </h3>
                    <p className="text-3xl font-black text-white mt-1">
                      {teamGameStats?.battingAvg
                        ? teamGameStats.battingAvg.toFixed(3)
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 text-xs font-medium text-white/70">
                  Batting Performance
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-br from-neutral-bg-bg4 to-neutral-bg-bg2 border-white/5 text-white shadow-lg">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs opacity-70 font-bold uppercase tracking-wider text-white">
                      Active Players
                    </h3>
                    <p className="text-3xl font-black text-white mt-1">
                      {teamStats?.activePlayers || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 text-xs font-medium text-white/70">
                  Roster Strength
                </div>
              </Card.Content>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Performance */}
            <Card>
              <Card.Header className="flex flex-col items-start gap-1 px-6 pt-6 pb-2">
                <h3 className="text-lg font-bold">Recent Performance</h3>
                <p className="text-sm text-foreground/60">Last 5 Games</p>
              </Card.Header>
              <Card.Content className="px-6 py-4">
                <div className="space-y-4">
                  {recentEvents && recentEvents.length > 0 ? (
                    recentEvents.map((event, index) => (
                      <div
                        key={event.id || index}
                        className="flex items-center justify-between p-4 bg-content2/30 rounded-xl border border-divider hover:border-divider transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-lg bg-content1 ${getGameResultColor(event.result)}`}
                          >
                            {getGameResultIcon(event.result)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">
                              {event.opponent || 'Opponent'}
                            </p>
                            <p className="text-xs text-ui-muted">
                              {formatDate(event.date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-black ${getGameResultColor(event.result)}`}
                          >
                            {event.score_us || 0} - {event.score_them || 0}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 opacity-50">
                      <Activity className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No recent games found</p>
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>

            {/* Upcoming Schedule */}
            <Card>
              <Card.Header className="flex flex-col items-start gap-1 px-6 pt-6 pb-2">
                <h3 className="text-lg font-bold">Upcoming Schedule</h3>
                <p className="text-sm text-foreground/60">Next 5 Matchups</p>
              </Card.Header>
              <Card.Content className="px-6 py-4">
                <div className="space-y-4">
                  {upcomingEvents && upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event, index) => (
                      <div
                        key={event.id || index}
                        className="flex items-center justify-between p-4 bg-content2/30 rounded-xl border border-divider hover:border-divider transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-brand/10 rounded-xl">
                            <Calendar className="w-5 h-5 text-brand" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">
                              {event.opponent || 'Opponent'}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-ui-muted">
                                <MapPin className="w-3 h-3" />
                                {event.location || 'TBD'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-sm">
                            {formatDate(event.date)}
                          </p>
                          <div className="flex items-center justify-end gap-1 mt-0.5 text-xs text-ui-muted">
                            <Clock className="w-3 h-3" />
                            {event.time ? formatTime(event.time) : 'TBD'}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 opacity-50">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No upcoming games scheduled</p>
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeTab === 'performance' && (
        <Card className="p-12 text-center opacity-50">
          <Card.Content>
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-bold">Detailed Performance Metrics</p>
            <p className="text-sm">Coming soon in the next update</p>
          </Card.Content>
        </Card>
      )}

      {activeTab === 'roster' && (
        <Card className="p-12 text-center opacity-50">
          <Card.Content>
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-bold">Roster Management</p>
            <p className="text-sm">Coming soon in the next update</p>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default TeamStatistics;
