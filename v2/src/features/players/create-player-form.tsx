import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { playersApi } from '@/lib/players-api'
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
  position: z.string().min(1, 'Required'),
  school_type: z.string().optional(),
  school: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  graduation_year: z.number().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'OF', 'DH'] as const
const SCHOOL_TYPES = ['HS', 'COLL'] as const

export function CreatePlayerForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      position: '',
      school_type: '',
      school: '',
      city: '',
      state: '',
      graduation_year: undefined,
      email: '',
      phone: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      playersApi.create({
        first_name: data.first_name,
        last_name: data.last_name,
        position: data.position,
        school_type: data.school_type || undefined,
        school: data.school || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        graduation_year: data.graduation_year,
        email: data.email || undefined,
        phone: data.phone || undefined,
      }),
    onSuccess: (player) => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
      toast.success('Player created')
      navigate({ to: '/players/$id', params: { id: String(player?.id) } })
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to create player')
    },
  })

  return (
    <Main>
      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle>Add Player</CardTitle>
          <p className='text-sm text-muted-foreground'>
            Create a new roster entry
          </p>
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
                name='position'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
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
                    <FormLabel>School type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='HS or COLL' />
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
                name='school'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School</FormLabel>
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
              <div className='flex gap-2'>
                <Button type='submit' disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : null}
                  Create Player
                </Button>
                <Button type='button' variant='outline' asChild>
                  <Link to='/players'>Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Main>
  )
}
