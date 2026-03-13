import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown, Plus } from 'lucide-react'
import { playersApi, type Player } from '@/lib/players-api'
import { useIsMobile } from '@/hooks/use-mobile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PositionBadge } from '@/components/ui/position-badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
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
import { PlayerDetail } from './player-detail'

const POSITIONS = [
  'P',
  'C',
  '1B',
  '2B',
  '3B',
  'SS',
  'LF',
  'CF',
  'RF',
  'OF',
  'DH',
] as const
const SCHOOL_TYPES = ['HS', 'COLL'] as const
const STATUSES = ['active', 'inactive', 'graduated', 'transferred'] as const

function SortableHeader<T>({
  column,
  label,
}: {
  column: import('@tanstack/react-table').Column<T>
  label: string
}) {
  const sorted = column.getIsSorted()
  return (
    <button
      type='button'
      className='flex items-center gap-1 hover:text-foreground'
      onClick={() => column.toggleSorting()}
    >
      {label}
      {sorted === 'asc' ? (
        <ArrowUp className='size-3.5' />
      ) : sorted === 'desc' ? (
        <ArrowDown className='size-3.5' />
      ) : (
        <ArrowUpDown className='size-3.5 text-muted-foreground/50' />
      )}
    </button>
  )
}

export function PlayersList() {
  const isMobile = useIsMobile()
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [position, setPosition] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [schoolType, setSchoolType] = useState<string>('')
  const [sorting, setSorting] = useState<SortingState>([])

  const { data, isLoading, error } = useQuery({
    queryKey: ['players', page, search, position, status, schoolType],
    queryFn: () =>
      playersApi.list({
        page,
        limit: 20,
        search: search || undefined,
        position: position || undefined,
        status: status || undefined,
        school_type: schoolType || undefined,
      }),
  })

  const columns: ColumnDef<Player>[] = [
    {
      id: 'name',
      accessorFn: (row) =>
        [row.last_name, row.first_name].filter(Boolean).join(', '),
      header: ({ column }) => <SortableHeader column={column} label='Name' />,
      cell: ({ row }) => {
        const p = row.original
        const name =
          [p.first_name, p.last_name].filter(Boolean).join(' ') || '—'
        const initials = `${(p.first_name ?? '')[0] ?? ''}${(p.last_name ?? '')[0] ?? ''}`
        return (
          <div className='flex items-center gap-3'>
            <Avatar className='size-10'>
              {p.photo_url && <AvatarImage src={p.photo_url} alt={name} />}
              <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <span className='font-medium'>{name}</span>
              {p.jersey_number != null && (
                <span className='ml-1.5 text-xs text-muted-foreground'>
                  #{p.jersey_number}
                </span>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'position',
      header: ({ column }) => <SortableHeader column={column} label='Pos' />,
      cell: ({ row }) => {
        const pos = row.original.position
        return pos ? <PositionBadge position={pos} /> : '—'
      },
    },
    {
      id: 'bt',
      accessorFn: (row) => [row.bats, row.throws].filter(Boolean).join('/'),
      header: ({ column }) => <SortableHeader column={column} label='B/T' />,
      cell: ({ row }) => {
        const { bats, throws: t } = row.original
        if (!bats && !t) return '—'
        return (
          <span className='text-sm text-muted-foreground'>
            {(bats ?? '—').charAt(0).toUpperCase()}/
            {(t ?? '—').charAt(0).toUpperCase()}
          </span>
        )
      },
    },
    {
      id: 'size',
      accessorFn: (row) => row.weight ?? 0,
      header: ({ column }) => <SortableHeader column={column} label='Ht/Wt' />,
      cell: ({ row }) => {
        const { height, weight } = row.original
        if (!height && !weight) return '—'
        return (
          <span className='text-sm whitespace-nowrap text-muted-foreground'>
            {[height, weight ? `${weight}` : null].filter(Boolean).join(' / ')}
          </span>
        )
      },
    },
  ]

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const pagination = data?.pagination

  return (
    <Main fluid>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Players</h2>
            <CardDescription>Roster and player management</CardDescription>
          </div>
          <Button asChild>
            <Link to='/players/create'>
              <Plus className='size-4' />
              Add Player
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className='flex flex-wrap gap-4'>
              <Input
                placeholder='Search...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='max-w-xs'
              />
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger className='w-32'>
                  <SelectValue placeholder='Position' />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={schoolType} onValueChange={setSchoolType}>
                <SelectTrigger className='w-28'>
                  <SelectValue placeholder='Type' />
                </SelectTrigger>
                <SelectContent>
                  {SCHOOL_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className='w-32'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='py-8 text-center text-muted-foreground'>
                Loading...
              </div>
            ) : error ? (
              <div className='py-8 text-center text-destructive'>
                {(error as Error).message}
              </div>
            ) : (
              <>
                {isMobile ? (
                  <DataTableCardView table={table} titleColumnId='name' />
                ) : (
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((hg) => (
                        <TableRow key={hg.id}>
                          {hg.headers.map((h) => (
                            <TableHead key={h.id}>
                              {flexRender(
                                h.column.columnDef.header,
                                h.getContext()
                              )}
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
                            onClick={() => setSelectedPlayerId(row.original.id)}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className='py-8 text-center text-muted-foreground'
                          >
                            No players found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
                {pagination && pagination.pages > 1 && (
                  <div className='mt-4 flex items-center justify-between'>
                    <p className='text-sm text-muted-foreground'>
                      Page {pagination.page} of {pagination.pages} (
                      {pagination.total} total)
                    </p>
                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        disabled={page >= pagination.pages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet
        open={selectedPlayerId != null}
        onOpenChange={(open) => !open && setSelectedPlayerId(null)}
      >
        <SheetContent
          side='right'
          className='w-full overflow-y-auto p-0 sm:max-w-4xl'
        >
          <SheetHeader className='sr-only'>
            <SheetTitle>Player Details</SheetTitle>
            <SheetDescription>View player profile and stats</SheetDescription>
          </SheetHeader>
          {selectedPlayerId != null && (
            <PlayerDetail
              id={String(selectedPlayerId)}
              embedded
              onClose={() => setSelectedPlayerId(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </Main>
  )
}
