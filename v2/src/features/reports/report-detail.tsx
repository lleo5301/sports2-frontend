import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react'
import { formatDateTime } from '@/lib/format-date'
import { reportsApi } from '@/lib/reports-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useState } from 'react'
import { EditReportForm } from './edit-report-form'

interface ReportDetailProps {
  id: string
}

export function ReportDetail({ id }: ReportDetailProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: () => reportsApi.getById(id),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: () => reportsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      toast.success('Report deleted')
      navigate({ to: '/reports' })
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to delete')
    },
  })

  const pdfMutation = useMutation({
    mutationFn: () => reportsApi.generatePdf(id),
    onSuccess: (data) => {
      if (data?.url) window.open(data.url, '_blank')
      else toast.success('PDF generation started')
    },
    onError: (err) => toast.error((err as Error).message || 'Failed to generate PDF'),
  })

  const excelMutation = useMutation({
    mutationFn: () => reportsApi.exportExcel(id),
    onSuccess: (data) => {
      if (data?.url) window.open(data.url, '_blank')
      else toast.success('Excel export started')
    },
    onError: (err) => toast.error((err as Error).message || 'Failed to export Excel'),
  })

  if (isLoading) {
    return (
      <Main>
        <div className='flex items-center justify-center py-16'>
          <Loader2 className='size-8 animate-spin text-muted-foreground' />
        </div>
      </Main>
    )
  }

  if (error || !report) {
    return (
      <Main>
        <div className='py-8 text-center'>
          <p className='text-destructive'>
            {(error as Error)?.message ?? 'Report not found'}
          </p>
          <Button asChild className='mt-4' variant='outline'>
            <Link to='/reports'>Back to reports</Link>
          </Button>
        </div>
      </Main>
    )
  }

  if (editing) {
    return (
      <Main>
        <EditReportForm
          report={report}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['report', id] })
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      </Main>
    )
  }

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link to='/reports'>
              <ArrowLeft className='size-4' />
              Back to reports
            </Link>
          </Button>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setEditing(true)}
            >
              <Pencil className='size-4' />
              Edit
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => pdfMutation.mutate()}
              disabled={pdfMutation.isPending}
            >
              <Download className='size-4' />
              Export PDF
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => excelMutation.mutate()}
              disabled={excelMutation.isPending}
            >
              <FileSpreadsheet className='size-4' />
              Export Excel
            </Button>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className='size-4' />
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <CardTitle>{report.title}</CardTitle>
              <Badge variant='secondary' className='font-normal'>
                {report.type || 'custom'}
              </Badge>
              <Badge
                variant={
                  report.status === 'published'
                    ? 'default'
                    : report.status === 'archived'
                      ? 'outline'
                      : 'secondary'
                }
                className='capitalize'
              >
                {report.status ?? 'draft'}
              </Badge>
            </div>
            {report.description && (
              <CardDescription>{report.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className='space-y-4'>
            <dl className='grid gap-2 text-sm'>
              <div>
                <dt className='font-medium text-muted-foreground'>ID</dt>
                <dd>{report.id}</dd>
              </div>
              {report.data_sources && report.data_sources.length > 0 && (
                <div>
                  <dt className='font-medium text-muted-foreground'>
                    Data sources
                  </dt>
                  <dd className='flex flex-wrap gap-1'>
                    {report.data_sources.map((s) => (
                      <Badge key={s} variant='outline'>
                        {s}
                      </Badge>
                    ))}
                  </dd>
                </div>
              )}
              {report.sections && report.sections.length > 0 && (
                <div>
                  <dt className='font-medium text-muted-foreground'>Sections</dt>
                  <dd className='flex flex-wrap gap-1'>
                    {report.sections.map((s) => (
                      <Badge key={s} variant='outline'>
                        {s}
                      </Badge>
                    ))}
                  </dd>
                </div>
              )}
              {report.created_at && (
                <div>
                  <dt className='font-medium text-muted-foreground'>Created</dt>
                  <dd>{formatDateTime(report.created_at)}</dd>
                </div>
              )}
              {report.updated_at && (
                <div>
                  <dt className='font-medium text-muted-foreground'>Updated</dt>
                  <dd>{formatDateTime(report.updated_at)}</dd>
                </div>
              )}
            </dl>
            <p className='text-sm text-muted-foreground'>
              Report content and sections can be configured in future updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
