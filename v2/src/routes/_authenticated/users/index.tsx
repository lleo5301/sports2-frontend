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
