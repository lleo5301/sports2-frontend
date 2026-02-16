import { useState } from 'react';
import {
  Chip,
  Button,
  Tabs,
  Tab,
  Spinner,
  Card
} from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { playersService } from '../services/players';
import { teamsService } from '../services/teams';
import { reportsService } from '../services/reports';
import { useAuth } from '../contexts/AuthContext';
import { useKeyboardClick } from '../hooks/useKeyboardClick';
import TeamStatistics from '../components/TeamStatistics';
import { DashboardSkeleton } from '../components/skeletons';
import {
  Users,
  FileText,
  Activity,
  Zap,
  Plus,
  ClipboardList,
  TrendingUp,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for tabs
  const [activeTeamStatsTab, setActiveTeamStatsTab] = useState('overview');

  // Fetch players
  const {
    data: playersResponse,
    isLoading: playersLoading,
    error: playersError
  } = useQuery({
    queryKey: ['players', { limit: 5 }],
    queryFn: () => playersService.getPlayers({ limit: 5 })
  });

  // Fetch scouting reports
  const {
    data: reportsResponse,
    isLoading: reportsLoading,
    error: reportsError
  } = useQuery({
    queryKey: ['scouting-reports', { limit: 5 }],
    queryFn: () => reportsService.getScoutingReports({ limit: 5 })
  });

  // Fetch user's team if they have a team_id
  const {
    data: teamResponse,
    isLoading: teamLoading,
    error: teamError
  } = useQuery({
    queryKey: ['team', user?.team_id],
    queryFn: () => teamsService.getTeam(user.team_id),
    enabled: !!user?.team_id
  });

  // Calculate stats
  const totalPlayers = playersResponse?.pagination?.total || 0;
  const activePlayers =
    playersResponse?.data?.filter((p) => p.status === 'active').length || 0;
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
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="alert alert-error">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
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
          <h1 className="text-4xl font-bold text-foreground mb-3 page-title tracking-tight">
            Dashboard
          </h1>
          <p className="text-foreground/60 text-lg">
            Welcome back! Here&apos;s an overview of your team&apos;s data.
          </p>
        </div>

        {/* Bento Grid Layout - Replaced with standard grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Players - Medium card */}
          <Card className="hover:scale-[1.02] transition-transform animate-fade-in stagger-1">
            <Card.Content className="flex flex-col justify-between h-full p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <Chip color="primary" variant="bordered">
                  Players
                </Chip>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold tracking-tight">
                  {stats.totalPlayers}
                </p>
                <p className="text-sm text-foreground/60 mt-1">Total Players</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-success text-sm font-medium">
                  {stats.activePlayers} active
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-gentle-pulse"></span>
              </div>
            </Card.Content>
          </Card>

          {/* Scouting Reports - Medium card */}
          <Card className="hover:scale-[1.02] transition-transform animate-fade-in stagger-2">
            <Card.Content className="flex flex-col justify-between h-full p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-secondary/10">
                  <FileText className="w-6 h-6 text-secondary" />
                </div>
                <Chip color="secondary" variant="bordered">
                  Reports
                </Chip>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold tracking-tight">
                  {stats.totalReports}
                </p>
                <p className="text-sm text-foreground/60 mt-1">
                  Scouting Reports
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-info text-sm font-medium">
                  {stats.recentReports} recent
                </span>
              </div>
            </Card.Content>
          </Card>

          {/* Team Status - Medium card */}
          <Card className="hover:scale-[1.02] transition-transform animate-fade-in stagger-3">
            <Card.Content className="flex flex-col justify-between h-full p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-success/10">
                  <Activity className="w-6 h-6 text-success" />
                </div>
                <Chip color="success" variant="bordered">
                  Status
                </Chip>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold tracking-tight">Active</p>
                <p className="text-sm text-foreground/60 mt-1">Team Status</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-success text-sm font-medium">
                  All systems go
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-gentle-pulse"></span>
              </div>
            </Card.Content>
          </Card>

          {/* Quick Actions Count - Medium card */}
          <Card className="hover:scale-[1.02] transition-transform animate-fade-in stagger-4">
            <Card.Content className="flex flex-col justify-between h-full p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-warning/10">
                  <Zap className="w-6 h-6 text-warning" />
                </div>
                <Chip color="warning" variant="bordered">
                  Actions
                </Chip>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold tracking-tight">4</p>
                <p className="text-sm text-foreground/60 mt-1">Quick Actions</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-foreground/60 text-sm font-medium">
                  Available now
                </span>
              </div>
            </Card.Content>
          </Card>

          {/* Recent Players - Large card spanning 2 columns */}
          <Card className="col-span-1 md:col-span-2 animate-fade-in stagger-1">
            <Card.Header className="flex flex-col items-start gap-1 px-6 pt-6 pb-2">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Players
                </h2>
                <Button
                  onPress={() => navigate('/players')}
                  size="sm"
                  variant="light"
                >
                  View all
                </Button>
              </div>
              <p className="text-sm text-foreground/60 uppercase tracking-wider font-medium">
                Latest players added to your roster
              </p>
            </Card.Header>
            <Card.Content className="px-6 py-2 overflow-auto">
              {recentPlayers.length > 0 ? (
                <div className="space-y-3">
                  {recentPlayers.map((player) => {
                    const PlayerCard = () => {
                      const keyboardProps = useKeyboardClick(() =>
                        navigate(`/players/${player.id}`)
                      );

                      return (
                        <div
                          key={player.id}
                          className="flex items-center justify-between p-4 bg-content1/50 rounded-xl hover:bg-content1 transition-colors cursor-pointer"
                          onClick={() => navigate(`/players/${player.id}`)}
                          aria-label={`View ${player.first_name} ${player.last_name} - ${player.position} at ${player.school}`}
                          {...keyboardProps}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-semibold text-sm">
                                {player.first_name?.[0]}
                                {player.last_name?.[0]}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium">
                                {player.first_name} {player.last_name}
                              </h3>
                              <p className="text-sm text-foreground/60">
                                {player.position} • {player.school}
                              </p>
                            </div>
                          </div>
                          <Chip
                            variant={
                              player.status === 'active' ? 'flat' : 'bordered'
                            }
                            color={
                              player.status === 'active' ? 'success' : 'default'
                            }
                            size="sm"
                          >
                            {player.status}
                          </Chip>
                        </div>
                      );
                    };

                    return <PlayerCard key={player.id} />;
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-foreground/50">
                  <Users className="w-12 h-12 mb-3 opacity-50" />
                  <p>No recent players</p>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Recent Reports - Large card spanning 2 columns */}
          <Card className="col-span-1 md:col-span-2 animate-fade-in stagger-2">
            <Card.Header className="flex flex-col items-start gap-1 px-6 pt-6 pb-2">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Reports
                </h2>
                <Button
                  onPress={() => navigate('/scouting')}
                  size="sm"
                  variant="light"
                >
                  View all
                </Button>
              </div>
              <p className="text-sm text-foreground/60 uppercase tracking-wider font-medium">
                Latest scouting reports
              </p>
            </Card.Header>
            <Card.Content className="px-6 py-2 overflow-auto">
              {recentReportsData.length > 0 ? (
                <div className="space-y-3">
                  {recentReportsData.map((report) => {
                    const ReportCard = () => {
                      const keyboardProps = useKeyboardClick(() =>
                        navigate(`/scouting/${report.id}`)
                      );

                      return (
                        <div
                          key={report.id}
                          className="flex items-center justify-between p-4 bg-content1/50 rounded-xl hover:bg-content1 transition-colors cursor-pointer"
                          onClick={() => navigate(`/scouting/${report.id}`)}
                          aria-label={`View scouting report for ${report.Player?.first_name} ${report.Player?.last_name} - Grade ${report.overall_grade}`}
                          {...keyboardProps}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                              <h3 className="font-medium">
                                {report.Player?.first_name}{' '}
                                {report.Player?.last_name}
                              </h3>
                              <p className="text-sm text-foreground/60">
                                {new Date(
                                  report.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Chip className="font-semibold" color="primary">
                            {report.overall_grade}
                          </Chip>
                        </div>
                      );
                    };

                    return <ReportCard key={report.id} />;
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-foreground/50">
                  <FileText className="w-12 h-12 mb-3 opacity-50" />
                  <p>No recent reports</p>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Quick Actions - Full width card */}
        <Card className="mb-10 animate-fade-in">
          <Card.Header className="flex flex-col items-start gap-1 px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Actions
            </h2>
            <p className="text-sm text-foreground/60 uppercase tracking-wider font-medium">
              Common tasks and shortcuts
            </p>
          </Card.Header>
          <Card.Content className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                className="justify-start gap-3 h-auto py-4 bg-background hover:bg-content1 border border-divider text-foreground"
                onPress={handleAddPlayer}
                size="lg"
              >
                <div className="p-2 rounded-lg bg-content1">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Add Player</div>
                  <div className="text-xs opacity-60">
                    Create new roster entry
                  </div>
                </div>
              </Button>

              <Button
                className="justify-start gap-3 h-auto py-4 bg-background hover:bg-content1 border border-divider text-foreground"
                onPress={handleCreateReport}
                size="lg"
              >
                <div className="p-2 rounded-lg bg-content1">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Create Report</div>
                  <div className="text-xs opacity-60">New scouting report</div>
                </div>
              </Button>

              <Button
                className="justify-start gap-3 h-auto py-4 bg-background hover:bg-content1 border border-divider text-foreground"
                onPress={handleViewPerformance}
                size="lg"
              >
                <div className="p-2 rounded-lg bg-content1">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Performance</div>
                  <div className="text-xs opacity-60">View team metrics</div>
                </div>
              </Button>

              <Button
                className="justify-start gap-3 h-auto py-4 bg-background hover:bg-content1 border border-divider text-foreground"
                onPress={handleViewAnalytics}
                size="lg"
              >
                <div className="p-2 rounded-lg bg-content1">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Analytics</div>
                  <div className="text-xs opacity-60">Detailed insights</div>
                </div>
              </Button>
            </div>
          </Card.Content>
        </Card>

        {/* Team Statistics Section - Wrapped in a single card */}
        {user?.team_id && teamResponse && (
          <Card className="animate-fade-in stagger-3 mb-10">
            <Card.Header className="flex flex-col items-start gap-1 px-6 pt-6 pb-2 bg-content2/10 border-b border-divider">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Team Performance
              </h2>
              <p className="text-sm text-foreground/60 uppercase tracking-wider font-medium">
                Comprehensive analytics and metrics for {teamResponse.name}
              </p>
            </Card.Header>
            <Card.Content className="p-8">
              <Tabs
                selectedKey={activeTeamStatsTab}
                onSelectionChange={setActiveTeamStatsTab}
                variant="bordered"
                size="sm"
                classNames={{
                  base: 'bg-content2/30 p-1 border border-divider rounded-xl mb-6',
                  tabList: 'gap-2',
                  cursor: 'w-full bg-primary',
                  tab: 'max-w-fit px-4 h-8',
                  tabContent:
                    'group-data-[selected=true]:text-primary-foreground font-medium'
                }}
              >
                <Tab key="overview" title="Overview" />
                <Tab key="performance" title="Performance" />
                <Tab key="roster" title="Roster" />
              </Tabs>
              {activeTeamStatsTab === 'overview' && (
                <TeamStatistics team={teamResponse} />
              )}
              {activeTeamStatsTab === 'performance' && (
                <div className="py-4 text-center text-foreground/60">
                  Performance data coming soon!
                </div>
              )}
              {activeTeamStatsTab === 'roster' && (
                <div className="py-4 text-center text-foreground/60">
                  Roster details coming soon!
                </div>
              )}
            </Card.Content>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
