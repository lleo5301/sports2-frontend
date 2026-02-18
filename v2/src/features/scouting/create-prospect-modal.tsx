import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
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
import { prospectsApi, POSITIONS, type Prospect } from '@/lib/prospects-api'
import { toast } from 'sonner'

const schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  primary_position: z.string().min(1, 'Required'),
  school_type: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface CreateProspectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (prospect: Prospect) => void
}

export function CreateProspectModal({
  open,
  onOpenChange,
  onCreated,
}: CreateProspectModalProps) {
  const queryClient = useQueryClient()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      primary_position: '',
      school_type: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      prospectsApi.create({
        first_name: data.first_name,
        last_name: data.last_name,
        primary_position: data.primary_position,
        school_type: data.school_type || undefined,
      }),
    onSuccess: (prospect) => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] })
      queryClient.invalidateQueries({ queryKey: ['prospects-simple'] })
      toast.success('Prospect created')
      if (prospect) {
        onCreated(prospect)
      }
      form.reset({
        first_name: '',
        last_name: '',
        primary_position: '',
        school_type: '',
      })
      onOpenChange(false)
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to create prospect')
    },
  })

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset({
        first_name: '',
        last_name: '',
        primary_position: '',
        school_type: '',
      })
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Create New Prospect</DialogTitle>
          <DialogDescription>
            Add a prospect to select for this scouting report. You can add more
            details later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className='space-y-4'
          >
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='first_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='John' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='last_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Smith' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='primary_position'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary position</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select position' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {POSITIONS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='school_type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School type (optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='HS, JUCO, D1...' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['HS', 'JUCO', 'D1', 'D2', 'D3', 'NAIA', 'Independent'].map(
                          (t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : null}
                Create Prospect
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
