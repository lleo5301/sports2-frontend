/**
 * Scouting report detail view with edit.
 */
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  Pencil,
  User,
  MapPin,
  Zap,
  FileText,
  Target,
} from 'lucide-react'
import { scoutingApi, type ScoutingReport } from '@/lib/scouting-api'
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
import { Separator } from '@/components/ui/separator'
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

function subjectPosition(report: ScoutingReport) {
  return report.Prospect?.primary_position ?? report.Player?.position ?? null
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatDateTime(dateStr?: string) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

function GradeBadge({ value, label }: { value?: unknown; label?: string }) {
  if (value === undefined || value === null || value === '') return <span className='text-muted-foreground'>—</span>
  const display = String(value)
  // Determine color intensity based on grade type
  const numVal = Number(display)
  let variant: 'default' | 'secondary' | 'outline' = 'secondary'
  if (!Number.isNaN(numVal)) {
    if (numVal >= 60) variant = 'default'
    else if (numVal >= 40) variant = 'secondary'
    else variant = 'outline'
  }
  return (
    <Badge variant={variant} className='min-w-[2.5rem] justify-center text-sm font-semibold'>
      {display}
    </Badge>
  )
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

  const position = subjectPosition(report)
  const hasGrades =
    report.overall_present != null ||
    report.overall_future != null ||
    report.hitting_present != null ||
    report.hitting_future != null ||
    report.pitching_present != null ||
    report.pitching_future != null ||
    report.fielding_present != null ||
    report.fielding_future != null ||
    report.speed_present != null ||
    report.speed_future != null
  const hasAthleticism = report.sixty_yard_dash != null || !!report.mlb_comparison

  return (
    <Main>
      <div className='mx-auto max-w-4xl space-y-6'>
        {/* Header */}
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
                {formatDate(report.report_date)} • {report.event_type || '—'}
              </CardDescription>
            </div>
          </div>
          <Button variant='outline' onClick={() => setEditing(true)}>
            <Pencil className='size-4' />
            Edit
          </Button>
        </div>

        {/* Subject & Event Info Card */}
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base'>Report Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <div className='flex items-start gap-3'>
                <User className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
                <div>
                  <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                    Subject
                  </p>
                  <p className='font-medium'>{subjectName(report)}</p>
                  {position && (
                    <Badge variant='outline' className='mt-1'>
                      {position}
                    </Badge>
                  )}
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <Calendar className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
                <div>
                  <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                    Report Date
                  </p>
                  <p className='font-medium'>{formatDate(report.report_date)}</p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <MapPin className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
                <div>
                  <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                    Event Type
                  </p>
                  <p className='font-medium capitalize'>
                    {report.event_type || '—'}
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <Target className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
                <div>
                  <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                    Report ID
                  </p>
                  <p className='font-medium'>#{report.id}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grades Card */}
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base'>Grades</CardTitle>
            <CardDescription>
              20–80 scale or letter grades (Present / Future)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasGrades ? (
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b'>
                      <th className='pb-2 text-left font-medium text-muted-foreground'>
                        Skill
                      </th>
                      <th className='pb-2 text-center font-medium text-muted-foreground'>
                        Present
                      </th>
                      <th className='pb-2 text-center font-medium text-muted-foreground'>
                        Future
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y'>
                    <GradeRow
                      label='Overall'
                      present={report.overall_present}
                      future={report.overall_future}
                    />
                    <GradeRow
                      label='Hitting'
                      present={report.hitting_present}
                      future={report.hitting_future}
                    />
                    <GradeRow
                      label='Pitching'
                      present={report.pitching_present}
                      future={report.pitching_future}
                    />
                    <GradeRow
                      label='Fielding'
                      present={report.fielding_present}
                      future={report.fielding_future}
                    />
                    <GradeRow
                      label='Speed'
                      present={report.speed_present}
                      future={report.speed_future}
                    />
                  </tbody>
                </table>
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>No grades recorded</p>
            )}
          </CardContent>
        </Card>

        {/* Athleticism Card */}
        <Card>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-2'>
              <Zap className='size-4 text-muted-foreground' />
              <CardTitle className='text-base'>Athleticism & Comparison</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {hasAthleticism ? (
              <div className='grid gap-6 sm:grid-cols-2'>
                <div>
                  <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                    60-Yard Dash
                  </p>
                  <p className='mt-1 text-2xl font-bold tabular-nums'>
                    {report.sixty_yard_dash != null
                      ? `${report.sixty_yard_dash}s`
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                    MLB Comparison
                  </p>
                  <p className='mt-1 text-lg font-medium'>
                    {report.mlb_comparison || '—'}
                  </p>
                </div>
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>
                No athleticism data recorded
              </p>
            )}
          </CardContent>
        </Card>

        {/* Notes Card */}
        <Card>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-2'>
              <FileText className='size-4 text-muted-foreground' />
              <CardTitle className='text-base'>Scouting Notes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {report.notes ? (
              <p className='whitespace-pre-wrap leading-relaxed text-foreground'>
                {report.notes}
              </p>
            ) : (
              <p className='text-sm italic text-muted-foreground'>
                No notes recorded for this report.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Metadata Footer */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground'>
              {report.User && (
                <div className='flex items-center gap-1.5'>
                  <User className='size-3.5' />
                  <span>
                    Created by{' '}
                    <span className='font-medium text-foreground'>
                      {[report.User.first_name, report.User.last_name]
                        .filter(Boolean)
                        .join(' ') || 'Unknown'}
                    </span>
                  </span>
                </div>
              )}
              {report.created_at && (
                <div className='flex items-center gap-1.5'>
                  <Clock className='size-3.5' />
                  <span>Created {formatDateTime(report.created_at)}</span>
                </div>
              )}
              {report.updated_at && report.updated_at !== report.created_at && (
                <div className='flex items-center gap-1.5'>
                  <Clock className='size-3.5' />
                  <span>Updated {formatDateTime(report.updated_at)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}

function GradeRow({
  label,
  present,
  future,
}: {
  label: string
  present?: unknown
  future?: unknown
}) {
  return (
    <tr>
      <td className='py-3 font-medium'>{label}</td>
      <td className='py-3 text-center'>
        <GradeBadge value={present} />
      </td>
      <td className='py-3 text-center'>
        <GradeBadge value={future} />
      </td>
    </tr>
  )
}
