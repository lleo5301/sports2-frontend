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
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Main } from '@/components/layout/main'
import { AddToPreferenceListModal } from '@/features/preference-lists/add-to-preference-list-modal'
import { ScoutingReportCard } from '@/features/scouting/scouting-report-card'
import { EditProspectForm } from './edit-prospect-form'

interface ProspectDetailProps {
  id: string
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
              {reports.map((report, i) => (
                <ScoutingReportCard
                  key={report.id}
                  report={report}
                  defaultExpanded={i === 0}
                />
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
