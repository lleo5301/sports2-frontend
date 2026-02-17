/**
 * Prospect detail view.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Pencil, Trash2 } from 'lucide-react'
import { prospectsApi, type Prospect } from '@/lib/prospects-api'
import { Main } from '@/components/layout/main'
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
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useState } from 'react'
import { EditProspectForm } from './edit-prospect-form'

interface ProspectDetailProps {
  id: string
}

export function ProspectDetail({ id }: ProspectDetailProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const prospectId = parseInt(id, 10)
  const { data: prospect, isLoading, error } = useQuery({
    queryKey: ['prospect', prospectId],
    queryFn: () => prospectsApi.getById(prospectId),
    enabled: !Number.isNaN(prospectId),
  })

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
          <p className='text-destructive'>{(error as Error)?.message ?? 'Prospect not found'}</p>
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

        <Card>
          <CardHeader>
            <div className='flex flex-wrap gap-2'>
              {prospect.primary_position && (
                <Badge variant='secondary'>{prospect.primary_position}</Badge>
              )}
              {prospect.school_type && (
                <Badge variant='outline'>{prospect.school_type}</Badge>
              )}
              {prospect.status && (
                <Badge
                  variant={
                    prospect.status === 'committed' || prospect.status === 'signed'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {prospect.status}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <DetailRow label='Primary position' value={prospect.primary_position} />
            <DetailRow label='Secondary position' value={prospect.secondary_position} />
            <DetailRow label='School type' value={prospect.school_type} />
            <DetailRow label='School' value={prospect.school_name} />
            <DetailRow label='City' value={prospect.city} />
            <DetailRow label='State' value={prospect.state} />
            <DetailRow label='Graduation year' value={prospect.graduation_year?.toString()} />
            <DetailRow label='Bats / Throws' value={prospect.bats && prospect.throws ? `${prospect.bats}/${prospect.throws}` : undefined} />
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
      </div>
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
