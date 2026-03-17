/**
 * Stat leaderboard — ranked player leaders by stat.
 * Borderless rows, season shown once, zero-value categories hidden.
 *
 * DONE: Tiered layout — key stats (AVG, OBP, HR, ERA) show #1 as
 *       hero number, secondary stats stay compact.
 * DONE: Search filter — find a player across all categories,
 *       effectively providing a player-centric view.
 */
import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ChevronDown, ChevronUp, Loader2, Search, X } from 'lucide-react'
import { gamesApi, type LeaderEntry } from '@/lib/games-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Main } from '@/components/layout/main'

interface StatDef {
  value: string
  label: string
  primary?: boolean
}

const STAT_GROUPS: Record<string, StatDef[]> = {
  Batting: [
    { value: 'batting_average', label: 'Batting Average', primary: true },
    { value: 'on_base_percentage', label: 'OBP', primary: true },
    { value: 'home_runs', label: 'Home Runs', primary: true },
    { value: 'rbi', label: 'RBI', primary: true },
    { value: 'slugging_percentage', label: 'Slugging %' },
    { value: 'ops', label: 'OPS' },
    { value: 'hits', label: 'Hits' },
    { value: 'runs', label: 'Runs' },
    { value: 'stolen_bases', label: 'Stolen Bases' },
    { value: 'walks', label: 'Walks' },
    { value: 'doubles', label: 'Doubles' },
    { value: 'triples', label: 'Triples' },
  ],
  Pitching: [
    { value: 'era', label: 'ERA', primary: true },
    { value: 'strikeouts_pitching', label: 'Strikeouts', primary: true },
    { value: 'whip', label: 'WHIP' },
    { value: 'k_per_9', label: 'K/9' },
    { value: 'bb_per_9', label: 'BB/9' },
    { value: 'pitching_wins', label: 'Wins' },
    { value: 'saves', label: 'Saves' },
    { value: 'innings_pitched', label: 'Innings Pitched' },
  ],
  Fielding: [
    { value: 'fielding_percentage', label: 'Fielding %', primary: true },
  ],
}

const ALL_STATS = Object.values(STAT_GROUPS).flat()

const TOP_N = 3
const FULL_LIMIT = 20

/** Check if a category has meaningful data (top value is not 0 / empty) */
function hasMeaningfulData(leaders: LeaderEntry[]): boolean {
  if (leaders.length === 0) return false
  const topValue = leaders[0]?.value
  return (
    topValue != null &&
    topValue !== 0 &&
    topValue !== '0' &&
    topValue !== '' &&
    topValue !== '--'
  )
}

