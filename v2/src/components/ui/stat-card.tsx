import { cva, type VariantProps } from 'class-variance-authority'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

const statCardVariants = cva('', {
  variants: {
    size: {
      default: '',
      compact: 'py-2 sm:py-3',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  sublabel?: string
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  label,
  value,
  change,
  trend,
  sublabel,
  icon,
  size,
  className,
}: StatCardProps) {
  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <Card
      className={cn(
        // Override card edge-to-edge on mobile — stat cards live in grids
        'mx-0 gap-2 overflow-hidden rounded-lg border py-3 sm:gap-4 sm:rounded-xl sm:py-4',
        statCardVariants({ size }),
        className
      )}
    >
      <CardContent className='flex min-w-0 items-start justify-between gap-2'>
        <div className='min-w-0 space-y-0.5 sm:space-y-1'>
          <p className='truncate text-[10px] font-medium tracking-wider text-muted-foreground uppercase sm:text-xs'>
            {label}
          </p>
          <p className='text-xl font-bold tracking-tight sm:text-3xl'>
            {value}
          </p>
          {(change || sublabel) && (
            <div className='flex items-center gap-1.5 text-xs'>
              {change && (
                <span
                  className={cn(
                    'flex items-center gap-0.5 font-medium',
                    trend === 'up' && 'text-success',
                    trend === 'down' && 'text-destructive',
                    trend === 'neutral' && 'text-muted-foreground'
                  )}
                >
                  <TrendIcon className='size-3' />
                  {change}
                </span>
              )}
              {sublabel && (
                <span className='truncate text-muted-foreground'>
                  {sublabel}
                </span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className='shrink-0 rounded-lg bg-primary/10 p-1.5 text-primary sm:p-2'>
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
