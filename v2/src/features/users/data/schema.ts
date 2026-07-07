import { type AdminUser, type AdminRole } from '@/lib/admin-users-api'

export type UserRole = AdminRole

// The feature's canonical row type is the API's AdminUser.
export type User = AdminUser
