import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import {
  highSchoolCoachesApi,
  type HighSchoolCoach,
} from '@/lib/high-school-coaches-api'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  school_name: z.string().min(1, 'Required'),
  position: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface EditHighSchoolCoachFormProps {
  coach: HighSchoolCoach
  onSuccess: () => void
  onCancel: () => void
}

export function EditHighSchoolCoachForm({
  coach,
  onSuccess,
  onCancel,
}: EditHighSchoolCoachFormProps) {
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: coach.first_name ?? '',
      last_name: coach.last_name ?? '',
      school_name: coach.school_name ?? '',
      position: coach.position ?? '',
      email: coach.email ?? '',
      phone: coach.phone ?? '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      highSchoolCoachesApi.update(coach.id, {
        first_name: data.first_name,
        last_name: data.last_name,
        school_name: data.school_name,
        position: data.position || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['high-school-coaches'] })
      queryClient.invalidateQueries({
        queryKey: ['high-school-coach', coach.id],
      })
      toast.success('Coach updated')
      onSuccess()
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to update')
    },
  })

  return (
    <Card className='max-w-2xl'>
      <CardHeader>
        <CardTitle>Edit High School Coach</CardTitle>
        <p className='text-sm text-muted-foreground'>
          Update coach contact details
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
              name='school_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='position'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g. Head Coach' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' {...field} />
                    </FormControl>
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex gap-2 pt-4'>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending && (
                  <Loader2 className='size-4 animate-spin' />
                )}
                Save
              </Button>
              <Button variant='outline' type='button' onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
