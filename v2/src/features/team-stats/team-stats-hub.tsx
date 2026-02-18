/**
 * Team Statistics Hub — tabbed layout with Overview, Batting, Pitching, Fielding, Game Log, Lineup.
 */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ClipboardList,
  Loader2,
  Trophy,
  User,
} from 'lucide-react'
import { formatDate, formatDateTime } from '@/lib/format-date'
import {
  extendedStatsApi,
  type CoachDashboardData,
  type DashboardRecentGame,
  type TeamGameLogGame,
  type TeamLineupData,
} from '@/lib/extended-stats-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'

const STAT_LABELS: Record<string, string> = {
  avg: 'AVG', runs: 'R', hits: 'H', doubles: '2B', triples: '3B',
  home_runs: 'HR', rbi: 'RBI', stolen_bases: 'SB', obp: 'OBP', slg: 'SLG',
  ops: 'OPS', at_bats: 'AB', walks: 'BB', strikeouts: 'SO',
  hit_by_pitch: 'HBP', sacrifice_hits: 'SH', sacrifice_flies: 'SF',
  era: 'ERA', innings_pitched: 'IP', wins: 'W', losses: 'L', saves: 'SV',
  hits_allowed: 'H', earned_runs: 'ER', whip: 'WHIP',
  complete_games: 'CG', shutouts: 'SHO',
  fielding_pct: 'FLD%', errors: 'E', putouts: 'PO', assists: 'A',
  double_plays: 'DP', stolen_bases_allowed: 'SBA', caught_stealing: 'CS',
}

const BATTING_KEYS = ['avg', 'runs', 'hits', 'doubles', 'triples', 'home_runs', 'rbi', 'stolen_bases', 'obp', 'slg', 'ops', 'at_bats', 'walks', 'strikeouts']
const PITCHING_KEYS = ['era', 'innings_pitched', 'wins', 'losses', 'saves', 'strikeouts', 'walks', 'hits_allowed', 'earned_runs', 'whip']
const FIELDING_KEYS = ['fielding_pct', 'errors', 'putouts', 'assists', 'double_plays']

function parseRecord(s: string): { wins: number; losses: number } | null {
  const m = s.match(/^(\d+)-(\d+)(?:-(\d+))?$/)
  if (!m) return null
  return { wins: parseInt(m[1], 10), losses: parseInt(m[2], 10) }
}

function buildRecordProgression(games: DashboardRecentGame[]) {
  return [...games].reverse().map((g, i) => {
    const r = parseRecord(g.running_record)
    if (!r) return null
    return { index: i + 1, date: g.date, opponent: g.opponent, result: g.result, wins: r.wins, losses: r.losses }
  }).filter(Boolean) as Array<{ index: number; date: string; opponent: string; result: string | null; wins: number; losses: number }>
}

const LEADER_CATS = [
  { key: 'batting_avg', label: 'Batting Avg' },
  { key: 'home_runs', label: 'HR' },
  { key: 'rbi', label: 'RBI' },
  { key: 'stolen_bases', label: 'SB' },
  { key: 'era', label: 'ERA' },
  { key: 'strikeouts', label: 'SO' },
] as const

