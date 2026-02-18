/**
 * Player game log tab — per-game stats from /players/byId/:id/game-log
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { formatDate } from '@/lib/format-date'
import { extendedStatsApi, type PlayerGameLogEntry } from '@/lib/extended-stats-api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

/** Per-game AVG for chart (newest first → chronological order for display) */
function gameByGameAvg(games: PlayerGameLogEntry[], n: number): Array<{ game: number; avg: number; label: string }> {
  const withBatting = games
    .filter((g) => g.batting?.ab != null && g.batting.ab > 0)
    .slice(0, n)
  return withBatting
    .map((g, i) => {
      const h = g.batting?.h ?? 0
      const ab = g.batting?.ab ?? 0
      return {
        game: withBatting.length - i,
        avg: ab > 0 ? h / ab : 0,
        label: g.game?.opponent ?? `G${i + 1}`,
      }
    })
    .reverse()
}

/** Hitting streak: consecutive games with at least 1 hit (from newest) */
function hitStreak(games: PlayerGameLogEntry[]): number {
  let s = 0
  for (const g of games) {
    const h = g.batting?.h ?? 0
    if (h >= 1) s++
    else break
  }
  return s
}

/** Last N games: AVG, OPS-like (simplified: (H+BB)/PA) */
function lastNStats(games: PlayerGameLogEntry[], n: number): { avg: string; pa: number } {
  const slice = games.slice(0, n).filter((g) => g.batting?.ab != null)
  const hits = slice.reduce((s, g) => s + (g.batting?.h ?? 0), 0)
  const ab = slice.reduce((s, g) => s + (g.batting?.ab ?? 0), 0)
  const bb = slice.reduce((s, g) => s + (g.batting?.bb ?? 0), 0)
  const pa = ab + bb
  const avg = pa > 0 ? (hits / ab).toFixed(3) : '.000'
  return { avg, pa }
}

export function PlayerGameLogTab({ playerId }: { playerId: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['player', playerId, 'game-log'],
    queryFn: () => extendedStatsApi.getPlayerGameLog(playerId),
  })

  if (isLoading) return <div className='py-4 text-center text-muted-foreground'>Loading...</div>
  if (error) return <div className='py-4 text-center text-destructive'>{(error as Error).message}</div>
  if (!data?.games?.length) {
    return (
      <Card>
        <CardContent className='py-8 text-center text-muted-foreground'>
          No game log. Sync with PrestoSports to populate.
        </CardContent>
      </Card>
    )
  }

  const games = data.games
  const streak = hitStreak(games)
  const last5 = lastNStats(games, 5)
  const last10 = lastNStats(games, 10)
  const trendData = gameByGameAvg(games, 15)
  const hasBattingGames = games.some((g) => g.batting?.ab != null && g.batting.ab > 0)

  return (
    <div className='space-y-6'>
      {/* Streaks and recent performance */}
      {hasBattingGames && (
        <Card>
          <CardHeader>
            <CardTitle>Trends</CardTitle>
            <CardDescription>Recent performance and streaks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-3'>
              {streak > 0 && (
                <Badge variant='default'>Hit streak: {streak} games</Badge>
              )}
              {last5.pa > 0 && (
                <Badge variant='secondary'>Last 5: .{last5.avg.slice(2)} AVG</Badge>
              )}
              {last10.pa > 0 && (
                <Badge variant='outline'>Last 10: .{last10.avg.slice(2)} AVG</Badge>
              )}
            </div>
            {trendData.length >= 3 && (
              <div className='mt-4 h-32'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id='avgGrad' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0%' stopColor='var(--primary)' stopOpacity={0.3} />
                        <stop offset='100%' stopColor='var(--primary)' stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey='game' stroke='var(--muted-foreground)' fontSize={10} tickLine={false} />
                    <YAxis stroke='var(--muted-foreground)' fontSize={10} tickLine={false} width={24} domain={[0, 1]} tickFormatter={(v) => v.toFixed(1)} />
                    <Tooltip content={({ active, payload }) => (active && payload?.[0] ? (
                      <div className='rounded border bg-background p-2 text-xs'>
                        {payload[0].payload.label}: {(payload[0].value as number).toFixed(3)} AVG
                      </div>
                    ) : null)} />
                    <Area type='monotone' dataKey='avg' stroke='var(--primary)' fill='url(#avgGrad)' strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
                <p className='mt-1 text-xs text-muted-foreground'>Per-game AVG (last 15 games)</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Game log</CardTitle>
          <CardDescription>Per-game batting, pitching, fielding · {data.player_name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Opponent</TableHead>
                <TableHead>Pos</TableHead>
                <TableHead>AB</TableHead>
                <TableHead>R</TableHead>
                <TableHead>H</TableHead>
                <TableHead>RBI</TableHead>
                <TableHead>BB</TableHead>
                <TableHead>SO</TableHead>
                <TableHead>PO-A-E</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.games.map((entry, i) => (
                <TableRow key={entry.game.id ?? i}>
                  <TableCell>
                    <Link
                      to='/games/$id'
                      params={{ id: entry.game.id }}
                      className='font-medium hover:underline'
                    >
                      {formatDate(entry.game.date)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      to='/games/$id'
                      params={{ id: entry.game.id }}
                      className='hover:underline'
                    >
                      {entry.game.home_away === 'home' ? 'vs' : '@'} {entry.game.opponent}
                    </Link>
                  </TableCell>
                  <TableCell>{entry.position}</TableCell>
                  <TableCell>{entry.batting?.ab ?? '—'}</TableCell>
                  <TableCell>{entry.batting?.r ?? '—'}</TableCell>
                  <TableCell>{entry.batting?.h ?? '—'}</TableCell>
                  <TableCell>{entry.batting?.rbi ?? '—'}</TableCell>
                  <TableCell>{entry.batting?.bb ?? '—'}</TableCell>
                  <TableCell>{entry.batting?.so ?? '—'}</TableCell>
                  <TableCell>
                    {entry.fielding
                      ? `${entry.fielding.po}-${entry.fielding.a}-${entry.fielding.e}`
                      : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
