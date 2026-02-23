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
    <Card className={cn(statCardVariants({ size }), className)}>
      <CardContent className='flex items-start justify-between'>
        <div className='space-y-1'>
          <p className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>
            {label}
          </p>
          <p className='text-2xl font-bold tracking-tight sm:text-3xl'>
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
                <span className='text-muted-foreground'>{sublabel}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className='rounded-lg bg-primary/10 p-2 text-primary'>
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
