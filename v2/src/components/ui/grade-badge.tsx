import { Badge } from '@/components/ui/badge'

interface GradeBadgeProps {
  value?: number | string | null
}

export function GradeBadge({ value }: GradeBadgeProps) {
  if (value === undefined || value === null || value === '')
    return <span className='text-muted-foreground'>—</span>
  const display = String(value)
  const numVal = Number(display)
  let variant: 'default' | 'secondary' | 'outline' = 'secondary'
  if (!Number.isNaN(numVal)) {
    if (numVal >= 60) variant = 'default'
    else if (numVal >= 40) variant = 'secondary'
    else variant = 'outline'
  }
  return (
    <Badge
      variant={variant}
      className='min-w-[2.5rem] justify-center text-sm font-semibold'
    >
      {display}
    </Badge>
  )
}
