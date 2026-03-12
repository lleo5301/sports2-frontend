import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Pencil, Trash2 } from 'lucide-react'
import { highSchoolCoachesApi } from '@/lib/high-school-coaches-api'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useState } from 'react'
import { EditHighSchoolCoachForm } from './edit-high-school-coach-form'

interface HighSchoolCoachDetailProps {
  id: string
}

export function HighSchoolCoachDetail({ id }: HighSchoolCoachDetailProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const coachId = parseInt(id, 10)
  const { data: coach, isLoading, error } = useQuery({
    queryKey: ['high-school-coach', coachId],
    queryFn: () => highSchoolCoachesApi.getById(coachId),
    enabled: !Number.isNaN(coachId),
  })

  const deleteMutation = useMutation({
    mutationFn: () => highSchoolCoachesApi.delete(coachId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['high-school-coaches'] })
      toast.success('Coach deleted')
      navigate({ to: '/high-school-coaches' })
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to delete')
    },
  })

  if (Number.isNaN(coachId)) {
    return (
      <Main>
        <div className='py-8 text-center text-destructive'>
          Invalid coach ID
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

  if (error || !coach) {
    return (
      <Main>
        <div className='py-8 text-center'>
          <p className='text-destructive'>
            {(error as Error)?.message ?? 'Coach not found'}
          </p>
          <Button asChild className='mt-4' variant='outline'>
            <Link to='/high-school-coaches'>Back to coaches</Link>
          </Button>
        </div>
      </Main>
    )
  }

  if (editing) {
    return (
      <Main>
        <EditHighSchoolCoachForm
          coach={coach}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: ['high-school-coach', coachId],
            })
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      </Main>
    )
  }

  const name = [coach.first_name, coach.last_name].filter(Boolean).join(' ')

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex flex-wrap items-center gap-4'>
            <Button variant='ghost' size='icon' asChild>
              <Link to='/high-school-coaches'>
                <ArrowLeft className='size-4' />
              </Link>
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                {name || 'Coach'}
              </h2>
              <CardDescription>
                {coach.school_name && `${coach.school_name}`}
                {coach.position && ` • ${coach.position}`}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon'>
                <Pencil className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setEditing(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-destructive'
                onClick={() => deleteMutation.mutate()}
              >
                <Trash2 className='size-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>School</p>
              <p className='font-medium'>{coach.school_name || '—'}</p>
            </div>
            {coach.position && (
              <div>
                <p className='text-sm text-muted-foreground'>Position</p>
                <p className='font-medium'>{coach.position}</p>
              </div>
            )}
            {coach.email && (
              <div>
                <p className='text-sm text-muted-foreground'>Email</p>
                <a
                  href={`mailto:${coach.email}`}
                  className='font-medium text-primary hover:underline'
                >
                  {coach.email}
                </a>
              </div>
            )}
            {coach.phone && (
              <div>
                <p className='text-sm text-muted-foreground'>Phone</p>
                <a
                  href={`tel:${coach.phone}`}
                  className='font-medium text-primary hover:underline'
                >
                  {coach.phone}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