/** Match player name against search query */
function matchesSearch(entry: LeaderEntry, query: string): boolean {
  const name = [entry.player.first_name, entry.player.last_name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return name.includes(query.toLowerCase())
}

export function LeaderboardPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [search, setSearch] = useState('')

  const queries = useQueries({
    queries: ALL_STATS.map((s) => ({
      queryKey: ['leaderboard', s.value],
      queryFn: () =>
        gamesApi.getLeaderboard({ stat: s.value, limit: FULL_LIMIT }),
    })),
  })

  const isInitialLoad = queries.every((q) => q.isLoading)
  const hasAnyData = queries.some((q) => q.data?.leaders?.length)

  // Extract season name from the first query that has it
  const seasonName =
    queries.find((q) => q.data?.season_name)?.data?.season_name ?? null

  const isSearching = search.trim().length > 0

  const toggleExpand = (stat: string) => {
    setExpanded((p) => ({ ...p, [stat]: !p[stat] }))
  }

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <h2 className='font-display text-2xl font-extrabold tracking-tight'>
              Leaderboard
            </h2>
            <p className='text-muted-foreground'>
              Season stat leaders
              {seasonName && <> · {seasonName}</>}
            </p>
          </div>
          {hasAnyData && !isInitialLoad && (
            <div className='relative w-full max-w-xs'>
              <Search className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Find a player...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pr-8 pl-9'
              />
              {search && (
                <button
                  type='button'
                  onClick={() => setSearch('')}
                  className='absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                >
                  <X className='size-4' />
                </button>
              )}
            </div>
          )}
        </div>

        {isInitialLoad ? (
          <div className='flex justify-center py-16'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : !hasAnyData ? (
          <Card>
            <CardContent className='py-12 text-center text-muted-foreground'>
              No leaderboard data. Run PrestoSports sync to populate stats.
            </CardContent>
          </Card>
        ) : isSearching ? (
          <SearchResults queries={queries} search={search} />
        ) : (
          <div className='space-y-8'>
            {Object.entries(STAT_GROUPS).map(([group, stats]) => {
              const groupHasData = stats.some((s) => {
                const idx = ALL_STATS.findIndex((a) => a.value === s.value)
                const leaders = queries[idx]?.data?.leaders ?? []
                return hasMeaningfulData(leaders)
              })
              if (!groupHasData) return null

              const primaryStats = stats.filter((s) => s.primary)
              const secondaryStats = stats.filter((s) => !s.primary)

              const renderCard = (s: StatDef) => {
                const idx = ALL_STATS.findIndex((a) => a.value === s.value)
                const q = queries[idx]
                const data = q?.data
                const leaders = data?.leaders ?? []

                if (!q?.isLoading && !hasMeaningfulData(leaders)) return null

                const top3 = leaders.slice(0, TOP_N)
                const hasMore = leaders.length > TOP_N
                const isExpanded = expanded[s.value]

                return (
                  <LeaderboardCard
                    key={s.value}
                    statLabel={s.label}
                    leaders={leaders}
                    topN={top3}
                    hasMore={hasMore}
                    isExpanded={isExpanded}
                    onToggleExpand={() => toggleExpand(s.value)}
                    isLoading={q?.isLoading}
                    primary={s.primary}
                  />
                )
              }

              return (
                <div key={group}>
                  <h3 className='mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase'>
                    {group}
                  </h3>
                  {primaryStats.length > 0 && (
                    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                      {primaryStats.map(renderCard)}
                    </div>
                  )}
                  {secondaryStats.length > 0 && (
                    <div
                      className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${primaryStats.length > 0 ? 'mt-4' : ''}`}
                    >
                      {secondaryStats.map(renderCard)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Main>
  )
}

/** Player-centric search results — shows a player's rank across all stat categories */
function SearchResults({
  queries,
  search,
}: {
  queries: ReturnType<
    typeof useQueries<
      {
        queryKey: string[]
        queryFn: () => Promise<{ leaders: LeaderEntry[]; season_name?: string }>
      }[]
    >
  >
  search: string
}) {
  const results: Array<{ stat: StatDef; entry: LeaderEntry }> = []

  for (const s of ALL_STATS) {
    const idx = ALL_STATS.findIndex((a) => a.value === s.value)
    const leaders = queries[idx]?.data?.leaders ?? []
    for (const entry of leaders) {
      if (matchesSearch(entry, search)) {
        results.push({ stat: s, entry })
      }
    }
  }

  if (results.length === 0) {
    return (
      <p className='py-12 text-center text-sm text-muted-foreground'>
        No players matching &ldquo;{search}&rdquo;
      </p>
    )
  }

  // Group by player for player-centric display
  const byPlayer = new Map<
    number,
    Array<{ stat: StatDef; entry: LeaderEntry }>
  >()
  for (const r of results) {
    const pid = r.entry.player.id
    if (!byPlayer.has(pid)) byPlayer.set(pid, [])
    byPlayer.get(pid)!.push(r)
  }

  return (
    <div className='space-y-8'>
      {[...byPlayer.entries()].map(([pid, entries]) => {
        const player = entries[0].entry.player
        const name =
          [player.first_name, player.last_name].filter(Boolean).join(' ') ||
          `Player #${pid}`
        return (
          <div key={pid}>
            <Link
              to='/players/$id'
              params={{ id: String(pid) }}
              className='group mb-3 flex items-baseline gap-3 hover:underline'
            >
              <span className='font-display text-xl font-bold tracking-tight'>
                {name}
              </span>
              <span className='text-sm text-muted-foreground'>
                {[
                  player.position,
                  player.jersey_number != null
                    ? `#${player.jersey_number}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </Link>
            <div className='grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
              {entries.map(({ stat, entry }) => {
                const displayValue =
                  typeof entry.value === 'number' && entry.value % 1 !== 0
                    ? entry.value.toFixed(3)
                    : String(entry.value)
                return (
                  <div key={stat.value}>
                    <p className='text-[11px] text-muted-foreground'>
                      {stat.label}
                    </p>
                    <p className='font-display text-base font-bold tabular-nums'>
                      {displayValue}
                      <span
                        className={`ml-1.5 text-xs font-normal ${entry.rank === 1 ? 'text-success' : 'text-muted-foreground'}`}
                      >
                        #{entry.rank}
                      </span>
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LeaderboardCard({
  statLabel,
  leaders,
  topN,
  hasMore,
  isExpanded,
  onToggleExpand,
  isLoading,
  primary,
}: {
  statLabel: string
  leaders: LeaderEntry[]
  topN: LeaderEntry[]
  hasMore: boolean
  isExpanded: boolean
  onToggleExpand: () => void
  isLoading?: boolean
  primary?: boolean
}) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{statLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex justify-center py-8'>
            <Loader2 className='size-5 animate-spin text-muted-foreground' />
          </div>
        </CardContent>
      </Card>
    )
  }

  const hero = primary ? topN[0] : null
  const restRows = primary ? topN.slice(1) : topN

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base'>{statLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        {topN.length === 0 ? (
          <p className='py-4 text-center text-sm text-muted-foreground'>
            No data
          </p>
        ) : (
          <>
            {hero && <HeroLeader entry={hero} />}
            {restRows.length > 0 && (
              <ul
                className={`divide-y divide-border/40 ${hero ? 'border-t border-border/40' : ''}`}
              >
                {restRows.map((entry) => (
                  <LeaderRow key={entry.player.id} entry={entry} />
                ))}
              </ul>
            )}
            {isExpanded && hasMore && (
              <ul className='divide-y divide-border/40 border-t border-border/40'>
                {leaders.slice(TOP_N).map((entry) => (
                  <LeaderRow key={entry.player.id} entry={entry} />
                ))}
              </ul>
            )}
            {hasMore && (
              <Button
                variant='ghost'
                size='sm'
                className='mt-1 w-full text-muted-foreground'
                onClick={onToggleExpand}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className='mr-1 size-4' />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className='mr-1 size-4' />
                    View more ({leaders.length - TOP_N} more)
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function HeroLeader({ entry }: { entry: LeaderEntry }) {
  const name =
    [entry.player.first_name, entry.player.last_name]
      .filter(Boolean)
      .join(' ') || `Player #${entry.player.id}`
  const displayValue =
    typeof entry.value === 'number' && entry.value % 1 !== 0
      ? entry.value.toFixed(3)
      : String(entry.value)
  return (
    <Link
      to='/players/$id'
      params={{ id: String(entry.player.id) }}
      className='group block rounded-lg px-2 py-3 transition-colors hover:bg-muted/60'
    >
      <p className='font-display text-4xl font-extrabold tracking-tighter tabular-nums'>
        {displayValue}
      </p>
      <p className='mt-0.5 font-medium group-hover:underline'>{name}</p>
      <div className='flex gap-2 text-xs text-muted-foreground'>
        {entry.player.position && <span>{entry.player.position}</span>}
        {entry.player.jersey_number != null && (
          <span>#{entry.player.jersey_number}</span>
        )}
        {entry.qualifier_value != null && (
          <span>· {entry.qualifier_value} qual.</span>
        )}
      </div>
    </Link>
  )
}

function LeaderRow({ entry }: { entry: LeaderEntry }) {
  const name =
    [entry.player.first_name, entry.player.last_name]
      .filter(Boolean)
      .join(' ') || `Player #${entry.player.id}`
  const displayValue =
    typeof entry.value === 'number' && entry.value % 1 !== 0
      ? entry.value.toFixed(3)
      : String(entry.value)
  return (
    <li>
      <Link
        to='/players/$id'
        params={{ id: String(entry.player.id) }}
        className='flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60'
      >
        <span
          className={`w-5 shrink-0 text-center font-display tabular-nums ${
            entry.rank === 1
              ? 'font-bold text-foreground'
              : 'text-muted-foreground'
          }`}
        >
          {entry.rank}
        </span>
        <div className='min-w-0 flex-1'>
          <p className={entry.rank === 1 ? 'font-semibold' : 'font-medium'}>
            {name}
          </p>
          <div className='flex gap-2 text-xs text-muted-foreground'>
            {entry.player.position && <span>{entry.player.position}</span>}
            {entry.player.jersey_number != null && (
              <span>#{entry.player.jersey_number}</span>
            )}
          </div>
        </div>
        <div className='text-right'>
          <p
            className={`font-display tabular-nums ${entry.rank === 1 ? 'text-lg font-bold' : 'font-semibold'}`}
          >
            {displayValue}
          </p>
          {entry.qualifier_value != null && (
            <p className='text-xs text-muted-foreground tabular-nums'>
              ({entry.qualifier_value} qual.)
            </p>
          )}
        </div>
      </Link>
    </li>
  )
}
