import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import {
  prospectsApi,
  type Prospect,
  PROSPECT_STATUSES,
  SCHOOL_TYPES,
  POSITIONS,
} from '@/lib/prospects-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { toast } from 'sonner'

export function ProspectsList() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [position, setPosition] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [schoolType, setSchoolType] = useState<string>('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['prospects', page, search, position, status, schoolType],
    queryFn: () =>
      prospectsApi.list({
        page,
        limit: 20,
        search: search || undefined,
        primary_position: position || undefined,
        status: status || undefined,
        school_type: schoolType || undefined,
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => prospectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] })
      toast.success('Prospect deleted')
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to delete')
    },
  })

  const columns: ColumnDef<Prospect>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <Link
          to='/prospects/$id'
          params={{ id: String(row.original.id) }}
          className='font-medium text-primary hover:underline'
        >
          {row.original.id}
        </Link>
      ),
    },
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) =>
        [row.original.first_name, row.original.last_name]
          .filter(Boolean)
          .join(' ') || '—',
    },
    { accessorKey: 'primary_position', header: 'Pos' },
    { accessorKey: 'school_type', header: 'Type' },
    { accessorKey: 'school_name', header: 'School' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = row.original.status
        if (!s) return '—'
        return (
          <Badge variant={s === 'committed' || s === 'signed' ? 'default' : 'secondary'}>
            {s}
          </Badge>
        )
      },
    },
    {
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
              <Link to='/prospects/$id' params={{ id: String(row.original.id) }}>
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
    },
  ]

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const pagination = data?.pagination

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Prospects</h2>
            <CardDescription>Recruiting pipeline</CardDescription>
          </div>
          <Button asChild>
            <Link to='/prospects/create'>
              <Plus className='size-4' />
              Add Prospect
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
                <SelectTrigger className='w-32'>
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
                <SelectTrigger className='w-36'>
                  <SelectValue placeholder='Pipeline Status' />
                </SelectTrigger>
                <SelectContent>
                  {PROSPECT_STATUSES.map((s) => (
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
                        <TableRow key={row.id}>
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
                          No prospects found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {pagination && pagination.pages > 1 && (
                  <div className='mt-4 flex items-center justify-between'>
                    <p className='text-sm text-muted-foreground'>
                      Page {pagination.page} of {pagination.pages} ({pagination.total} total)
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
    </Main>
  )
}
