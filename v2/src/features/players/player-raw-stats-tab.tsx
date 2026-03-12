/**
 * Player raw stats tab — Presto keys from current_season.raw_stats (stats API)
 * or /players/byId/:id/stats/raw (extended stats API).
 */
import { useQuery } from '@tanstack/react-query'
import { extendedStatsApi } from '@/lib/extended-stats-api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Short Presto keys → display labels
const PRESTO_LABELS: Record<string, string> = {
  // Batting
  gp: 'GP',
  gs: 'GS',
  ab: 'AB',
  pa: 'PA',
  h: 'H',
  r: 'R',
  hr: 'HR',
  rbi: 'RBI',
  bb: 'BB',
  k: 'SO',
  sb: 'SB',
  cs: 'CS',
  hbp: 'HBP',
  sf: 'SF',
  sh: 'SH',
  xbh: 'XBH',
  tb: 'TB',
  avg: 'AVG',
  obp: 'OBP',
  slg: 'SLG',
  ops: 'OPS',
  dsk: '2B',
  '2b': '2B',
  '3b': '3B',
  gdp: 'GIDP',
  gfo: 'GO/AO',
  lob: 'LOB',
  ibb: 'IBB',
  adv: 'ADV',
  gsb: 'GSB',
  go: 'GO',
  fo: 'FO',
  kl: 'K looking',
  ci: 'CI',
  dp: 'DP',
  ht: 'HBP',
  havg: 'AVG',
  ravg: 'R/9',
  kavg: 'K/9',
  bbavg: 'BB/9',
  abavg: 'AB/G',
  tbavg: 'TB/G',
  rbiavg: 'RBI/G',
  flyavg: 'Fly%',
  groundavg: 'Gnd%',
  sbpct: 'SB%',
  sbcs: 'SB-CS',
  // Pitching
  ip: 'IP',
  er: 'ER',
  era: 'ERA',
  whip: 'WHIP',
  ph: 'H',
  pr: 'R',
  pbb: 'BB',
  pk: 'K',
  pw: 'W',
  pl: 'L',
  sv: 'SV',
  hd: 'HD',
  phr: 'HR allowed',
  pab: 'BF',
  pkn: 'K/9',
  pgp: 'GP',
  pgs: 'GS',
  psv: 'SV',
  pwpl: 'W-L',
  phd: 'HD',
  pkl: 'K looking',
  pht: 'H',
  np: 'NP',
  bf: 'BF',
  bk: 'BK',
  cg: 'CG',
  sho: 'SHO',
  pb: 'PB',
  wp: 'WP',
  par: 'Run support',
  pgf: 'GF',
  pgdp: 'GIDP',
  pgpr: 'Pr runs',
  phbp: 'HBP',
  pibb: 'IBB',
  pavg: 'BAA',
  per: 'ER',
  ipraw: 'IP',
  ipapp: 'IP/App',
  ipplus: 'IP+',
  pplus: 'IP+',
  scpk: 'K/GS',
  // Fielding
  po: 'PO',
  a: 'A',
  e: 'E',
  fpct: 'FLD%',
  tc: 'TC',
  rcs: 'CS',
  sba: 'SBA',
  sbapt: 'SB%',
  rcspt: 'CS%',
  // Situational / other
  gpgs: 'GP-GS',
  runspergame: 'R/G',
  strikeoutspergame: 'K/G',
  homerunspergame: 'HR/G',
  walkspergame: 'BB/G',
  pitchingflygnd: 'Fly/Gnd',
  pitchingflyout: 'Fly outs',
  pitchinggndout: 'Gnd outs',
  pitchingtotalhab: 'H-AB',
  pitchingemptypct: 'Empty BA',
  pitchingleadoffpct: 'Lead-off OBP',
  pitchingvsrightpct: 'vs RHB',
  pitchingvsleftpct: 'vs LHB',
  pitchingwrunnerspct: 'w/RISP',
  pitchingtotalhabpct: 'BAA',
  sbacsb: 'SB-CS',
}

