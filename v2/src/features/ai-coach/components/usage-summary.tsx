import { useEffect, useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { aiApi } from '@/lib/ai-api'
import { Badge } from '@/components/ui/badge'
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
import type {
  UsageSummary as UsageSummaryType,
  AiUsageLog,
  Pagination,
} from '../types'

function formatNumber(n: number): string {
  return n.toLocaleString()
}

function formatCost(cost: string | number): string {
  return `$${Number(cost).toFixed(4)}`
}

export function UsageSummary() {
  const [summary, setSummary] = useState<UsageSummaryType | null>(null)
  const [logs, setLogs] = useState<AiUsageLog[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([aiApi.getUsage(), aiApi.getUsageDetail({ limit: 20 })])
      .then(([usage, detail]) => {
        if (usage) setSummary(usage)
        setLogs(detail.data)
        setPagination(detail.pagination)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BarChart3 className='size-4' />
            Usage
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-3 sm:grid-cols-3'>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className='h-16 w-full rounded-lg' />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const summaryCards = summary
    ? [
        {
          label: 'Total Requests',
          value: formatNumber(Number(summary.total_requests)),
        },
        {
          label: 'Total Tokens',
          value: formatNumber(Number(summary.total_tokens)),
        },
        { label: 'Total Cost', value: formatCost(summary.total_cost_usd) },
        {
          label: 'This Month Tokens',
          value: formatNumber(Number(summary.month_tokens)),
        },
        { label: 'This Month Cost', value: formatCost(summary.month_cost_usd) },
      ]
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <BarChart3 className='size-4' />
          Usage Summary
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Summary cards */}
        {summary && (
          <div className='grid gap-3 sm:grid-cols-3 lg:grid-cols-5'>
            {summaryCards.map((card) => (
              <div key={card.label} className='rounded-lg border p-3'>
                <p className='text-xs text-muted-foreground'>{card.label}</p>
                <p className='text-lg font-semibold'>{card.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Detail table */}
        {logs.length > 0 && (
          <div className='overflow-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead className='text-right'>Input</TableHead>
                  <TableHead className='text-right'>Output</TableHead>
                  <TableHead className='text-right'>Total</TableHead>
                  <TableHead className='text-right'>Cost</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className='text-xs'>
                      {new Date(log.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant='secondary' className='text-xs'>
                        {log.model.replace('anthropic/', '')}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right text-xs'>
                      {formatNumber(log.input_tokens)}
                    </TableCell>
                    <TableCell className='text-right text-xs'>
                      {formatNumber(log.output_tokens)}
                    </TableCell>
                    <TableCell className='text-right text-xs'>
                      {formatNumber(log.total_tokens)}
                    </TableCell>
                    <TableCell className='text-right text-xs'>
                      {formatCost(log.cost_usd)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          log.key_source === 'byok' ? 'default' : 'secondary'
                        }
                        className='text-xs'
                      >
                        {log.key_source === 'byok' ? 'BYOK' : 'Platform'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {logs.length === 0 && !loading && (
          <p className='text-center text-sm text-muted-foreground'>
            No usage data yet
          </p>
        )}

        {pagination && pagination.pages > 1 && (
          <p className='text-center text-xs text-muted-foreground'>
            Showing page {pagination.page} of {pagination.pages} (
            {pagination.total} total)
          </p>
        )}
      </CardContent>
    </Card>
  )
}
