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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  recruitsApi,
  LIST_TYPES,
  LIST_TYPE_LABELS,
  INTEREST_LEVELS,
  type ListType,
  type InterestLevel,
} from '@/lib/recruits-api'
import { toast } from 'sonner'

type AddToPreferenceListModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  prospectId: number
  prospectName?: string
  preselectedListType?: ListType | string
  onAdded?: () => void
}

export function AddToPreferenceListModal({
  open,
  onOpenChange,
  prospectId,
  prospectName,
  preselectedListType,
  onAdded,
}: AddToPreferenceListModalProps) {
  const queryClient = useQueryClient()
  const [listType, setListType] = useState<ListType | string>(
    preselectedListType ?? 'hs_pref_list'
  )
  const [priority, setPriority] = useState('')
  const [interestLevel, setInterestLevel] = useState<string>('')
  const [notes, setNotes] = useState('')

  const addMutation = useMutation({
    mutationFn: () =>
      recruitsApi.addToPreferenceList({
        prospect_id: prospectId,
        list_type: listType,
        priority: priority ? parseInt(priority, 10) : undefined,
        interest_level: interestLevel || undefined,
        notes: notes.trim() || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruits'] })
      queryClient.invalidateQueries({ queryKey: ['preference-lists'] })
      toast.success('Added to preference list')
      setListType(preselectedListType ?? 'hs_pref_list')
      setPriority('')
      setInterestLevel('')
      setNotes('')
      onOpenChange(false)
      onAdded?.()
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to add to list')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addMutation.mutate()
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setListType(preselectedListType ?? 'hs_pref_list')
      setPriority('')
      setInterestLevel('')
      setNotes('')
    }
    onOpenChange(next)
  }

  const displayName = prospectName || `Prospect #${prospectId}`

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add to Preference List</DialogTitle>
            <DialogDescription>
              Add {displayName} to a recruiting preference list
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='list-type'>List</Label>
              <Select value={listType} onValueChange={setListType}>
                <SelectTrigger id='list-type'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIST_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {LIST_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='priority'>Priority (1 = top)</Label>
              <input
                id='priority'
                type='number'
                min={1}
                max={999}
                placeholder='999'
                className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='interest-level'>Interest Level</Label>
              <Select value={interestLevel} onValueChange={setInterestLevel}>
                <SelectTrigger id='interest-level'>
                  <SelectValue placeholder='Select (optional)' />
                </SelectTrigger>
                <SelectContent>
                  {INTEREST_LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='notes'>Notes (optional)</Label>
              <Textarea
                id='notes'
                placeholder='e.g. Saw at PG showcase'
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
