import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import {
  rostersApi,
  ROSTER_TYPES,
  ROSTER_TYPE_LABELS,
  type RosterType,
} from '@/lib/rosters-api'
import { gamesApi } from '@/lib/games-api'
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
  name: z.string().min(1, 'Required'),
  roster_type: z.enum(ROSTER_TYPES as unknown as [string, ...string[]]),
  game_id: z.union([z.number(), z.string()]).optional(),
  effective_date: z.string().optional(),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function CreateRosterForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: gamesData } = useQuery({
    queryKey: ['games-for-roster'],
    queryFn: () => gamesApi.list({ limit: 100 }),
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      roster_type: 'game_day',
      game_id: undefined,
      effective_date: new Date().toISOString().slice(0, 10),
      description: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      rostersApi.create({
        name: data.name,
        roster_type: data.roster_type as RosterType,
        game_id:
          data.game_id !== undefined && data.game_id !== ''
            ? typeof data.game_id === 'number'
              ? data.game_id
              : parseInt(String(data.game_id), 10)
            : undefined,
        effective_date: data.effective_date || undefined,
        description: data.description || undefined,
      }),
    onSuccess: (roster) => {
      queryClient.invalidateQueries({ queryKey: ['rosters'] })
      toast.success('Roster created')
      navigate({
        to: roster?.id ? '/rosters/$id' : '/rosters',
        params: roster?.id ? { id: String(roster.id) } : undefined,
      })
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to create roster')
    },
  })

  return (
    <Main>
      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle>Create Roster</CardTitle>
          <p className='text-sm text-muted-foreground'>
            Create a named roster (game-day, travel, practice, etc.) and add
            players later.
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
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='e.g. vs Florida State - Feb 14'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='roster_type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roster type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROSTER_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {ROSTER_TYPE_LABELS[t]}
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
                name='game_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game (optional)</FormLabel>
                    <Select
                      onValueChange={(v) =>
                        field.onChange(
                          v && v !== 'none' ? parseInt(v, 10) : undefined
                        )
                      }
                      value={
                        field.value !== undefined && field.value !== null
                          ? String(field.value)
                          : 'none'
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select game' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='none'>None</SelectItem>
                        {gamesData?.data?.map((g) => (
                          <SelectItem key={g.id} value={String(g.id)}>
                            {g.opponent
                              ? `vs ${g.opponent} (${g.game_date ?? g.date ?? ''})`
                              : `Game #${g.id}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='effective_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effective date (optional)</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='e.g. Friday night starter: Rivera'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='flex gap-2'>
                <Button type='submit' disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : null}
                  Create Roster
                </Button>
                <Button type='button' variant='outline' asChild>
                  <Link to='/rosters'>Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Main>
  )
}
