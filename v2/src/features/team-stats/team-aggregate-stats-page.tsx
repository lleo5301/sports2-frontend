/**
 * Team Aggregate Stats — batting, pitching, fielding from /teams/aggregate-stats.
 */
import { useQuery } from '@tanstack/react-query'
import { formatDateTime } from '@/lib/format-date'
import { Loader2 } from 'lucide-react'
import { extendedStatsApi } from '@/lib/extended-stats-api'
import { Main } from '@/components/layout/main'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const BATTING_KEYS = [
  'avg', 'runs', 'hits', 'doubles', 'triples', 'home_runs', 'rbi',
  'stolen_bases', 'obp', 'slg', 'ops', 'at_bats', 'walks', 'strikeouts',
  'hit_by_pitch', 'sacrifice_hits', 'sacrifice_flies',
]
const PITCHING_KEYS = [
  'era', 'innings_pitched', 'wins', 'losses', 'saves', 'strikeouts',
  'walks', 'hits_allowed', 'earned_runs', 'whip', 'complete_games', 'shutouts',
]
const FIELDING_KEYS = [
  'fielding_pct', 'errors', 'putouts', 'assists', 'double_plays',
  'stolen_bases_allowed', 'caught_stealing',
]

const KEY_LABELS: Record<string, string> = {
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

function StatsSection({
  title,
  stats,
  keys,
}: {
  title: string
  stats: Record<string, string> | undefined
  keys: string[]
}) {
  if (!stats || Object.keys(stats).length === 0)
    return (
      <div>
        <h4 className='mb-2 text-sm font-medium text-muted-foreground'>{title}</h4>
        <p className='text-muted-foreground'>No data</p>
      </div>
    )
  const entries = keys
    .filter((k) => stats[k] != null && stats[k] !== '' && stats[k] !== '--')
    .map((k) => [k, stats[k]])
  if (entries.length === 0)
    return (
      <div>
        <h4 className='mb-2 text-sm font-medium text-muted-foreground'>{title}</h4>
        <p className='text-muted-foreground'>No data</p>
      </div>
    )
  return (
    <div>
      <h4 className='mb-2 text-sm font-medium text-muted-foreground'>{title}</h4>
      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4'>
        {entries.map(([k, v]) => (
          <div key={k} className='rounded border bg-muted/30 px-2 py-1.5'>
            <p className='text-xs text-muted-foreground'>{KEY_LABELS[k] ?? k}</p>
            <p className='font-semibold'>{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TeamAggregateStatsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['team-aggregate-stats'],
    queryFn: () => extendedStatsApi.getTeamAggregateStats(),
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
              Connect PrestoSports to sync.
            </p>
          </CardContent>
        </Card>
      </Main>
    )
  }

  const hasData =
    data &&
    (Object.keys(data.batting ?? {}).length > 0 ||
      Object.keys(data.pitching ?? {}).length > 0 ||
      Object.keys(data.fielding ?? {}).length > 0)

  return (
    <Main>
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Team statistics</h2>
          <CardDescription>Full batting, pitching, and fielding totals</CardDescription>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Aggregate stats</CardTitle>
            <CardDescription>
              {data?.last_synced_at ? (
                <>Last synced {formatDateTime(data.last_synced_at)}</>
              ) : (
                'Stats not yet synced'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {hasData ? (
              <>
                <StatsSection title='Batting' stats={data?.batting} keys={BATTING_KEYS} />
                <StatsSection title='Pitching' stats={data?.pitching} keys={PITCHING_KEYS} />
                <StatsSection title='Fielding' stats={data?.fielding} keys={FIELDING_KEYS} />
              </>
            ) : (
              <p className='py-8 text-center text-muted-foreground'>
                No stats available. Connect PrestoSports to sync.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
