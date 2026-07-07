# Admin Users Page Wiring — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the faker-backed `/users` shadcn stub into a working super_admin user-management console wired to the real `/api/v1/auth/admin/*` endpoints.

**Architecture:** A new `admin-users-api.ts` lib wraps the backend endpoints and maps snake_case ↔ camelCase. The existing users feature (schema, data maps, table, dialogs, provider, columns, row actions) is rewritten to the real `User` shape. The page fetches one page of up to 100 users via TanStack Query and keeps the template's existing **client-side** table filtering/search (team user counts are tiny, so server-side pagination is unnecessary complexity). Mutations invalidate the query and toast via `sonner`. The page and a new sidebar entry are gated to `super_admin`.

**Tech Stack:** React 19, TanStack Router + Query, react-hook-form + zod, shadcn/ui, axios (`lib/api.ts`), sonner.

## Global Constraints

- Real role enum only: `super_admin | head_coach | assistant_coach`. No `username`, no 4-state status.
- User state is a boolean `is_active` (frontend `isActive`), shown as an Active/Inactive badge.
- Backend is authoritative and already gates every endpoint to super_admin (403 otherwise); the UI gate is UX, not security.
- No component test runner exists in v2 — per-task verification is `npx tsc -b` (must exit 0) plus, where noted, `npm run build`. Behavioral verification is the final live browser pass (Task 9).
- Follow existing `lib/*-api.ts` conventions (axios `api`, `{success,data}` unwrap).
- Backend `PUT /admin/users/:id` accepts `is_active` (verified in `src/routes/auth.js`), even though the current `openapi.yaml` omits it.
- Commit after every task. Branch: `feat/admin-users-page` (already created, holds the spec commit).

---

### Task 1: Admin users API client

**Files:**
- Create: `v2/src/lib/admin-users-api.ts`

**Interfaces:**
- Produces:
  - `type AdminUser = { id: number; firstName: string; lastName: string; email: string; phone?: string; role: AdminRole; isActive: boolean; teamName?: string; createdAt?: string; updatedAt?: string }`
  - `type AdminRole = 'super_admin' | 'head_coach' | 'assistant_coach'`
  - `adminUsersApi.list(params?: { search?: string; role?: AdminRole; is_active?: boolean; page?: number; limit?: number }) => Promise<{ users: AdminUser[]; pagination: { page: number; limit: number; total: number; pages: number } }>`
  - `adminUsersApi.create(input: AdminUserCreateInput) => Promise<AdminUser>`
  - `adminUsersApi.update(id: number, input: AdminUserUpdateInput) => Promise<AdminUser>`
  - `adminUsersApi.remove(id: number) => Promise<void>`
  - `adminUsersApi.resetPassword(id: number, newPassword?: string) => Promise<{ temporaryPassword?: string; emailSent: boolean }>`
  - `type AdminUserCreateInput = { email: string; password: string; first_name: string; last_name: string; role: AdminRole; phone?: string }`
  - `type AdminUserUpdateInput = { email?: string; first_name?: string; last_name?: string; role?: AdminRole; phone?: string; is_active?: boolean }`

- [ ] **Step 1: Write the module**

Create `v2/src/lib/admin-users-api.ts`:

