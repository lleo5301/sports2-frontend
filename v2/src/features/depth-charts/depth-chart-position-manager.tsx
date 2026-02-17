import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit, Hash, Palette, Plus, Save, Trash2 } from 'lucide-react'
import { depthChartsApi } from '@/lib/depth-charts-api'
import type { DepthChartPosition } from '@/lib/depth-charts-api'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

const COLOR_OPTIONS = [
  { value: '#EF4444', label: 'Red' },
  { value: '#F97316', label: 'Orange' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#10B981', label: 'Emerald' },
  { value: '#14B8A6', label: 'Teal' },
  { value: '#06B6D4', label: 'Cyan' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#6366F1', label: 'Indigo' },
  { value: '#8B5CF6', label: 'Violet' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#6B7280', label: 'Gray' },
]

type DepthChartPositionManagerProps = {
  chartId: number
  positions: DepthChartPosition[]
  onUpdated: () => void
}

export function DepthChartPositionManager({
  chartId,
  positions,
  onUpdated,
}: DepthChartPositionManagerProps) {
  const queryClient = useQueryClient()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPosition, setEditingPosition] =
    useState<DepthChartPosition | null>(null)
  const [newPosition, setNewPosition] = useState({
    position_code: '',
    position_name: '',
    color: '#6B7280',
    icon: 'Shield',
    sort_order: positions.length + 1,
    max_players: '' as number | '',
    description: '',
  })

  const addMutation = useMutation({
    mutationFn: (data: {
      position_code: string
      position_name: string
      color?: string
      icon?: string
      sort_order?: number
      max_players?: number
    }) => depthChartsApi.addPosition(chartId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depth-chart', chartId] })
      setShowAddModal(false)
      setNewPosition({
        position_code: '',
        position_name: '',
        color: '#6B7280',
        icon: 'Shield',
        sort_order: positions.length + 1,
        max_players: '',
        description: '',
      })
      onUpdated()
      toast.success('Position added')
    },
    onError: (err) => toast.error((err as Error).message),
  })

  const updateMutation = useMutation({
    mutationFn: ({
      positionId,
      data,
    }: {
      positionId: number
      data: Parameters<typeof depthChartsApi.updatePosition>[1]
    }) => depthChartsApi.updatePosition(positionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depth-chart', chartId] })
      setEditingPosition(null)
      onUpdated()
      toast.success('Position updated')
    },
    onError: (err) => toast.error((err as Error).message),
  })

  const deleteMutation = useMutation({
    mutationFn: (positionId: number) =>
      depthChartsApi.deletePosition(positionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depth-chart', chartId] })
      onUpdated()
      toast.success('Position deleted')
    },
    onError: (err) => toast.error((err as Error).message),
  })

  const handleAdd = () => {
    if (!newPosition.position_code || !newPosition.position_name) return
    addMutation.mutate({
      position_code: newPosition.position_code,
      position_name: newPosition.position_name,
      color: newPosition.color,
      icon: newPosition.icon,
      sort_order: newPosition.sort_order,
      max_players:
        newPosition.max_players === ''
          ? undefined
          : Number(newPosition.max_players),
    })
  }

  const handleUpdate = () => {
    if (!editingPosition) return
    updateMutation.mutate({
      positionId: editingPosition.id,
      data: {
        position_code: editingPosition.position_code,
        position_name: editingPosition.position_name,
        color: editingPosition.color,
        icon: editingPosition.icon,
        sort_order: editingPosition.sort_order,
        max_players: editingPosition.max_players ?? undefined,
      },
    })
  }

  const handleDelete = (positionId: number) => {
    if (
      !window.confirm(
        'Delete this position? This will remove all player assignments.'
      )
    )
      return
    deleteMutation.mutate(positionId)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Position configuration</h3>
        <Button size='sm' onClick={() => setShowAddModal(true)}>
          <Plus className='size-4' />
          Add position
        </Button>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {positions.map((position) => (
          <div key={position.id} className='rounded-lg border p-4'>
            {editingPosition?.id === position.id ? (
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div
                      className='size-4 rounded'
                      style={{
                        backgroundColor: editingPosition.color ?? '#6B7280',
                      }}
                    />
                    <Input
                      className='w-24'
                      value={editingPosition.position_code}
                      onChange={(e) =>
                        setEditingPosition((p) =>
                          p ? { ...p, position_code: e.target.value } : null
                        )
                      }
                      placeholder='Code'
                    />
                  </div>
                  <div className='flex gap-1'>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={handleUpdate}
                      disabled={updateMutation.isPending}
                    >
                      <Save className='size-4' />
                    </Button>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={() => setEditingPosition(null)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
                <Input
                  value={editingPosition.position_name}
                  onChange={(e) =>
                    setEditingPosition((p) =>
                      p ? { ...p, position_name: e.target.value } : null
                    )
                  }
                  placeholder='Position name'
                />
                <div className='flex gap-2'>
                  <Select
                    value={editingPosition.color ?? '#6B7280'}
                    onValueChange={(v) =>
                      setEditingPosition((p) =>
                        p ? { ...p, color: v } : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOR_OPTIONS.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex gap-2'>
                  <Input
                    type='number'
                    className='w-20'
                    value={editingPosition.sort_order ?? ''}
                    onChange={(e) =>
                      setEditingPosition((p) =>
                        p
                          ? {
                              ...p,
                              sort_order: parseInt(e.target.value) || 0,
                            }
                          : null
                      )
                    }
                    placeholder='Order'
                  />
                  <Input
                    type='number'
                    className='w-24'
                    value={editingPosition.max_players ?? ''}
                    onChange={(e) =>
                      setEditingPosition((p) =>
                        p
                          ? {
                              ...p,
                              max_players: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            }
                          : null
                      )
                    }
                    placeholder='Max'
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className='mb-3 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div
                      className='size-4 rounded'
                      style={{
                        backgroundColor: position.color ?? '#6B7280',
                      }}
                    />
                    <div>
                      <h4 className='font-semibold'>
                        {position.position_name}
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        {position.position_code}
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-1'>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={() =>
                        setEditingPosition({ ...position })
                      }
                    >
                      <Edit className='size-4' />
                    </Button>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='text-destructive hover:text-destructive'
                      onClick={() => handleDelete(position.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                </div>
                <div className='space-y-2 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <Palette className='size-3' />
                    Icon: {position.icon ?? '—'}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Hash className='size-3' />
                    Order: {position.sort_order ?? '—'}
                    {position.max_players != null &&
                      ` • Max: ${position.max_players}`}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add position</DialogTitle>
            <DialogDescription>
              Add a new position to this depth chart
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Position code</Label>
                <Input
                  value={newPosition.position_code}
                  onChange={(e) =>
                    setNewPosition((p) => ({
                      ...p,
                      position_code: e.target.value,
                    }))
                  }
                  placeholder='e.g. P, C, 1B'
                />
              </div>
              <div>
                <Label>Sort order</Label>
                <Input
                  type='number'
                  value={newPosition.sort_order}
                  onChange={(e) =>
                    setNewPosition((p) => ({
                      ...p,
                      sort_order: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Position name</Label>
              <Input
                value={newPosition.position_name}
                onChange={(e) =>
                  setNewPosition((p) => ({
                    ...p,
                    position_name: e.target.value,
                  }))
                }
                placeholder='e.g. Pitcher, Catcher'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Color</Label>
                <Select
                  value={newPosition.color}
                  onValueChange={(v) =>
                    setNewPosition((p) => ({ ...p, color: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_OPTIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Max players</Label>
                <Input
                  type='number'
                  value={newPosition.max_players}
                  onChange={(e) =>
                    setNewPosition((p) => ({
                      ...p,
                      max_players: e.target.value
                        ? (parseInt(e.target.value) as number)
                        : '',
                    }))
                  }
                  placeholder='Unlimited'
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newPosition.description}
                onChange={(e) =>
                  setNewPosition((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                placeholder='Optional'
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={
                !newPosition.position_code ||
                !newPosition.position_name ||
                addMutation.isPending
              }
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
