import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { reportsApi } from '@/lib/reports-api'
import { toast } from 'sonner'

const REPORT_TYPES = [
  { value: 'roster', label: 'Roster' },
  { value: 'scouting', label: 'Scouting' },
  { value: 'schedule', label: 'Schedule' },
  { value: 'recruiting', label: 'Recruiting' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'custom', label: 'Custom' },
] as const

type CreateReportModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

export function CreateReportModal({
  open,
  onOpenChange,
  onCreated,
}: CreateReportModalProps) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [type, setType] = useState<string>('custom')
  const [description, setDescription] = useState('')

  const createMutation = useMutation({
    mutationFn: () =>
      reportsApi.create({
        title: title.trim(),
        type: type || 'custom',
        description: description.trim() || undefined,
        status: 'draft',
      }),
    onSuccess: (report) => {
      toast.success('Report created')
      setTitle('')
      setType('custom')
      setDescription('')
      onOpenChange(false)
      onCreated()
      if (report?.id) {
        navigate({ to: '/reports/$id', params: { id: report.id } })
      }
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to create report')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }
    createMutation.mutate()
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setTitle('')
      setType('custom')
      setDescription('')
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Report</DialogTitle>
            <DialogDescription>
              Add a new custom report. You can configure data sources and
              sections after creation.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                placeholder='e.g. Spring Roster Report'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='type'>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id='type'>
                  <SelectValue placeholder='Select type' />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='description'>Description (optional)</Label>
              <Textarea
                id='description'
                placeholder='Brief description of the report'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
            <Button type='submit' disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