```ts
/**
 * Admin user management API (super_admin only).
 * Wraps /api/v1/auth/admin/* and maps backend snake_case to camelCase.
 */

import api from './api'

export type AdminRole = 'super_admin' | 'head_coach' | 'assistant_coach'

export interface AdminUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: AdminRole
  isActive: boolean
  teamName?: string
  createdAt?: string
  updatedAt?: string
}

export interface AdminUserCreateInput {
  email: string
  password: string
  first_name: string
  last_name: string
  role: AdminRole
  phone?: string
}

export interface AdminUserUpdateInput {
  email?: string
  first_name?: string
  last_name?: string
  role?: AdminRole
  phone?: string
  is_active?: boolean
}

interface BackendUser {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string | null
  role: AdminRole
  is_active: boolean
  Team?: { id: number; name: string } | null
  created_at?: string
  updated_at?: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

function mapUser(u: BackendUser): AdminUser {
  return {
    id: u.id,
    firstName: u.first_name,
    lastName: u.last_name,
    email: u.email,
    phone: u.phone ?? undefined,
    role: u.role,
    isActive: u.is_active,
    teamName: u.Team?.name,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
  }
}

export const adminUsersApi = {
  list: async (params?: {
    search?: string
    role?: AdminRole
    is_active?: boolean
    page?: number
    limit?: number
  }) => {
    const r = await api.get<{
      success?: boolean
      data?: BackendUser[]
      pagination?: Pagination
    }>('/auth/admin/users', { params })
    const users = (r.data?.data ?? []).map(mapUser)
    const pagination = r.data?.pagination ?? {
      page: 1,
      limit: 20,
      total: users.length,
      pages: 1,
    }
    return { users, pagination }
  },

  create: async (input: AdminUserCreateInput) => {
    const r = await api.post<{ success?: boolean; data?: BackendUser }>(
      '/auth/admin/users',
      input
    )
    return mapUser(r.data!.data!)
  },

  update: async (id: number, input: AdminUserUpdateInput) => {
    const r = await api.put<{ success?: boolean; data?: BackendUser }>(
      `/auth/admin/users/${id}`,
      input
    )
    return mapUser(r.data!.data!)
  },

  remove: async (id: number) => {
    await api.delete(`/auth/admin/users/${id}`)
  },

  resetPassword: async (id: number, newPassword?: string) => {
    const r = await api.put<{
      success?: boolean
      data?: { temporaryPassword?: string; email_sent?: boolean }
    }>(`/auth/admin/users/${id}/reset-password`, {
      ...(newPassword ? { new_password: newPassword } : {}),
    })
    return {
      temporaryPassword: r.data?.data?.temporaryPassword,
      emailSent: !!r.data?.data?.email_sent,
    }
  },
}
```

- [ ] **Step 2: Typecheck**

Run: `cd v2 && npx tsc -b`
Expected: exits 0 (new file compiles; it is not yet imported anywhere).

- [ ] **Step 3: Commit**

```bash
git add v2/src/lib/admin-users-api.ts
git commit -m "feat(users): add admin-users API client"
```

---

### Task 2: Rewrite users schema and data maps

**Files:**
- Modify (rewrite): `v2/src/features/users/data/schema.ts`
- Modify (rewrite): `v2/src/features/users/data/data.ts`
- Delete: `v2/src/features/users/data/users.ts` (faker source)

