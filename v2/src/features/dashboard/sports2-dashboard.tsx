/**
 * Sports2 Dashboard — Overview per frontend-build-spec §6.1
 * Data: teams/me, teams/stats, teams/recent-schedules, teams/upcoming-schedules
 * Supplemental: schedules/stats, games/team-stats, depth-charts, prospects, rosters
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { parseISO, endOfDay } from 'date-fns'
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
  UserPlus,
  List,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { teamsApi } from '@/lib/teams-api'
import { schedulesApi } from '@/lib/schedules-api'
import { gamesApi } from '@/lib/games-api'
import { depthChartsApi } from '@/lib/depth-charts-api'
import { prospectsApi } from '@/lib/prospects-api'
import { playersApi } from '@/lib/players-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatGameDateShort, type Game } from '@/lib/games-api'
import { OpponentLogo } from '@/components/opponent-logo'

function formatGameLabel(game: Game) {
  const opp = game.opponent ?? 'Opponent'
  return game.result ? `vs ${opp}` : `vs ${opp}`
}

function formatGameResult(game: Game) {
  if (game.result) return game.result
  if (game.team_score != null && game.opponent_score != null) {
    const w = game.team_score > game.opponent_score
    return `${w ? 'W' : 'L'} ${game.team_score}-${game.opponent_score}`
  }
  return ''
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

  const { data: recentGamesFromLog = [] } = useQuery({
    queryKey: ['games-log', 5],
    queryFn: () => gamesApi.getGameLog(5),
  })

  const { data: gamesListData } = useQuery({
    queryKey: ['games-list-dashboard'],
    queryFn: () => gamesApi.list({ limit: 30 }),
  })

  const recentGames = (() => {
    const now = new Date()
    const endOfToday = endOfDay(now)

    const getGameDate = (g: Game | Record<string, unknown>) => {
      const r = g as Record<string, unknown>
      return (
        (g as Game).date ??
        (g as Game).game_date ??
        r.gameDate ??
        r.scheduled_at ??
        r.start_date
      )
    }

    const isPastOrToday = (g: Game | Record<string, unknown>) => {
      const d = getGameDate(g)
      if (!d) return false
      try {
        const parsed = typeof d === 'string' ? parseISO(d) : d
        return parsed <= endOfToday
      } catch {
        return false
      }
    }

    const sortByDateDesc = (a: Game | Record<string, unknown>, b: Game | Record<string, unknown>) => {
      const da = getGameDate(a) ?? ''
      const db = getGameDate(b) ?? ''
      return String(db).localeCompare(String(da))
    }

    const fromLog = Array.isArray(recentGamesFromLog) ? recentGamesFromLog : []
    const pastFromLog = fromLog.filter((g) => isPastOrToday(g)).sort(sortByDateDesc)
    if (pastFromLog.length > 0) return pastFromLog.slice(0, 5)

    const list = gamesListData?.data ?? []
    return list
      .filter((g) => isPastOrToday(g))
      .sort(sortByDateDesc)
      .slice(0, 5)
  })()

  const { data: upcomingGames = [] } = useQuery({
    queryKey: ['games-upcoming'],
    queryFn: () => gamesApi.getUpcoming(),
  })

  const { data: scheduleStats } = useQuery({
    queryKey: ['schedules-stats'],
    queryFn: () => schedulesApi.getStats(),
  })

  const { data: gamesTeamStats } = useQuery({
    queryKey: ['games-team-stats'],
    queryFn: () => gamesApi.getTeamStats(),
  })

  const { data: gamesSeasonStats } = useQuery({
    queryKey: ['games-season-stats'],
    queryFn: () => gamesApi.getSeasonStats(),
  })

  const { data: depthCharts = [] } = useQuery({
    queryKey: ['depth-charts'],
    queryFn: () => depthChartsApi.list(),
  })

  const { data: prospectsList } = useQuery({
    queryKey: ['prospects-dashboard-count'],
    queryFn: () => prospectsApi.list({ limit: 1 }),
  })

  const { data: playersList } = useQuery({
    queryKey: ['players-dashboard-count'],
    queryFn: () => playersApi.list({ limit: 1 }),
  })

  const isLoading = teamLoading || statsLoading
  const error = teamError || statsError

  const teamStats = stats as Record<string, unknown> | undefined
  const gamesStats = (gamesTeamStats ?? gamesSeasonStats) as Record<string, unknown> | undefined

  const teamPlayers = Number(teamStats?.players ?? teamStats?.player_count ?? teamStats?.total_players ?? 0) || 0

  const statsData = {
    players:
      teamPlayers > 0 ? teamPlayers : (playersList?.pagination?.total ?? 0),
    reports:
      Number(teamStats?.reports ?? teamStats?.report_count ?? 0) || 0,
    schedules:
      Number(teamStats?.schedules ?? teamStats?.schedule_count ?? 0) || 0,
    wins:
      Number(teamStats?.wins ?? gamesStats?.wins ?? 0) || 0,
    losses:
      Number(teamStats?.losses ?? gamesStats?.losses ?? 0) || 0,
    scheduleThisWeek: Number(scheduleStats?.thisWeek ?? 0) || 0,
    scheduleThisMonth: Number(scheduleStats?.thisMonth ?? 0) || 0,
    depthCharts: Array.isArray(depthCharts) ? depthCharts.length : 0,
    prospects: prospectsList?.pagination?.total ?? 0,
  }

  const teamName = (team as { name?: string })?.name ?? 'Team'
  const recent = Array.isArray(recentGames) ? recentGames : []
  const upcoming = Array.isArray(upcomingGames) ? upcomingGames : []

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
        <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
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
                <p className='mt-1 text-sm text-muted-foreground'>
                  {statsData.scheduleThisWeek > 0 || statsData.scheduleThisMonth > 0
                    ? `Schedules • ${statsData.scheduleThisWeek} this week, ${statsData.scheduleThisMonth} this month`
                    : 'Schedules'}
                </p>
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

          <Link to='/depth-charts'>
            <Card className='transition-all hover:shadow-md'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='rounded-xl bg-blue-500/10 p-3'>
                    <List className='size-6 text-blue-600' />
                  </div>
                  <Badge variant='outline'>Operations</Badge>
                </div>
                <p className='mt-4 text-3xl font-bold'>{statsData.depthCharts}</p>
                <p className='mt-1 text-sm text-muted-foreground'>Depth Charts</p>
              </CardContent>
            </Card>
          </Link>

          <Link to='/prospects'>
            <Card className='transition-all hover:shadow-md'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='rounded-xl bg-violet-500/10 p-3'>
                    <UserPlus className='size-6 text-violet-600' />
                  </div>
                  <Badge variant='outline'>Recruiting</Badge>
                </div>
                <p className='mt-4 text-3xl font-bold'>{statsData.prospects}</p>
                <p className='mt-1 text-sm text-muted-foreground'>Prospects</p>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Recent & Upcoming Games */}
        <section className='grid gap-6 lg:grid-cols-2'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between px-6 pb-2 pt-6'>
              <h2 className='flex items-center gap-2 text-lg font-bold'>
                <Trophy className='size-5 text-muted-foreground' />
                Recent Games
              </h2>
              <Button variant='ghost' size='sm' asChild>
                <Link to='/games'>
                  View all <ChevronRight className='size-4' />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className='px-6 pb-6'>
              {recent.length > 0 ? (
                <ul className='space-y-3'>
                  {recent.slice(0, 5).map((game, i) => (
                    <li
                      key={game.id ?? i}
                      className='cursor-pointer rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted'
                    >
                      <Link
                        to='/games/$id'
                        params={{ id: String(game.id) }}
                        className='flex items-center gap-3'
                      >
                        <OpponentLogo
                          opponent={(game as Game).opponent}
                          size={32}
                          reserveSpace
                        />
                        <span className='w-20 shrink-0 text-sm text-muted-foreground'>
                          {formatGameDateShort(game)}
                        </span>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate font-medium'>
                            {formatGameLabel(game)}
                            {formatGameResult(game) && (
                              <span className='ms-2 text-muted-foreground'>
                                {formatGameResult(game)}
                              </span>
                            )}
                          </p>
                          {game.location && (
                            <p className='flex items-center gap-1 text-sm text-muted-foreground'>
                              <MapPin className='size-3.5' />
                              {game.location}
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className='py-8 text-center text-muted-foreground'>
                  <Trophy className='mx-auto mb-3 size-12 opacity-50' />
                  <p>No recent games</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between px-6 pb-2 pt-6'>
              <h2 className='flex items-center gap-2 text-lg font-bold'>
                <Trophy className='size-5 text-muted-foreground' />
                Upcoming Games
              </h2>
              <Button variant='ghost' size='sm' asChild>
                <Link to='/games'>
                  View all <ChevronRight className='size-4' />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className='px-6 pb-6'>
              {upcoming.length > 0 ? (
                <ul className='space-y-3'>
                  {upcoming.slice(0, 5).map((game, i) => (
                    <li
                      key={game.id ?? i}
                      className='cursor-pointer rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted'
                    >
                      <Link
                        to='/games/$id'
                        params={{ id: String(game.id) }}
                        className='flex items-center gap-3'
                      >
                        <OpponentLogo
                          opponent={(game as Game).opponent}
                          size={32}
                          reserveSpace
                        />
                        <span className='w-20 shrink-0 text-sm text-muted-foreground'>
                          {formatGameDateShort(game)}
                        </span>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate font-medium'>
                            {formatGameLabel(game)}
                          </p>
                          {game.location && (
                            <p className='flex items-center gap-1 text-sm text-muted-foreground'>
                              <MapPin className='size-3.5' />
                              {game.location}
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className='py-8 text-center text-muted-foreground'>
                  <Trophy className='mx-auto mb-3 size-12 opacity-50' />
                  <p>No upcoming games</p>
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
