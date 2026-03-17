/**
 * Player raw stats tab — Presto keys from current_season.raw_stats (stats API)
 * or /players/byId/:id/stats/raw (extended stats API).
 */
import { useQuery } from '@tanstack/react-query'
import { extendedStatsApi } from '@/lib/extended-stats-api'

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

// Compound suffixes (after stripping hitting/pitching/fielding/catching prefix)
const COMPOUND_LABELS: Record<string, string> = {
  // Rate / per-game stats
  advopspct: 'Adv OPS%',
  bbpct: 'BB%',
  kpct: 'K%',
  abpergame: 'AB/G',
  hpergame: 'H/G',
  rpergame: 'R/G',
  hrpergame: 'HR/G',
  rbipergame: 'RBI/G',
  bbpergame: 'BB/G',
  kpergame: 'K/G',
  sbpergame: 'SB/G',
  spergame: 'SB/G',
  ippergame: 'IP/G',
  ippg: 'IP/G',
  kbb: 'K/BB',
  gopct: 'GO%',
  fopct: 'FO%',
  flypct: 'Fly%',
  gndpct: 'Ground%',
  fldpct: 'FLD%',
  gbfb: 'GB/FB',
  // Long per-game keys (no prefix)
  doublespergame: '2B/G',
  triplespergame: '3B/G',
  stolenbasespergame: 'SB/G',
  runsbattedinpergame: 'RBI/G',
  // Aggregate / splits
  totalhab: 'H-AB',
  totalhabpct: 'BAA',
  flygnd: 'Fly/Gnd',
  flyout: 'Fly Outs',
  gndout: 'Gnd Outs',
  oppavg: 'Opp AVG',
  oppobp: 'Opp OBP',
  oppslg: 'Opp SLG',
  oppops: 'Opp OPS',
  babip: 'BABIP',
  iso: 'ISO',
  woba: 'wOBA',
  wobaadj: 'wOBA Adj',
  wrc: 'wRC',
  wrcplus: 'wRC+',
  // Situational — bases empty
  empty: 'Empty',
  emptyh: 'Empty H',
  emptyab: 'Empty AB',
  emptypct: 'Empty BA',
  // Situational — lead-off
  leadoff: 'Lead-off',
  leadoffno: 'Lead-off #',
  leadoffops: 'Lead-off OPS',
  leadoffpct: 'Lead-off OBP',
  // Situational — vs left/right
  vsleft: 'vs LHB',
  vslefth: 'vs LHB H',
  vsleftab: 'vs LHB AB',
  vsleftpct: 'vs LHB BA',
  vsright: 'vs RHB',
  vsrighth: 'vs RHB H',
  vsrightab: 'vs RHB AB',
  vsrightpct: 'vs RHB BA',
  // Situational — with 2 outs
  w2outs: 'w/ 2 Outs',
  w2outsh: 'w/ 2 Outs H',
  w2outsab: 'w/ 2 Outs AB',
  w2outspct: 'w/ 2 Outs BA',
  // Situational — bases loaded
  wloaded: 'Bases Loaded',
  wloadedh: 'Bases Loaded H',
  wloadedab: 'Bases Loaded AB',
  wloadedpct: 'Bases Loaded BA',
  // Situational — runners on
  wrunners: 'w/ Runners',
  wrunnersh: 'w/ Runners H',
  wrunnersab: 'w/ Runners AB',
  wrunnerspct: 'w/ RISP BA',
  // Situational — RISP / RBI opportunity
  wrbiops: 'RISP',
  wrbiopsh: 'RISP H',
  wrbiopsab: 'RISP AB',
  wrbiopspct: 'RISP BA',
  // Situational — runner on 3rd
  rbi3rd: 'Runner 3rd',
  rbi3rdno: 'Runner 3rd #',
  rbi3rdops: 'Runner 3rd OPS',
  rbi2out: 'RBI 2-Out',
  // Situational — pinch hitting
  pinchhit: 'Pinch Hit',
  pinchhith: 'Pinch Hit H',
  pinchhitab: 'Pinch Hit AB',
  pinchhitpct: 'Pinch Hit BA',
  // Advanced OPS
  advopsno: 'Adv OPS #',
  advopsops: 'Adv OPS',
  // Fielding extras
  hdp: 'HDP',
  psf: 'SF',
  psh: 'SH',
  poff: 'Picked Off',
  hpoff: 'HP Off',
  rchfc: 'Reached FC',
  stlat: 'Steal Att',
  rcherr: 'Reached Err',
  stlata: 'Steal Att A',
}

