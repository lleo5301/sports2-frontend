import { useMemo } from 'react'
import { parseISO } from 'date-fns'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import {
  gamesApi,
  formatGameDateTime,
  formatGameLocation,
  type Game,
} from '@/lib/games-api'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  GameResultBadge,
  StreakIndicator,
} from '@/components/ui/game-result-badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTableCardView } from '@/components/data-table/card-view'
import { Main } from '@/components/layout/main'
import { OpponentLogo } from '@/components/opponent-logo'

const resultMap: Record<string, 'W' | 'L' | 'T' | 'D'> = {
  Win: 'W',
  Loss: 'L',
  Tie: 'T',
  Draw: 'D',
  W: 'W',
  L: 'L',
  T: 'T',
  D: 'D',
}

function getResultForRow(g: Game): 'W' | 'L' | 'T' | 'D' | null {
  return g.result ? (resultMap[g.result] ?? null) : null
}

function getCountdownText(game: Game): string {
  const d = getGameDate(game)
  if (!d) return ''
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Math.round(
    (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days > 1) return `${days}d`
  return ''
}

function formatHomeAway(game: Game): string | null {
  const ha = game.home_away?.toUpperCase()
  if (ha === 'H' || ha === 'HOME') return 'Home'
  if (ha === 'A' || ha === 'AWAY') return 'Away'
  if (ha === 'N' || ha === 'NEUTRAL') return 'Neutral'
  return null
}

function getGameDate(game: Game): Date | null {
  const d = game.date ?? game.game_date
  if (!d || typeof d !== 'string') return null
  try {
    return parseISO(d)
  } catch {
    return null
  }
}

export function GamesList() {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['games'],
    queryFn: () => gamesApi.list({ limit: 200 }),
  })

  const { upcoming, previous } = useMemo(() => {
    const list = data?.data ?? []
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const up: Game[] = []
    const prev: Game[] = []
    for (const g of list) {
      const d = getGameDate(g)
      if (!d) prev.push(g)
      else if (d >= now) up.push(g)
      else prev.push(g)
    }
    up.sort((a, b) => {
      const da = getGameDate(a)?.getTime() ?? 0
      const db = getGameDate(b)?.getTime() ?? 0
      return da - db
    })
    prev.sort((a, b) => {
      const da = getGameDate(a)?.getTime() ?? 0
      const db = getGameDate(b)?.getTime() ?? 0
      return da - db
    })
    return { upcoming: up, previous: prev }
  }, [data?.data])

  const deleteMutation = useMutation({
    mutationFn: (id: number) => gamesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      toast.success('Game deleted')
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to delete')
    },
  })

  const streakResults = useMemo(() => {
    return [...previous]
      .sort(
        (a, b) =>
          (getGameDate(b)?.getTime() ?? 0) - (getGameDate(a)?.getTime() ?? 0)
      )
      .map(getResultForRow)
      .filter((r): r is 'W' | 'L' | 'T' | 'D' => r !== null)
      .slice(0, 10)
  }, [previous])

  const currentStreak = useMemo(() => {
    if (!streakResults.length) return null
    const first = streakResults[0]
    let count = 0
    for (const r of streakResults) {
      if (r === first) count++
      else break
    }
    return { result: first, count }
  }, [streakResults])

  const sharedColumns: ColumnDef<Game>[] = [
    {
      id: 'opponent',
      header: 'Opponent',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <OpponentLogo
            opponent={row.original.opponent}
            logoUrl={row.original.opponent_logo_url}
            size={24}
            reserveSpace
          />
          <span>{row.original.opponent || '—'}</span>
        </div>
      ),
    },
    {
      id: 'date-time',
      header: 'Date & Time',
      cell: ({ row }) => (
        <span className='whitespace-normal'>
          {formatGameDateTime(row.original)}
        </span>
      ),
    },
    {
      id: 'venue',
      header: 'Venue',
      cell: ({ row }) => {
        const loc = formatGameLocation(row.original)
        const tournament = row.original.tournament?.name
        if (!loc && !tournament) return '—'
        return (
          <span className='whitespace-normal'>
            {loc || '—'}
            {tournament && loc && ' · '}
            {tournament && (
              <span className='text-muted-foreground'>{tournament}</span>
            )}
          </span>
        )
      },
    },
  ]

  const actionsColumn: ColumnDef<Game> = {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <MoreHorizontal className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem asChild>
            <Link to='/games/$id' params={{ id: String(row.original.id) }}>
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='text-destructive'
            onClick={() => deleteMutation.mutate(row.original.id)}
          >
            <Trash2 className='size-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }

  const tagsBadges = (g: Game) => (
    <div className='flex flex-wrap gap-1'>
      {g.is_conference && (
        <Badge variant='outline' className='text-xs'>
          Conf
        </Badge>
      )}
      {g.is_post_season && (
        <Badge variant='highlight' className='text-xs'>
          Post
        </Badge>
      )}
    </div>
  )

  const upcomingColumns: ColumnDef<Game>[] = [
    ...sharedColumns,
    {
      id: 'tags',
      header: '',
      cell: ({ row }) => tagsBadges(row.original),
    },
    actionsColumn,
  ]

  const previousColumns: ColumnDef<Game>[] = [
    ...sharedColumns,
    {
      id: 'score',
      header: 'Score',
      cell: ({ row }) => {
        const g = row.original
        if (g.team_score != null && g.opponent_score != null) {
          const won = g.team_score > g.opponent_score
          const lost = g.team_score < g.opponent_score
          return (
            <span
              className={
                won
                  ? 'font-semibold text-success'
                  : lost
                    ? 'font-semibold text-destructive'
                    : ''
              }
            >
              {g.team_score}–{g.opponent_score}
            </span>
          )
        }
        return '—'
      },
    },
    {
      accessorKey: 'result',
      header: 'Result',
      cell: ({ row }) => {
        const g = row.original
        const r = g.result
        const mapped = r ? resultMap[r] : undefined
        return (
          <div className='flex flex-wrap gap-1'>
            {mapped ? (
              <GameResultBadge result={mapped} />
            ) : r ? (
              <Badge variant='secondary'>{r}</Badge>
            ) : null}
            {tagsBadges(g)}
          </div>
        )
      },
    },
    actionsColumn,
  ]

  const upcomingTable = useReactTable<Game>({
    data: upcoming,
    columns: upcomingColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const previousTable = useReactTable<Game>({
    data: previous,
    columns: previousColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const renderTable = (
    table: ReturnType<typeof useReactTable<Game>>,
    options?: { getRowClassName?: (row: Game) => string }
  ) => (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((h) => (
              <TableHead key={h.id}>
                {flexRender(h.column.columnDef.header, h.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className={cn(
                'cursor-pointer',
                options?.getRowClassName?.(row.original)
              )}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('[data-row-actions]'))
                  return
                navigate({
                  to: '/games/$id',
                  params: { id: String(row.original.id) },
                })
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {cell.column.id === 'actions' ? (
                    <div data-row-actions>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getAllColumns().length}
              className='py-6 text-center text-muted-foreground'
            >
              No games
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )

  return (
    <Main>
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Games</h2>
          <CardDescription>Games and results</CardDescription>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className='py-8 text-center text-muted-foreground'>
              Loading...
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className='py-8 text-center text-destructive'>
              {(error as Error).message}
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-8'>
            {upcoming.length > 0 &&
              (() => {
                const next = upcoming[0]
                const second = upcoming[1]
                const countdown = getCountdownText(next)
                const venue = formatGameLocation(next)
                const homeAway = formatHomeAway(next)
                const tournament = next.tournament?.name
                const isToday = countdown === 'Today'
                return (
                  <Card className='overflow-hidden'>
                    <CardContent className='p-5 sm:p-6'>
                      <div className='mb-4 flex items-center gap-2'>
                        <span className='text-xs font-semibold tracking-widest text-muted-foreground uppercase'>
                          Next Game
                        </span>
                        {next.is_conference && (
                          <Badge variant='outline' className='text-xs'>
                            Conf
                          </Badge>
                        )}
                        {next.is_post_season && (
                          <Badge variant='highlight' className='text-xs'>
                            Post
                          </Badge>
                        )}
                      </div>

                      <div className='flex items-start justify-between gap-4'>
                        <div className='flex min-w-0 items-start gap-4'>
                          <OpponentLogo
                            opponent={next.opponent}
                            logoUrl={next.opponent_logo_url}
                            size={52}
                            reserveSpace
                            className='mt-1 shrink-0'
                          />
                          <div className='min-w-0'>
                            <h3 className='text-2xl leading-tight font-bold tracking-tight sm:text-3xl'>
                              {next.opponent || 'TBD'}
                            </h3>
                            <p className='mt-1 text-sm text-muted-foreground'>
                              {formatGameDateTime(next)}
                            </p>
                            {(venue || homeAway || tournament) && (
                              <p className='mt-0.5 flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground'>
                                {venue && <span>{venue}</span>}
                                {homeAway && (
                                  <>
                                    {venue && <span>·</span>}
                                    <span className='font-medium text-foreground'>
                                      {homeAway}
                                    </span>
                                  </>
                                )}
                                {tournament && (
                                  <>
                                    <span>·</span>
                                    <span>{tournament}</span>
                                  </>
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        {countdown && (
                          <div className='shrink-0 text-right'>
                            <span
                              className={cn(
                                'text-3xl font-bold tabular-nums sm:text-4xl',
                                isToday ? 'text-warning' : 'text-primary'
                              )}
                            >
                              {countdown}
                            </span>
                          </div>
                        )}
                      </div>

                      {second && (
                        <div className='mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-sm text-muted-foreground'>
                          <div className='flex items-center gap-2'>
                            <OpponentLogo
                              opponent={second.opponent}
                              logoUrl={second.opponent_logo_url}
                              size={18}
                              reserveSpace
                            />
                            <span>{second.opponent || 'TBD'}</span>
                          </div>
                          <span className='tabular-nums'>
                            {getCountdownText(second)}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })()}

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle>Upcoming</CardTitle>
                <CardDescription>{upcoming.length} scheduled</CardDescription>
              </CardHeader>
              <CardContent>
                {isMobile ? (
                  <DataTableCardView
                    table={upcomingTable}
                    titleColumnId='opponent'
                  />
                ) : (
                  renderTable(upcomingTable)
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <div className='flex items-start justify-between'>
                  <div>
                    <CardTitle>Previous</CardTitle>
                    <CardDescription>
                      {previous.length} games played
                    </CardDescription>
                  </div>
                  {streakResults.length > 0 && (
                    <div className='flex items-center gap-3'>
                      {currentStreak && (
                        <span
                          className={cn(
                            'text-sm font-bold tabular-nums',
                            currentStreak.result === 'W'
                              ? 'text-success'
                              : 'text-destructive'
                          )}
                        >
                          {currentStreak.result}
                          {currentStreak.count}
                        </span>
                      )}
                      <StreakIndicator results={streakResults} />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isMobile ? (
                  <DataTableCardView
                    table={previousTable}
                    titleColumnId='opponent'
                  />
                ) : (
                  renderTable(previousTable, {
                    getRowClassName: (g) => {
                      const r = getResultForRow(g)
                      if (r === 'W') return 'bg-success/10'
                      if (r === 'L') return 'bg-destructive/10'
                      return ''
                    },
                  })
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Main>
  )
}
