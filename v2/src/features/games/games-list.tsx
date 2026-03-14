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
import { GameResultBadge } from '@/components/ui/game-result-badge'
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

  const sharedColumns: ColumnDef<Game>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <Link
          to='/games/$id'
          params={{ id: String(row.original.id) }}
          className='font-medium text-primary hover:underline'
        >
          {row.original.id}
        </Link>
      ),
    },
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

  const renderTable = (table: ReturnType<typeof useReactTable<Game>>) => (
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
              className='cursor-pointer'
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
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle>Upcoming</CardTitle>
                <CardDescription>
                  Soonest first (ascending by date)
                </CardDescription>
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
                <CardTitle>Previous</CardTitle>
                <CardDescription>
                  Oldest first (ascending by date)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isMobile ? (
                  <DataTableCardView
                    table={previousTable}
                    titleColumnId='opponent'
                  />
                ) : (
                  renderTable(previousTable)
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Main>
  )
}
