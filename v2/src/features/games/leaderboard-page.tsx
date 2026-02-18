/**
 * Stat leaderboard — ranked player leaders by stat.
 * One card per stat with top 3; "View more" expands to full list.
 */
import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { gamesApi, type LeaderEntry } from '@/lib/games-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const STAT_GROUPS = {
  Batting: [
    { value: 'batting_average', label: 'Batting Average' },
    { value: 'on_base_percentage', label: 'OBP' },
    { value: 'slugging_percentage', label: 'Slugging %' },
    { value: 'ops', label: 'OPS' },
    { value: 'home_runs', label: 'Home Runs' },
    { value: 'rbi', label: 'RBI' },
    { value: 'hits', label: 'Hits' },
    { value: 'runs', label: 'Runs' },
    { value: 'stolen_bases', label: 'Stolen Bases' },
    { value: 'walks', label: 'Walks' },
    { value: 'doubles', label: 'Doubles' },
    { value: 'triples', label: 'Triples' },
  ],
  Pitching: [
    { value: 'era', label: 'ERA' },
    { value: 'whip', label: 'WHIP' },
    { value: 'k_per_9', label: 'K/9' },
    { value: 'bb_per_9', label: 'BB/9' },
    { value: 'strikeouts_pitching', label: 'Strikeouts' },
    { value: 'pitching_wins', label: 'Wins' },
    { value: 'saves', label: 'Saves' },
    { value: 'innings_pitched', label: 'Innings Pitched' },
  ],
  Fielding: [{ value: 'fielding_percentage', label: 'Fielding %' }],
}

const ALL_STATS = Object.values(STAT_GROUPS).flat()

const TOP_N = 3
const FULL_LIMIT = 20

export function LeaderboardPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const queries = useQueries({
    queries: ALL_STATS.map((s) => ({
      queryKey: ['leaderboard', s.value],
      queryFn: () => gamesApi.getLeaderboard({ stat: s.value, limit: FULL_LIMIT }),
    })),
  })

  const isInitialLoad = queries.every((q) => q.isLoading)
  const hasAnyData = queries.some((q) => q.data?.leaders?.length)

  const toggleExpand = (stat: string) => {
    setExpanded((p) => ({ ...p, [stat]: !p[stat] }))
  }

  return (
    <Main>
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Leaderboard</h2>
          <p className='text-muted-foreground'>
            Season stat leaders (from PrestoSports sync)
          </p>
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
        ) : (
          <div className='space-y-6'>
            {Object.entries(STAT_GROUPS).map(([group, stats]) => (
              <div key={group}>
                <h3 className='mb-4 text-lg font-semibold text-muted-foreground'>
                  {group}
                </h3>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {stats.map((s) => {
                    const idx = ALL_STATS.findIndex((a) => a.value === s.value)
                    const q = queries[idx]
                    const data = q?.data
                    const leaders = data?.leaders ?? []
                    const top3 = leaders.slice(0, TOP_N)
                    const hasMore = leaders.length > TOP_N
                    const isExpanded = expanded[s.value]

                    return (
                      <LeaderboardCard
                        key={s.value}
                        statLabel={s.label}
                        season={data?.season_name ?? data?.season ?? null}
                        leaders={leaders}
                        topN={top3}
                        hasMore={hasMore}
                        isExpanded={isExpanded}
                        onToggleExpand={() => toggleExpand(s.value)}
                        isLoading={q?.isLoading}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Main>
  )
}

function LeaderboardCard({
  statLabel,
  season,
  leaders,
  topN,
  hasMore,
  isExpanded,
  onToggleExpand,
  isLoading,
}: {
  statLabel: string
  season: string | null
  leaders: LeaderEntry[]
  topN: LeaderEntry[]
  hasMore: boolean
  isExpanded: boolean
  onToggleExpand: () => void
  isLoading?: boolean
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

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base'>{statLabel}</CardTitle>
        {season && (
          <CardDescription>{season}</CardDescription>
        )}
      </CardHeader>
      <CardContent className='space-y-2'>
        {topN.length === 0 ? (
          <p className='py-4 text-center text-sm text-muted-foreground'>
            No data
          </p>
        ) : (
          <>
            <div className='space-y-1'>
              {topN.map((entry) => (
                <LeaderRow key={entry.player.id} entry={entry} />
              ))}
            </div>
            {isExpanded && hasMore && (
              <div className='space-y-1 border-t pt-2'>
                {leaders.slice(TOP_N).map((entry) => (
                  <LeaderRow key={entry.player.id} entry={entry} />
                ))}
              </div>
            )}
            {hasMore && (
              <Button
                variant='ghost'
                size='sm'
                className='w-full text-muted-foreground'
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

function LeaderRow({ entry }: { entry: LeaderEntry }) {
  const name = [entry.player.first_name, entry.player.last_name]
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
      className='flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50'
    >
      <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted font-semibold'>
        {entry.rank}
      </span>
      <div className='min-w-0 flex-1'>
        <p className='font-medium'>{name}</p>
        <div className='flex gap-2 text-sm text-muted-foreground'>
          {entry.player.position && (
            <span>{entry.player.position}</span>
          )}
          {entry.player.jersey_number != null && (
            <span>#{entry.player.jersey_number}</span>
          )}
        </div>
      </div>
      <div className='text-right'>
        <p className='font-bold'>{displayValue}</p>
        {entry.qualifier_value != null && (
          <p className='text-xs text-muted-foreground'>
            ({entry.qualifier_value} qual.)
          </p>
        )}
      </div>
    </Link>
  )
}
