/**
 * Scouting report detail — single cohesive "report sheet" view.
 */
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Loader2,
  Pencil,
  User,
  MapPin,
  Calendar,
  Clock,
  FileText,
} from 'lucide-react'
import { scoutingApi, type ScoutingReport } from '@/lib/scouting-api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
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

function GradeBadge({ value }: { value?: unknown }) {
  if (value === undefined || value === null || value === '')
    return <span className='text-muted-foreground'>—</span>
  const display = String(value)
  const numVal = Number(display)
  let variant: 'default' | 'secondary' | 'outline' = 'secondary'
  if (!Number.isNaN(numVal)) {
    if (numVal >= 60) variant = 'default'
    else if (numVal >= 40) variant = 'secondary'
    else variant = 'outline'
  }
  return (
    <Badge
      variant={variant}
      className='min-w-[2.5rem] justify-center text-sm font-semibold'
    >
      {display}
    </Badge>
  )
}

export function ScoutingDetail({ id }: ScoutingDetailProps) {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const reportId = parseInt(id, 10)
  const {
    data: report,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['scouting-report', reportId],
    queryFn: () => scoutingApi.getById(reportId),
    enabled: !Number.isNaN(reportId),
  })

  if (Number.isNaN(reportId)) {
    return (
      <Main>
        <div className='py-8 text-center text-destructive'>
          Invalid report ID
        </div>
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
          queryClient.invalidateQueries({
            queryKey: ['scouting-report', reportId],
          })
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  const position = subjectPosition(report)
  const gradeRows = [
    {
      label: 'Overall',
      present: report.overall_present,
      future: report.overall_future,
    },
    {
      label: 'Hitting',
      present: report.hitting_present,
      future: report.hitting_future,
    },
    {
      label: 'Power',
      present: report.power_present,
      future: report.power_future,
    },
    {
      label: 'Fielding',
      present: report.fielding_present,
      future: report.fielding_future,
    },
    { label: 'Arm', present: report.arm_present, future: report.arm_future },
    {
      label: 'Speed',
      present: report.speed_present,
      future: report.speed_future,
    },
    {
      label: 'Pitching',
      present: report.pitching_present,
      future: report.pitching_future,
    },
  ]
  const hasGrades = gradeRows.some(
    (r) =>
      (r.present !== undefined && r.present !== null && r.present !== '') ||
      (r.future !== undefined && r.future !== null && r.future !== '')
  )
  const hasAthleticism =
    report.sixty_yard_dash != null || !!report.mlb_comparison

  const scoutName = report.User
    ? [report.User.first_name, report.User.last_name].filter(Boolean).join(' ')
    : null

  return (
    <Main>
      <div className='mx-auto max-w-3xl space-y-4'>
        {/* Header with back + Update Report button */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Button variant='ghost' size='icon' asChild>
              <Link to='/scouting'>
                <ArrowLeft className='size-4' />
              </Link>
            </Button>
            <div className='min-w-0'>
              <h2 className='truncate text-xl font-bold tracking-tight sm:text-2xl'>
                {subjectName(report)}
              </h2>
              <CardDescription className='text-sm'>
                {formatDate(report.report_date)} • {report.event_type || '—'}
              </CardDescription>
            </div>
          </div>
          <Button onClick={() => setEditing(true)}>
            <Pencil className='size-4' />
            Update Report
          </Button>
        </div>

        {/* Single unified report card */}
        <Card>
          <CardHeader className='pb-4'>
            {/* Report metadata row */}
            <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm'>
              <div className='flex items-center gap-1.5'>
                <User className='size-3.5 text-muted-foreground' />
                <span className='font-medium'>{subjectName(report)}</span>
                {position && (
                  <Badge variant='outline' className='ml-1'>
                    {position}
                  </Badge>
                )}
              </div>
              <div className='flex items-center gap-1.5 text-muted-foreground'>
                <Calendar className='size-3.5' />
                {formatDate(report.report_date)}
              </div>
              <div className='flex items-center gap-1.5 text-muted-foreground'>
                <MapPin className='size-3.5' />
                <span className='capitalize'>{report.event_type || '—'}</span>
              </div>
              {scoutName && (
                <div className='flex items-center gap-1.5 text-muted-foreground'>
                  <User className='size-3.5' />
                  Scout: {scoutName}
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className='space-y-6'>
            {/* Tool Grades */}
            {hasGrades && (
              <div>
                <h3 className='mb-3 text-sm font-semibold tracking-wider text-muted-foreground uppercase'>
                  Tool Grades
                </h3>
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm whitespace-nowrap'>
                    <thead>
                      <tr className='border-b'>
                        <th className='pb-2 text-left font-medium text-muted-foreground'>
                          Tool
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
                      {gradeRows.map((row) => (
                        <tr key={row.label}>
                          <td className='py-2.5 font-medium'>{row.label}</td>
                          <td className='py-2.5 text-center'>
                            <GradeBadge value={row.present} />
                          </td>
                          <td className='py-2.5 text-center'>
                            <GradeBadge value={row.future} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {hasGrades && (hasAthleticism || report.notes) && <Separator />}

            {/* Athleticism & Comparison */}
            {hasAthleticism && (
              <div>
                <h3 className='mb-3 text-sm font-semibold tracking-wider text-muted-foreground uppercase'>
                  Athleticism
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  {report.sixty_yard_dash != null && (
                    <div>
                      <p className='text-xs text-muted-foreground'>
                        60-Yard Dash
                      </p>
                      <p className='text-2xl font-bold tabular-nums'>
                        {report.sixty_yard_dash}s
                      </p>
                    </div>
                  )}
                  {report.mlb_comparison && (
                    <div>
                      <p className='text-xs text-muted-foreground'>
                        MLB Comparison
                      </p>
                      <p className='text-lg font-medium'>
                        {report.mlb_comparison}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {hasAthleticism && report.notes && <Separator />}

            {/* Notes */}
            {report.notes && (
              <div>
                <h3 className='mb-2 flex items-center gap-1.5 text-sm font-semibold tracking-wider text-muted-foreground uppercase'>
                  <FileText className='size-3.5' />
                  Scouting Notes
                </h3>
                <p className='text-sm leading-relaxed whitespace-pre-wrap text-foreground sm:text-base'>
                  {report.notes}
                </p>
              </div>
            )}

            {!hasGrades && !hasAthleticism && !report.notes && (
              <p className='py-4 text-center text-sm text-muted-foreground'>
                No grades, athleticism data, or notes recorded yet.
              </p>
            )}

            {/* Metadata footer */}
            <Separator />
            <div className='flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground'>
              <span>Report #{report.id}</span>
              {report.created_at && (
                <span className='flex items-center gap-1'>
                  <Clock className='size-3' />
                  Created {formatDateTime(report.created_at)}
                </span>
              )}
              {report.updated_at && report.updated_at !== report.created_at && (
                <span className='flex items-center gap-1'>
                  <Clock className='size-3' />
                  Updated {formatDateTime(report.updated_at)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
