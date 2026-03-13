import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, UserPlus, Users } from 'lucide-react'
import { toast } from 'sonner'
import { depthChartsApi } from '@/lib/depth-charts-api'
import type { DepthChartPosition } from '@/lib/depth-charts-api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
  const [positionFilter, setPositionFilter] = useState('all')
  const [viewMode, setViewMode] = useState<ViewMode>('all')

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
    const name = `${p.first_name ?? ''} ${p.last_name ?? ''}`
      .trim()
      .toLowerCase()
    const search = playerSearch.toLowerCase()
    if (
      search &&
      !name.includes(search) &&
      !(p.position ?? '').toLowerCase().includes(search)
    )
      return false
    if (
      viewMode === 'all' &&
      positionFilter !== 'all' &&
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

  const currentPlayers = (position.DepthChartPlayers ?? []).sort(
    (a, b) => a.depth_order - b.depth_order
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[90vh] w-[90vw] max-w-5xl flex-col overflow-hidden'>
        <DialogHeader>
          <DialogTitle>Assign Player to {position.position_name}</DialogTitle>
          <DialogDescription>
            {currentPlayers.length > 0
              ? `${currentPlayers.length} player${currentPlayers.length > 1 ? 's' : ''} currently assigned`
              : 'No players currently assigned'}
          </DialogDescription>
        </DialogHeader>

        {currentPlayers.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {currentPlayers.map((cp) => (
              <Badge key={cp.id} variant='secondary' className='text-xs'>
                #{cp.depth_order} {cp.Player?.first_name} {cp.Player?.last_name}
              </Badge>
            ))}
          </div>
        )}

        <div className='flex flex-col space-y-3 overflow-hidden'>
          <div className='flex gap-4'>
            <div className='flex-1'>
              <Input
                placeholder='Search by name or position...'
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
              />
            </div>
            {viewMode === 'all' && (
              <div className='w-32'>
                <Select
                  value={positionFilter}
                  onValueChange={setPositionFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='All' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All</SelectItem>
                    {[
                      'P',
                      'C',
                      '1B',
                      '2B',
                      '3B',
                      'SS',
                      'LF',
                      'CF',
                      'RF',
                      'DH',
                    ].map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
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

          <div className='min-h-0 flex-1 overflow-y-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-20' />
                  <TableHead>Name</TableHead>
                  <TableHead className='w-16'>Pos</TableHead>
                  {viewMode === 'recommended' && (
                    <TableHead className='w-16'>Score</TableHead>
                  )}
                  <TableHead className='w-24'>Ht / Wt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map((player) => (
                  <TableRow key={player.id} className='hover:bg-muted/50'>
                    <TableCell>
                      <Button
                        size='sm'
                        variant={
                          viewMode === 'recommended' ? 'default' : 'outline'
                        }
                        onClick={() => handleAssign(player.id)}
                        disabled={assignMutation.isPending}
                      >
                        <UserPlus className='size-3' />
                        Assign
                      </Button>
                    </TableCell>
                    <TableCell className='font-medium'>
                      {player.first_name} {player.last_name}
                      {viewMode === 'recommended' &&
                        'reasons' in player &&
                        Array.isArray(player.reasons) &&
                        player.reasons.length > 0 && (
                          <p className='max-w-56 truncate text-xs text-muted-foreground'>
                            {player.reasons[0]}
                          </p>
                        )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          viewMode === 'recommended' ? 'secondary' : 'outline'
                        }
                        className='text-xs'
                      >
                        {player.position ?? '—'}
                      </Badge>
                    </TableCell>
                    {viewMode === 'recommended' && (
                      <TableCell className='font-semibold text-primary'>
                        {'score' in player && player.score != null
                          ? String(player.score)
                          : '—'}
                      </TableCell>
                    )}
                    <TableCell className='text-xs whitespace-nowrap text-muted-foreground'>
                      {[
                        player.height,
                        player.weight ? `${player.weight}` : null,
                      ]
                        .filter(Boolean)
                        .join(' / ')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredPlayers.length === 0 && (
              <div className='py-8 text-center text-muted-foreground'>
                {viewMode === 'recommended'
                  ? 'No recommendations. Try "All Players" view.'
                  : 'No players match your filters'}
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
