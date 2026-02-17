import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { vendorsApi } from '@/lib/vendors-api'
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
import { Textarea } from '@/components/ui/textarea'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const schema = z.object({
  company_name: z.string().min(1, 'Required'),
  contact_name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function CreateVendorForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      company_name: '',
      contact_name: '',
      email: '',
      phone: '',
      notes: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      vendorsApi.create({
        company_name: data.company_name,
        contact_name: data.contact_name || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        notes: data.notes || undefined,
      }),
    onSuccess: (vendor) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] })
      toast.success('Vendor added')
      navigate({ to: '/vendors/$id', params: { id: String(vendor?.id) } })
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to add vendor')
    },
  })

  return (
    <Main>
      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle>Add Vendor</CardTitle>
          <p className='text-sm text-muted-foreground'>
            Add a vendor contact
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
                name='company_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='contact_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex gap-2 pt-4'>
                <Button type='submit' disabled={mutation.isPending}>
                  {mutation.isPending && (
                    <Loader2 className='size-4 animate-spin' />
                  )}
                  Add Vendor
                </Button>
                <Button variant='outline' asChild>
                  <Link to='/vendors'>Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Main>
  )
}
