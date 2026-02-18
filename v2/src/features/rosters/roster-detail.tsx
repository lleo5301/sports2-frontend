import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  rostersApi,
  type Roster,
  type RosterEntry,
  ROSTER_TYPE_LABELS,
} from '@/lib/rosters-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
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
import { AddPlayersModal } from './add-players-modal'
import { EditEntryModal } from './edit-entry-modal'

interface RosterDetailProps {
  id: string
}

export function RosterDetail({ id }: RosterDetailProps) {
  const rosterId = parseInt(id ?? '0', 10)
  const queryClient = useQueryClient()
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<RosterEntry | null>(null)
  const [removeTarget, setRemoveTarget] = useState<RosterEntry | null>(null)

  const { data: roster, isLoading, error } = useQuery({
    queryKey: ['roster', rosterId],
    queryFn: () => rostersApi.getById(rosterId),
    enabled: rosterId > 0,
  })

  const removeMutation = useMutation({
    mutationFn: (playerId: number) =>
      rostersApi.removePlayer(rosterId, playerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roster', rosterId] })
      toast.success('Player removed from roster')
      setRemoveTarget(null)
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to remove')
    },
  })

  const existingPlayerIds = (roster?.entries ?? []).map((e) => e.player_id)

  const columns: ColumnDef<RosterEntry>[] = [
    {
      id: 'player',
      header: 'Player',
      cell: ({ row }) => {
        const p = row.original.Player
        if (!p) return `#${row.original.player_id}`
        return (
          <Link
            to='/players/$id'
            params={{ id: String(row.original.player_id) }}
            className='font-medium text-primary hover:underline'
          >
            {[p.first_name, p.last_name].filter(Boolean).join(' ')}
          </Link>
        )
      },
    },
    {
      id: 'position',
      header: 'Pos',
      cell: ({ row }) => row.original.position ?? row.original.Player?.position ?? '—',
    },
    {
      id: 'jersey',
      header: '#',
      cell: ({ row }) => row.original.jersey_number ?? '—',
    },
    {
      id: 'order',
      header: 'Order',
      cell: ({ row }) => row.original.order ?? '—',
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === 'active'
              ? 'default'
              : row.original.status === 'injured'
                ? 'destructive'
                : 'secondary'
          }
        >
          {row.original.status}
        </Badge>
      ),
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
            <DropdownMenuItem onClick={() => setEditEntry(row.original)}>
              <Pencil className='size-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-destructive'
              onClick={() => setRemoveTarget(row.original)}
            >
              <Trash2 className='size-4' />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data: roster?.entries ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (rosterId <= 0 || error) {
    return (
      <Main>
        <div className='py-8 text-center text-destructive'>
          Invalid roster or error: {(error as Error)?.message ?? 'Not found'}
        </div>
        <Button asChild variant='outline'>
          <Link to='/rosters'>Back to rosters</Link>
        </Button>
      </Main>
    )
  }

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link to='/rosters'>
              <ArrowLeft className='size-4' />
            </Link>
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {roster?.name ?? 'Roster'}
            </h2>
            <CardDescription>
              {roster
                ? `${ROSTER_TYPE_LABELS[roster.roster_type] ?? roster.roster_type} • ${roster.entries?.length ?? 0} players`
                : 'Loading...'}
            </CardDescription>
          </div>
        </div>

        {roster && (
          <Card>
            <CardHeader>
              <div className='flex flex-wrap items-center justify-between gap-4'>
                <div>
                  <CardTitle>Details</CardTitle>
                  <div className='mt-2 space-y-1 text-sm text-muted-foreground'>
                    {roster.effective_date && (
                      <p>Effective: {roster.effective_date}</p>
                    )}
                    {roster.Game && (
                      <p>
                        Game: vs {roster.Game.opponent} (
                        {roster.Game.game_date})
                      </p>
                    )}
                    {roster.description && (
                      <p>{roster.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div>
                <CardTitle>Players</CardTitle>
                <CardDescription>
                  Roster entries with position, jersey, and status
                </CardDescription>
              </div>
              <Button onClick={() => setAddModalOpen(true)}>
                <Plus className='size-4' />
                Add Players
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='py-8 text-center text-muted-foreground'>
                Loading...
              </div>
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
                        No players on this roster. Click &quot;Add Players&quot;
                        to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AddPlayersModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        rosterId={rosterId}
        existingPlayerIds={existingPlayerIds}
        onAdded={() => {}}
      />

      <EditEntryModal
        open={!!editEntry}
        onOpenChange={(open) => !open && setEditEntry(null)}
        rosterId={rosterId}
        entry={editEntry}
        onSaved={() => setEditEntry(null)}
      />

      <AlertDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove player?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove{' '}
              {removeTarget?.Player
                ? [removeTarget.Player.first_name, removeTarget.Player.last_name]
                    .filter(Boolean)
                    .join(' ')
                : `Player #${removeTarget?.player_id}`}{' '}
              from this roster? This does not delete the player from the team.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              onClick={() =>
                removeTarget && removeMutation.mutate(removeTarget.player_id)
              }
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Main>
  )
}
