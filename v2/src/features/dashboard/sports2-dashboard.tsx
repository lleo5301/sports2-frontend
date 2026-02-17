/**
 * Sports2 Dashboard — Overview per frontend-build-spec §6.1
 * Data: teams/me, teams/stats, teams/recent-schedules, teams/upcoming-schedules
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
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
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { teamsApi } from '@/lib/teams-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function formatEventDate(ev: {
  date?: string
  start_date?: string
  scheduled_at?: string
  created_at?: string
}) {
  const d = ev?.date ?? ev?.start_date ?? ev?.scheduled_at ?? ev?.created_at
  if (!d) return ''
  try {
    const date = typeof d === 'string' ? parseISO(d) : d
    return format(date, 'MMM d, h:mm a')
  } catch {
    return String(d)
  }
}

function formatEventName(ev: Record<string, unknown>) {
  return String(
    ev?.name ?? ev?.title ?? ev?.activity_name ?? 'Event'
  )
}

function formatEventLocation(ev: Record<string, unknown>) {
  return String(ev?.location ?? ev?.venue ?? '')
}

export function Sports2Dashboard() {
  const { user } = useAuth()

  const { data: team, isLoading: teamLoading, error: teamError } = useQuery({
    queryKey: ['team-me'],
    queryFn: () => teamsApi.getMyTeam(),
    retry: 1,
  })

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['team-stats'],
    queryFn: () => teamsApi.getTeamStats(),
  })

  const { data: recentEvents = [] } = useQuery({
    queryKey: ['team-recent-schedules', 5],
    queryFn: () => teamsApi.getRecentSchedules(5),
  })

  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ['team-upcoming-schedules', 5],
    queryFn: () => teamsApi.getUpcomingSchedules(5),
  })

  const isLoading = teamLoading || statsLoading
  const error = teamError || statsError

  const statsData = {
    players: (stats as { players?: number; player_count?: number })?.players ?? (stats as { player_count?: number })?.player_count ?? 0,
    reports: (stats as { reports?: number; report_count?: number })?.reports ?? (stats as { report_count?: number })?.report_count ?? 0,
    schedules: (stats as { schedules?: number; schedule_count?: number })?.schedules ?? (stats as { schedule_count?: number })?.schedule_count ?? 0,
    wins: (stats as { wins?: number })?.wins ?? 0,
    losses: (stats as { losses?: number })?.losses ?? 0,
  }

  const teamName = (team as { name?: string })?.name ?? 'Team'
  const events = Array.isArray(recentEvents) ? recentEvents : []
  const upcoming = Array.isArray(upcomingEvents) ? upcomingEvents : []

  if (isLoading) {
    return (
      <Main>
        <div className='animate-pulse space-y-8 p-6'>
          <div className='h-10 w-64 rounded bg-muted' />
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='h-32 rounded-lg bg-muted' />
            ))}
          </div>
        </div>
      </Main>
    )
  }

  if (error) {
    const errMsg =
      (error as { response?: { data?: { error?: string } }; message?: string })
        ?.response?.data?.error ??
      (error as Error).message ??
      'Failed to load dashboard'
    return (
      <Main>
        <div className='p-8'>
          <Card className='border-destructive'>
            <CardContent className='p-6'>
              <p className='font-medium text-destructive'>{errMsg}</p>
              <Button className='mt-4' onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </Main>
    )
  }

  return (
    <Main>
      <div className='space-y-8 p-6 md:p-8'>
        <header>
          <h1 className='text-3xl font-bold tracking-tight'>
            Welcome back{user?.first_name ? `, ${user.first_name}` : ''}
          </h1>
          <p className='mt-2 text-lg text-muted-foreground'>
            {teamName} — Overview
          </p>
        </header>

        {/* Stats cards */}
        <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Link to='/players'>
            <Card className='transition-all hover:shadow-md'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='rounded-xl bg-primary/10 p-3'>
                    <Users className='size-6 text-primary' />
                  </div>
                  <Badge variant='outline'>Roster</Badge>
                </div>
                <p className='mt-4 text-3xl font-bold'>{statsData.players}</p>
                <p className='mt-1 text-sm text-muted-foreground'>Players</p>
              </CardContent>
            </Card>
          </Link>

          <Link to='/scouting'>
            <Card className='transition-all hover:shadow-md'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='rounded-xl bg-secondary/10 p-3'>
                    <FileText className='size-6 text-secondary' />
                  </div>
                  <Badge variant='outline'>Reports</Badge>
                </div>
                <p className='mt-4 text-3xl font-bold'>{statsData.reports}</p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Scouting Reports
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to='/schedules'>
            <Card className='transition-all hover:shadow-md'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='rounded-xl bg-green-500/10 p-3'>
                    <Calendar className='size-6 text-green-600' />
                  </div>
                  <Badge variant='outline'>Schedule</Badge>
                </div>
                <p className='mt-4 text-3xl font-bold'>{statsData.schedules}</p>
                <p className='mt-1 text-sm text-muted-foreground'>Schedules</p>
              </CardContent>
            </Card>
          </Link>

          <Link to='/games'>
            <Card className='transition-all hover:shadow-md'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='rounded-xl bg-amber-500/10 p-3'>
                    <Trophy className='size-6 text-amber-600' />
                  </div>
                  <Badge variant='outline'>Record</Badge>
                </div>
                <p className='mt-4 text-3xl font-bold'>
                  {statsData.wins}-{statsData.losses}
                </p>
                <p className='mt-1 text-sm text-muted-foreground'>Wins-Losses</p>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Recent & Upcoming */}
        <section className='grid gap-6 lg:grid-cols-2'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between px-6 pb-2 pt-6'>
              <h2 className='flex items-center gap-2 text-lg font-bold'>
                <Calendar className='size-5 text-muted-foreground' />
                Recent Events
              </h2>
              <Button variant='ghost' size='sm' asChild>
                <Link to='/schedules'>
                  View all <ChevronRight className='size-4' />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className='px-6 pb-6'>
              {events.length > 0 ? (
                <ul className='space-y-3'>
                  {events.slice(0, 5).map((ev: Record<string, unknown>, i) => (
                    <li
                      key={String(ev.id ?? i)}
                      className='cursor-pointer rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted'
                    >
                      <Link to='/schedules'>
                        <span className='float-left w-24 shrink-0 text-sm text-muted-foreground'>
                          {formatEventDate(ev)}
                        </span>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate font-medium'>
                            {formatEventName(ev)}
                          </p>
                          {formatEventLocation(ev) && (
                            <p className='flex items-center gap-1 text-sm text-muted-foreground'>
                              <MapPin className='size-3.5' />
                              {formatEventLocation(ev)}
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className='py-8 text-center text-muted-foreground'>
                  <Calendar className='mx-auto mb-3 size-12 opacity-50' />
                  <p>No recent events</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between px-6 pb-2 pt-6'>
              <h2 className='flex items-center gap-2 text-lg font-bold'>
                <Calendar className='size-5 text-muted-foreground' />
                Upcoming
              </h2>
              <Button variant='ghost' size='sm' asChild>
                <Link to='/schedules'>
                  View all <ChevronRight className='size-4' />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className='px-6 pb-6'>
              {upcoming.length > 0 ? (
                <ul className='space-y-3'>
                  {upcoming.slice(0, 5).map((ev: Record<string, unknown>, i) => (
                    <li
                      key={String(ev.id ?? i)}
                      className='cursor-pointer rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted'
                    >
                      <Link to='/schedules'>
                        <span className='float-left w-24 shrink-0 text-sm text-muted-foreground'>
                          {formatEventDate(ev)}
                        </span>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate font-medium'>
                            {formatEventName(ev)}
                          </p>
                          {formatEventLocation(ev) && (
                            <p className='flex items-center gap-1 text-sm text-muted-foreground'>
                              <MapPin className='size-3.5' />
                              {formatEventLocation(ev)}
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className='py-8 text-center text-muted-foreground'>
                  <Calendar className='mx-auto mb-3 size-12 opacity-50' />
                  <p>No upcoming events</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <Card>
          <CardHeader className='px-6 pb-2 pt-6'>
            <h2 className='flex items-center gap-2 text-lg font-bold'>
              <BarChart3 className='size-5' />
              Quick Actions
            </h2>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Button
                variant='outline'
                className='h-auto justify-start gap-3 py-4'
                asChild
              >
                <Link to='/players/create'>
                  <div className='rounded-lg bg-muted p-2'>
                    <Plus className='size-5' />
                  </div>
                  <div className='text-left'>
                    <div className='font-semibold'>Add Player</div>
                    <div className='text-xs text-muted-foreground'>
                      Create roster entry
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                variant='outline'
                className='h-auto justify-start gap-3 py-4'
                asChild
              >
                <Link to='/scouting/create'>
                  <div className='rounded-lg bg-muted p-2'>
                    <ClipboardList className='size-5' />
                  </div>
                  <div className='text-left'>
                    <div className='font-semibold'>Create Report</div>
                    <div className='text-xs text-muted-foreground'>
                      New scouting report
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                variant='outline'
                className='h-auto justify-start gap-3 py-4'
                asChild
              >
                <Link to='/reports/analytics'>
                  <div className='rounded-lg bg-muted p-2'>
                    <TrendingUp className='size-5' />
                  </div>
                  <div className='text-left'>
                    <div className='font-semibold'>Analytics</div>
                    <div className='text-xs text-muted-foreground'>
                      View team metrics
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                variant='outline'
                className='h-auto justify-start gap-3 py-4'
                asChild
              >
                <Link to='/reports'>
                  <div className='rounded-lg bg-muted p-2'>
                    <BarChart3 className='size-5' />
                  </div>
                  <div className='text-left'>
                    <div className='font-semibold'>Reports</div>
                    <div className='text-xs text-muted-foreground'>
                      Analytics & exports
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
