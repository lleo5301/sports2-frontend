/**
 * Player detail view with edit capability.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Pencil, Trash2 } from 'lucide-react'
import { playersApi, type Player } from '@/lib/players-api'
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
import { EditPlayerForm } from './edit-player-form'

interface PlayerDetailProps {
  id: string
}

export function PlayerDetail({ id }: PlayerDetailProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const playerId = parseInt(id, 10)
  const { data: player, isLoading, error } = useQuery({
    queryKey: ['player', playerId],
    queryFn: () => playersApi.getById(playerId),
    enabled: !Number.isNaN(playerId),
  })

  const deleteMutation = useMutation({
    mutationFn: () => playersApi.delete(playerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
      toast.success('Player deleted')
      navigate({ to: '/players' })
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to delete')
    },
  })

  if (Number.isNaN(playerId)) {
    return (
      <Main>
        <div className='py-8 text-center text-destructive'>
          Invalid player ID
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

  if (error || !player) {
    return (
      <Main>
        <div className='py-8 text-center'>
          <p className='text-destructive'>{(error as Error)?.message ?? 'Player not found'}</p>
          <Button asChild className='mt-4' variant='outline'>
            <Link to='/players'>Back to roster</Link>
          </Button>
        </div>
      </Main>
    )
  }

  if (editing) {
    return (
      <EditPlayerForm
        player={player}
        onSuccess={() => {
          setEditing(false)
          queryClient.invalidateQueries({ queryKey: ['player', playerId] })
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
              <Link to='/players'>
                <ArrowLeft className='size-4' />
              </Link>
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                {[player.first_name, player.last_name].filter(Boolean).join(' ') || `Player #${id}`}
              </h2>
              <CardDescription>Roster profile</CardDescription>
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
                  Delete player
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className='flex flex-wrap gap-2'>
              {player.position && (
                <Badge variant='secondary'>{player.position}</Badge>
              )}
              {player.school_type && (
                <Badge variant='outline'>{player.school_type}</Badge>
              )}
              {player.status && (
                <Badge variant={player.status === 'active' ? 'default' : 'secondary'}>
                  {player.status}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <DetailRow label='Position' value={player.position} />
            <DetailRow label='School type' value={player.school_type} />
            <DetailRow label='School' value={player.school} />
            <DetailRow label='City' value={player.city} />
            <DetailRow label='State' value={player.state} />
            <DetailRow label='Graduation year' value={player.graduation_year?.toString()} />
            <DetailRow label='Email' value={player.email} />
            <DetailRow label='Phone' value={player.phone} />
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
