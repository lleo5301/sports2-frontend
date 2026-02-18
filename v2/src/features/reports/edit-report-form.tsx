import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { reportsApi, type Report } from '@/lib/reports-api'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'

const STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
] as const

interface EditReportFormProps {
  report: Report
  onSuccess: () => void
  onCancel: () => void
}

export function EditReportForm({
  report,
  onSuccess,
  onCancel,
}: EditReportFormProps) {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState(report.title ?? '')
  const [description, setDescription] = useState(report.description ?? '')
  const [status, setStatus] = useState(report.status ?? 'draft')

  const updateMutation = useMutation({
    mutationFn: () =>
      reportsApi.update(report.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        status: status as 'draft' | 'published' | 'archived',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['report', report.id] })
      toast.success('Report updated')
      onSuccess()
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to update')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }
    updateMutation.mutate()
  }

  return (
    <div className='space-y-6'>
      <Button variant='ghost' size='sm' asChild>
        <Link to='/reports'>
          <ArrowLeft className='size-4' />
          Back to reports
        </Link>
      </Button>

      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle>Edit Report</CardTitle>
          <CardDescription>Update report details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid gap-2'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='status'>Status</Label>
              <Select
                value={status}
                onValueChange={(v) =>
                  setStatus(v as 'draft' | 'published' | 'archived')
                }
              >
                <SelectTrigger id='status'>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className='flex gap-2'>
              <Button type='button' variant='outline' onClick={onCancel}>
                Cancel
              </Button>
              <Button type='submit' disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