export function TeamStatsHub() {
  const [activeTab, setActiveTab] = useState('overview')

  const { data: dashboard, isLoading: dashLoading } = useQuery({
    queryKey: ['coach-dashboard'],
    queryFn: () => extendedStatsApi.getCoachDashboard(),
  })

  const { data: aggregateStats, isLoading: aggLoading } = useQuery({
    queryKey: ['team-aggregate-stats'],
    queryFn: () => extendedStatsApi.getTeamAggregateStats(),
  })

  const { data: games, isLoading: gamesLoading } = useQuery({
    queryKey: ['team-game-log'],
    queryFn: () => extendedStatsApi.getTeamGameLog(),
  })

  const { data: lineup, isLoading: lineupLoading } = useQuery({
    queryKey: ['team-lineup'],
    queryFn: () => extendedStatsApi.getTeamLineup(),
  })

  const isLoading = dashLoading || aggLoading
  const record = dashboard?.record
  const leaders = dashboard?.leaders
  const progressionData = dashboard?.recent_games?.length ? buildRecordProgression(dashboard.recent_games) : []

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Team statistics</h2>
            <p className='text-muted-foreground'>
              Season stats, record progression, game log, and lineup
            </p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm' asChild>
              <Link to='/coach-dashboard'>Coach&apos;s Dashboard</Link>
            </Button>
            <Button variant='outline' size='sm' asChild>
              <Link to='/games/leaderboard'>Leaderboard</Link>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='flex flex-wrap'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='batting'>Batting</TabsTrigger>
            <TabsTrigger value='pitching'>Pitching</TabsTrigger>
            <TabsTrigger value='fielding'>Fielding</TabsTrigger>
            <TabsTrigger value='game-log'>Game log</TabsTrigger>
            <TabsTrigger value='lineup'>Lineup</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            <OverviewTab
              record={record}
              leaders={leaders}
              progressionData={progressionData}
              lastSynced={aggregateStats?.last_synced_at}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value='batting'>
            <StatsTableTab
              title='Batting'
              stats={aggregateStats?.batting}
              keys={BATTING_KEYS}
              lastSynced={aggregateStats?.last_synced_at}
              isLoading={aggLoading}
            />
          </TabsContent>

          <TabsContent value='pitching'>
            <StatsTableTab
              title='Pitching'
              stats={aggregateStats?.pitching}
              keys={PITCHING_KEYS}
              lastSynced={aggregateStats?.last_synced_at}
              isLoading={aggLoading}
            />
          </TabsContent>

          <TabsContent value='fielding'>
            <StatsTableTab
              title='Fielding'
              stats={aggregateStats?.fielding}
              keys={FIELDING_KEYS}
              lastSynced={aggregateStats?.last_synced_at}
              isLoading={aggLoading}
            />
          </TabsContent>

          <TabsContent value='game-log'>
            <GameLogTab games={games ?? []} isLoading={gamesLoading} />
          </TabsContent>

          <TabsContent value='lineup'>
            <LineupTab data={lineup} isLoading={lineupLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </Main>
  )
}

