import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import {
  schedulesApi,
  SCHEDULE_SECTION_TYPES,
  type ScheduleSectionType,
} from '@/lib/schedules-api'
import { toast } from 'sonner'

const SECTION_LABELS: Record<ScheduleSectionType, string> = {
  general: 'General',
  position_players: 'Position Players',
  pitchers: 'Pitchers',
  grinder_performance: 'Grinder (Performance)',
  grinder_hitting: 'Grinder (Hitting)',
  grinder_defensive: 'Grinder (Defensive)',
  bullpen: 'Bullpen',
  live_bp: 'Live BP',
}

type AddSectionModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  scheduleId: number
  onAdded: () => void
}

export function AddSectionModal({
  open,
  onOpenChange,
  scheduleId,
  onAdded,
}: AddSectionModalProps) {
  const queryClient = useQueryClient()
  const [type, setType] = useState<ScheduleSectionType>('general')
  const [title, setTitle] = useState('')

  const addMutation = useMutation({
    mutationFn: () =>
      schedulesApi.addSection(scheduleId, {
        type,
        title: title.trim() || SECTION_LABELS[type],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', scheduleId] })
      toast.success('Section added')
      setType('general')
      setTitle('')
      onOpenChange(false)
      onAdded()
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to add section')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addMutation.mutate()
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setType('general')
      setTitle('')
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
            <DialogDescription>
              Add a new section to this schedule. Choose a type and optional
              title.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='section-type'>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as ScheduleSectionType)}>
                <SelectTrigger id='section-type'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCHEDULE_SECTION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {SECTION_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='section-title'>Title (optional)</Label>
              <Input
                id='section-title'
                placeholder={`e.g. ${SECTION_LABELS[type]}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={addMutation.isPending}>
              {addMutation.isPending ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
