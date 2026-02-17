import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Pencil, Trash2 } from 'lucide-react'
import { scoutsApi } from '@/lib/scouts-api'
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
import { EditScoutForm } from './edit-scout-form'

interface ScoutDetailProps {
  id: string
}

export function ScoutDetail({ id }: ScoutDetailProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const scoutId = parseInt(id, 10)
  const { data: scout, isLoading, error } = useQuery({
    queryKey: ['scout', scoutId],
    queryFn: () => scoutsApi.getById(scoutId),
    enabled: !Number.isNaN(scoutId),
  })

  const deleteMutation = useMutation({
    mutationFn: () => scoutsApi.delete(scoutId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scouts'] })
      toast.success('Scout deleted')
      navigate({ to: '/scouts' })
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to delete')
    },
  })

  if (Number.isNaN(scoutId)) {
    return (
      <Main>
        <div className='py-8 text-center text-destructive'>
          Invalid scout ID
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

  if (error || !scout) {
    return (
      <Main>
        <div className='py-8 text-center'>
          <p className='text-destructive'>
            {(error as Error)?.message ?? 'Scout not found'}
          </p>
          <Button asChild className='mt-4' variant='outline'>
            <Link to='/scouts'>Back to scouts</Link>
          </Button>
        </div>
      </Main>
    )
  }

  if (editing) {
    return (
      <Main>
        <EditScoutForm
          scout={scout}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['scout', scoutId] })
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      </Main>
    )
  }

  const name = [scout.first_name, scout.last_name].filter(Boolean).join(' ')

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex flex-wrap items-center gap-4'>
            <Button variant='ghost' size='icon' asChild>
              <Link to='/scouts'>
                <ArrowLeft className='size-4' />
              </Link>
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                {name || 'Scout'}
              </h2>
              <CardDescription>
                {scout.organization && scout.organization}
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
            {scout.organization && (
              <div>
                <p className='text-sm text-muted-foreground'>Organization</p>
                <p className='font-medium'>{scout.organization}</p>
              </div>
            )}
            {scout.email && (
              <div>
                <p className='text-sm text-muted-foreground'>Email</p>
                <a
                  href={`mailto:${scout.email}`}
                  className='font-medium text-primary hover:underline'
                >
                  {scout.email}
                </a>
              </div>
            )}
            {scout.phone && (
              <div>
                <p className='text-sm text-muted-foreground'>Phone</p>
                <a
                  href={`tel:${scout.phone}`}
                  className='font-medium text-primary hover:underline'
                >
                  {scout.phone}
                </a>
              </div>
            )}
            {scout.notes && (
              <div>
                <p className='text-sm text-muted-foreground'>Notes</p>
                <p className='whitespace-pre-wrap'>{scout.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
