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
import { Textarea } from '@/components/ui/textarea'
import { schedulesApi } from '@/lib/schedules-api'
import type { ScheduleSection } from '@/lib/schedules-api'
import { toast } from 'sonner'

type AddActivityModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  section: ScheduleSection | null
  scheduleId: number
  onAdded: () => void
}

export function AddActivityModal({
  open,
  onOpenChange,
  section,
  scheduleId,
  onAdded,
}: AddActivityModalProps) {
  const queryClient = useQueryClient()
  const [time, setTime] = useState('')
  const [activity, setActivity] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')

  const addMutation = useMutation({
    mutationFn: () =>
      section
        ? schedulesApi.addActivity(section.id, {
            time: time.trim(),
            activity: activity.trim(),
            location: location.trim() || undefined,
            notes: notes.trim() || undefined,
          })
        : Promise.reject(new Error('No section selected')),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', scheduleId] })
      toast.success('Activity added')
      setTime('')
      setActivity('')
      setLocation('')
      setNotes('')
      onOpenChange(false)
      onAdded()
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to add activity')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!time.trim() || !activity.trim()) {
      toast.error('Time and activity are required')
      return
    }
    addMutation.mutate()
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setTime('')
      setActivity('')
      setLocation('')
      setNotes('')
    }
    onOpenChange(next)
  }

  const sectionTitle = section?.title || section?.type || `Section #${section?.id ?? ''}`

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
            <DialogDescription>
              Add an activity to {sectionTitle}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='activity-time'>Time *</Label>
              <Input
                id='activity-time'
                placeholder='e.g. 2:00 PM'
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='activity-name'>Activity *</Label>
              <Input
                id='activity-name'
                placeholder='e.g. Hitting practice'
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='activity-location'>Location (optional)</Label>
              <Input
                id='activity-location'
                placeholder='e.g. Main field'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='activity-notes'>Notes (optional)</Label>
              <Textarea
                id='activity-notes'
                placeholder='Additional notes'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
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