// Presto keys by category (stats API uses short keys, not hitting*/pitching* prefixes)
const BATTING_KEYS = new Set([
  'gp', 'gs', 'ab', 'pa', 'h', 'r', 'hr', 'rbi', 'bb', 'k', 'sb', 'cs', 'hbp', 'sf', 'sh',
  'xbh', 'tb', 'avg', 'obp', 'slg', 'ops', 'dsk', '2b', '3b', 'gdp', 'gfo', 'lob', 'ibb',
  'adv', 'gsb', 'go', 'fo', 'kl', 'ci', 'dp', 'ht', 'havg', 'ravg', 'abavg', 'tbavg',
  'rbiavg', 'flyavg', 'groundavg', 'sbpct', 'sbcs',
])
const PITCHING_KEYS = new Set([
  'ip', 'er', 'era', 'whip', 'ph', 'pr', 'pbb', 'pk', 'pw', 'pl', 'sv', 'hd', 'phr',
  'pab', 'pkn', 'pgp', 'pgs', 'psv', 'pwpl', 'phd', 'pkl', 'pht', 'np', 'bf', 'bk',
  'cg', 'sho', 'pb', 'wp', 'par', 'pgf', 'pgdp', 'pgpr', 'phbp', 'pibb', 'pavg',
  'per', 'ipraw', 'ipapp', 'ipplus', 'scpk', 'kbb', 'kavg', 'bbplus', 'bfplus',
  'erplus', 'flyplus', 'gndplus', 'hrplus', 'soplus', 'eraplus',
])
const FIELDING_KEYS = new Set(['po', 'a', 'e', 'fpct', 'tc', 'rcs', 'sba', 'sbapt', 'rcspt'])

// Legacy extended-stats format uses hitting*/pitching*/fielding* prefixes
const isLegacyKey = (k: string) =>
  k.startsWith('hitting') || k.startsWith('pitching') || k.startsWith('fielding') || k.startsWith('catching')

function categorize(key: string): 'batting' | 'pitching' | 'fielding' | 'other' {
  if (isLegacyKey(key)) {
    if (key.startsWith('hitting')) return 'batting'
    if (key.startsWith('pitching')) return 'pitching'
    if (key.startsWith('fielding') || key.startsWith('catching')) return 'fielding'
  }
  if (BATTING_KEYS.has(key)) return 'batting'
  if (PITCHING_KEYS.has(key)) return 'pitching'
  if (FIELDING_KEYS.has(key)) return 'fielding'
  return 'other'
}

export interface PlayerRawStatsTabProps {
  playerId: number
  /** Raw stats from stats API current_season.raw_stats — used when available */
  rawStats?: Record<string, string> | null
  seasonName?: string
}

export function PlayerRawStatsTab({ playerId, rawStats: statsFromParent, seasonName: seasonFromParent }: PlayerRawStatsTabProps) {
  const { data: fetched, isLoading, error } = useQuery({
    queryKey: ['player', playerId, 'raw-stats'],
    queryFn: () => extendedStatsApi.getPlayerRawStats(playerId),
    // Prefer stats API data; only fetch when not provided
    enabled: !statsFromParent && !!playerId,
  })

  const rawStats = statsFromParent ?? fetched?.raw_stats ?? null
  const seasonName = seasonFromParent ?? fetched?.season_name ?? ''

  if (isLoading && !rawStats) {
    return <div className='py-4 text-center text-muted-foreground'>Loading...</div>
  }
  if (error && !rawStats) {
    return <div className='py-4 text-center text-destructive'>{(error as Error).message}</div>
  }
  if (!rawStats || Object.keys(rawStats).length === 0) {
    return (
      <Card>
        <CardContent className='py-8 text-center text-muted-foreground'>
          No raw stats. Sync with PrestoSports to populate.
        </CardContent>
      </Card>
    )
  }

  const entries = Object.entries(rawStats).filter(
    ([, v]) => v != null && v !== '' && v !== '--' && v !== '-'
  )
  const batting = entries.filter(([k]) => categorize(k) === 'batting')
  const pitching = entries.filter(([k]) => categorize(k) === 'pitching')
  const fielding = entries.filter(([k]) => categorize(k) === 'fielding')
  const other = entries.filter(([k]) => categorize(k) === 'other')

  const renderSection = (title: string, items: [string, string][]) => {
    if (items.length === 0) return null
    return (
      <div>
        <h4 className='mb-2 text-sm font-medium text-muted-foreground'>{title}</h4>
        <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4'>
          {items.map(([k, v]) => (
            <div key={k} className='rounded border bg-muted/30 px-2 py-1.5'>
              <p className='text-xs text-muted-foreground'>{PRESTO_LABELS[k] ?? k}</p>
              <p className='font-semibold'>{v}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Raw stats</CardTitle>
        <CardDescription>
          {seasonName ? `${seasonName} · ` : ''}Full Presto payload
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {renderSection('Batting', batting)}
        {renderSection('Pitching', pitching)}
        {renderSection('Fielding', fielding)}
        {other.length > 0 && renderSection('Other', other)}
      </CardContent>
    </Card>
  )
}
