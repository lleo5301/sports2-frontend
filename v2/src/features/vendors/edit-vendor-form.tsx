import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { vendorsApi, type Vendor } from '@/lib/vendors-api'
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

interface EditVendorFormProps {
  vendor: Vendor
  onSuccess: () => void
  onCancel: () => void
}

export function EditVendorForm({
  vendor,
  onSuccess,
  onCancel,
}: EditVendorFormProps) {
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      company_name: vendor.company_name ?? '',
      contact_name: vendor.contact_name ?? '',
      email: vendor.email ?? '',
      phone: vendor.phone ?? '',
      notes: vendor.notes ?? '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      vendorsApi.update(vendor.id, {
        company_name: data.company_name,
        contact_name: data.contact_name || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        notes: data.notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] })
      queryClient.invalidateQueries({ queryKey: ['vendor', vendor.id] })
      toast.success('Vendor updated')
      onSuccess()
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to update')
    },
  })

  return (
    <Card className='max-w-2xl'>
      <CardHeader>
        <CardTitle>Edit Vendor</CardTitle>
        <p className='text-sm text-muted-foreground'>
          Update vendor contact details
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
