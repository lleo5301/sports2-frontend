import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Pin, PinOff, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { INSIGHT_CATEGORY_LABELS, INSIGHT_CATEGORY_COLORS } from '../constants'
import type { AiInsight } from '../types'

interface InsightCardProps {
  insight: AiInsight
  onTogglePin: (id: string, isPinned: boolean) => void
  onDelete: (id: string) => void
}

export function InsightCard({
  insight,
  onTogglePin,
  onDelete,
}: InsightCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card>
      <CardHeader className='flex-row items-start justify-between gap-2 space-y-0'>
        <div className='min-w-0 space-y-1'>
          <div className='flex items-center gap-2'>
            <Badge
              className={cn(
                'text-[10px]',
                INSIGHT_CATEGORY_COLORS[insight.category]
              )}
            >
              {INSIGHT_CATEGORY_LABELS[insight.category] || insight.category}
            </Badge>
            <span className='text-xs text-muted-foreground'>
              {insight.created_at &&
              !isNaN(new Date(insight.created_at).getTime())
                ? formatDistanceToNow(new Date(insight.created_at), {
                    addSuffix: true,
                  })
                : 'just now'}
            </span>
          </div>
          <CardTitle
            className='cursor-pointer text-sm'
            onClick={() => setExpanded(!expanded)}
          >
            <span className='flex items-center gap-1'>
              {expanded ? (
                <ChevronDown className='size-3.5' />
              ) : (
                <ChevronRight className='size-3.5' />
              )}
              {insight.title}
            </span>
          </CardTitle>
        </div>
        <Button
          variant='ghost'
          size='icon'
          className='size-7 shrink-0'
          onClick={() => onTogglePin(insight.id, insight.is_pinned)}
        >
          {insight.is_pinned ? (
            <PinOff className='size-3.5' />
          ) : (
            <Pin className='size-3.5' />
          )}
        </Button>
      </CardHeader>
      {expanded && (
        <CardContent className='space-y-3'>
          <div className='prose prose-sm max-w-none dark:prose-invert'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {insight.content}
            </ReactMarkdown>
          </div>
          <div className='flex justify-end'>
            <Button
              variant='ghost'
              size='sm'
              className='text-destructive hover:text-destructive'
              onClick={() => onDelete(insight.id)}
            >
              <Trash2 className='mr-1 size-3.5' />
              Delete
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
