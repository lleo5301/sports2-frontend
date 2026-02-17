/**
 * Scouting report detail view with edit.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Pencil } from 'lucide-react'
import { scoutingApi, type ScoutingReport } from '@/lib/scouting-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useState } from 'react'
import { EditScoutingForm } from './edit-scouting-form'

interface ScoutingDetailProps {
  id: string
}

function subjectName(report: ScoutingReport) {
  if (report.Prospect) {
    return [report.Prospect.first_name, report.Prospect.last_name]
      .filter(Boolean)
      .join(' ')
  }
  if (report.Player) {
    return [report.Player.first_name, report.Player.last_name]
      .filter(Boolean)
      .join(' ')
  }
  return report.prospect_id
    ? `Prospect #${report.prospect_id}`
    : report.player_id
      ? `Player #${report.player_id}`
      : '—'
}

function GradeDisplay({ value }: { value?: unknown }) {
  if (value === undefined || value === null) return null
  return <span>{String(value)}</span>
}

export function ScoutingDetail({ id }: ScoutingDetailProps) {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const reportId = parseInt(id, 10)
  const { data: report, isLoading, error } = useQuery({
    queryKey: ['scouting-report', reportId],
    queryFn: () => scoutingApi.getById(reportId),
    enabled: !Number.isNaN(reportId),
  })

  if (Number.isNaN(reportId)) {
    return (
      <Main>
        <div className='py-8 text-center text-destructive'>Invalid report ID</div>
      </Main>
    )
  }

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
            <Link to='/scouting'>Back to reports</Link>
          </Button>
        </div>
      </Main>
    )
  }

  if (editing) {
    return (
      <EditScoutingForm
        report={report}
        onSuccess={() => {
          setEditing(false)
          queryClient.invalidateQueries({ queryKey: ['scouting-report', reportId] })
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='icon' asChild>
              <Link to='/scouting'>
                <ArrowLeft className='size-4' />
              </Link>
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Report #{id} — {subjectName(report)}
              </h2>
              <CardDescription>
                {report.report_date} • {report.event_type || '—'}
              </CardDescription>
            </div>
          </div>
          <Button variant='outline' onClick={() => setEditing(true)}>
            <Pencil className='size-4' />
            Edit
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className='flex flex-wrap gap-2'>
              {report.event_type && (
                <Badge variant='secondary'>{report.event_type}</Badge>
              )}
              {report.report_date && (
                <Badge variant='outline'>{report.report_date}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div>
              <h3 className='mb-3 font-semibold'>Grades (Present / Future)</h3>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                <DetailRow
                  label='Overall'
                  present={report.overall_present}
                  future={report.overall_future}
                />
                <DetailRow
                  label='Hitting'
                  present={report.hitting_present}
                  future={report.hitting_future}
                />
                <DetailRow
                  label='Pitching'
                  present={report.pitching_present}
                  future={report.pitching_future}
                />
                <DetailRow
                  label='Fielding'
                  present={report.fielding_present}
                  future={report.fielding_future}
                />
                <DetailRow
                  label='Speed'
                  present={report.speed_present}
                  future={report.speed_future}
                />
              </div>
            </div>
            {(report.sixty_yard_dash != null || report.mlb_comparison) && (
              <div className='grid gap-4 sm:grid-cols-2'>
                {report.sixty_yard_dash != null && (
                  <div>
                    <p className='text-sm text-muted-foreground'>60-yard dash</p>
                    <p className='font-medium'>{report.sixty_yard_dash}s</p>
                  </div>
                )}
                {report.mlb_comparison && (
                  <div>
                    <p className='text-sm text-muted-foreground'>MLB comparison</p>
                    <p className='font-medium'>{report.mlb_comparison}</p>
                  </div>
                )}
              </div>
            )}
            {report.notes && (
              <div>
                <p className='text-sm text-muted-foreground'>Notes</p>
                <p className='whitespace-pre-wrap'>{report.notes}</p>
              </div>
            )}
            {report.User && (
              <div className='border-t pt-4 text-sm text-muted-foreground'>
                Created by{' '}
                {[report.User.first_name, report.User.last_name]
                  .filter(Boolean)
                  .join(' ') || 'Unknown'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}

function DetailRow({
  label,
  present,
  future,
}: {
  label: string
  present?: unknown
  future?: unknown
}) {
  if (present == null && future == null) return null
  return (
    <div>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className='font-medium'>
        <GradeDisplay value={present} /> / <GradeDisplay value={future} />
      </p>
    </div>
  )
}
