/**
 * Prospect detail view with scouting reports.
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  ClipboardList,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { toast } from 'sonner'
import { prospectsApi } from '@/lib/prospects-api'
import { scoutingApi, type ScoutingReport } from '@/lib/scouting-api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Main } from '@/components/layout/main'
import { AddToPreferenceListModal } from '@/features/preference-lists/add-to-preference-list-modal'
import { EditProspectForm } from './edit-prospect-form'

interface ProspectDetailProps {
  id: string
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

function OFPBadge({ reports }: { reports: ScoutingReport[] }) {
  if (!reports.length) return null
  // Use the most recent report's overall_future (OFP) or overall_present
  const latest = reports[0]
  const ofp = latest.overall_future ?? latest.overall_present
  if (ofp === undefined || ofp === null || ofp === '') return null

  const display = String(ofp)
  const numVal = Number(display)
  let className = 'bg-muted text-muted-foreground'
  if (!Number.isNaN(numVal)) {
    if (numVal >= 60) className = 'bg-primary text-primary-foreground'
    else if (numVal >= 50) className = 'bg-blue-600 text-white'
    else if (numVal >= 40) className = 'bg-amber-600 text-white'
    else className = 'bg-muted text-muted-foreground'
  } else {
    // Letter grade styling
    const letter = display.toUpperCase()
    if (letter.startsWith('A')) className = 'bg-primary text-primary-foreground'
    else if (letter.startsWith('B')) className = 'bg-blue-600 text-white'
    else if (letter.startsWith('C')) className = 'bg-amber-600 text-white'
  }

  return (
    <Badge className={`px-3 py-1 text-base ${className}`}>OFP: {display}</Badge>
  )
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function ReportCard({ report }: { report: ScoutingReport }) {
  const [expanded, setExpanded] = useState(false)

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
  ].filter(
    (r) =>
      (r.present !== undefined && r.present !== null && r.present !== '') ||
      (r.future !== undefined && r.future !== null && r.future !== '')
  )

  const scoutName = report.User
    ? [report.User.first_name, report.User.last_name].filter(Boolean).join(' ')
    : null

  return (
    <Card>
      <CardHeader
        className='cursor-pointer pb-3'
        onClick={() => setExpanded(!expanded)}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div>
              <CardTitle className='flex items-center gap-2 text-base'>
                <Calendar className='size-4 text-muted-foreground' />
                {formatDate(report.report_date)}
                {report.event_type && (
                  <Badge variant='outline' className='capitalize'>
                    {report.event_type}
                  </Badge>
                )}
              </CardTitle>
              {scoutName && (
                <CardDescription className='mt-1'>
                  Scout: {scoutName}
                </CardDescription>
              )}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            {report.overall_future != null && (
              <span className='text-sm font-medium text-muted-foreground'>
                OFP:{' '}
                <span className='font-bold text-foreground'>
                  {String(report.overall_future)}
                </span>
              </span>
            )}
            <Button variant='ghost' size='icon' className='size-8'>
              {expanded ? (
                <ChevronUp className='size-4' />
              ) : (
                <ChevronDown className='size-4' />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className='space-y-4 pt-0'>
          {/* Grades Table */}
          {gradeRows.length > 0 && (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
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
                      <td className='py-2 font-medium'>{row.label}</td>
                      <td className='py-2 text-center'>
                        <GradeBadge value={row.present} />
                      </td>
                      <td className='py-2 text-center'>
                        <GradeBadge value={row.future} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Athleticism */}
          {(report.sixty_yard_dash != null || report.mlb_comparison) && (
            <div className='grid grid-cols-2 gap-4'>
              {report.sixty_yard_dash != null && (
                <div>
                  <p className='text-xs font-medium text-muted-foreground uppercase'>
                    60-Yard Dash
                  </p>
                  <p className='text-lg font-bold tabular-nums'>
                    {report.sixty_yard_dash}s
                  </p>
                </div>
              )}
              {report.mlb_comparison && (
                <div>
                  <p className='text-xs font-medium text-muted-foreground uppercase'>
                    MLB Comparison
                  </p>
                  <p className='text-lg font-medium'>{report.mlb_comparison}</p>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {report.notes && (
            <div>
              <div className='mb-1 flex items-center gap-1.5'>
                <FileText className='size-3.5 text-muted-foreground' />
                <p className='text-xs font-medium text-muted-foreground uppercase'>
                  Scouting Notes
                </p>
              </div>
              <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                {report.notes}
              </p>
            </div>
          )}

          {/* Link to full report */}
          <div className='pt-2'>
            <Button variant='outline' size='sm' asChild>
              <Link to='/scouting/$id' params={{ id: String(report.id) }}>
                View Full Report
              </Link>
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export function ProspectDetail({ id }: ProspectDetailProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [addToListOpen, setAddToListOpen] = useState(false)

  const prospectId = parseInt(id, 10)
  const {
    data: prospect,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['prospect', prospectId],
    queryFn: () => prospectsApi.getById(prospectId),
    enabled: !Number.isNaN(prospectId),
  })

  const { data: reportsData } = useQuery({
    queryKey: ['scouting-reports', { prospect_id: prospectId }],
    queryFn: () => scoutingApi.list({ prospect_id: prospectId, limit: 50 }),
    enabled: !Number.isNaN(prospectId),
  })

  const reports = reportsData?.data ?? []

  const deleteMutation = useMutation({
    mutationFn: () => prospectsApi.delete(prospectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] })
      toast.success('Prospect deleted')
      navigate({ to: '/prospects' })
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to delete')
    },
  })

  if (Number.isNaN(prospectId)) {
    return (
      <Main>
        <div className='py-8 text-center text-destructive'>
          Invalid prospect ID
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

  if (error || !prospect) {
    return (
      <Main>
        <div className='py-8 text-center'>
          <p className='text-destructive'>
            {(error as Error)?.message ?? 'Prospect not found'}
          </p>
          <Button asChild className='mt-4' variant='outline'>
            <Link to='/prospects'>Back to prospects</Link>
          </Button>
        </div>
      </Main>
    )
  }

  if (editing) {
    return (
      <EditProspectForm
        prospect={prospect}
        onSuccess={() => {
          setEditing(false)
          queryClient.invalidateQueries({ queryKey: ['prospect', prospectId] })
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
              <Link to='/prospects'>
                <ArrowLeft className='size-4' />
              </Link>
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                {[prospect.first_name, prospect.last_name]
                  .filter(Boolean)
                  .join(' ') || `Prospect #${id}`}
              </h2>
              <CardDescription>Recruiting profile</CardDescription>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => setAddToListOpen(true)}>
              <Plus className='size-4' />
              Add to List
            </Button>
            <Button variant='outline' asChild>
              <Link
                to='/scouting/create'
                search={{ prospectId: String(prospect.id) }}
              >
                <ClipboardList className='size-4' />
                Create Report
              </Link>
            </Button>
            <Button variant='outline' onClick={() => setEditing(true)}>
              <Pencil className='size-4' />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon'>
                  <Trash2 className='size-4 text-destructive' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  className='text-destructive'
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                >
                  Delete prospect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className='flex flex-wrap items-center gap-2'>
              {prospect.primary_position && (
                <Badge variant='secondary'>{prospect.primary_position}</Badge>
              )}
              {prospect.school_type && (
                <Badge variant='outline'>{prospect.school_type}</Badge>
              )}
              <OFPBadge reports={reports} />
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <DetailRow
              label='Primary position'
              value={prospect.primary_position}
            />
            <DetailRow
              label='Secondary position'
              value={prospect.secondary_position}
            />
            <DetailRow label='School type' value={prospect.school_type} />
            <DetailRow label='School' value={prospect.school_name} />
            <DetailRow label='City' value={prospect.city} />
            <DetailRow label='State' value={prospect.state} />
            <DetailRow
              label='Graduation year'
              value={prospect.graduation_year?.toString()}
            />
            <DetailRow
              label='Bats / Throws'
              value={
                prospect.bats && prospect.throws
                  ? `${prospect.bats}/${prospect.throws}`
                  : undefined
              }
            />
            <DetailRow label='Email' value={prospect.email} />
            <DetailRow label='Phone' value={prospect.phone} />
            {prospect.notes && (
              <div>
                <p className='text-sm text-muted-foreground'>Notes</p>
                <p className='whitespace-pre-wrap'>{prospect.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scouting Reports Section */}
        <div>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>
              Scouting Reports ({reports.length})
            </h3>
            <Button variant='outline' size='sm' asChild>
              <Link
                to='/scouting/create'
                search={{ prospectId: String(prospect.id) }}
              >
                <Plus className='size-4' />
                New Report
              </Link>
            </Button>
          </div>
          {reports.length === 0 ? (
            <Card>
              <CardContent className='py-8 text-center'>
                <ClipboardList className='mx-auto mb-2 size-8 text-muted-foreground' />
                <p className='text-sm text-muted-foreground'>
                  No scouting reports yet. Create one to start evaluating this
                  prospect.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-3'>
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddToPreferenceListModal
        open={addToListOpen}
        onOpenChange={setAddToListOpen}
        prospectId={prospect.id}
        prospectName={[prospect.first_name, prospect.last_name]
          .filter(Boolean)
          .join(' ')}
      />
    </Main>
  )
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className='font-medium'>{value}</p>
    </div>
  )
}