**Interfaces:**
- Consumes: `AdminRole` from Task 1.
- Produces:
  - `type User = AdminUser` (re-exported so existing component imports of `../data/schema`'s `User` keep working)
  - `roles: ReadonlyArray<{ label: string; value: AdminRole; icon: React.ElementType }>`
  - `roleLabels: Record<AdminRole, string>`

- [ ] **Step 1: Rewrite `schema.ts`**

Replace the entire contents of `v2/src/features/users/data/schema.ts`:

```ts
import { z } from 'zod'
import { type AdminUser, type AdminRole } from '@/lib/admin-users-api'

export const userRoleSchema = z.union([
  z.literal('super_admin'),
  z.literal('head_coach'),
  z.literal('assistant_coach'),
])

export type UserRole = AdminRole

export const userSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  role: userRoleSchema,
  isActive: z.boolean(),
  teamName: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

// The feature's canonical row type is the API's AdminUser.
export type User = AdminUser
```

- [ ] **Step 2: Rewrite `data.ts`**

Replace the entire contents of `v2/src/features/users/data/data.ts`:

```ts
import { Shield, UserCog, UserCheck } from 'lucide-react'
import { type AdminRole } from '@/lib/admin-users-api'

export const roleLabels: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  head_coach: 'Head Coach',
  assistant_coach: 'Assistant Coach',
}

export const roles = [
  { label: 'Super Admin', value: 'super_admin', icon: Shield },
  { label: 'Head Coach', value: 'head_coach', icon: UserCog },
  { label: 'Assistant Coach', value: 'assistant_coach', icon: UserCheck },
] as const satisfies ReadonlyArray<{
  label: string
  value: AdminRole
  icon: React.ElementType
}>
```

- [ ] **Step 3: Delete the faker data source**

```bash
git rm v2/src/features/users/data/users.ts
```

- [ ] **Step 4: Typecheck (expect failures in consumers)**

Run: `cd v2 && npx tsc -b`
Expected: FAIL — errors in `features/users/index.tsx` (imports deleted `./data/users`), `users-columns.tsx` (`username`/`status`/`phoneNumber` gone), `data-table-row-actions.tsx`, route search schema, and dialogs. These are fixed in Tasks 3–7. This confirms the schema change propagates.

- [ ] **Step 5: Commit**

```bash
git add v2/src/features/users/data/schema.ts v2/src/features/users/data/data.ts
git commit -m "feat(users): rewrite schema/data maps to real user model"
```

---

### Task 3: Columns — real fields and Active/Inactive badge

**Files:**
- Modify (rewrite): `v2/src/features/users/components/users-columns.tsx`

**Interfaces:**
- Consumes: `User`, `roles`, `roleLabels` (Tasks 1–2); `DataTableRowActions` (Task 4, signature unchanged).

- [ ] **Step 1: Rewrite `users-columns.tsx`**

Replace the entire contents:

```tsx
import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { roleLabels, roles } from '../data/data'
import { type User } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const usersColumns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const { firstName, lastName } = row.original
      return <LongText className='max-w-48 ps-3'>{`${firstName} ${lastName}`}</LongText>
    },
    meta: { className: 'w-48' },
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => <div>{row.original.phone ?? '—'}</div>,
    enableSorting: false,
  },
  {
    id: 'status',
    accessorFn: (row) => (row.isActive ? 'active' : 'inactive'),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const active = row.original.isActive
      return (
        <Badge
          variant='outline'
          className={cn(
            'capitalize',
            active
              ? 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'
              : 'bg-neutral-300/40 border-neutral-300'
          )}
        >
          {active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => {
      const role = row.original.role
      const userType = roles.find(({ value }) => value === role)
      return (
        <div className='flex items-center gap-x-2'>
          {userType?.icon && (
            <userType.icon size={16} className='text-muted-foreground' />
          )}
          <span className='text-sm'>{roleLabels[role]}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
```

- [ ] **Step 2: Commit** (typecheck still fails elsewhere until later tasks; that is expected)

```bash
git add v2/src/features/users/components/users-columns.tsx
git commit -m "feat(users): real columns with active/inactive badge"
```

---

### Task 4: Provider + row actions (add reset, drop invite)

**Files:**
- Modify: `v2/src/features/users/components/users-provider.tsx`
- Modify (rewrite): `v2/src/features/users/components/data-table-row-actions.tsx`

**Interfaces:**
- Produces: `UsersDialogType = 'add' | 'edit' | 'delete' | 'reset'` (removes `'invite'`, adds `'reset'`); `useUsers()` unchanged shape.
- Consumes: `useAuth()` for self-guard on delete.

- [ ] **Step 1: Update the dialog-type union in `users-provider.tsx`**

Replace the line:
```ts
type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete'
```
with:
```ts
type UsersDialogType = 'add' | 'edit' | 'delete' | 'reset'
```

- [ ] **Step 2: Rewrite `data-table-row-actions.tsx`**

Replace the entire contents:

```tsx
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { KeyRound, Trash2, UserPen } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type User } from '../data/schema'
import { useUsers } from './users-provider'

type DataTableRowActionsProps = {
  row: Row<User>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useUsers()
  const { user } = useAuth()
  const isSelf = String(user?.id) === String(row.original.id)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[180px]'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('edit')
          }}
        >
          Edit
          <DropdownMenuShortcut>
            <UserPen size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('reset')
          }}
        >
          Reset password
          <DropdownMenuShortcut>
            <KeyRound size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isSelf}
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('delete')
          }}
          className='text-red-500!'
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add v2/src/features/users/components/users-provider.tsx v2/src/features/users/components/data-table-row-actions.tsx
git commit -m "feat(users): row actions add reset-password, guard self-delete"
```

---

### Task 5: Action dialog (create/edit) wired to API

**Files:**
- Modify (rewrite): `v2/src/features/users/components/users-action-dialog.tsx`

**Interfaces:**
- Consumes: `adminUsersApi.create/update`, `AdminRole` (Task 1); `roles` (Task 2); `useUsers` (Task 4).

- [ ] **Step 1: Rewrite `users-action-dialog.tsx`**

Replace the entire contents:

```tsx
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
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
          ? ((err.response?.data as { error?: string })?.error ?? 'Request failed')
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
                    items={roles.map((r) => ({ label: r.label, value: r.value }))}
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
          <Button
            type='submit'
            form='user-form'
            disabled={mutation.isPending}
          >
            {isEdit ? 'Save changes' : 'Create user'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 2: Verify `SelectDropdown` prop shape**

Run: `cd v2 && grep -n "items\|onValueChange\|defaultValue\|placeholder" src/components/select-dropdown.tsx | head`
Expected: confirms `items`, `defaultValue`, `onValueChange`, `placeholder` props exist. If the prop names differ, adjust the `<SelectDropdown>` usage above to match before continuing.

- [ ] **Step 3: Commit**

```bash
git add v2/src/features/users/components/users-action-dialog.tsx
git commit -m "feat(users): wire create/edit dialog to admin API"
```

---

### Task 6: Delete dialog, reset-password dialog, dialogs wiring

**Files:**
- Modify (rewrite): `v2/src/features/users/components/users-delete-dialog.tsx`
- Create: `v2/src/features/users/components/users-reset-password-dialog.tsx`
- Modify (rewrite): `v2/src/features/users/components/users-dialogs.tsx`
- Delete: `v2/src/features/users/components/users-invite-dialog.tsx`

**Interfaces:**
- Consumes: `adminUsersApi.remove/resetPassword` (Task 1), `useUsers` (Task 4).

- [ ] **Step 1: Rewrite `users-delete-dialog.tsx`**

Replace the entire contents:

```tsx
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { adminUsersApi } from '@/lib/admin-users-api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { type User } from '../data/schema'

type Props = {
  currentRow: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersDeleteDialog({ currentRow, open, onOpenChange }: Props) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => adminUsersApi.remove(currentRow.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success(`Deleted ${currentRow.firstName} ${currentRow.lastName}`)
      onOpenChange(false)
    },
    onError: (err) => {
      const msg =
        err instanceof AxiosError
          ? ((err.response?.data as { error?: string })?.error ?? 'Delete failed')
          : 'Delete failed'
      toast.error(msg)
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes {currentRow.firstName} {currentRow.lastName}{' '}
            ({currentRow.email}). This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={mutation.isPending}
            onClick={(e) => {
              e.preventDefault()
              mutation.mutate()
            }}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

- [ ] **Step 2: Create `users-reset-password-dialog.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { adminUsersApi } from '@/lib/admin-users-api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'
import { type User } from '../data/schema'

type Props = {
  currentRow: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersResetPasswordDialog({
  currentRow,
  open,
  onOpenChange,
}: Props) {
  const queryClient = useQueryClient()
  const [customPassword, setCustomPassword] = useState('')
  const [result, setResult] = useState<{
    temporaryPassword?: string
    emailSent: boolean
  } | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      adminUsersApi.resetPassword(
        currentRow.id,
        customPassword.trim() ? customPassword.trim() : undefined
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setResult(data)
      toast.success(
        data.emailSent
          ? 'Password reset and emailed to the user'
          : 'Password reset (email not sent)'
      )
    },
    onError: (err) => {
      const msg =
        err instanceof AxiosError
          ? ((err.response?.data as { error?: string })?.error ?? 'Reset failed')
          : 'Reset failed'
      toast.error(msg)
    },
  })

  const close = (state: boolean) => {
    if (!state) {
      setCustomPassword('')
      setResult(null)
    }
    onOpenChange(state)
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>
            Reset the password for {currentRow.firstName} {currentRow.lastName}.
            Leave blank to auto-generate one. The new password is emailed to the
            user.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className='space-y-2 text-sm'>
            {result.temporaryPassword ? (
              <p>
                Temporary password:{' '}
                <code className='rounded bg-muted px-2 py-1 font-mono'>
                  {result.temporaryPassword}
                </code>
              </p>
            ) : (
              <p>The password was set to the value you provided.</p>
            )}
            <p className='text-muted-foreground'>
              {result.emailSent
                ? 'An email with the new password was sent to the user.'
                : 'Email delivery failed — share the password manually.'}
            </p>
          </div>
        ) : (
          <div className='space-y-2'>
            <Label htmlFor='custom-password'>Custom password (optional)</Label>
            <PasswordInput
              id='custom-password'
              placeholder='Leave blank to auto-generate'
              value={customPassword}
              onChange={(e) => setCustomPassword(e.target.value)}
            />
          </div>
        )}

        <DialogFooter>
          {result ? (
            <Button onClick={() => close(false)}>Done</Button>
          ) : (
            <Button disabled={mutation.isPending} onClick={() => mutation.mutate()}>
              Reset password
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 3: Rewrite `users-dialogs.tsx`**

Replace the entire contents:

```tsx
import { UsersActionDialog } from './users-action-dialog'
import { UsersDeleteDialog } from './users-delete-dialog'
import { UsersResetPasswordDialog } from './users-reset-password-dialog'
import { useUsers } from './users-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()

  const clearRowLater = () => setTimeout(() => setCurrentRow(null), 300)

  return (
    <>
      <UsersActionDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={() => setOpen(open === 'add' ? null : 'add')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen(null)
              clearRowLater()
            }}
            currentRow={currentRow}
          />

          <UsersResetPasswordDialog
            key={`user-reset-${currentRow.id}`}
            open={open === 'reset'}
            onOpenChange={() => {
              setOpen(null)
              clearRowLater()
            }}
            currentRow={currentRow}
          />

          <UsersDeleteDialog
            key={`user-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen(null)
              clearRowLater()
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
```

- [ ] **Step 4: Delete the invite dialog**

```bash
git rm v2/src/features/users/components/users-invite-dialog.tsx
```

- [ ] **Step 5: Commit**

```bash
git add v2/src/features/users/components/users-delete-dialog.tsx v2/src/features/users/components/users-reset-password-dialog.tsx v2/src/features/users/components/users-dialogs.tsx
git commit -m "feat(users): wire delete + reset-password dialogs, drop invite"
```

---

### Task 7: Page data source, primary button, bulk actions, table filters, route schema

**Files:**
- Modify: `v2/src/features/users/index.tsx`
- Modify: `v2/src/features/users/components/users-primary-buttons.tsx`
- Modify: `v2/src/features/users/components/data-table-bulk-actions.tsx`
- Modify: `v2/src/features/users/components/users-multi-delete-dialog.tsx`
- Modify: `v2/src/features/users/components/users-table.tsx`
- Modify: `v2/src/routes/_authenticated/users/index.tsx`

**Interfaces:**
- Consumes: `adminUsersApi.list/remove` (Task 1), `roles` (Task 2).

- [ ] **Step 1: Rewrite `features/users/index.tsx` to fetch real data**

Replace the entire contents:

```tsx
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { adminUsersApi } from '@/lib/admin-users-api'
import { Main } from '@/components/layout/main'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminUsersApi.list({ limit: 100 }),
  })

  const users = data?.users ?? []

  return (
    <UsersProvider>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User Management</h2>
            <p className='text-muted-foreground'>
              Manage team members and their roles.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex justify-center py-16'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <UsersTable data={users} search={search} navigate={navigate} />
        )}
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
```

- [ ] **Step 2: Simplify `users-primary-buttons.tsx` to a single Add button**

Replace the entire contents:

```tsx
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUsers } from './users-provider'

export function UsersPrimaryButtons() {
  const { setOpen } = useUsers()
  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Add User</span>
      <UserPlus size={18} />
    </Button>
  )
}
```

- [ ] **Step 3: Inspect the bulk-actions and multi-delete files**

Run: `cd v2 && sed -n '1,80p' src/features/users/components/data-table-bulk-actions.tsx`
Run: `cd v2 && sed -n '1,80p' src/features/users/components/users-multi-delete-dialog.tsx`
Expected: reveals how they read selected rows and how the multi-delete confirms. Note whether bulk-actions references `'invite'` or status, and how multi-delete performs deletion (template uses `showSubmittedData`/faker).

- [ ] **Step 4: Wire `users-multi-delete-dialog.tsx` to real deletion**

Edit so the confirm handler deletes each selected row via the API, excluding the current user, then invalidates. The concrete handler body (adapt names to the file's existing props — `table` / `selectedRows`):

```tsx
// imports to add at top:
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { adminUsersApi } from '@/lib/admin-users-api'

// inside the component, replace the faker/showSubmittedData confirm logic:
const queryClient = useQueryClient()
const { user } = useAuth()

const mutation = useMutation({
  mutationFn: async (ids: number[]) => {
    const deletable = ids.filter((id) => String(id) !== String(user?.id))
    await Promise.all(deletable.map((id) => adminUsersApi.remove(id)))
    return { attempted: ids.length, deleted: deletable.length }
  },
  onSuccess: ({ attempted, deleted }) => {
    queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    if (deleted < attempted) {
      toast.success(`Deleted ${deleted} user(s); your own account was skipped.`)
    } else {
      toast.success(`Deleted ${deleted} user(s)`)
    }
    table.resetRowSelection()
    onOpenChange(false)
  },
  onError: () => toast.error('Bulk delete failed'),
})

// the confirm button calls:
// mutation.mutate(selectedRows.map((r) => r.original.id))
```

If the file's confirm currently requires typing a confirmation value, keep that guard; only swap the action from faker to `mutation.mutate(...)`.

- [ ] **Step 5: Fix `data-table-bulk-actions.tsx` if it references removed concepts**

If Step 3 showed references to `'invite'`, `status`, or the removed status map, remove those menu items/imports so the file typechecks. Leave the delete bulk action (it opens the multi-delete dialog). No other changes.

- [ ] **Step 6: Update `users-table.tsx` filter column ids**

In `src/features/users/components/users-table.tsx`, find the `useTableUrlState` config array (contains lines like `{ columnId: 'username', searchKey: 'username', type: 'string' }`, `{ columnId: 'status', ... }`, `{ columnId: 'role', ... }`). Replace that array's entries with:

```ts
      { columnId: 'fullName', searchKey: 'name', type: 'string' },
      { columnId: 'status', searchKey: 'status', type: 'array' },
      { columnId: 'role', searchKey: 'role', type: 'array' },
```

If a faceted-filter config elsewhere in the file lists `status` options from the old `callTypes`, replace those options with `[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]`. Role facet options come from `roles` (already imported).

- [ ] **Step 7: Update the route search schema `routes/_authenticated/users/index.tsx`**

Replace the entire contents:

```tsx
import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Users } from '@/features/users'
import { roles } from '@/features/users/data/data'

const usersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(z.union([z.literal('active'), z.literal('inactive')]))
    .optional()
    .catch([]),
  role: z
    .array(z.enum(roles.map((r) => r.value) as [string, ...string[]]))
    .optional()
    .catch([]),
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: usersSearchSchema,
  component: Users,
})
```

- [ ] **Step 8: Typecheck the whole feature**

Run: `cd v2 && npx tsc -b`
Expected: exits 0. Fix any residual references to removed fields (`username`, `phoneNumber`, old `status` literals, `callTypes`) until clean.

- [ ] **Step 9: Commit**

```bash
git add v2/src/features/users v2/src/routes/_authenticated/users/index.tsx
git commit -m "feat(users): fetch real users, wire bulk delete, fix table filters"
```

---

### Task 8: Sidebar entry + route access guard (super_admin)

**Files:**
- Modify: `v2/src/components/layout/types.ts`
- Modify: `v2/src/components/layout/app-sidebar.tsx`
- Modify: `v2/src/components/layout/data/sidebar-data.ts`
- Modify: `v2/src/features/users/index.tsx`

**Interfaces:**
- Consumes: `useAuth()` (`user.role`).

- [ ] **Step 1: Add a `superAdminOnly` flag to the nav item type**

In `src/components/layout/types.ts`, in `type BaseNavItem`, add the field:

```ts
  /** Show only to super_admin users. */
  superAdminOnly?: boolean
```

- [ ] **Step 2: Filter super-admin items in `app-sidebar.tsx`**

In `src/components/layout/app-sidebar.tsx`, the `navGroups` builder already maps groups and filters by `permission`. Extend the filter to also drop `superAdminOnly` items for non-super_admins. `user` is already in scope from `useAuth()`. Change the `filterByPermission` helper and the top-level item filter:

```ts
  const isSuperAdmin = user?.role === 'super_admin'

  const allowItem = (item: { permission?: string; superAdminOnly?: boolean }) =>
    (!item.permission || has(item.permission)) &&
    (!item.superAdminOnly || isSuperAdmin)

  const filterByPermission = (items: { permission?: string; superAdminOnly?: boolean }[]) =>
    items.filter(allowItem)
```

Then in the top-level `.map`, replace the single-item permission check:

```ts
        if ('permission' in item || 'superAdminOnly' in item) {
          if (!allowItem(item)) return null
        }
        return item
```

(Keep the existing collapsible-group branch that calls `filterByPermission(item.items)`.)

- [ ] **Step 3: Add the sidebar nav item**

In `src/components/layout/data/sidebar-data.ts`, add `UserCog` to the lucide import, and add a new group before the settings/`Team Settings` group (or into an existing admin-ish group). Insert this group object into `navGroups`:

```ts
    {
      title: 'Administration',
      items: [
        {
          title: 'User Management',
          url: '/users',
          icon: UserCog,
          superAdminOnly: true,
        },
      ],
    },
```

- [ ] **Step 4: Add the in-page access guard**

In `src/features/users/index.tsx`, import `useAuth` and short-circuit for non-super_admins. Add near the top of the imports:

```tsx
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
```

And at the start of the `Users` component body, before the query:

```tsx
  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'super_admin'
```

Wrap the returned JSX so non-admins get a denial. Immediately after computing `isSuperAdmin`, add:

```tsx
  if (!isSuperAdmin) {
    return (
      <Main>
        <Card>
          <CardContent className='py-12 text-center text-muted-foreground'>
            You need super admin access to manage users.
          </CardContent>
        </Card>
      </Main>
    )
  }
```

(Place this guard before the `useQuery` call so the admin list is not even fetched for non-admins. Move the `const { data, isLoading } = useQuery(...)` line below the guard. Note: this means the `useQuery` runs only for admins — acceptable because the guard returns before any other hook. Ensure `useAuth` is the only hook above the guard; `useQuery` and `route.useSearch`/`route.useNavigate` come after. `route.useSearch()`/`useNavigate()` are hooks too — call them AFTER the guard as well, or the rules-of-hooks are violated. Reorder so ALL hooks except `useAuth` sit below the guard, OR keep hooks above and instead conditionally render. To stay rules-of-hooks-safe, prefer conditional RENDER: keep all hooks at top, and gate only the returned JSX.)

Final safe structure for the component:

```tsx
export function Users() {
  const { user } = useAuth()
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const isSuperAdmin = user?.role === 'super_admin'

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminUsersApi.list({ limit: 100 }),
    enabled: isSuperAdmin,
  })

  if (!isSuperAdmin) {
    return (
      <Main>
        <Card>
          <CardContent className='py-12 text-center text-muted-foreground'>
            You need super admin access to manage users.
          </CardContent>
        </Card>
      </Main>
    )
  }

  const users = data?.users ?? []
  // ...rest unchanged (UsersProvider + table)
}
```

Use `enabled: isSuperAdmin` on the query so no admin fetch fires for non-admins while keeping all hooks unconditional.

- [ ] **Step 5: Typecheck + build**

Run: `cd v2 && npx tsc -b && npm run build`
Expected: both succeed.

- [ ] **Step 6: Commit**

```bash
git add v2/src/components/layout v2/src/features/users/index.tsx
git commit -m "feat(users): super_admin-gated sidebar entry and page guard"
```

---

### Task 9: OpenAPI doc sync + live verification

**Files:**
- Modify: `openapi.yaml` and `docs/openapi.yaml` (in the **sports2-backend** repo)

- [ ] **Step 1: Sync the backend OpenAPI PUT body**

In the **sports2-backend** repo, in `openapi.yaml` under `/api/v1/auth/admin/users/{userId}` → `put` → requestBody schema properties, add:

```yaml
                is_active: { type: boolean }
```

Then copy to the docs mirror:

```bash
cd /Users/leo/testcopy/sports2-backend
cp openapi.yaml docs/openapi.yaml
git checkout -b chore/openapi-admin-user-is-active
git add openapi.yaml docs/openapi.yaml
git commit -m "docs(openapi): document is_active on admin user update"
```

- [ ] **Step 2: Start the frontend against local backend (or use the dev server)**

Run: `cd /Users/leo/testcopy/sports2-frontend/v2 && npm run dev`
Expected: dev server starts; note the URL (typically http://localhost:5173).

- [ ] **Step 3: Live browser verification (super_admin)**

Sign in as `lleo5301@gmail.com` (super_admin). Verify each:
- Sidebar shows "User Management" under Administration.
- `/users` lists real users including `leo@ddagcy.com`, with Active/Inactive badges and correct role labels.
- Add User: create a throwaway user → appears in the list, welcome email path exercised.
- Edit: change a user's role → persists after refetch.
- Reset password: run on a user → dialog shows temp password + email-sent note.
- Delete: guarded (disabled) for your own row; deletes another test user.
- Sign in as a non-super_admin (e.g. `testcoach@theprogram1814.com`, head_coach) → no sidebar item; visiting `/users` directly shows the access-denied card.

Document the outcomes. Any failure → return to the relevant task.

- [ ] **Step 4: Final commit / branch status**

Ensure the frontend feature branch `feat/admin-users-page` holds all commits and the backend `chore/openapi-admin-user-is-active` holds the doc sync. Ready for PRs (do not merge/deploy without user confirmation).

---

## Self-Review

**Spec coverage:**
- API client → Task 1. Schema/status model → Task 2, 3. CRUD dialogs → Task 5, 6. Reset password → Task 6. Invite removal → Task 6. Row actions → Task 4. Real data fetch → Task 7. Bulk delete self-exclusion → Task 7. Filters/route schema → Task 7. Sidebar + access guard → Task 8. OpenAPI sync → Task 9. Verification → Task 9. All spec sections mapped.

**Placeholder scan:** No TBD/TODO; every code step contains full file contents or a concrete, named edit. Tasks 7-Step 4/5 and 8-Step 2 are edits to files whose exact current contents vary slightly; each specifies the precise symbols to change and the full replacement snippet, with an inspection step (7-Step 3) preceding the adaptive edits.

**Type consistency:** `AdminUser`/`User` unified (Task 2 aliases `User = AdminUser`). Query key `['admin-users']` identical across index, action, delete, reset, multi-delete. `adminUsersApi` method names (`list/create/update/remove/resetPassword`) consistent across Tasks 5–8. Dialog union `'add'|'edit'|'delete'|'reset'` consistent between provider (Task 4), row actions (Task 4), and dialogs (Task 6). `superAdminOnly` consistent between types (Task 8-1), filter (8-2), data (8-3).

**Note on rules-of-hooks:** Task 8-Step 4 explicitly resolves the hook-ordering hazard by keeping all hooks unconditional and using `enabled: isSuperAdmin` — flagged because the naive early-return would violate rules-of-hooks.
