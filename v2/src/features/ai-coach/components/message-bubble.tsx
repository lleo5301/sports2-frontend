import { useState } from 'react'
import { ChevronDown, ChevronRight, Wrench } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { TOOL_LABELS } from '../constants'
import type { AiMessage } from '../types'

interface MessageBubbleProps {
  message: AiMessage
  isLast?: boolean
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [expanded, setExpanded] = useState(false)

  // Tool call/result messages render as small collapsible badges
  if (message.role === 'tool_call' || message.role === 'tool_result') {
    const label =
      TOOL_LABELS[message.tool_name || ''] || message.tool_name || 'Tool'
    const isCall = message.role === 'tool_call'

    return (
      <div className='flex justify-start px-4 py-0.5'>
        <button
          onClick={() => setExpanded(!expanded)}
          className='flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground'
        >
          <Wrench className='size-3' />
          <span>{isCall ? label : `${label} complete`}</span>
          {expanded ? (
            <ChevronDown className='size-3' />
          ) : (
            <ChevronRight className='size-3' />
          )}
        </button>
        {expanded && message.tool_input && (
          <pre className='mt-1 max-w-md overflow-auto rounded bg-muted p-2 text-xs'>
            {JSON.stringify(message.tool_input, null, 2)}
          </pre>
        )}
      </div>
    )
  }

  const isUser = message.role === 'user'

  return (
    <div
      className={cn('flex px-4 py-2', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 sm:max-w-[75%]',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {isUser ? (
          <p className='text-sm whitespace-pre-wrap'>{message.content}</p>
        ) : (
          <div className='prose prose-sm dark:prose-invert max-w-none'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content || ''}
            </ReactMarkdown>
          </div>
        )}
        {message.role === 'assistant' && message.tokens_used && (
          <div className='mt-1.5 flex justify-end'>
            <Badge variant='secondary' className='text-[10px]'>
              {message.tokens_used.toLocaleString()} tokens
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