function OverviewTab({
  record,
  leaders,
  progressionData,
  lastSynced,
  isLoading,
}: {
  record: CoachDashboardData['record'] | undefined
  leaders: CoachDashboardData['leaders'] | undefined
  progressionData: Array<{ index: number; opponent: string; result: string | null; wins: number }>
  lastSynced?: string | null
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className='flex justify-center py-16'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Record cards */}
      {record && (
        <div className='grid gap-4 sm:grid-cols-2'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Trophy className='size-5' />
                Season record
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex gap-6'>
                <div>
                  <p className='text-3xl font-bold'>
                    {record.wins}-{record.losses}
                    {record.ties > 0 ? `-${record.ties}` : ''}
                  </p>
                  <p className='text-sm text-muted-foreground'>Overall</p>
                </div>
                {record.conference_wins != null && record.conference_losses != null && (
                  <div>
                    <p className='text-3xl font-bold'>
                      {record.conference_wins}-{record.conference_losses}
                    </p>
                    <p className='text-sm text-muted-foreground'>Conference</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {lastSynced && (
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg'>Last synced</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>{formatDateTime(lastSynced)}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Record progression chart */}
      {progressionData.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Record progression</CardTitle>
            <CardDescription>Wins over the season</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={200}>
              <AreaChart data={progressionData}>
                <defs>
                  <linearGradient id='winsGrad2' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='var(--primary)' stopOpacity={0.4} />
                    <stop offset='100%' stopColor='var(--primary)' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey='index' stroke='var(--muted-foreground)' fontSize={11} tickLine={false} tickFormatter={(i) => `G${i}`} />
                <YAxis stroke='var(--muted-foreground)' fontSize={11} tickLine={false} width={28} />
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.[0] ? (
                      <div className='rounded-lg border bg-background p-3 shadow-md'>
                        <p className='text-sm font-medium'>
                          {payload[0].payload.opponent} · {payload[0].payload.result ?? '—'}
                        </p>
                        <p className='text-xs text-muted-foreground'>{payload[0].payload.wins} wins</p>
                      </div>
                    ) : null
                  }
                />
                <Area type='monotone' dataKey='wins' stroke='var(--primary)' fill='url(#winsGrad2)' strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Stat leaders */}
      {leaders && Object.keys(leaders).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Stat leaders</CardTitle>
            <CardDescription>Top performers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {LEADER_CATS.map(({ key, label }) => {
                const arr = leaders[key as keyof typeof leaders]
                if (!arr?.length) return null
                return (
                  <div key={key} className='rounded-lg border p-3'>
                    <p className='mb-2 text-xs font-medium text-muted-foreground'>{label}</p>
                    <ol className='space-y-1'>
                      {arr.map((l) => (
                        <li key={l.player_id} className='flex justify-between text-sm'>
                          <Link to='/players/$id' params={{ id: l.player_id }} className='font-medium hover:underline'>
                            {l.name}
                          </Link>
                          <span className='tabular-nums'>{l.value}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatsTableTab({
  title,
  stats,
  keys,
  lastSynced,
  isLoading,
}: {
  title: string
  stats: Record<string, string> | undefined
  keys: string[]
  lastSynced?: string | null
  isLoading: boolean
}) {
  const entries = stats
    ? keys
        .filter((k) => stats[k] != null && stats[k] !== '' && stats[k] !== '--')
        .map((k) => ({ stat: k, value: stats[k] }))
    : []

  const columns: ColumnDef<{ stat: string; value: string }>[] = [
    { accessorKey: 'stat', header: 'Stat', cell: ({ row }) => STAT_LABELS[row.original.stat] ?? row.original.stat },
    { accessorKey: 'value', header: 'Value', cell: ({ row }) => row.original.value },
  ]

  const table = useReactTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className='flex justify-center py-16'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {lastSynced ? <>Last synced {formatDateTime(lastSynced)}</> : 'Stats not yet synced'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className='py-8 text-center text-muted-foreground'>No {title.toLowerCase()} stats</p>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead key={h.id}>{h.column.columnDef.header as string}</TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

function GameLogTab({ games, isLoading }: { games: TeamGameLogGame[]; isLoading: boolean }) {
  const [homeAway, setHomeAway] = useState<'all' | 'home' | 'away'>('all')
  const [resultFilter, setResultFilter] = useState<'all' | 'W' | 'L' | 'T'>('all')
  const [search, setSearch] = useState('')

  const filtered = games.filter((g) => {
    if (homeAway !== 'all' && g.home_away !== homeAway) return false
    if (resultFilter !== 'all' && g.result !== resultFilter) return false
    if (search && !g.opponent.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  if (isLoading) {
    return (
      <div className='flex justify-center py-16'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game log</CardTitle>
        <CardDescription>Completed games, newest first</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-wrap gap-3'>
          <Input
            placeholder='Search opponent...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='max-w-xs'
          />
          <select
            value={homeAway}
            onChange={(e) => setHomeAway(e.target.value as 'all' | 'home' | 'away')}
            className='rounded-md border bg-background px-3 py-2 text-sm'
          >
            <option value='all'>All (H/A)</option>
            <option value='home'>Home</option>
            <option value='away'>Away</option>
          </select>
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value as 'all' | 'W' | 'L' | 'T')}
            className='rounded-md border bg-background px-3 py-2 text-sm'
          >
            <option value='all'>All results</option>
            <option value='W'>Wins</option>
            <option value='L'>Losses</option>
            <option value='T'>Ties</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className='py-8 text-center text-muted-foreground'>No games found</p>
        ) : (
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Opponent</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Record</TableHead>
                  <TableHead>Stats</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>
                      <Link to='/games/$id' params={{ id: g.id }} className='font-medium hover:underline'>
                        {formatDate(g.date)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link to='/games/$id' params={{ id: g.id }} className='hover:underline'>
                        {g.home_away === 'home' ? 'vs' : '@'} {g.opponent}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={g.result === 'W' ? 'default' : g.result === 'L' ? 'secondary' : 'outline'}>
                        {g.game_summary}
                      </Badge>
                    </TableCell>
                    <TableCell>{g.score ?? '—'}</TableCell>
                    <TableCell className='text-muted-foreground'>{g.running_record ?? '—'}</TableCell>
                    <TableCell>
                      <GameStatsChips stats={g.team_stats} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function GameStatsChips({ stats }: { stats?: TeamGameLogGame['team_stats'] }) {
  if (!stats) return <span className='text-muted-foreground'>—</span>
  const bat = stats.batting ?? stats
  const pitch = stats.pitching
  const out: Array<[string, string | number]> = []
  if (bat && typeof bat === 'object') {
    for (const [k, v] of Object.entries(bat)) {
      if (v != null && v !== '' && !['batting', 'pitching'].includes(k))
        out.push([k, v])
    }
  }
  if (pitch && typeof pitch === 'object') {
    for (const [k, v] of Object.entries(pitch)) {
      if (v != null && v !== '') out.push([k, v])
    }
  }
  if (out.length === 0) return <span className='text-muted-foreground'>—</span>
  return (
    <div className='flex flex-wrap gap-1'>
      {out.slice(0, 6).map(([k, v]) => (
        <Badge key={k} variant='outline' className='text-xs'>
          {STAT_LABELS[k] ?? k}: {v}
        </Badge>
      ))}
      {out.length > 6 && <span className='text-xs text-muted-foreground'>+{out.length - 6}</span>}
    </div>
  )
}

function LineupTab({ data, isLoading }: { data: TeamLineupData | undefined; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className='flex justify-center py-16'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (!data || data.source === 'none' || !data.players?.length) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          {data?.message ?? 'No completed games found. Sync with PrestoSports to populate.'}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      {data.game_id && (
        <Card>
          <CardHeader className='flex flex-row items-center justify-between gap-4'>
            <CardDescription>
              {data.game_date && formatDate(data.game_date)}
              {data.game_date && data.opponent ? ' · ' : ''}
              {data.opponent ? `vs ${data.opponent}` : ''}
            </CardDescription>
            <Button asChild variant='outline' size='sm'>
              <Link to='/games/$id' params={{ id: data.game_id }}>
                View game
              </Link>
            </Button>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <ClipboardList className='size-5' />
            Batting order
          </CardTitle>
          <CardDescription>From last completed game</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {data.players.map((p, i) => (
              <div key={p.player_id ?? i} className='flex items-center gap-4 rounded-lg border p-3'>
                <Avatar className='size-10'>
                  <AvatarImage src={p.photo_url ?? undefined} alt={p.name} />
                  <AvatarFallback><User className='size-5' /></AvatarFallback>
                </Avatar>
                <div className='min-w-0 flex-1'>
                  <div className='flex gap-2'>
                    {p.player_id ? (
                      <Link to='/players/$id' params={{ id: p.player_id }} className='font-medium hover:underline'>
                        {p.name}
                      </Link>
                    ) : (
                      <span className='font-medium'>{p.name}</span>
                    )}
                    <span className='text-muted-foreground'>#{p.jersey_number}</span>
                    <span className='rounded bg-muted px-1.5 py-0.5 text-xs font-medium'>{p.position}</span>
                  </div>
                  {p.batting && (
                    <p className='mt-1 text-sm text-muted-foreground'>
                      AB {p.batting.ab} · H {p.batting.h} · R {p.batting.r} · RBI {p.batting.rbi}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
