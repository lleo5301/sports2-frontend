'use client'

import { z } from 'zod'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminUsersApi, type AdminRole } from '@/lib/admin-users-api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { roles } from '../data/data'
import { type User } from '../data/schema'

const formSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    email: z.email({
      error: (iss) => (iss.input === '' ? 'Email is required.' : undefined),
    }),
    phone: z.string().optional(),
    role: z.string().min(1, 'Role is required.'),
    password: z.string().transform((p) => p.trim()),
    confirmPassword: z.string().transform((p) => p.trim()),
    isEdit: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.isEdit) return
    if (data.password.length < 8) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Password must be at least 8 characters.',
      })
    }
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords do not match.',
      })
    }
  })

type UserForm = z.infer<typeof formSchema>

type Props = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const queryClient = useQueryClient()

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    values: {
      firstName: currentRow?.firstName ?? '',
      lastName: currentRow?.lastName ?? '',
      email: currentRow?.email ?? '',
      phone: currentRow?.phone ?? '',
      role: currentRow?.role ?? '',
      password: '',
      confirmPassword: '',
      isEdit,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: UserForm) => {
      if (isEdit && currentRow) {
        return adminUsersApi.update(currentRow.id, {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          phone: values.phone || undefined,
          role: values.role as AdminRole,
        })
      }
      return adminUsersApi.create({
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone: values.phone || undefined,
        role: values.role as AdminRole,
        password: values.password,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success(isEdit ? 'User updated' : 'User created')
      form.reset()
      onOpenChange(false)
    },
    onError: (err) => {
      const msg =
        err instanceof AxiosError
          ? ((err.response?.data as { error?: string })?.error ??
            'Request failed')
          : 'Request failed'
      toast.error(msg)
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the user and save when you are done.'
              : 'Create a new user for your team.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='user-form'
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className='space-y-4'
          >
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder='Jane' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder='Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='jane@example.com' {...field} />
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
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='5551234567' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select a role'
                    items={roles.map((r) => ({
                      label: r.label,
                      value: r.value,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEdit && (
              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder='********' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder='********' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='user-form' disabled={mutation.isPending}>
            {isEdit ? 'Save changes' : 'Create user'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
