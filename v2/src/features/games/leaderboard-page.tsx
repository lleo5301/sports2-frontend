/**
 * Stat leaderboard — ranked player leaders by stat.
 */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { gamesApi, type LeaderEntry } from '@/lib/games-api'
import { Main } from '@/components/layout/main'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

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

export function LeaderboardPage() {
  const [stat, setStat] = useState('batting_average')

  const { data, isLoading, error } = useQuery({
    queryKey: ['leaderboard', stat],
    queryFn: () => gamesApi.getLeaderboard({ stat, limit: 20 }),
  })

  return (
    <Main>
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Leaderboard</h2>
          <p className='text-muted-foreground'>
            Season stat leaders (from PrestoSports sync)
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stat leaders</CardTitle>
            <CardDescription>
              Select a stat to see ranked leaders
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Select value={stat} onValueChange={setStat}>
              <SelectTrigger className='w-full max-w-sm'>
                <SelectValue placeholder='Select stat' />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STAT_GROUPS).map(([group, stats]) => (
                  <div key={group}>
                    <div className='px-2 py-1.5 text-xs font-medium text-muted-foreground'>
                      {group}
                    </div>
                    {stats.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>

            {isLoading ? (
              <div className='flex items-center justify-center py-12'>
                <Loader2 className='size-8 animate-spin text-muted-foreground' />
              </div>
            ) : error ? (
              <div className='py-8 text-center text-destructive'>
                {(error as Error).message}
              </div>
            ) : data ? (
              <LeaderboardList
                stat={data.stat}
                season={data.season}
                leaders={data.leaders}
              />
            ) : (
              <div className='rounded-lg border border-dashed p-8 text-center text-muted-foreground'>
                No leaderboard data. Run PrestoSports sync to populate stats.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}

function LeaderboardList({
  stat,
  season,
  leaders,
}: {
  stat: string
  season: string | null
  leaders: LeaderEntry[]
}) {
  const statLabel = ALL_STATS.find((s) => s.value === stat)?.label ?? stat
  if (leaders.length === 0) {
    return (
      <div className='rounded-lg border border-dashed p-8 text-center text-muted-foreground'>
        No leaders found for {statLabel}
        {season && ` (${season})`}
      </div>
    )
  }
  return (
    <div className='space-y-2'>
      {season && (
        <p className='text-sm text-muted-foreground'>Season: {season}</p>
      )}
      <div className='space-y-1'>
        {leaders.map((entry) => (
          <LeaderRow key={entry.player.id} entry={entry} />
        ))}
      </div>
    </div>
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
