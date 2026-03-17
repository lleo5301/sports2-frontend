/**
 * Coach's Dashboard — extended stats from /teams/dashboard.
 * Hero: season record. Leaders + recent games side by side. Team stats below.
 * @see docs/api/extended-stats-api.md
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ChevronRight, Loader2 } from 'lucide-react'
import {
  extendedStatsApi,
  type CoachDashboardData,
} from '@/lib/extended-stats-api'
import { formatDate, formatDateTime } from '@/lib/format-date'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  GameResultBadge,
  StreakIndicator,
} from '@/components/ui/game-result-badge'
import { Main } from '@/components/layout/main'
import { OpponentLogo } from '@/components/opponent-logo'

const BAT_KEY_LABELS: Record<string, string> = {
  avg: 'AVG',
  runs: 'R',
  hits: 'H',
  doubles: '2B',
  triples: '3B',
  home_runs: 'HR',
  rbi: 'RBI',
  stolen_bases: 'SB',
  obp: 'OBP',
  slg: 'SLG',
  ops: 'OPS',
}

const PIT_KEY_LABELS: Record<string, string> = {
  era: 'ERA',
  innings_pitched: 'IP',
  strikeouts: 'SO',
  walks: 'BB',
  whip: 'WHIP',
}

const FLD_KEY_LABELS: Record<string, string> = {
  fielding_pct: 'FLD%',
  errors: 'E',
  putouts: 'PO',
  assists: 'A',
  double_plays: 'DP',
}

/** Borderless stat grid — label/value pairs in a dense grid */
function StatGrid({
  stats,
  labels,
}: {
  stats: Record<string, string>
  labels: Record<string, string>
}) {
  const entries = Object.entries(stats).filter(
    ([, v]) => v != null && v !== '' && v !== '--'
  )
  if (entries.length === 0) return null
  return (
    <div className='grid grid-cols-3 gap-x-4 gap-y-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
      {entries.slice(0, 12).map(([k, v]) => (
        <div key={k}>
          <p className='text-xs text-muted-foreground'>{labels[k] ?? k}</p>
          <p className='font-semibold tabular-nums'>{v}</p>
        </div>
      ))}
    </div>
  )
}

function LeadersSection({
  leaders,
}: {
  leaders: CoachDashboardData['leaders']
}) {
  if (!leaders || Object.keys(leaders).length === 0) return null
  const cats = [
    { key: 'batting_avg', label: 'Batting Avg' },
    { key: 'home_runs', label: 'HR' },
    { key: 'rbi', label: 'RBI' },
    { key: 'stolen_bases', label: 'SB' },
    { key: 'era', label: 'ERA' },
    { key: 'strikeouts', label: 'SO' },
  ] as const
  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-1'>
      {cats.map(({ key, label }) => {
        const arr = leaders[key as keyof typeof leaders]
        if (!arr?.length) return null
        return (
          <div key={key}>
            <p className='mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase'>
              {label}
            </p>
            <ol className='space-y-1'>
              {arr.map((l, i) => (
                <li key={l.player_id} className='flex justify-between text-sm'>
                  <Link
                    to='/players/$id'
                    params={{ id: l.player_id }}
                    className='transition-colors hover:text-foreground'
                  >
                    {i + 1}. {l.name}
                  </Link>
                  <span className='font-semibold tabular-nums'>{l.value}</span>
                </li>
              ))}
            </ol>
          </div>
        )
      })}
    </div>
  )
}

