/**
 * Dashboard — Home screen per frontend-build-spec §6.1
 *
 * Data: teams/me, teams/stats, teams/recent-schedules, teams/upcoming-schedules
 * Content: Team branding, stats cards, recent/upcoming events, quick actions
 */
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardContent, Button, Chip } from '@heroui/react';
import { teamsService } from '../services/teams';
import { useBranding } from '../contexts/BrandingContext';
import { useAuth } from '../contexts/AuthContext';
import { DashboardSkeleton } from '../components/skeletons';
import {
  Users,
  FileText,
  Calendar,
  Trophy,
  MapPin,
  Plus,
  ClipboardList,
  TrendingUp,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Extract payload from API response { success, data }
const unwrap = (res) => (res?.data !== undefined ? res.data : res);

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { name, programName, logoUrl } = useBranding();

  const { data: teamRes, isLoading: teamLoading, error: teamError } = useQuery({
    queryKey: ['team-me'],
    queryFn: () => teamsService.getMyTeam(),
    retry: 1
  });

  const { data: statsRes, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['team-stats'],
    queryFn: () => teamsService.getTeamStats()
  });

  const { data: recentRes } = useQuery({
    queryKey: ['team-recent-schedules', 5],
    queryFn: () => teamsService.getRecentSchedules(5)
  });

  const { data: upcomingRes } = useQuery({
    queryKey: ['team-upcoming-schedules', 5],
    queryFn: () => teamsService.getUpcomingSchedules(5)
  });

  const team = unwrap(teamRes);
  const stats = unwrap(statsRes);
  const recentEvents = Array.isArray(unwrap(recentRes)) ? unwrap(recentRes) : [];
  const upcomingEvents = Array.isArray(unwrap(upcomingRes)) ? unwrap(upcomingRes) : [];

  const isLoading = teamLoading || statsLoading;
  const error = teamError || statsError;

  const statsData = {
    players: stats?.players ?? stats?.player_count ?? 0,
    reports: stats?.reports ?? stats?.report_count ?? 0,
    schedules: stats?.schedules ?? stats?.schedule_count ?? 0,
    wins: stats?.wins ?? 0,
    losses: stats?.losses ?? 0
  };

  const formatEventDate = (ev) => {
    const d = ev?.date ?? ev?.start_date ?? ev?.scheduled_at ?? ev?.created_at;
    if (!d) return '';
    try {
      const date = typeof d === 'string' ? parseISO(d) : d;
      return format(date, 'MMM d, h:mm a');
    } catch {
      return String(d);
    }
  };

  const formatEventName = (ev) =>
    ev?.name ?? ev?.title ?? ev?.activity_name ?? 'Event';

  const formatEventLocation = (ev) => ev?.location ?? ev?.venue ?? '';

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Card className="border-danger">
          <CardContent className="p-6">
            <p className="text-danger font-medium">
              {error.response?.data?.error ?? error.message ?? 'Failed to load dashboard'}
            </p>
            <Button
              className="mt-4"
              color="primary"
              variant="flat"
              onPress={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Welcome back{user?.first_name ? `, ${user.first_name}` : ''}
        </h1>
        <p className="text-foreground/60 mt-2 text-lg">
          {programName || name || team?.name || 'Team'} — Overview
        </p>
      </header>

      {/* Stats cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card
          className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          isPressable
          onPress={() => navigate('/players')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <Chip size="sm" variant="bordered" color="primary">
                Roster
              </Chip>
            </div>
            <p className="text-3xl font-bold mt-4">{statsData.players}</p>
            <p className="text-sm text-foreground/60 mt-1">Players</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          isPressable
          onPress={() => navigate('/reports')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-secondary/10">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <Chip size="sm" variant="bordered" color="secondary">
                Reports
              </Chip>
            </div>
            <p className="text-3xl font-bold mt-4">{statsData.reports}</p>
            <p className="text-sm text-foreground/60 mt-1">Scouting Reports</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          isPressable
          onPress={() => navigate('/team-schedule')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-success/10">
                <Calendar className="w-6 h-6 text-success" />
              </div>
              <Chip size="sm" variant="bordered" color="success">
                Schedule
              </Chip>
            </div>
            <p className="text-3xl font-bold mt-4">{statsData.schedules}</p>
            <p className="text-sm text-foreground/60 mt-1">Schedules</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          isPressable
          onPress={() => navigate('/games')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-warning/10">
                <Trophy className="w-6 h-6 text-warning" />
              </div>
              <Chip size="sm" variant="bordered" color="warning">
                Record
              </Chip>
            </div>
            <p className="text-3xl font-bold mt-4">
              {statsData.wins}-{statsData.losses}
            </p>
            <p className="text-sm text-foreground/60 mt-1">Wins-Losses</p>
          </CardContent>
        </Card>
      </section>

      {/* Recent & Upcoming Schedule */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-foreground/70" />
              Recent Events
            </h2>
            <Button
              size="sm"
              variant="light"
              onPress={() => navigate('/team-schedule')}
              endContent={<ChevronRight className="w-4 h-4" />}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {recentEvents.length > 0 ? (
              <ul className="space-y-3">
                {recentEvents.slice(0, 5).map((ev, i) => (
                  <li
                    key={ev.id ?? i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-content1/50 hover:bg-content1 transition-colors cursor-pointer"
                    onClick={() => navigate('/team-schedule')}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && navigate('/team-schedule')
                    }
                    role="button"
                    tabIndex={0}
                  >
                    <span className="text-foreground/50 text-sm shrink-0 w-24">
                      {formatEventDate(ev)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">
                        {formatEventName(ev)}
                      </p>
                      {formatEventLocation(ev) && (
                        <p className="text-sm text-foreground/60 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {formatEventLocation(ev)}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center text-foreground/50">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent events</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-foreground/70" />
              Upcoming
            </h2>
            <Button
              size="sm"
              variant="light"
              onPress={() => navigate('/team-schedule')}
              endContent={<ChevronRight className="w-4 h-4" />}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {upcomingEvents.length > 0 ? (
              <ul className="space-y-3">
                {upcomingEvents.slice(0, 5).map((ev, i) => (
                  <li
                    key={ev.id ?? i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-content1/50 hover:bg-content1 transition-colors cursor-pointer"
                    onClick={() => navigate('/team-schedule')}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && navigate('/team-schedule')
                    }
                    role="button"
                    tabIndex={0}
                  >
                    <span className="text-foreground/50 text-sm shrink-0 w-24">
                      {formatEventDate(ev)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">
                        {formatEventName(ev)}
                      </p>
                      {formatEventLocation(ev) && (
                        <p className="text-sm text-foreground/60 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {formatEventLocation(ev)}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center text-foreground/50">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming events</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="px-6 pt-6 pb-2">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Quick Actions
          </h2>
          <p className="text-sm text-foreground/60">
            Common tasks and shortcuts
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              className="justify-start gap-3 h-auto py-4 bg-content1/50 hover:bg-content1 border border-divider"
              onPress={() => navigate('/players/create')}
              startContent={
                <div className="p-2 rounded-lg bg-content2">
                  <Plus className="w-5 h-5" />
                </div>
              }
            >
              <div className="text-left">
                <div className="font-semibold">Add Player</div>
                <div className="text-xs opacity-60">Create roster entry</div>
              </div>
            </Button>

            <Button
              className="justify-start gap-3 h-auto py-4 bg-content1/50 hover:bg-content1 border border-divider"
              onPress={() => navigate('/scouting/create')}
              startContent={
                <div className="p-2 rounded-lg bg-content2">
                  <ClipboardList className="w-5 h-5" />
                </div>
              }
            >
              <div className="text-left">
                <div className="font-semibold">Create Report</div>
                <div className="text-xs opacity-60">New scouting report</div>
              </div>
            </Button>

            <Button
              className="justify-start gap-3 h-auto py-4 bg-content1/50 hover:bg-content1 border border-divider"
              onPress={() => navigate('/performance')}
              startContent={
                <div className="p-2 rounded-lg bg-content2">
                  <TrendingUp className="w-5 h-5" />
                </div>
              }
            >
              <div className="text-left">
                <div className="font-semibold">Performance</div>
                <div className="text-xs opacity-60">View team metrics</div>
              </div>
            </Button>

            <Button
              className="justify-start gap-3 h-auto py-4 bg-content1/50 hover:bg-content1 border border-divider"
              onPress={() => navigate('/reports')}
              startContent={
                <div className="p-2 rounded-lg bg-content2">
                  <BarChart3 className="w-5 h-5" />
                </div>
              }
            >
              <div className="text-left">
                <div className="font-semibold">Reports</div>
                <div className="text-xs opacity-60">Analytics & exports</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
