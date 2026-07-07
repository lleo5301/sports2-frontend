# Wire /users Page to Admin User Management — Design

**Date:** 2026-07-07
**Repo:** sports2-frontend (v2)
**Status:** Approved (feature set, status model, and access model confirmed by user)

## Problem

The v2 `/users` page is an unwired shadcn template: it renders faker-generated fake
users, uses boilerplate roles (`superadmin/admin/cashier/manager`) and a 4-state status
(`active/inactive/invited/suspended`), has an email-invite dialog with no backend, and is
not in the sidebar. The backend already exposes complete super_admin user management; this
wires the page to it.

## Backend contract (already exists, no changes)

All under `/api/v1/auth/admin/*`, super_admin only, multi-tenant (scoped to the admin's
`team_id`), 403 otherwise:

- `GET /admin/users?page&limit&search&role&is_active` → `{ success, data: User[], pagination }`
- `POST /admin/users` (email, password, first_name, last_name, role, phone?) → 201
- `GET /admin/users/:id`
- `PUT /admin/users/:id` (email, first_name, last_name, role, phone, is_active) — no
  password. NOTE: the handler accepts `is_active` (verified in `src/routes/auth.js`) but
  the `openapi.yaml` PUT schema omits it — sync both openapi copies as a doc-only fix
  (the one backend-repo change in this work, no code change).
- `DELETE /admin/users/:id` — backend forbids deleting self
- `PUT /admin/users/:id/reset-password` ({new_password?}) → temp password (if generated) +
  `email_sent`; emails the user

Backend `User` fields returned: `id` (number), `email`, `first_name`, `last_name`, `role`
(`super_admin|head_coach|assistant_coach`), `phone` (nullable), `is_active` (boolean),
`Team {id,name}`, `created_at`, `updated_at`. No `username`.

## Decisions

- **Feature set:** full CRUD + password reset.
- **Status model:** drop `username`; map boolean `is_active` to an Active/Inactive badge,
  toggled via the update endpoint. No 4-state status, no "invited" concept.
- **Access & nav:** sidebar "User Management" item shown only for super_admin; direct
  navigation by a non-super_admin shows an access-denied state.

## Components

### New: `lib/admin-users-api.ts`
Mirrors existing `*-api.ts` files (axios `api` client, `{success,data}` unwrap).
- Types: `AdminUser` (camelCase frontend shape) + mapper from backend snake_case.
- `listUsers(params) → { users: AdminUser[], pagination }`
- `createUser(input)`, `updateUser(id, input)`, `deleteUser(id)`
- `resetPassword(id, newPassword?) → { temporaryPassword?, email_sent }`

### Rewrite: `features/users/data/schema.ts` + `data/data.ts`
- `userSchema`: `id: number`, `firstName`, `lastName`, `email`, `phone: string.optional()`,
  `role: 'super_admin'|'head_coach'|'assistant_coach'`, `isActive: boolean`,
  `createdAt/updatedAt: coerce.date()`. Remove `username`, remove `status` union.
- `data.ts`: role label map (Super Admin / Head Coach / Assistant Coach) + icons; remove
  cashier/manager/superadmin/admin and the call-type/status maps that no longer apply.

### Replace: `data/users.ts` (faker) → query hook
- Remove faker import/seed. Page pulls data from a `useQuery(['admin-users', params])`
  calling `listUsers`. Search + pagination sourced from the route search params the page
  already reads (`route.useSearch`).

### Dialogs
- `users-action-dialog.tsx`: remove `username` + `phoneNumber`-required; roles from new
  `data.ts`; on **add** require password (min 8, confirm), on **edit** hide password
  fields. Submit → `createUser` / `updateUser`; invalidate `['admin-users']`; toast.
- `users-delete-dialog.tsx`: call `deleteUser`; disable/hide for the current user
  (`useAuth().user.id`), matching backend self-delete guard.
- **New `users-reset-password-dialog.tsx`**: optional custom password field (else
  auto-generate); on success show returned temp password (if any) and an
  "email sent / not sent" note. Calls `resetPassword`.
- **Remove** `users-invite-dialog.tsx` and its primary button (no backend concept).
- `data-table-row-actions.tsx`: add "Reset password" item opening the new dialog; keep
  edit/delete. `users-provider.tsx` `open` union gains `'reset'`, drops `'invite'`.
- Bulk delete (`users-multi-delete-dialog.tsx`): keep, but exclude current user from the
  deletion set.

### Access & navigation
- `components/layout/data/sidebar-data.ts`: add `{ title: 'User Management', url: '/users',
  icon: <Users/UserCog> }` in an admin group, conditionally included when the signed-in
  user is super_admin. (Sidebar builds from `useAuth`; gate at render.)
- `routes/_authenticated/users/index.tsx`: component-level guard — if
  `user.role !== 'super_admin'`, render an access-denied card instead of the table.

## Data flow

Page → `useQuery(listUsers)` → table. Mutations (create/update/delete/reset) →
`useMutation` → on success `queryClient.invalidateQueries(['admin-users'])` + toast. No
optimistic updates (simple refetch; volumes are small). Errors surface the API `error`
message via `sonner`, same as `account-form.tsx`.

## Error / edge handling

- Non-super_admin: access-denied UI; API also 403s (defense in depth).
- Self-delete: guarded in UI and backend.
- Reset password: email may fail (`email_sent:false`) — dialog still shows the temp
  password so the admin can relay it.
- Empty/duplicate email on create: backend 400 → toast.

## Testing / verification

- `npm run build` (tsc + vite) passes.
- Live browser pass signed in as super_admin (`lleo5301@gmail.com`):
  list shows real users incl. `leo@ddagcy.com`; edit a user's role persists; reset-password
  shows temp password + email_sent; delete guarded for self; sidebar item hidden for a
  non-admin and the page shows access-denied.

## Out of scope

- Any backend code change (none needed — only an `openapi.yaml` doc sync to add
  `is_active` to the documented PUT body).
- "Invited" status / invitation emails.
- Team Settings' existing coach-facing add-user form (unchanged).
