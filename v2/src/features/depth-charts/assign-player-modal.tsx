import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Star, UserPlus, Users } from 'lucide-react'
import { depthChartsApi } from '@/lib/depth-charts-api'
import type { DepthChartPosition } from '@/lib/depth-charts-api'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

type ViewMode = 'recommended' | 'all'

type AssignPlayerModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  chartId: number
  position: DepthChartPosition | null
  onAssigned: () => void
}

export function AssignPlayerModal({
  open,
  onOpenChange,
  chartId,
  position,
  onAssigned,
}: AssignPlayerModalProps) {
  const queryClient = useQueryClient()
  const [playerSearch, setPlayerSearch] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('recommended')

  const { data: recommendedPlayers = [] } = useQuery({
    queryKey: ['recommended-players', chartId, position?.id],
    queryFn: () =>
      position?.id
        ? depthChartsApi.getRecommendedPlayers(chartId, position.id)
        : [],
    enabled: open && !!position?.id && viewMode === 'recommended',
  })

  const { data: availablePlayers = [] } = useQuery({
    queryKey: ['available-players', chartId],
    queryFn: () => depthChartsApi.getAvailablePlayers(chartId),
    enabled: open && !!chartId && viewMode === 'all',
  })

  const assignMutation = useMutation({
    mutationFn: ({
      positionId,
      playerId,
    }: {
      positionId: number
      playerId: number
    }) =>
      depthChartsApi.assignPlayer(positionId, {
        player_id: playerId,
        depth_order: 1,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depth-chart', chartId] })
      toast.success('Player assigned')
      onAssigned()
    },
    onError: (err) => toast.error((err as Error).message),
  })

  const players =
    viewMode === 'recommended'
      ? (recommendedPlayers as Array<{
          id: number
          first_name?: string
          last_name?: string
          position?: string
          school_type?: string
          graduation_year?: number
          height?: string
          weight?: number
          score?: number
          reasons?: string[]
        }>)
      : (availablePlayers as Array<{
          id: number
          first_name?: string
          last_name?: string
          position?: string
          school_type?: string
          graduation_year?: number
          height?: string
          weight?: number
        }>)

  const filteredPlayers = players.filter((p) => {
    const name = `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim().toLowerCase()
    const search = playerSearch.toLowerCase()
    if (search && !name.includes(search) && !(p.position ?? '').toLowerCase().includes(search))
      return false
    if (
      viewMode === 'all' &&
      positionFilter &&
      p.position !== positionFilter
    )
      return false
    return true
  })

  const handleAssign = (playerId: number) => {
    if (!position?.id) return
    assignMutation.mutate({ positionId: position.id, playerId })
  }

  if (!position) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-hidden flex flex-col max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            Assign Player to {position.position_name}
          </DialogTitle>
          <DialogDescription>
            Select a player to add to this position
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 overflow-y-auto'>
          <div className='flex gap-4'>
            <div className='flex-1'>
              <label className='mb-1 block text-sm font-medium'>
                Search Players
              </label>
              <Input
                placeholder='Search by name or position...'
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
              />
            </div>
            {viewMode === 'all' && (
              <div className='w-40'>
                <label className='mb-1 block text-sm font-medium'>
                  Position
                </label>
                <Select
                  value={positionFilter}
                  onValueChange={setPositionFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='All' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>All</SelectItem>
                    {['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'].map(
                      (pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className='flex gap-2'>
            <Button
              variant={viewMode === 'recommended' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setViewMode('recommended')}
            >
              <Star className='size-4' />
              Recommended
            </Button>
            <Button
              variant={viewMode === 'all' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setViewMode('all')}
            >
              <Users className='size-4' />
              All Players
            </Button>
          </div>

          <div className='max-h-96 space-y-4 overflow-y-auto'>
            {viewMode === 'recommended' && (
              <div>
                <h4 className='mb-3 flex items-center gap-2 font-semibold'>
                  <Star className='size-5 text-yellow-500' />
                  Top recommendations for {position.position_name}
                </h4>
                <div className='grid gap-4 sm:grid-cols-2'>
                  {filteredPlayers.map((player) => (
                    <button
                      key={player.id}
                      type='button'
                      onClick={() => handleAssign(player.id)}
                      disabled={assignMutation.isPending}
                      className='rounded-lg border-2 border-primary/20 bg-primary/5 p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/10'
                    >
                      <div className='mb-2 flex items-center justify-between'>
                        <span className='font-bold'>
                          {player.first_name} {player.last_name}
                        </span>
                        <div className='flex items-center gap-2'>
                          <Badge variant='secondary'>
                            {player.position ?? '—'}
                          </Badge>
                          {'score' in player && player.score != null && (
                            <span className='text-sm font-bold text-primary'>
                              Score: {String(player.score)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className='mb-2 text-sm text-muted-foreground'>
                        {player.school_type}
                        {player.graduation_year && ` • Grad: ${player.graduation_year}`}
                        {player.height && player.weight &&
                          ` • ${player.height} • ${player.weight} lbs`}
                      </div>
                          {'reasons' in player &&
                        Array.isArray(player.reasons) &&
                        player.reasons.length > 0 && (
                          <div className='space-y-1 text-xs text-primary'>
                            {player.reasons.slice(0, 3).map((r, i) => (
                              <div key={i} className='flex items-center gap-1'>
                                <CheckCircle className='size-3' />
                                {typeof r === 'string' ? r : String(r)}
                              </div>
                            ))}
                          </div>
                        )}
                      <Button
                        size='sm'
                        className='mt-2'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAssign(player.id)
                        }}
                      >
                        <UserPlus className='size-3' />
                        Assign
                      </Button>
                    </button>
                  ))}
                </div>
                {filteredPlayers.length === 0 && (
                  <div className='py-8 text-center text-muted-foreground'>
                    No recommendations. Try &quot;All Players&quot; view.
                  </div>
                )}
              </div>
            )}

            {viewMode === 'all' && (
              <div>
                <h4 className='mb-3 flex items-center gap-2 font-semibold'>
                  <Users className='size-5' />
                  All available players
                </h4>
                <div className='grid gap-4 sm:grid-cols-2'>
                  {filteredPlayers.map((player) => (
                    <button
                      key={player.id}
                      type='button'
                      onClick={() => handleAssign(player.id)}
                      disabled={assignMutation.isPending}
                      className='rounded-lg border p-4 text-left transition-all hover:border-primary/50 hover:bg-muted/50'
                    >
                      <div className='mb-2 flex items-center justify-between'>
                        <span className='font-bold'>
                          {player.first_name} {player.last_name}
                        </span>
                        <Badge variant='outline'>{player.position}</Badge>
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {player.school_type}
                        {player.graduation_year && ` • Grad: ${player.graduation_year}`}
                      </div>
                      <Button
                        size='sm'
                        variant='outline'
                        className='mt-2'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAssign(player.id)
                        }}
                      >
                        <UserPlus className='size-3' />
                        Assign
                      </Button>
                    </button>
                  ))}
                </div>
                {filteredPlayers.length === 0 && (
                  <div className='py-8 text-center text-muted-foreground'>
                    No players match your filters
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
