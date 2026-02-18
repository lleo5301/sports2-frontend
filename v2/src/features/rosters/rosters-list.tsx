import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { Pencil, Plus, Trash2, Download, Eye } from 'lucide-react'
import { rostersApi, type Roster, ROSTER_TYPE_LABELS, ROSTER_SOURCES } from '@/lib/rosters-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function RostersList() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [rosterTypeFilter, setRosterTypeFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [activeFilter, setActiveFilter] = useState<string>('true')
  const [deleteTarget, setDeleteTarget] = useState<Roster | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'rosters',
      page,
      rosterTypeFilter,
      sourceFilter,
      activeFilter,
    ],
    queryFn: () =>
      rostersApi.list({
        page,
        limit: 20,
        roster_type:
          rosterTypeFilter && rosterTypeFilter !== 'all'
            ? (rosterTypeFilter as import('@/lib/rosters-api').RosterType)
            : undefined,
        source:
          sourceFilter && sourceFilter !== 'all'
            ? (sourceFilter as import('@/lib/rosters-api').RosterSource)
            : undefined,
        is_active:
          activeFilter === 'all'
            ? undefined
            : activeFilter === 'true',
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => rostersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rosters'] })
      toast.success('Roster deleted')
      setDeleteTarget(null)
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to delete')
    },
  })

  const backfillMutation = useMutation({
    mutationFn: () => rostersApi.backfill({ all: true }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['rosters'] })
      const created = result?.created ?? 0
      toast.success(
        created > 0 ? `Backfilled ${created} roster(s) from PrestoSports` : 'No new rosters to backfill'
      )
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Backfill failed')
    },
  })

  const columns: ColumnDef<Roster>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    {
      id: 'roster_type',
      header: 'Type',
      cell: ({ row }) =>
        ROSTER_TYPE_LABELS[row.original.roster_type] ?? row.original.roster_type,
    },
    {
      id: 'source',
      header: 'Source',
      cell: ({ row }) =>
        row.original.source === 'presto' ? 'PrestoSports' : 'Manual',
    },
    { accessorKey: 'effective_date', header: 'Date' },
    {
      id: 'entry_count',
      header: 'Players',
      cell: ({ row }) =>
        row.original.entry_count ?? row.original.total_entries ?? row.original.entries?.length ?? '—',
    },
    {
      id: 'game',
      header: 'Game',
      cell: ({ row }) =>
        row.original.Game?.opponent
          ? `vs ${row.original.Game.opponent}`
          : '—',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' asChild>
            <Link
              to='/rosters/$id'
              params={{ id: String(row.original.id) }}
            >
              <Eye className='size-4' />
              View
            </Link>
          </Button>
          <Button variant='outline' size='sm' asChild>
            <Link
              to='/rosters/$id'
              params={{ id: String(row.original.id) }}
            >
              <Pencil className='size-4' />
              Edit
            </Link>
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='text-destructive hover:text-destructive'
            onClick={() => setDeleteTarget(row.original)}
            title='Delete'
          >
            <Trash2 className='size-4' />
          </Button>
        </div>
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
    <Main fluid>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Named Rosters</h2>
            <CardDescription>
              Game-day, travel, practice, and custom rosters
            </CardDescription>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => backfillMutation.mutate()}
              disabled={backfillMutation.isPending}
            >
              <Download className='size-4' />
              Backfill from Presto
            </Button>
            <Button asChild>
              <Link to='/rosters/create'>
                <Plus className='size-4' />
                Create Roster
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className='flex flex-wrap gap-4'>
              <Select value={rosterTypeFilter} onValueChange={setRosterTypeFilter}>
                <SelectTrigger className='w-44'>
                  <SelectValue placeholder='Type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All types</SelectItem>
                  {Object.entries(ROSTER_TYPE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className='w-44'>
                  <SelectValue placeholder='Source' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All sources</SelectItem>
                  {ROSTER_SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === 'presto' ? 'PrestoSports' : 'Manual'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className='w-36'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='true'>Active</SelectItem>
                  <SelectItem value='false'>Inactive</SelectItem>
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
                          No rosters found. Create one or backfill from
                          PrestoSports.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete roster?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deleteTarget?.name}&quot; and
              all player entries. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Main>
  )
}
