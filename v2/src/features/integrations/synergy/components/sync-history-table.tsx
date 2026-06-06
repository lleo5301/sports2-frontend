import { useSynergyStore } from '@/stores/synergy-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SYNC_TYPE_LABELS, SYNC_STATUS_BADGE } from '../constants'
import type { SyncHistoryEntry, SyncStatus } from '../types'

function formatDuration(ms: number | null): string {
  if (ms === null) return '\u2014'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function SyncStatusBadge({ status }: { status: SyncHistoryEntry['status'] }) {
  const config =
    SYNC_STATUS_BADGE[status as SyncStatus] ?? SYNC_STATUS_BADGE.completed
  return (
    <Badge variant='outline' className={config.className}>
      {config.label}
    </Badge>
  )
}

export function SyncHistoryTable() {
  const { syncHistory, historyPagination, loading, fetchHistory } =
    useSynergyStore()

  const { page, pages } = historyPagination

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading.history && syncHistory.length === 0 ? (
          <div className='space-y-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-10 w-full' />
            ))}
          </div>
        ) : syncHistory.length === 0 ? (
          <p className='py-8 text-center text-sm text-muted-foreground'>
            No sync history yet. Run a sync to get started.
          </p>
        ) : (
          <>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className='text-right'>Created</TableHead>
                    <TableHead className='text-right'>Updated</TableHead>
                    <TableHead className='text-right'>Failed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncHistory.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className='font-medium'>
                        {SYNC_TYPE_LABELS[entry.sync_type] ?? entry.sync_type}
                      </TableCell>
                      <TableCell>
                        <SyncStatusBadge status={entry.status} />
                      </TableCell>
                      <TableCell
                        className='text-muted-foreground'
                        title={new Date(entry.started_at).toLocaleString()}
                      >
                        {formatRelativeTime(entry.started_at)}
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {formatDuration(entry.duration_ms)}
                      </TableCell>
                      <TableCell className='text-right'>
                        {entry.items_created ?? '\u2014'}
                      </TableCell>
                      <TableCell className='text-right'>
                        {entry.items_updated ?? '\u2014'}
                      </TableCell>
                      <TableCell className='text-right'>
                        {entry.items_failed ? (
                          <span className='font-medium text-destructive'>
                            {entry.items_failed}
                          </span>
                        ) : (
                          (entry.items_failed ?? '\u2014')
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {pages > 1 && (
              <div className='flex items-center justify-between pt-4'>
                <p className='text-sm text-muted-foreground'>
                  Page {page} of {pages}
                </p>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={page <= 1 || loading.history}
                    onClick={() => fetchHistory(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={page >= pages || loading.history}
                    onClick={() => fetchHistory(page + 1)}
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
  )
}
