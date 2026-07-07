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
