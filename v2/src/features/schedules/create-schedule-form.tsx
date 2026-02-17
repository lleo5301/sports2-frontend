import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { schedulesApi } from '@/lib/schedules-api'
import { teamsApi } from '@/lib/teams-api'
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
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const schema = z.object({
  team_name: z.string().min(1, 'Required'),
  program_name: z.string().min(1, 'Required'),
  date: z.string().min(1, 'Required'),
})

type FormValues = z.infer<typeof schema>

export function CreateScheduleForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: team } = useQuery({
    queryKey: ['team-me'],
    queryFn: () => teamsApi.getMyTeam(),
  })

  const teamName =
    (team as { name?: string })?.name ??
    (team as { team_name?: string })?.team_name ??
    ''

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      team_name: '',
      program_name: '',
      date: new Date().toISOString().slice(0, 10),
    },
  })

  useEffect(() => {
    if (teamName) form.setValue('team_name', teamName)
  }, [teamName, form])

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      schedulesApi.create({
        team_name: data.team_name,
        program_name: data.program_name,
        date: data.date,
        sections: [],
      }),
    onSuccess: (schedule) => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      toast.success('Schedule created')
      navigate({
        to: schedule?.id ? '/schedules/$id' : '/schedules',
        params: schedule?.id ? { id: String(schedule.id) } : undefined,
      })
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to create schedule')
    },
  })

  return (
    <Main>
      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle>Create Schedule</CardTitle>
          <p className='text-sm text-muted-foreground'>
            Create a new team schedule
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='team_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='e.g. Miami Dade' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='program_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program / schedule name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='e.g. Spring 2026, Opening Day'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex gap-2'>
                <Button type='submit' disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : null}
                  Create Schedule
                </Button>
                <Button type='button' variant='outline' asChild>
                  <Link to='/schedules'>Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Main>
  )
}
