/**
 * Player splits tab — home/away, situational from /players/byId/:id/splits
 */
import { useQuery } from '@tanstack/react-query'
import { extendedStatsApi } from '@/lib/extended-stats-api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const SPLIT_LABELS: Record<string, string> = {
  overall: 'Overall',
  home: 'Home',
  away: 'Away',
  conference: 'Conference',
  vs_lhp: 'vs LHP',
  vs_rhp: 'vs RHP',
  risp: 'RISP',
  two_outs: '2 Outs',
  bases_loaded: 'Bases Loaded',
  bases_empty: 'Bases Empty',
  leadoff: 'Leadoff',
  with_runners: 'W/ Runners',
}

/** Batting keys returned by Presto splits API (ab, h, k, avg, etc.) */
const BAT_KEYS = ['gp', 'ab', 'pa', 'h', 'r', 'hr', 'rbi', 'bb', 'k', 'sb', 'avg', 'obp', 'slg', 'ops']
const BAT_LABELS: Record<string, string> = {
  gp: 'GP', ab: 'AB', pa: 'PA', h: 'H', r: 'R', hr: 'HR', rbi: 'RBI',
  bb: 'BB', k: 'K', sb: 'SB', avg: 'AVG', obp: 'OBP', slg: 'SLG', ops: 'OPS',
}
/** Situational keys (API uses k for strikeouts, not so) */
const SITUATIONAL_KEYS = ['ab', 'h', 'avg', 'hr', 'rbi', 'bb', 'k', 'obp']
const SITUATIONAL_LABELS: Record<string, string> = {
  ab: 'AB', h: 'H', avg: 'AVG', hr: 'HR', rbi: 'RBI', bb: 'BB', k: 'K', obp: 'OBP',
}

function SplitGrid({ title, stats, keys, labels }: {
  title: string
  stats: Record<string, string> | undefined
  keys: string[]
  labels: Record<string, string>
}) {
  if (!stats || Object.keys(stats).length === 0) return null
  const entries = keys.filter((k) => {
    const v = stats[k]
    return v != null && v !== '' && v !== '--' && v !== '-'
  })
  if (entries.length === 0) return null
  return (
    <div>
      <h4 className='mb-2 text-sm font-medium text-muted-foreground'>{title}</h4>
      <div className='grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5'>
        {entries.map((k) => (
          <div key={k} className='rounded border bg-muted/30 px-2 py-1.5'>
            <p className='text-xs text-muted-foreground'>{labels[k] ?? k}</p>
            <p className='font-semibold'>{stats[k]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PlayerSplitsTab({ playerId }: { playerId: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['player', playerId, 'splits'],
    queryFn: () => extendedStatsApi.getPlayerSplits(playerId),
  })

  if (isLoading) return <div className='py-4 text-center text-muted-foreground'>Loading...</div>
  if (error) return <div className='py-4 text-center text-destructive'>{(error as Error).message}</div>
  if (!data || !data.splits) {
    return (
      <Card>
        <CardContent className='py-8 text-center text-muted-foreground'>
          {data?.message ?? 'No split stats. Sync with PrestoSports to populate.'}
        </CardContent>
      </Card>
    )
  }

  const splits = data.splits
  const prestoSplits = ['overall', 'home', 'away', 'conference']
  const situationalSplits = ['vs_lhp', 'vs_rhp', 'risp', 'two_outs', 'bases_loaded', 'bases_empty', 'leadoff', 'with_runners']

  const vsLhp = splits.vs_lhp
  const vsRhp = splits.vs_rhp
  const hasPlatoonSplits = vsLhp && vsRhp && (Object.keys(vsLhp).length > 0 || Object.keys(vsRhp).length > 0)

  const situationalKeys = ['risp', 'two_outs', 'bases_loaded'] as const
  const hasSituational = situationalKeys.some((k) => splits[k] && Object.keys(splits[k]).length > 0)

  return (
    <div className='space-y-6'>
      {/* vs LHP / vs RHP comparison — key for lineup decisions */}
      {hasPlatoonSplits && (
        <Card>
          <CardHeader>
            <CardTitle>Platoon splits</CardTitle>
            <CardDescription>vs Left-handed / vs Right-handed pitching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='rounded-lg border bg-muted/30 p-4'>
                <h4 className='mb-3 text-sm font-medium text-muted-foreground'>vs LHP</h4>
                <div className='grid grid-cols-3 gap-2 sm:grid-cols-4'>
                  {SITUATIONAL_KEYS.filter((k) => vsLhp[k] != null && vsLhp[k] !== '').map((k) => (
                    <div key={k} className='rounded border bg-background px-2 py-1.5'>
                      <p className='text-xs text-muted-foreground'>{SITUATIONAL_LABELS[k] ?? k}</p>
                      <p className='font-semibold'>{vsLhp[k]}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className='rounded-lg border bg-muted/30 p-4'>
                <h4 className='mb-3 text-sm font-medium text-muted-foreground'>vs RHP</h4>
                <div className='grid grid-cols-3 gap-2 sm:grid-cols-4'>
                  {SITUATIONAL_KEYS.filter((k) => vsRhp[k] != null && vsRhp[k] !== '').map((k) => (
                    <div key={k} className='rounded border bg-background px-2 py-1.5'>
                      <p className='text-xs text-muted-foreground'>{SITUATIONAL_LABELS[k] ?? k}</p>
                      <p className='font-semibold'>{vsRhp[k]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Situational summary — RISP, 2-outs, bases loaded */}
      {hasSituational && (
        <Card>
          <CardHeader>
            <CardTitle>Situational stats</CardTitle>
            <CardDescription>RISP, 2 outs, bases loaded</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {situationalKeys.map(
                (key) =>
                  splits[key] &&
                  Object.keys(splits[key]).length > 0 && (
                    <div key={key} className='rounded-lg border p-3'>
                      <h4 className='mb-2 text-sm font-medium text-muted-foreground'>
                        {SPLIT_LABELS[key]}
                      </h4>
                      <div className='grid grid-cols-3 gap-1'>
                        {SITUATIONAL_KEYS.filter((k) => splits[key][k] != null).map((k) => (
                          <div key={k} className='rounded bg-muted/50 px-2 py-1'>
                            <p className='text-[10px] text-muted-foreground'>
                              {SITUATIONAL_LABELS[k]}
                            </p>
                            <p className='text-sm font-semibold'>{splits[key][k]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All splits</CardTitle>
          <CardDescription>
            {data.season_name ?? ''} · {data.player_name}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
        {prestoSplits.map(
          (key) =>
            splits[key] && (
              <SplitGrid
                key={key}
                title={SPLIT_LABELS[key] ?? key}
                stats={splits[key]}
                keys={BAT_KEYS}
                labels={BAT_LABELS}
              />
            )
        )}
        {situationalSplits.map(
          (key) =>
            splits[key] && (
              <SplitGrid
                key={key}
                title={SPLIT_LABELS[key] ?? key}
                stats={splits[key]}
                keys={SITUATIONAL_KEYS}
                labels={SITUATIONAL_LABELS}
              />
            )
        )}
      </CardContent>
    </Card>
    </div>
  )
}
