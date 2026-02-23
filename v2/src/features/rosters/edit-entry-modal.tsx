import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { rostersApi, POSITIONS, ENTRY_STATUSES } from '@/lib/rosters-api'
import { toast } from 'sonner'

const schema = z.object({
  position: z.string().optional(),
  jersey_number: z.number().optional(),
  order: z.number().optional(),
  status: z.enum(ENTRY_STATUSES as unknown as [string, ...string[]]),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface EditEntryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rosterId: number
  entry: {
    player_id: number
    position?: string
    jersey_number?: number
    order?: number
    status: string
    notes?: string
    Player?: { first_name?: string; last_name?: string }
  } | null
  onSaved: () => void
}

export function EditEntryModal({
  open,
  onOpenChange,
  rosterId,
  entry,
  onSaved,
}: EditEntryModalProps) {
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      position: '',
      jersey_number: undefined,
      order: undefined,
      status: 'active',
      notes: '',
    },
  })

  useEffect(() => {
    if (entry && open) {
      form.reset({
        position: entry.position ?? '',
        jersey_number: entry.jersey_number,
        order: entry.order,
        status: (entry.status as FormValues['status']) ?? 'active',
        notes: entry.notes ?? '',
      })
    }
  }, [entry, open, form])

  const updateMutation = useMutation({
    mutationFn: (data: FormValues) =>
      rostersApi.updateEntry(rosterId, entry!.player_id, {
        position: data.position || undefined,
        jersey_number: data.jersey_number,
        order: data.order,
        status: data.status as import('@/lib/rosters-api').EntryStatus,
        notes: data.notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roster', rosterId] })
      toast.success('Entry updated')
      onOpenChange(false)
      onSaved()
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to update')
    },
  })

  if (!entry) return null

  const playerName = entry.Player
    ? [entry.Player.first_name, entry.Player.last_name]
        .filter(Boolean)
        .join(' ')
    : `Player #${entry.player_id}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Edit Roster Entry</DialogTitle>
          <DialogDescription>
            Update position, jersey, order, or status for {playerName}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              updateMutation.mutate({ ...data, status: data.status })
            )}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='position'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || 'none'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='none'>—</SelectItem>
                      {POSITIONS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='jersey_number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jersey #</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const v = e.target.value
                          field.onChange(v === '' ? undefined : Number(v))
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='order'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const v = e.target.value
                          field.onChange(v === '' ? undefined : Number(v))
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ENTRY_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='e.g. DH only, day-to-day'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