/** Format a raw Presto stat key into a human-readable label. */
function formatStatKey(key: string): string {
  if (PRESTO_LABELS[key]) return PRESTO_LABELS[key]

  // Strip category prefix
  let base = key
  for (const prefix of ['hitting', 'pitching', 'fielding', 'catching']) {
    if (base.startsWith(prefix) && base.length > prefix.length) {
      base = base.slice(prefix.length)
      break
    }
  }

  // Check stripped key against both maps
  if (PRESTO_LABELS[base]) return PRESTO_LABELS[base]
  if (COMPOUND_LABELS[base]) return COMPOUND_LABELS[base]

  // Last resort: insert spaces at camelCase boundaries, clean up suffixes
  return base
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/pct$/i, '%')
    .replace(/avg$/i, ' AVG')
    .replace(/^./, (c) => c.toUpperCase())
}

// Presto keys by category (stats API uses short keys, not hitting*/pitching* prefixes)
const BATTING_KEYS = new Set([
  'gp',
  'gs',
  'ab',
  'pa',
  'h',
  'r',
  'hr',
  'rbi',
  'bb',
  'k',
  'sb',
  'cs',
  'hbp',
  'sf',
  'sh',
  'xbh',
  'tb',
  'avg',
  'obp',
  'slg',
  'ops',
  'dsk',
  '2b',
  '3b',
  'gdp',
  'gfo',
  'lob',
  'ibb',
  'adv',
  'gsb',
  'go',
  'fo',
  'kl',
  'ci',
  'dp',
  'ht',
  'havg',
  'ravg',
  'abavg',
  'tbavg',
  'rbiavg',
  'flyavg',
  'groundavg',
  'sbpct',
  'sbcs',
])
const PITCHING_KEYS = new Set([
  'ip',
  'er',
  'era',
  'whip',
  'ph',
  'pr',
  'pbb',
  'pk',
  'pw',
  'pl',
  'sv',
  'hd',
  'phr',
  'pab',
  'pkn',
  'pgp',
  'pgs',
  'psv',
  'pwpl',
  'phd',
  'pkl',
  'pht',
  'np',
  'bf',
  'bk',
  'cg',
  'sho',
  'pb',
  'wp',
  'par',
  'pgf',
  'pgdp',
  'pgpr',
  'phbp',
  'pibb',
  'pavg',
  'per',
  'ipraw',
  'ipapp',
  'ipplus',
  'scpk',
  'kbb',
  'kavg',
  'bbplus',
  'bfplus',
  'erplus',
  'flyplus',
  'gndplus',
  'hrplus',
  'soplus',
  'eraplus',
])
const FIELDING_KEYS = new Set([
  'po',
  'a',
  'e',
  'fpct',
  'tc',
  'rcs',
  'sba',
  'sbapt',
  'rcspt',
])

// Legacy extended-stats format uses hitting*/pitching*/fielding* prefixes
const isLegacyKey = (k: string) =>
  k.startsWith('hitting') ||
  k.startsWith('pitching') ||
  k.startsWith('fielding') ||
  k.startsWith('catching')

function categorize(
  key: string
): 'batting' | 'pitching' | 'fielding' | 'other' {
  if (isLegacyKey(key)) {
    if (key.startsWith('hitting')) return 'batting'
    if (key.startsWith('pitching')) return 'pitching'
    if (key.startsWith('fielding') || key.startsWith('catching'))
      return 'fielding'
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

export function PlayerRawStatsTab({
  playerId,
  rawStats: statsFromParent,
  seasonName: seasonFromParent,
}: PlayerRawStatsTabProps) {
  const {
    data: fetched,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['player', playerId, 'raw-stats'],
    queryFn: () => extendedStatsApi.getPlayerRawStats(playerId),
    // Prefer stats API data; only fetch when not provided
    enabled: !statsFromParent && !!playerId,
  })

  const rawStats = statsFromParent ?? fetched?.raw_stats ?? null
  const seasonName = seasonFromParent ?? fetched?.season_name ?? ''

  if (isLoading && !rawStats) {
    return (
      <div className='py-4 text-center text-muted-foreground'>Loading...</div>
    )
  }
  if (error && !rawStats) {
    return (
      <div className='py-4 text-center text-destructive'>
        {(error as Error).message}
      </div>
    )
  }
  if (!rawStats || Object.keys(rawStats).length === 0) {
    return (
      <p className='py-8 text-center text-muted-foreground'>
        No raw stats. Sync with PrestoSports to populate.
      </p>
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
        <h5 className='mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase'>
          {title}
        </h5>
        <div className='grid grid-cols-3 gap-x-4 gap-y-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
          {items.map(([k, v]) => (
            <div key={k}>
              <p className='text-[11px] text-muted-foreground'>
                {formatStatKey(k)}
              </p>
              <p className='font-display text-base font-bold tabular-nums'>
                {v}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <h3 className='font-display text-base font-bold tracking-tight'>
        Raw stats
        {seasonName && (
          <span className='ml-2 text-sm font-normal text-muted-foreground'>
            {seasonName}
          </span>
        )}
      </h3>
      {renderSection('Batting', batting)}
      {renderSection('Pitching', pitching)}
      {renderSection('Fielding', fielding)}
      {other.length > 0 && renderSection('Other', other)}
    </div>
  )
}
