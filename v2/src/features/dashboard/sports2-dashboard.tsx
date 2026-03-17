/**
 * Sports2 Dashboard — distilled to essentials.
 * Hero: season record + streak. Next game spotlight. Recent/upcoming games.
 * Navigation counts removed — sidebar handles all navigation.
 */
import {
  parseISO,
  endOfDay,
  differenceInCalendarDays,
  differenceInHours,
  format,
} from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { MapPin, ChevronRight, Clock } from 'lucide-react'
import { extendedStatsApi } from '@/lib/extended-stats-api'
import {
  gamesApi,
  formatGameDateShort,
  formatGameLocation,
  type Game,
} from '@/lib/games-api'
import { teamsApi } from '@/lib/teams-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  GameResultBadge,
  StreakIndicator,
} from '@/components/ui/game-result-badge'
import { Main } from '@/components/layout/main'
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

/** Parse a result string like "W 5-3" into { result, score } for GameResultBadge */
function parseGameResult(game: Game & { game_summary?: string | null }): {
  result: 'W' | 'L' | 'T' | 'D'
  score?: string
} | null {
  // Direct score comparison
  if (game.team_score != null && game.opponent_score != null) {
    const r =
      game.team_score > game.opponent_score
        ? 'W'
        : game.team_score < game.opponent_score
          ? 'L'
          : 'T'
    return {
      result: r as 'W' | 'L' | 'T',
      score: `${game.team_score}-${game.opponent_score}`,
    }
  }
  // Parse from result / game_summary string
  const raw = game.game_summary ?? game.result ?? ''
  const match = raw.match(/^(W|L|T|D)\s*(.*)$/)
  if (match) {
    return {
      result: match[1] as 'W' | 'L' | 'T' | 'D',
      score: match[2] || undefined,
    }
  }
  return null
}

