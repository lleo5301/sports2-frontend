import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type GameResult = 'W' | 'L' | 'T' | 'D'

const resultStyles: Record<GameResult, string> = {
  W: 'bg-success text-success-foreground',
  L: 'bg-destructive text-white',
  T: 'bg-warning text-warning-foreground',
  D: 'bg-warning text-warning-foreground',
}

interface GameResultBadgeProps {
  result: GameResult
  score?: string
  className?: string
}

export function GameResultBadge({
  result,
  score,
  className,
}: GameResultBadgeProps) {
  return (
    <Badge
      className={cn(
        'rounded-md border-0 font-bold',
        resultStyles[result],
        className
      )}
    >
      {result}
      {score ? ` ${score}` : ''}
    </Badge>
  )
}

interface StreakIndicatorProps {
  results: GameResult[]
  className?: string
}

export function StreakIndicator({ results, className }: StreakIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {results.slice(-10).map((result, i) => (
        <div
          key={i}
          className={cn(
            'size-2 rounded-full',
            result === 'W' && 'bg-success',
            result === 'L' && 'bg-destructive',
            (result === 'T' || result === 'D') && 'bg-warning'
          )}
          title={result}
        />
      ))}
    </div>
  )
}
