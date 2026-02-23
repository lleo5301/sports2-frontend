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
import { gamesApi, formatGameDateShort, formatGameLocation, type Game } from '@/lib/games-api'
import { extendedStatsApi } from '@/lib/extended-stats-api'
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
import { OpponentLogo } from '@/components/opponent-logo'

function formatGameLabel(game: Game) {
  const opp = game.opponent ?? 'Opponent'
  return game.result ? `vs ${opp}` : `vs ${opp}`
}

function formatGameResult(game: Game & { game_summary?: string | null }) {
  if (game.game_summary) return game.game_summary
  if (game.result) return game.result
  if (game.team_score != null && game.opponent_score != null) {
    const w = game.team_score > game.opponent_score
    return `${w ? 'W' : 'L'} ${game.team_score}-${game.opponent_score}`
  }
  return ''
}

/** Normalize extended-stats game (recent_games / game-log) to Game shape */
function fromExtendedStats(
  g: {
    id: string | number
    date: string
    opponent: string
    home_away?: string
    result?: string | null
    score?: string | null
    game_summary?: string
    running_record?: string | null
    location?: string | null
    venue_name?: string | null
    opponent_logo_url?: string | null
  }
): Game {
  let teamScore: number | undefined
  let oppScore: number | undefined
  if (g.score) {
    const [a, b] = g.score.split('-').map((x) => parseInt(x.trim(), 10))
    if (!Number.isNaN(a) && !Number.isNaN(b)) {
      teamScore = a
      oppScore = b
    }
  }
  return {
    id: typeof g.id === 'number' ? g.id : (parseInt(String(g.id), 10) || g.id) as number,
    opponent: g.opponent,
    opponent_logo_url: g.opponent_logo_url,
    date: g.date,
    game_date: g.date,
    home_away: g.home_away,
    result: g.result ?? undefined,
    team_score: teamScore,
    opponent_score: oppScore,
    game_summary: g.game_summary,
    location: g.location ?? undefined,
    venue_name: g.venue_name ?? undefined,
  } as Game
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

  const { data: coachDashboard } = useQuery({
    queryKey: ['coach-dashboard'],
    queryFn: () => extendedStatsApi.getCoachDashboard(),
  })

  const { data: teamGameLog } = useQuery({
    queryKey: ['teams-game-log'],
    queryFn: () => extendedStatsApi.getTeamGameLog(),
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
    const pastFromList = list.filter((g) => isPastOrToday(g)).sort(sortByDateDesc)
    if (pastFromList.length > 0) return pastFromList.slice(0, 5)

    const fromDashboard = coachDashboard?.recent_games ?? []
    if (fromDashboard.length > 0) {
      return fromDashboard.slice(0, 5).map(fromExtendedStats)
    }

    const fromGameLog = Array.isArray(teamGameLog) ? teamGameLog : []
    if (fromGameLog.length > 0) {
      return fromGameLog.slice(0, 5).map((g) =>
        fromExtendedStats({
          id: g.id,
          date: g.date,
          opponent: g.opponent,
          opponent_logo_url: g.opponent_logo_url,
          home_away: g.home_away,
          result: g.result,
          score: g.score,
          game_summary: g.game_summary,
          running_record: g.running_record,
          location: g.location,
          venue_name: g.venue_name,
        })
      )
    }

    return []
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
        <section className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6'>
          <Link to='/players'>
            <Card className='group mx-0 overflow-hidden rounded-2xl border transition-all hover:shadow-md sm:rounded-xl'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
              <CardContent className='flex flex-col items-center justify-center p-4 text-center sm:p-6'>
                <div className='mb-3 rounded-full bg-primary/10 p-2.5 text-primary'>
                  <Users className='size-5 sm:size-6' />
                </div>
                <p className='text-3xl font-bold tracking-tight sm:text-4xl'>
                  {statsData.players}
                </p>
                <div className='mt-1 flex items-center justify-center gap-1.5'>
                  <p className='text-xs font-medium text-muted-foreground sm:text-sm'>
                    Players
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to='/scouting'>
            <Card className='group mx-0 overflow-hidden rounded-2xl border transition-all hover:shadow-md sm:rounded-xl'>
              <div className='absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
              <CardContent className='flex flex-col items-center justify-center p-4 text-center sm:p-6'>
                <div className='mb-3 rounded-full bg-secondary/10 p-2.5 text-secondary'>
                  <FileText className='size-5 sm:size-6' />
                </div>
                <p className='text-3xl font-bold tracking-tight sm:text-4xl'>
                  {statsData.reports}
                </p>
                <div className='mt-1 flex items-center justify-center gap-1.5'>
                  <p className='text-xs font-medium text-muted-foreground sm:text-sm'>
                    Reports
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to='/schedules'>
            <Card className='group mx-0 overflow-hidden rounded-2xl border transition-all hover:shadow-md sm:rounded-xl'>
              <div className='absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
              <CardContent className='flex flex-col items-center justify-center p-4 text-center sm:p-6'>
                <div className='mb-3 rounded-full bg-green-500/10 p-2.5 text-green-600'>
                  <Calendar className='size-5 sm:size-6' />
                </div>
                <p className='text-3xl font-bold tracking-tight sm:text-4xl'>
                  {statsData.schedules}
                </p>
                <div className='mt-1 flex items-center justify-center gap-1.5'>
                  <p className='text-xs font-medium text-muted-foreground sm:text-sm'>
                    {statsData.scheduleThisWeek > 0 || statsData.scheduleThisMonth > 0
                      ? `${statsData.scheduleThisWeek} Wk / ${statsData.scheduleThisMonth} Mo`
                      : 'Schedules'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to='/games'>
            <Card className='group mx-0 overflow-hidden rounded-2xl border transition-all hover:shadow-md sm:rounded-xl'>
              <div className='absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
              <CardContent className='flex flex-col items-center justify-center p-4 text-center sm:p-6'>
                <div className='mb-3 rounded-full bg-amber-500/10 p-2.5 text-amber-600'>
                  <Trophy className='size-5 sm:size-6' />
                </div>
                <p className='text-3xl font-bold tracking-tight sm:text-4xl'>
                  {statsData.wins}-{statsData.losses}
                </p>
                <div className='mt-1 flex items-center justify-center gap-1.5'>
                  <p className='text-xs font-medium text-muted-foreground sm:text-sm'>
                    Record
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to='/depth-charts'>
            <Card className='group mx-0 overflow-hidden rounded-2xl border transition-all hover:shadow-md sm:rounded-xl'>
              <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
              <CardContent className='flex flex-col items-center justify-center p-4 text-center sm:p-6'>
                <div className='mb-3 rounded-full bg-blue-500/10 p-2.5 text-blue-600'>
                  <List className='size-5 sm:size-6' />
                </div>
                <p className='text-3xl font-bold tracking-tight sm:text-4xl'>
                  {statsData.depthCharts}
                </p>
                <div className='mt-1 flex items-center justify-center gap-1.5'>
                  <p className='text-xs font-medium text-muted-foreground sm:text-sm'>
                    Charts
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to='/prospects'>
            <Card className='group mx-0 overflow-hidden rounded-2xl border transition-all hover:shadow-md sm:rounded-xl'>
              <div className='absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
              <CardContent className='flex flex-col items-center justify-center p-4 text-center sm:p-6'>
                <div className='mb-3 rounded-full bg-violet-500/10 p-2.5 text-violet-600'>
                  <UserPlus className='size-5 sm:size-6' />
                </div>
                <p className='text-3xl font-bold tracking-tight sm:text-4xl'>
                  {statsData.prospects}
                </p>
                <div className='mt-1 flex items-center justify-center gap-1.5'>
                  <p className='text-xs font-medium text-muted-foreground sm:text-sm'>
                    Prospects
                  </p>
                </div>
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
                          logoUrl={(game as Game).opponent_logo_url}
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
                          {(formatGameLocation(game) || (game as Game).tournament?.name) && (
                            <p className='flex items-center gap-1 text-sm text-muted-foreground'>
                              <MapPin className='size-3.5 shrink-0' />
                              {formatGameLocation(game) || (game as Game).tournament?.name}
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
                          logoUrl={(game as Game).opponent_logo_url}
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
                          {(formatGameLocation(game) || (game as Game).tournament?.name) && (
                            <p className='flex items-center gap-1 text-sm text-muted-foreground'>
                              <MapPin className='size-3.5 shrink-0' />
                              {formatGameLocation(game) || (game as Game).tournament?.name}
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