/** Normalize extended-stats game (recent_games / game-log) to Game shape */
function fromExtendedStats(g: {
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
}): Game {
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
    id:
      typeof g.id === 'number'
        ? g.id
        : ((parseInt(String(g.id), 10) || g.id) as number),
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
  const {
    data: team,
    isLoading: teamLoading,
    error: teamError,
  } = useQuery({
    queryKey: ['team-me'],
    queryFn: () => teamsApi.getMyTeam(),
    retry: 1,
  })

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
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

    const sortByDateDesc = (
      a: Game | Record<string, unknown>,
      b: Game | Record<string, unknown>
    ) => {
      const da = getGameDate(a) ?? ''
      const db = getGameDate(b) ?? ''
      return String(db).localeCompare(String(da))
    }

    const fromLog = Array.isArray(recentGamesFromLog) ? recentGamesFromLog : []
    const pastFromLog = fromLog
      .filter((g) => isPastOrToday(g))
      .sort(sortByDateDesc)
    if (pastFromLog.length > 0) return pastFromLog.slice(0, 5)

    const list = gamesListData?.data ?? []
    const pastFromList = list
      .filter((g) => isPastOrToday(g))
      .sort(sortByDateDesc)
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

  const { data: gamesTeamStats } = useQuery({
    queryKey: ['games-team-stats'],
    queryFn: () => gamesApi.getTeamStats(),
  })

  const { data: gamesSeasonStats } = useQuery({
    queryKey: ['games-season-stats'],
    queryFn: () => gamesApi.getSeasonStats(),
  })

  const isLoading = teamLoading || statsLoading
  const error = teamError || statsError

  const teamStats = stats as Record<string, unknown> | undefined
  const gamesStats = (gamesTeamStats ?? gamesSeasonStats) as
    | Record<string, unknown>
    | undefined

  const statsData = {
    wins: Number(teamStats?.wins ?? gamesStats?.wins ?? 0) || 0,
    losses: Number(teamStats?.losses ?? gamesStats?.losses ?? 0) || 0,
  }

  const teamName = (team as { name?: string })?.name ?? 'Team'
  const recent = Array.isArray(recentGames) ? recentGames : []
  const upcoming = Array.isArray(upcomingGames) ? upcomingGames : []

  const streakResults = recent
    .map((g) => parseGameResult(g))
    .filter(Boolean)
    .map((r) => r!.result)

  const currentStreak = (() => {
    if (streakResults.length === 0) return null
    const first = streakResults[0]
    let count = 0
    for (const r of streakResults) {
      if (r === first) count++
      else break
    }
    return { type: first, count }
  })()

  const nextGame = upcoming[0] ?? null
  const nextGameCountdown = (() => {
    if (!nextGame) return null
    const d = (nextGame as Game).date ?? (nextGame as Game).game_date
    if (!d) return null
    try {
      const gameDate = parseISO(String(d))
      const now = new Date()
      const days = differenceInCalendarDays(gameDate, now)
      if (days < 0) return null
      if (days === 0) {
        const hours = differenceInHours(gameDate, now)
        return hours > 0 ? `${hours}h` : 'Now'
      }
      if (days === 1) return 'Tomorrow'
      return `${days} days`
    } catch {
      return null
    }
  })()

  if (isLoading) {
    return (
      <Main>
        <div className='animate-pulse'>
          <div className='grid gap-5 lg:grid-cols-5 lg:gap-8'>
            <div className='flex flex-col gap-2 lg:col-span-2'>
              <div className='h-3 w-20 rounded bg-muted' />
              <div className='h-16 w-40 rounded bg-muted' />
              <div className='mt-1 h-3 w-32 rounded bg-muted' />
            </div>
            <div className='h-32 rounded-lg bg-muted lg:col-span-3' />
          </div>
          <div className='my-10 border-t border-border/40 sm:my-12' />
          <div className='grid gap-10 lg:grid-cols-2 lg:gap-16'>
            <div className='space-y-2'>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='h-12 rounded bg-muted' />
              ))}
            </div>
            <div className='space-y-2'>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='h-12 rounded bg-muted' />
              ))}
            </div>
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
      <div>
        {/* ── Hero: Record + Next Game ── */}
        <section className='grid items-stretch gap-5 pb-1 lg:grid-cols-5 lg:gap-8'>
          <div className='flex flex-col justify-center lg:col-span-2'>
            <p className='font-display text-[11px] font-semibold tracking-widest text-muted-foreground/70 uppercase'>
              {teamName}
            </p>
            <Link to='/games' className='group'>
              <h1 className='-mt-0.5 text-6xl leading-none font-extrabold tracking-tighter tabular-nums sm:text-7xl'>
                {statsData.wins}-{statsData.losses}
              </h1>
            </Link>
            {(currentStreak || streakResults.length > 0) && (
              <div className='mt-2 flex items-center gap-2.5'>
                {currentStreak && (
                  <span
                    className={`text-[13px] font-semibold ${
                      currentStreak.type === 'W'
                        ? 'text-success'
                        : currentStreak.type === 'L'
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {currentStreak.count}
                    {currentStreak.type} streak
                  </span>
                )}
                {streakResults.length > 0 && (
                  <StreakIndicator results={[...streakResults].reverse()} />
                )}
              </div>
            )}
          </div>

          <Card className='lg:col-span-3'>
            <CardContent className='flex h-full flex-col justify-center px-6 py-5 sm:px-8 sm:py-6'>
              {nextGame ? (
                <Link
                  to='/games/$id'
                  params={{ id: String(nextGame.id) }}
                  className='group block'
                >
                  <div className='flex items-center gap-1.5 text-[11px] font-semibold tracking-widest text-muted-foreground/70 uppercase'>
                    <Clock className='size-3' />
                    {nextGameCountdown
                      ? `Next game · ${nextGameCountdown}`
                      : 'Next game'}
                  </div>
                  <div className='mt-2.5 flex items-center gap-4'>
                    <OpponentLogo
                      opponent={(nextGame as Game).opponent}
                      logoUrl={(nextGame as Game).opponent_logo_url}
                      size={44}
                      reserveSpace
                    />
                    <div className='min-w-0 flex-1'>
                      <p className='font-display text-xl font-bold tracking-tight group-hover:underline sm:text-2xl'>
                        vs {(nextGame as Game).opponent ?? 'Opponent'}
                      </p>
                      <div className='mt-0.5 flex flex-wrap items-center gap-x-3 text-[13px] text-muted-foreground'>
                        {(() => {
                          const d =
                            (nextGame as Game).date ??
                            (nextGame as Game).game_date
                          if (!d) return null
                          try {
                            return (
                              <span>
                                {format(
                                  parseISO(String(d)),
                                  'EEE, MMM d · h:mm a'
                                )}
                              </span>
                            )
                          } catch {
                            return <span>{formatGameDateShort(nextGame)}</span>
                          }
                        })()}
                        {(formatGameLocation(nextGame) ||
                          (nextGame as Game).tournament?.name) && (
                          <span className='flex items-center gap-1'>
                            <MapPin className='size-3' />
                            {formatGameLocation(nextGame) ||
                              (nextGame as Game).tournament?.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className='py-2 text-center text-muted-foreground'>
                  <p className='text-sm'>No upcoming games scheduled</p>
                  <Button variant='ghost' size='sm' className='mt-1.5' asChild>
                    <Link to='/games'>View schedule</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ── Separator ── */}
        <div className='my-10 border-t border-border/40 sm:my-12' />

        {/* ── Recent & Upcoming Games ── */}
        <section className='grid gap-10 lg:grid-cols-2 lg:gap-16'>
          <div>
            <div className='mb-3 flex items-baseline justify-between'>
              <h2 className='text-sm font-semibold tracking-wide text-muted-foreground uppercase'>
                Recent
              </h2>
              <Button
                variant='ghost'
                size='sm'
                className='-mr-2 h-auto px-2 py-1 text-xs'
                asChild
              >
                <Link to='/games'>
                  All games <ChevronRight className='ml-0.5 size-3' />
                </Link>
              </Button>
            </div>
            {recent.length > 0 ? (
              <ul className='divide-y divide-border/40'>
                {recent.slice(0, 5).map((game, i) => (
                  <li key={game.id ?? i}>
                    <Link
                      to='/games/$id'
                      params={{ id: String(game.id) }}
                      className='flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60'
                    >
                      <OpponentLogo
                        opponent={(game as Game).opponent}
                        logoUrl={(game as Game).opponent_logo_url}
                        size={28}
                        reserveSpace
                      />
                      <div className='min-w-0 flex-1'>
                        <p className='flex items-center gap-2 text-sm font-medium'>
                          <span className='truncate'>
                            {formatGameLabel(game)}
                          </span>
                          {(() => {
                            const parsed = parseGameResult(game)
                            if (parsed) {
                              return (
                                <GameResultBadge
                                  result={parsed.result}
                                  score={parsed.score}
                                />
                              )
                            }
                            const text = formatGameResult(game)
                            return text ? (
                              <span className='text-xs text-muted-foreground'>
                                {text}
                              </span>
                            ) : null
                          })()}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {formatGameDateShort(game)}
                          {formatGameLocation(game) &&
                            ` · ${formatGameLocation(game)}`}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='py-10 text-center text-sm text-muted-foreground'>
                No recent games
              </p>
            )}
          </div>

          <div>
            <div className='mb-3 flex items-baseline justify-between'>
              <h2 className='text-sm font-semibold tracking-wide text-muted-foreground uppercase'>
                Upcoming
              </h2>
              <Button
                variant='ghost'
                size='sm'
                className='-mr-2 h-auto px-2 py-1 text-xs'
                asChild
              >
                <Link to='/games'>
                  Schedule <ChevronRight className='ml-0.5 size-3' />
                </Link>
              </Button>
            </div>
            {upcoming.length > 0 ? (
              <ul className='divide-y divide-border/40'>
                {upcoming.slice(0, 5).map((game, i) => (
                  <li key={game.id ?? i}>
                    <Link
                      to='/games/$id'
                      params={{ id: String(game.id) }}
                      className='flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60'
                    >
                      <OpponentLogo
                        opponent={(game as Game).opponent}
                        logoUrl={(game as Game).opponent_logo_url}
                        size={28}
                        reserveSpace
                      />
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-medium'>
                          vs {(game as Game).opponent ?? 'Opponent'}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {formatGameDateShort(game)}
                          {formatGameLocation(game) &&
                            ` · ${formatGameLocation(game)}`}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='py-10 text-center text-sm text-muted-foreground'>
                No upcoming games
              </p>
            )}
          </div>
        </section>
      </div>
    </Main>
  )
}
