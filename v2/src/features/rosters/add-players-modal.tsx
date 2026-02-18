import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { rostersApi, POSITIONS, type RosterEntry } from '@/lib/rosters-api'
import { playersApi } from '@/lib/players-api'
import { toast } from 'sonner'

interface AddPlayersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rosterId: number
  existingPlayerIds: number[]
  onAdded: () => void
}

export function AddPlayersModal({
  open,
  onOpenChange,
  rosterId,
  existingPlayerIds,
  onAdded,
}: AddPlayersModalProps) {
  const queryClient = useQueryClient()
  const [playerId, setPlayerId] = useState<string>('none')
  const [position, setPosition] = useState<string>('')
  const [jerseyNumber, setJerseyNumber] = useState<string>('')
  const [order, setOrder] = useState<string>('')

  const { data: playersData } = useQuery({
    queryKey: ['players-for-roster', rosterId],
    queryFn: () => playersApi.list({ limit: 100, status: 'active' }),
    enabled: open,
  })

  const addMutation = useMutation({
    mutationFn: (input: {
      player_id: number
      position?: string
      jersey_number?: number
      order?: number
    }) =>
      rostersApi.addPlayers(rosterId, {
        players: [
          {
            player_id: input.player_id,
            position: input.position || undefined,
            jersey_number: input.jersey_number,
            order: input.order,
            status: 'active',
          },
        ],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roster', rosterId] })
      toast.success('Player added to roster')
      setPlayerId('none')
      setPosition('')
      setJerseyNumber('')
      setOrder('')
      onAdded()
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to add player')
    },
  })

  const availablePlayers =
    playersData?.data?.filter((p) => !existingPlayerIds.includes(p.id)) ?? []

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const pid = playerId && playerId !== 'none' ? parseInt(playerId, 10) : 0
    if (!pid) return
    addMutation.mutate({
      player_id: pid,
      position: position || undefined,
      jersey_number: jerseyNumber ? parseInt(jerseyNumber, 10) : undefined,
      order: order ? parseInt(order, 10) : undefined,
    })
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setPlayerId('none')
      setPosition('')
      setJerseyNumber('')
      setOrder('')
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Add Player to Roster</DialogTitle>
          <DialogDescription>
            Select a player and optionally set position, jersey number, and
            order. You can add more after.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAdd}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='player'>Player</Label>
              <Select
                value={playerId}
                onValueChange={setPlayerId}
                required
              >
                <SelectTrigger id='player'>
                  <SelectValue placeholder='Select player' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='none'>Select player...</SelectItem>
                  {availablePlayers.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {[p.first_name, p.last_name].filter(Boolean).join(' ')}{' '}
                      ({p.position ?? '—'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availablePlayers.length === 0 && (
                <p className='text-sm text-muted-foreground'>
                  No available players. All active players may already be on this
                  roster.
                </p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='position'>Position (optional)</Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger id='position'>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='none'>—</SelectItem>
                  {POSITIONS.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='jersey'>Jersey #</Label>
                <Input
                  id='jersey'
                  type='number'
                  min={0}
                  max={99}
                  placeholder='21'
                  value={jerseyNumber}
                  onChange={(e) => setJerseyNumber(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='order'>Order</Label>
                <Input
                  id='order'
                  type='number'
                  min={1}
                  placeholder='1'
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
            >
              Done
            </Button>
            <Button
              type='submit'
              disabled={
                addMutation.isPending ||
                !playerId ||
                playerId === 'none' ||
                availablePlayers.length === 0
              }
            >
              {addMutation.isPending ? 'Adding...' : 'Add Player'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
