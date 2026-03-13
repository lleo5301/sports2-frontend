import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Copy,
  Edit,
  Eye,
  History,
  Layers,
  Loader2,
  Settings,
  Trash2,
  UserMinus,
  UserPlus,
  Download,
} from 'lucide-react'
import { toast } from 'sonner'
import { getPlayerStats } from '@/lib/depth-chart-utils'
import {
  depthChartsApi,
  type DepthChart,
  type DepthChartPosition,
  type DepthChartPlayerAssignment,
} from '@/lib/depth-charts-api'
import { formatDateTime } from '@/lib/format-date'
import { playersApi } from '@/lib/players-api'
import { useIsMobile } from '@/hooks/use-mobile'
import { usePermissions } from '@/hooks/use-permissions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EnhancedBaseballFieldView } from '@/components/depth-chart/enhanced-baseball-field-view'
import { Main } from '@/components/layout/main'
import { AssignPlayerModal } from './assign-player-modal'
import { BackfillFromGameDialog } from './backfill-from-game-dialog'
import { DepthChartPositionManager } from './depth-chart-position-manager'
import { DepthChartSheetView } from './depth-chart-sheet-view'

type ViewMode = 'list' | 'field' | 'sheet'

function PositionCard({
  position,
  canAssign,
  canUnassign,
  onAssign,
  onUnassign,
  isUnassigning,
  photoMap,
}: {
  position: DepthChartPosition
  canAssign: boolean
  canUnassign: boolean
  onAssign: () => void
  onUnassign: (id: number) => void
  isUnassigning: boolean
  photoMap: Map<number, string>
}) {
  const players = (position.DepthChartPlayers ?? []).filter(
    (a) => a.Player
  ) as Array<
    DepthChartPlayerAssignment & {
      Player: NonNullable<DepthChartPlayerAssignment['Player']>
    }
  >

  return (
    <Card>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div
              className='size-4 rounded'
              style={{ backgroundColor: position.color ?? '#6B7280' }}
            />
            <h3 className='text-lg font-semibold'>{position.position_name}</h3>
            <span className='text-sm text-muted-foreground'>
              {players.length} players
              {position.max_players != null && ` / ${position.max_players} max`}
            </span>
          </div>
          {canAssign && (
            <Button
              size='sm'
              variant='outline'
              className='min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0'
              onClick={onAssign}
              disabled={
                position.max_players != null &&
                players.length >= position.max_players
              }
            >
              <UserPlus className='size-4' />
              Add Player
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {players.map((assignment) => {
            const player = assignment.Player
            const stats = getPlayerStats(player)
            const photoUrl = photoMap.get(player.id)
            const initials = `${(player.first_name ?? '')[0] ?? ''}${(player.last_name ?? '')[0] ?? ''}`
            return (
              <div
                key={assignment.id}
                className='rounded-lg border p-4 transition-shadow hover:shadow-md active:shadow-md'
              >
                <div className='mb-3 flex items-start gap-3'>
                  <Avatar className='size-10'>
                    {photoUrl && (
                      <AvatarImage
                        src={photoUrl}
                        alt={`${player.first_name} ${player.last_name}`}
                      />
                    )}
                    <AvatarFallback className='text-xs'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center justify-between'>
                      <h4 className='font-semibold'>
                        {player.first_name} {player.last_name}
                      </h4>
                      <span className='text-sm text-muted-foreground'>
                        #{assignment.depth_order}
                      </span>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      {player.position} • {player.school_type}
                    </p>
                  </div>
                  <div className='flex gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='size-8'
                      asChild
                    >
                      <Link
                        to='/players/$id'
                        params={{ id: String(player.id) }}
                      >
                        <Eye className='size-4' />
                      </Link>
                    </Button>
                    {canUnassign && (
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-8 text-destructive hover:text-destructive'
                        onClick={() => onUnassign(assignment.id)}
                        disabled={isUnassigning}
                      >
                        <UserMinus className='size-4' />
                      </Button>
                    )}
                  </div>
                </div>
                {stats.length > 0 && (
                  <div className='flex flex-wrap gap-1'>
                    {stats.map((stat, i) => (
                      <Badge key={i} variant='secondary' className='text-xs'>
                        {stat}
                      </Badge>
                    ))}
                  </div>
                )}
                {assignment.notes && (
                  <p className='mt-2 text-xs text-muted-foreground'>
                    {assignment.notes}
                  </p>
                )}
              </div>
            )
          })}
        </div>
        {players.length === 0 && (
          <div className='rounded-lg border-2 border-dashed py-8 text-center'>
            <p className='text-muted-foreground'>No players assigned</p>
            {canAssign && (
              <Button
                className='mt-2'
                size='sm'
                variant='outline'
                onClick={onAssign}
              >
                <UserPlus className='size-4' />
                Add Player
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DepthChartDetailPage({ chartId }: { chartId: number }) {
  const queryClient = useQueryClient()
  const { has } = usePermissions()
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState<'chart' | 'positions' | 'history'>(
    'chart'
  )
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  // Default to list view on mobile, field view on larger screens
  useEffect(() => {
    setViewMode(isMobile ? 'list' : 'field')
  }, [isMobile])
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [backfillDialogOpen, setBackfillDialogOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] =
    useState<DepthChartPosition | null>(null)

  const canAssign = has('player_assign')
  const canUnassign = has('player_unassign')
  const canManagePositions = has('depth_chart_manage_positions')
  const canEdit = has('depth_chart_edit')
  const canDelete = has('depth_chart_delete')

  const {
    data: chart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['depth-chart', chartId],
    queryFn: () => depthChartsApi.getById(chartId),
  })

  const { data: history = [] } = useQuery({
    queryKey: ['depth-chart-history', chartId],
    queryFn: () => depthChartsApi.getHistory(chartId),
    enabled: activeTab === 'history',
  })

  // Fetch all players once to get photo_url (not included in depth chart API)
  const { data: playersData } = useQuery({
    queryKey: ['players-photos'],
    queryFn: () => playersApi.list({ limit: 500 }),
    staleTime: 5 * 60 * 1000,
  })

  const photoMap = useMemo(() => {
    const map = new Map<number, string>()
    if (playersData?.data) {
      for (const p of playersData.data) {
        if (p.photo_url) map.set(p.id, p.photo_url)
      }
    }
    return map
  }, [playersData])

  const duplicateMutation = useMutation({
    mutationFn: () => depthChartsApi.duplicate(chartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depth-charts'] })
      toast.success('Depth chart duplicated')
    },
    onError: (err) => toast.error((err as Error).message),
  })

  const navigate = useNavigate()
  const deleteMutation = useMutation({
    mutationFn: () => depthChartsApi.delete(chartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depth-charts'] })
      toast.success('Depth chart deleted')
      navigate({ to: '/depth-charts' })
    },
    onError: (err) => toast.error((err as Error).message),
  })

  const unassignMutation = useMutation({
    mutationFn: (assignmentId: number) =>
      depthChartsApi.unassignPlayer(assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depth-chart', chartId] })
      toast.success('Player removed')
    },
    onError: (err) => toast.error((err as Error).message),
  })

  const positions = chart?.DepthChartPositions ?? []
  const assignedPlayers = positions.flatMap((pos) =>
    (pos.DepthChartPlayers ?? []).map((a) => ({
      ...a,
      position_code: pos.position_code,
    }))
  )

  const openAssignModal = (position: DepthChartPosition) => {
    setSelectedPosition(position)
    setAssignModalOpen(true)
  }

  const closeAssignModal = () => {
    setAssignModalOpen(false)
    setSelectedPosition(null)
  }

  if (isLoading || !chart) {
    return (
      <Main>
        <div className='flex items-center justify-center gap-2 py-12 text-muted-foreground'>
          <Loader2 className='size-5 animate-spin' />
          Loading depth chart...
        </div>
      </Main>
    )
  }

  if (error) {
    return (
      <Main>
        <Card>
          <CardContent className='py-8'>
            <p className='text-center text-destructive'>
              {(error as Error).message ?? 'Depth chart not found'}
            </p>
            <Button asChild className='mt-4'>
              <Link to='/depth-charts'>Back to list</Link>
            </Button>
          </CardContent>
        </Card>
      </Main>
    )
  }

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between'>
          <Button
            variant='outline'
            size='sm'
            className='w-full sm:w-auto'
            asChild
          >
            <Link to='/depth-charts'>← Back</Link>
          </Button>
          <div className='grid grid-cols-2 gap-2 sm:flex'>
            {canEdit && (
              <Button
                variant='outline'
                size='sm'
                className='w-full sm:w-auto'
                disabled
              >
                <Edit className='size-4' />
                Edit
              </Button>
            )}
            {canDelete && (
              <Button
                variant='outline'
                size='sm'
                className='w-full sm:w-auto'
                onClick={() => {
                  if (
                    window.confirm(
                      'Delete this depth chart? This cannot be undone.'
                    )
                  ) {
                    deleteMutation.mutate()
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className='size-4' />
                Delete
              </Button>
            )}
            {canAssign && (
              <Button
                variant='outline'
                size='sm'
                className='w-full sm:w-auto'
                onClick={() => setBackfillDialogOpen(true)}
              >
                <Download className='size-4' />
                Backfill from game
              </Button>
            )}
            <Button
              variant='outline'
              size='sm'
              className='w-full sm:w-auto'
              onClick={() => duplicateMutation.mutate()}
              disabled={duplicateMutation.isPending}
            >
              <Copy className='size-4' />
              Duplicate
            </Button>
          </div>
        </div>

        <BackfillFromGameDialog
          open={backfillDialogOpen}
          onOpenChange={setBackfillDialogOpen}
          chartId={chartId}
          existingPositionCodes={positions.map((p) => p.position_code)}
          onBackfilled={() =>
            queryClient.invalidateQueries({
              queryKey: ['depth-chart', chartId],
            })
          }
        />

        <Card>
          <CardHeader>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div>
                <CardTitle>
                  {chart.name || `Depth Chart #${chart.id}`}
                </CardTitle>
                {chart.description && (
                  <CardDescription className='mt-1'>
                    {chart.description}
                  </CardDescription>
                )}
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                {chart.version != null && <span>Version {chart.version}</span>}
                {chart.Creator && (
                  <span>
                    By {chart.Creator.first_name} {chart.Creator.last_name}
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as typeof activeTab)}
            >
              <TabsList className='mt-4'>
                <TabsTrigger value='chart'>
                  <Layers className='size-4' />
                  Chart
                </TabsTrigger>
                {canManagePositions && (
                  <TabsTrigger value='positions'>
                    <Settings className='size-4' />
                    Positions
                  </TabsTrigger>
                )}
                <TabsTrigger value='history'>
                  <History className='size-4' />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value='chart' className='mt-4'>
                <div className='space-y-4'>
                  <div className='grid grid-cols-3 gap-2 sm:flex sm:justify-center'>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size='sm'
                      className='w-full sm:w-auto'
                      onClick={() => setViewMode('list')}
                    >
                      <Layers className='size-4' />
                      List
                    </Button>
                    <Button
                      variant={viewMode === 'field' ? 'default' : 'outline'}
                      size='sm'
                      className='w-full sm:w-auto'
                      onClick={() => setViewMode('field')}
                    >
                      Field
                    </Button>
                    <Button
                      variant={viewMode === 'sheet' ? 'default' : 'outline'}
                      size='sm'
                      className='w-full sm:w-auto'
                      onClick={() => setViewMode('sheet')}
                    >
                      Sheet
                    </Button>
                  </div>

                  {viewMode === 'field' && (
                    <EnhancedBaseballFieldView
                      positions={positions}
                      assignedPlayers={assignedPlayers}
                      onPositionClick={(code) => {
                        const pos = positions.find(
                          (p) => p.position_code === code
                        )
                        if (pos) openAssignModal(pos)
                      }}
                      selectedPosition={selectedPosition?.position_code}
                    />
                  )}

                  {viewMode === 'sheet' && (
                    <DepthChartSheetView depthChart={chart} />
                  )}

                  {viewMode === 'list' && (
                    <div className='space-y-6'>
                      {positions.map((position) => (
                        <PositionCard
                          key={position.id}
                          position={position}
                          canAssign={canAssign}
                          canUnassign={canUnassign}
                          onAssign={() => openAssignModal(position)}
                          onUnassign={unassignMutation.mutate}
                          isUnassigning={unassignMutation.isPending}
                          photoMap={photoMap}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value='positions' className='mt-4'>
                {canManagePositions && (
                  <DepthChartPositionManager
                    chartId={chartId}
                    positions={positions}
                    onUpdated={() =>
                      queryClient.invalidateQueries({
                        queryKey: ['depth-chart', chartId],
                      })
                    }
                  />
                )}
              </TabsContent>

              <TabsContent value='history' className='mt-4'>
                <div className='space-y-4'>
                  {history.length === 0 ? (
                    <div className='py-8 text-center text-muted-foreground'>
                      No history available
                    </div>
                  ) : (
                    history.map((entry) => (
                      <div key={entry.id} className='rounded-lg border p-4'>
                        <div className='mb-2 flex items-center justify-between'>
                          <span className='font-medium'>{entry.action}</span>
                          <span className='text-sm text-muted-foreground'>
                            {formatDateTime(entry.created_at)}
                          </span>
                        </div>
                        {entry.description && (
                          <p className='text-sm text-muted-foreground'>
                            {entry.description}
                          </p>
                        )}
                        {entry.User && (
                          <p className='mt-1 text-xs text-muted-foreground'>
                            By {entry.User.first_name} {entry.User.last_name}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <AssignPlayerModal
        open={assignModalOpen}
        onOpenChange={(open) => !open && closeAssignModal()}
        chartId={chartId}
        position={selectedPosition}
        onAssigned={() => {
          queryClient.invalidateQueries({ queryKey: ['depth-chart', chartId] })
          closeAssignModal()
        }}
      />
    </Main>
  )
}
