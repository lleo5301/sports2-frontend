/**
 * Player splits — home/away, platoon, situational from /players/byId/:id/splits
 */
import { useQuery } from '@tanstack/react-query'
import { extendedStatsApi } from '@/lib/extended-stats-api'

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

const BAT_KEYS = [
  'gp',
  'ab',
  'pa',
  'h',
  'r',
  'hr',
  'rbi',
  'bb',
  'k',
  'sb',
  'avg',
  'obp',
  'slg',
  'ops',
]
const BAT_LABELS: Record<string, string> = {
  gp: 'GP',
  ab: 'AB',
  pa: 'PA',
  h: 'H',
  r: 'R',
  hr: 'HR',
  rbi: 'RBI',
  bb: 'BB',
  k: 'K',
  sb: 'SB',
  avg: 'AVG',
  obp: 'OBP',
  slg: 'SLG',
  ops: 'OPS',
}
const SITUATIONAL_KEYS = ['ab', 'h', 'avg', 'hr', 'rbi', 'bb', 'k', 'obp']
const SITUATIONAL_LABELS: Record<string, string> = {
  ab: 'AB',
  h: 'H',
  avg: 'AVG',
  hr: 'HR',
  rbi: 'RBI',
  bb: 'BB',
  k: 'K',
  obp: 'OBP',
}

function SplitGrid({
  title,
  stats,
  keys,
  labels,
}: {
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
      <h5 className='mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase'>
        {title}
      </h5>
      <div className='grid grid-cols-3 gap-x-4 gap-y-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
        {entries.map((k) => (
          <div key={k}>
            <p className='text-[11px] text-muted-foreground'>
              {labels[k] ?? k}
            </p>
            <p className='font-display text-base font-bold tabular-nums'>
              {stats[k]}
            </p>
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

  if (isLoading)
    return (
      <div className='py-4 text-center text-muted-foreground'>Loading...</div>
    )
  if (error)
    return (
      <div className='py-4 text-center text-destructive'>
        {(error as Error).message}
      </div>
    )
  if (!data || !data.splits) {
    return (
      <p className='py-8 text-center text-muted-foreground'>
        {data?.message ?? 'No split stats. Sync with PrestoSports to populate.'}
      </p>
    )
  }

  const splits = data.splits
  const prestoSplits = ['overall', 'home', 'away', 'conference']
  const situationalSplits = [
    'vs_lhp',
    'vs_rhp',
    'risp',
    'two_outs',
    'bases_loaded',
    'bases_empty',
    'leadoff',
    'with_runners',
  ]

  const vsLhp = splits.vs_lhp
  const vsRhp = splits.vs_rhp
  const hasPlatoonSplits =
    vsLhp &&
    vsRhp &&
    (Object.keys(vsLhp).length > 0 || Object.keys(vsRhp).length > 0)

  const situationalKeys = ['risp', 'two_outs', 'bases_loaded'] as const
  const hasSituational = situationalKeys.some(
    (k) => splits[k] && Object.keys(splits[k]).length > 0
  )

  return (
    <div className='space-y-8'>
      {/* Platoon splits — vs LHP / vs RHP */}
      {hasPlatoonSplits && (
        <div>
          <h3 className='mb-4 font-display text-base font-bold tracking-tight'>
            Platoon splits
          </h3>
          <div className='grid gap-6 md:grid-cols-2'>
            <SplitGrid
              title='vs LHP'
              stats={vsLhp}
              keys={SITUATIONAL_KEYS}
              labels={SITUATIONAL_LABELS}
            />
            <SplitGrid
              title='vs RHP'
              stats={vsRhp}
              keys={SITUATIONAL_KEYS}
              labels={SITUATIONAL_LABELS}
            />
          </div>
        </div>
      )}

      {/* Situational — RISP, 2 outs, bases loaded */}
      {hasSituational && (
        <div
          className={hasPlatoonSplits ? 'border-t border-border/40 pt-6' : ''}
        >
          <h3 className='mb-4 font-display text-base font-bold tracking-tight'>
            Situational
          </h3>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {situationalKeys.map((key) =>
              splits[key] && Object.keys(splits[key]).length > 0 ? (
                <SplitGrid
                  key={key}
                  title={SPLIT_LABELS[key]}
                  stats={splits[key]}
                  keys={SITUATIONAL_KEYS}
                  labels={SITUATIONAL_LABELS}
                />
              ) : null
            )}
          </div>
        </div>
      )}

      {/* All splits — full data */}
      <div
        className={
          hasPlatoonSplits || hasSituational
            ? 'border-t border-border/40 pt-6'
            : ''
        }
      >
        <h3 className='mb-4 font-display text-base font-bold tracking-tight'>
          All splits
          {data.season_name && (
            <span className='ml-2 text-sm font-normal text-muted-foreground'>
              {data.season_name}
            </span>
          )}
        </h3>
        <div className='space-y-6'>
          {prestoSplits.map((key) =>
            splits[key] ? (
              <SplitGrid
                key={key}
                title={SPLIT_LABELS[key] ?? key}
                stats={splits[key]}
                keys={BAT_KEYS}
                labels={BAT_LABELS}
              />
            ) : null
          )}
          {situationalSplits.map((key) =>
            splits[key] ? (
              <SplitGrid
                key={key}
                title={SPLIT_LABELS[key] ?? key}
                stats={splits[key]}
                keys={SITUATIONAL_KEYS}
                labels={SITUATIONAL_LABELS}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}
