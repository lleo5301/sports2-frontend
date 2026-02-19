/**
 * Backfill a depth chart from a game's lineup.
 * Fetches lineup (from dedicated endpoint or derived from game stats),
 * then assigns players to matching positions.
 */
import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { endOfDay, parseISO } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { extendedStatsApi, type TeamLineupData } from '@/lib/extended-stats-api'
import { depthChartsApi } from '@/lib/depth-charts-api'
import { defaultPositions } from '@/lib/depth-chart-constants'
import { gamesApi, formatGameDateShort, type Game } from '@/lib/games-api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

type BackfillFromGameDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  chartId: number
  existingPositionCodes: string[]
  onBackfilled: () => void
}

export function BackfillFromGameDialog({
  open,
  onOpenChange,
  chartId,
  existingPositionCodes,
  onBackfilled,
}: BackfillFromGameDialogProps) {
  const queryClient = useQueryClient()
  const [selectedGameId, setSelectedGameId] = useState<string>('')

  const { data: games = [], isLoading: gamesLoading } = useQuery({
    queryKey: ['games-log', 50],
    queryFn: () => gamesApi.getGameLog(50),
    enabled: open,
  })

  const pastGames = useMemo(() => {
    const now = endOfDay(new Date())
    return games.filter((g: Game) => {
      const d = g.date ?? g.game_date
      if (!d || typeof d !== 'string') return false
      try {
        return parseISO(d) <= now
      } catch {
        return false
      }
    })
  }, [games])

  const { data: lineup, isLoading: lineupLoading } = useQuery({
    queryKey: ['game-lineup', selectedGameId],
    queryFn: () => extendedStatsApi.getGameLineup(parseInt(selectedGameId, 10)),
    enabled: open && !!selectedGameId && !Number.isNaN(parseInt(selectedGameId, 10)),
  })

  const backfillMutation = useMutation({
    mutationFn: async () => {
      const gameId = parseInt(selectedGameId, 10)
      if (Number.isNaN(gameId) || !lineup?.players?.length) {
        throw new Error('Select a game with lineup data')
      }
      let chart = await depthChartsApi.getById(chartId)
      let positions = chart?.DepthChartPositions ?? []

      if (positions.length === 0) {
        for (const def of defaultPositions) {
          await depthChartsApi.addPosition(chartId, {
            position_code: def.position_code,
            position_name: def.position_name,
            color: def.color,
            icon: def.icon,
            sort_order: def.sort_order,
            max_players: def.position_code === 'P' ? 15 : 3,
          })
        }
        chart = await depthChartsApi.getById(chartId)
        positions = chart?.DepthChartPositions ?? []
      }

      const assignments = positions.flatMap((pos) =>
        (pos.DepthChartPlayers ?? []).map((a) => a.id)
      )
      for (const assignmentId of assignments) {
        await depthChartsApi.unassignPlayer(assignmentId)
      }

      const positionByCode = Object.fromEntries(
        positions.map((p) => [p.position_code, p])
      )
      let assigned = 0
      for (const lp of lineup.players) {
        const pid =
          lp.player_id != null
            ? typeof lp.player_id === 'number'
              ? lp.player_id
              : parseInt(String(lp.player_id), 10)
            : NaN
        if (Number.isNaN(pid) || !lp.position) continue
        const pos = positionByCode[lp.position]
        if (!pos) continue
        await depthChartsApi.assignPlayer(pos.id, {
          player_id: pid,
          depth_order: 1,
        })
        assigned++
      }
      return { assigned }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['depth-chart', chartId] })
      toast.success(`Backfilled ${result.assigned} players from game`)
      onBackfilled()
      onOpenChange(false)
    },
    onError: (err) => toast.error((err as Error).message),
  })

  const hasLineup = (lineup?.players?.length ?? 0) > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Backfill from game</DialogTitle>
          <DialogDescription>
            Populate this depth chart from a game&apos;s lineup. Existing assignments will be cleared.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <div>
            <label className='mb-2 block text-sm font-medium'>Select game</label>
            <Select
              value={selectedGameId}
              onValueChange={setSelectedGameId}
              disabled={gamesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Choose a game...' />
              </SelectTrigger>
              <SelectContent>
                {pastGames.slice(0, 30).map((g: Game) => (
                  <SelectItem key={g.id} value={String(g.id)}>
                    vs {g.opponent ?? 'Opponent'} — {formatGameDateShort(g)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {gamesLoading && (
              <p className='mt-1 text-xs text-muted-foreground'>Loading games...</p>
            )}
          </div>
          {selectedGameId && lineupLoading && (
            <p className='text-sm text-muted-foreground flex items-center gap-2'>
              <Loader2 className='size-4 animate-spin' />
              Loading lineup...
            </p>
          )}
          {selectedGameId && !lineupLoading && lineup && (
            <LineupPreview data={lineup} />
          )}
          {selectedGameId && !lineupLoading && !hasLineup && lineup !== undefined && (
            <p className='text-sm text-destructive'>
              No lineup data for this game. Sync PrestoSports stats to populate.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => backfillMutation.mutate()}
            disabled={!selectedGameId || !hasLineup || backfillMutation.isPending}
          >
            {backfillMutation.isPending ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                Backfilling...
              </>
            ) : (
              'Backfill'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function LineupPreview({ data }: { data: TeamLineupData }) {
  const players = data.players ?? []
  if (players.length === 0) return null
  const byPos = players.reduce<Record<string, typeof players>>((acc, p) => {
    const pos = p.position || '?'
    if (!acc[pos]) acc[pos] = []
    acc[pos].push(p)
    return acc
  }, {})

  return (
    <div>
      <p className='mb-2 text-sm font-medium'>Lineup preview</p>
      <div className='max-h-40 overflow-y-auto rounded-lg border p-2 text-sm'>
        {Object.entries(byPos)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([pos, list]) => (
            <div key={pos} className='flex gap-2 py-0.5'>
              <span className='w-8 font-medium text-muted-foreground'>{pos}</span>
              <span>{list.map((p) => p.name).join(', ')}</span>
            </div>
          ))}
      </div>
    </div>
  )
}
