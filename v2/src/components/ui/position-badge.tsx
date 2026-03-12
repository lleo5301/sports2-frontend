import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const positionColors: Record<string, string> = {
  P: 'bg-red-600 text-white',
  C: 'bg-blue-600 text-white',
  '1B': 'bg-amber-600 text-white',
  '2B': 'bg-green-600 text-white',
  SS: 'bg-purple-600 text-white',
  '3B': 'bg-orange-600 text-white',
  LF: 'bg-teal-600 text-white',
  CF: 'bg-cyan-600 text-white',
  RF: 'bg-indigo-600 text-white',
  DH: 'bg-slate-600 text-white',
  UT: 'bg-zinc-600 text-white',
}

interface PositionBadgeProps {
  position: string
  className?: string
}

export function PositionBadge({ position, className }: PositionBadgeProps) {
  const colorClass =
    positionColors[position] ?? 'bg-muted text-muted-foreground'
  return (
    <Badge
      className={cn(
        'rounded-md border-0 px-1.5 py-0.5 text-xs font-bold uppercase',
        colorClass,
        className
      )}
    >
      {position}
    </Badge>
  )
}
