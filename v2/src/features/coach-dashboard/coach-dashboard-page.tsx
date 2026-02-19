/**
 * Coach's Dashboard — extended stats from /teams/dashboard.
 * @see docs/api/extended-stats-api.md
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { formatDate, formatDateTime } from '@/lib/format-date'
import { BarChart3, Loader2, Trophy } from 'lucide-react'
import { extendedStatsApi, type CoachDashboardData } from '@/lib/extended-stats-api'
import { Main } from '@/components/layout/main'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

function StatGrid({
  stats,
  labels,
}: {
  stats: Record<string, string>
  labels: Record<string, string>
}) {
  const entries = Object.entries(stats).filter(
    ([k, v]) => v != null && v !== '' && v !== '--'
  )
  if (entries.length === 0) return null
  return (
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4'>
      {entries.slice(0, 12).map(([k, v]) => (
        <div key={k} className='rounded border bg-muted/30 px-2 py-1.5'>
          <p className='text-xs text-muted-foreground'>{labels[k] ?? k}</p>
          <p className='font-semibold'>{v}</p>
        </div>
      ))}
    </div>
  )
}

function LeadersSection({ leaders }: { leaders: CoachDashboardData['leaders'] }) {
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
    <div className='space-y-4'>
      <h4 className='text-sm font-medium text-muted-foreground'>Stat leaders</h4>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {cats.map(({ key, label }) => {
          const arr = leaders[key as keyof typeof leaders]
          if (!arr?.length) return null
          return (
            <div key={key} className='rounded-lg border p-3'>
              <p className='mb-2 text-xs font-medium text-muted-foreground'>{label}</p>
              <ol className='space-y-1'>
                {arr.map((l, i) => (
                  <li key={l.player_id} className='flex justify-between text-sm'>
                    <span>
                      {i + 1}. {l.name}
                    </span>
                    <span className='font-medium'>{l.value}</span>
                  </li>
                ))}
              </ol>
            </div>
          )
        })}
      </div>
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

  const { record, team_batting, team_pitching, team_fielding, recent_games, leaders, stats_last_synced_at } = data

  return (
    <Main>
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Coach&apos;s Dashboard</h2>
          <CardDescription>
            Season record, team stats, recent games, and leaders
          </CardDescription>
        </div>

        {/* Record */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Trophy className='size-5' />
              Record
            </CardTitle>
            <CardDescription>
              {stats_last_synced_at ? (
                <>Last updated {formatDateTime(stats_last_synced_at)}</>
              ) : (
                'Stats not yet synced'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-4'>
              <div>
                <p className='text-2xl font-bold'>
                  {record.wins}-{record.losses}
                  {record.ties > 0 ? `-${record.ties}` : ''}
                </p>
                <p className='text-sm text-muted-foreground'>Overall</p>
              </div>
              {record.conference_wins != null && record.conference_losses != null && (
                <div>
                  <p className='text-2xl font-bold'>
                    {record.conference_wins}-{record.conference_losses}
                  </p>
                  <p className='text-sm text-muted-foreground'>Conference</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Team stats */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <BarChart3 className='size-5' />
              Team statistics
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {team_batting && Object.keys(team_batting).length > 0 && (
              <div>
                <h4 className='mb-2 text-sm font-medium text-muted-foreground'>Batting</h4>
                <StatGrid stats={team_batting} labels={BAT_KEY_LABELS} />
              </div>
            )}
            {team_pitching && Object.keys(team_pitching).length > 0 && (
              <div>
                <h4 className='mb-2 text-sm font-medium text-muted-foreground'>Pitching</h4>
                <StatGrid stats={team_pitching} labels={PIT_KEY_LABELS} />
              </div>
            )}
            {team_fielding && Object.keys(team_fielding).length > 0 && (
              <div>
                <h4 className='mb-2 text-sm font-medium text-muted-foreground'>Fielding</h4>
                <StatGrid stats={team_fielding} labels={FLD_KEY_LABELS} />
              </div>
            )}
            {(!team_batting || Object.keys(team_batting).length === 0) &&
              (!team_pitching || Object.keys(team_pitching).length === 0) && (
              <p className='py-4 text-center text-muted-foreground'>
                No team stats yet. Connect PrestoSports to sync.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Leaders */}
        {leaders && Object.keys(leaders).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Stat leaders</CardTitle>
              <CardDescription>Top performers in key categories</CardDescription>
            </CardHeader>
            <CardContent>
              <LeadersSection leaders={leaders} />
            </CardContent>
          </Card>
        )}

        {/* Recent games */}
        <Card>
          <CardHeader>
            <CardTitle>Recent games</CardTitle>
            <CardDescription>Last 10 completed games</CardDescription>
          </CardHeader>
          <CardContent>
            {recent_games?.length ? (
              <div className='space-y-2'>
                {recent_games.map((g) => (
                  <Link
                    key={g.id}
                    to='/games/$id'
                    params={{ id: g.id }}
                    className='flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50'
                  >
                    <div className="flex items-center gap-3">
                      <OpponentLogo opponent={g.opponent} size={40} reserveSpace />
                      <div>
                        <span className='font-medium'>
                          {g.home_away === 'home' ? 'vs' : '@'} {g.opponent}
                        </span>
                        <p className='text-sm text-muted-foreground'>{formatDate(g.date)}</p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <Badge variant={g.result === 'W' ? 'default' : g.result === 'L' ? 'secondary' : 'outline'}>
                        {g.game_summary}
                      </Badge>
                      {g.running_record && (
                        <p className='mt-1 text-xs text-muted-foreground'>
                          {g.running_record}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className='py-4 text-center text-muted-foreground'>
                No recent games. Sync with PrestoSports to populate.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
