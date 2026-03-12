import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { gamesApi } from '@/lib/games-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

const schema = z.object({
  opponent: z.string().min(1, 'Required'),
  date: z.string().min(1, 'Required'),
})

type FormValues = z.infer<typeof schema>

export function CreateGameForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      opponent: '',
      date: new Date().toISOString().slice(0, 10),
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      gamesApi.create({
        opponent: data.opponent,
        date: data.date,
      }),
    onSuccess: (game) => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      toast.success('Game created')
      navigate({
        to: game?.id ? '/games/$id' : '/games',
        params: game?.id ? { id: String(game.id) } : undefined,
      })
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to create game')
    },
  })

  return (
    <Main>
      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle>Add Game</CardTitle>
          <p className='text-sm text-muted-foreground'>
            Create a new game record
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
                name='opponent'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opponent</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='e.g. State University' />
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
              <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
                <Button
                  type='button'
                  variant='outline'
                  asChild
                  className='w-full sm:w-auto'
                >
                  <Link to='/games'>Cancel</Link>
                </Button>
                <Button
                  type='submit'
                  disabled={mutation.isPending}
                  className='w-full sm:w-auto'
                >
                  {mutation.isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : null}
                  Create Game
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Main>
  )
}
