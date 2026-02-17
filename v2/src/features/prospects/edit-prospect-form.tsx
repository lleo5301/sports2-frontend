import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import {
  prospectsApi,
  type Prospect,
  POSITIONS,
  SCHOOL_TYPES,
  PROSPECT_STATUSES,
} from '@/lib/prospects-api'
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
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  primary_position: z.string().min(1, 'Required'),
  secondary_position: z.string().optional(),
  school_type: z.string().optional(),
  school_name: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  graduation_year: z.number().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface EditProspectFormProps {
  prospect: Prospect
  onSuccess: () => void
  onCancel: () => void
}

export function EditProspectForm({ prospect, onSuccess, onCancel }: EditProspectFormProps) {
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: prospect.first_name ?? '',
      last_name: prospect.last_name ?? '',
      primary_position: prospect.primary_position ?? '',
      secondary_position: prospect.secondary_position ?? '',
      school_type: prospect.school_type ?? '',
      school_name: prospect.school_name ?? '',
      city: prospect.city ?? '',
      state: prospect.state ?? '',
      graduation_year: prospect.graduation_year,
      status: prospect.status ?? '',
      notes: prospect.notes ?? '',
      email: prospect.email ?? '',
      phone: prospect.phone ?? '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      prospectsApi.update(prospect.id, {
        first_name: data.first_name,
        last_name: data.last_name,
        primary_position: data.primary_position,
        secondary_position: data.secondary_position || undefined,
        school_type: data.school_type || undefined,
        school_name: data.school_name || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        graduation_year: data.graduation_year,
        status: data.status || undefined,
        notes: data.notes || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] })
      queryClient.invalidateQueries({ queryKey: ['prospect', prospect.id] })
      toast.success('Prospect updated')
      onSuccess()
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to update prospect')
    },
  })

  return (
    <Main>
      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle>Edit Prospect</CardTitle>
          <p className='text-sm text-muted-foreground'>Update recruiting profile</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              className='space-y-4'
            >
              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='first_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                name='secondary_position'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary position</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Optional' />
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='school_type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='HS, JUCO, D1...' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SCHOOL_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='school_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='state'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='graduation_year'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Graduation year</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const val = e.target.value
                          field.onChange(val === '' ? undefined : Number(val))
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pipeline status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='e.g. evaluating' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROSPECT_STATUSES.map((s) => (
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
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Scouting notes...' />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className='flex gap-2'>
                <Button type='submit' disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : null}
                  Save changes
                </Button>
                <Button type='button' variant='outline' onClick={onCancel}>
                  Cancel
                </Button>
                <Button type='button' variant='ghost' asChild>
                  <Link to='/prospects'>Back to prospects</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Main>
  )
}
