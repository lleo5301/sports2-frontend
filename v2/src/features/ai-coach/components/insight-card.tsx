import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Pin, PinOff, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
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
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <Card>
        <CardHeader className='flex-row items-start justify-between gap-2 space-y-0'>
          <div className='min-w-0 flex-1 space-y-1'>
            <div className='flex items-center gap-2'>
              <Badge
                variant='outline'
                className={cn(INSIGHT_CATEGORY_COLORS[insight.category])}
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
            <CollapsibleTrigger className='flex w-full items-center gap-1 text-left text-sm font-semibold transition-colors hover:text-foreground/80'>
              {expanded ? (
                <ChevronDown className='size-3.5 shrink-0' />
              ) : (
                <ChevronRight className='size-3.5 shrink-0' />
              )}
              <span className='truncate'>{insight.title}</span>
            </CollapsibleTrigger>
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
        <CollapsibleContent>
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
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
