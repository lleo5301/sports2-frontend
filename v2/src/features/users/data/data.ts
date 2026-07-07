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