export function CoachDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['coach-dashboard'],
    queryFn: () => extendedStatsApi.getCoachDashboard(),
  })

  if (isLoading) {
    return (
      <Main>
        <div className='flex items-center justify-center py-16'>
          <Loader2 className='size-8 animate-spin text-muted-foreground' />
        </div>
      </Main>
    )
  }

  if (error) {
    return (
      <Main>
        <Card>
          <CardContent className='py-8 text-center'>
            <p className='text-destructive'>{(error as Error).message}</p>
            <p className='mt-2 text-sm text-muted-foreground'>
              Stats may not be synced yet. Connect PrestoSports to populate.
            </p>
          </CardContent>
        </Card>
      </Main>
    )
  }

  if (!data) {
    return (
      <Main>
        <Card>
          <CardContent className='py-8 text-center text-muted-foreground'>
            No dashboard data available
          </CardContent>
        </Card>
      </Main>
    )
  }

  const {
    record,
    team_batting,
    team_pitching,
    team_fielding,
    recent_games,
    leaders,
    stats_last_synced_at,
  } = data

  const hasTeamStats =
    (team_batting && Object.keys(team_batting).length > 0) ||
    (team_pitching && Object.keys(team_pitching).length > 0) ||
    (team_fielding && Object.keys(team_fielding).length > 0)

  const streakResults = (recent_games ?? [])
    .map((g) => g.result)
    .filter((r): r is 'W' | 'L' | 'T' => r != null)

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

  const totalGames = record.wins + record.losses + record.ties
  const winPct =
    totalGames > 0
      ? (record.wins / totalGames).toFixed(3).replace(/^0/, '')
      : null

  return (
    <Main>
      <div>
        {/* ── Hero: Record ── */}
        <section className='pb-1'>
          <p className='font-display text-[11px] font-semibold tracking-widest text-muted-foreground/70 uppercase'>
            Coach&apos;s Dashboard
          </p>
          <h1 className='-mt-0.5 text-5xl leading-none font-extrabold tracking-tighter tabular-nums sm:text-6xl'>
            {record.wins}-{record.losses}
            {record.ties > 0 ? `-${record.ties}` : ''}
          </h1>
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
          <div className='mt-2 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] text-muted-foreground'>
            <span>Overall{winPct && ` ${winPct}`}</span>
            {record.conference_wins != null &&
              record.conference_losses != null && (
                <span>
                  ·{' '}
                  <span className='font-semibold text-foreground'>
                    {record.conference_wins}-{record.conference_losses}
                  </span>{' '}
                  Conference
                </span>
              )}
            {stats_last_synced_at && (
              <span>· Updated {formatDateTime(stats_last_synced_at)}</span>
            )}
          </div>
        </section>

        {/* ── Separator ── */}
        <div className='my-10 border-t border-border/40 sm:my-12' />

        {/* ── Leaders + Recent Games ── */}
        <section className='grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16'>
          {/* Leaders */}
          <div>
            <div className='mb-3'>
              <h2 className='text-sm font-semibold tracking-wide text-muted-foreground uppercase'>
                Leaders
              </h2>
            </div>
            {leaders && Object.keys(leaders).length > 0 ? (
              <LeadersSection leaders={leaders} />
            ) : (
              <p className='py-10 text-center text-sm text-muted-foreground'>
                No leaders data yet
              </p>
            )}
          </div>

          {/* Recent Games */}
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
            {recent_games?.length ? (
              <ul className='divide-y divide-border/40'>
                {recent_games.map((g) => (
                  <li key={g.id}>
                    <Link
                      to='/games/$id'
                      params={{ id: g.id }}
                      className='flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60'
                    >
                      <OpponentLogo
                        opponent={g.opponent}
                        logoUrl={g.opponent_logo_url}
                        size={28}
                        reserveSpace
                      />
                      <div className='min-w-0 flex-1'>
                        <p className='flex items-center gap-2 text-sm font-medium'>
                          <span className='truncate'>
                            {g.home_away === 'home' ? 'vs' : '@'} {g.opponent}
                          </span>
                          {g.result && (
                            <GameResultBadge
                              result={g.result}
                              score={g.score ?? undefined}
                            />
                          )}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {formatDate(g.date)}
                          {g.running_record && ` · ${g.running_record}`}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='py-10 text-center text-sm text-muted-foreground'>
                No recent games. Sync with PrestoSports to populate.
              </p>
            )}
          </div>
        </section>

        {/* ── Team Stats ── */}
        {hasTeamStats && (
          <>
            <div className='my-10 border-t border-border/40 sm:my-12' />
            <section className='space-y-6'>
              <h2 className='text-sm font-semibold tracking-wide text-muted-foreground uppercase'>
                Team Statistics
              </h2>
              {team_batting && Object.keys(team_batting).length > 0 && (
                <div>
                  <h4 className='mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase'>
                    Batting
                  </h4>
                  <StatGrid stats={team_batting} labels={BAT_KEY_LABELS} />
                </div>
              )}
              {team_pitching && Object.keys(team_pitching).length > 0 && (
                <div>
                  <h4 className='mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase'>
                    Pitching
                  </h4>
                  <StatGrid stats={team_pitching} labels={PIT_KEY_LABELS} />
                </div>
              )}
              {team_fielding && Object.keys(team_fielding).length > 0 && (
                <div>
                  <h4 className='mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase'>
                    Fielding
                  </h4>
                  <StatGrid stats={team_fielding} labels={FLD_KEY_LABELS} />
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </Main>
  )
}
