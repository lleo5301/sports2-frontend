import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { scoutingApi, type ScoutingReport } from '@/lib/scouting-api'
import { prospectsApi } from '@/lib/prospects-api'
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

function subjectName(report: ScoutingReport) {
  if (report.Prospect) {
    return [report.Prospect.first_name, report.Prospect.last_name]
      .filter(Boolean)
      .join(' ') || `Prospect #${report.prospect_id}`
  }
  if (report.Player) {
    return [report.Player.first_name, report.Player.last_name]
      .filter(Boolean)
      .join(' ') || `Player #${report.player_id}`
  }
  return report.prospect_id
    ? `Prospect #${report.prospect_id}`
    : report.player_id
      ? `Player #${report.player_id}`
      : '—'
}

export function ScoutingList() {
  const [page, setPage] = useState(1)
  const [prospectFilter, setProspectFilter] = useState<string>('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['scouting-reports', page, prospectFilter],
    queryFn: () =>
      scoutingApi.list({
        page,
        limit: 20,
        prospect_id: prospectFilter ? parseInt(prospectFilter, 10) : undefined,
      }),
  })

  const { data: prospectsData } = useQuery({
    queryKey: ['prospects-simple'],
    queryFn: () => prospectsApi.list({ limit: 200 }),
  })

  const columns: ColumnDef<ScoutingReport>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <Link
          to='/scouting/$id'
          params={{ id: String(row.original.id) }}
          className='font-medium text-primary hover:underline'
        >
          {row.original.id}
        </Link>
      ),
    },
    {
      id: 'subject',
      header: 'Subject',
      cell: ({ row }) => subjectName(row.original),
    },
    { accessorKey: 'report_date', header: 'Date' },
    {
      accessorKey: 'event_type',
      header: 'Event',
      cell: ({ row }) => row.original.event_type || '—',
    },
    {
      id: 'overall',
      header: 'Overall',
      cell: ({ row }) => {
        const p = row.original.overall_present
        const f = row.original.overall_future
        if (!p && !f) return '—'
        return `${p ?? '—'}/${f ?? '—'}`
      },
    },
    {
      id: 'creator',
      header: 'Creator',
      cell: ({ row }) =>
        row.original.User
          ? [row.original.User.first_name, row.original.User.last_name]
              .filter(Boolean)
              .join(' ') || '—'
          : '—',
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
            <h2 className='text-2xl font-bold tracking-tight'>Scouting Reports</h2>
            <CardDescription>Evaluations and grades</CardDescription>
          </div>
          <Button asChild>
            <Link to='/scouting/create'>
              <Plus className='size-4' />
              Create Report
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className='flex flex-wrap gap-4'>
              <Select value={prospectFilter} onValueChange={setProspectFilter}>
                <SelectTrigger className='w-64'>
                  <SelectValue placeholder='Filter by prospect' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>All prospects</SelectItem>
                  {prospectsData?.data?.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {[p.first_name, p.last_name].filter(Boolean).join(' ')}
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
                          No scouting reports found
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
