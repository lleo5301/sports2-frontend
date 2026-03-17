import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Database,
  Info,
  Pin,
  Wrench,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { TOOL_LABELS } from '../constants'
import type { AiMessage } from '../types'

interface MessageBubbleProps {
  message: AiMessage
  /** True if any tool calls preceded this assistant message in the thread */
  usedTools?: boolean
  onSaveInsight?: (message: AiMessage) => void
}

export function MessageBubble({
  message,
  usedTools,
  onSaveInsight,
}: MessageBubbleProps) {
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

  if (isUser) {
    return (
      <div className='flex justify-end px-4 py-2'>
        <div className='max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground sm:max-w-[75%]'>
          <p className='text-sm whitespace-pre-wrap'>{message.content}</p>
        </div>
      </div>
    )
  }

  // Assistant message — document style, no bubble
  return (
    <div className='group flex justify-start px-4 py-3'>
      <div className='w-full max-w-[85%] sm:max-w-[75%]'>
        <div className='border-l-2 border-primary/30 pl-4'>
          <div className='prose prose-sm max-w-none dark:prose-invert [&>p:first-child]:text-sm [&>p:first-child]:leading-snug [&>p:first-child]:font-medium'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content || ''}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer row — data signal (always visible) + save action (hover) */}
        <div className='mt-2 flex items-center justify-between pl-4'>
          {/* Data confidence signal */}
          <span
            className={cn(
              'flex items-center gap-1 text-xs',
              usedTools ? 'text-success/70' : 'text-muted-foreground/60'
            )}
          >
            {usedTools ? (
              <>
                <Database className='size-2.5' />
                Live data
              </>
            ) : (
              <>
                <Info className='size-2.5' />
                General knowledge
              </>
            )}
          </span>

          {/* Save as insight — hover only */}
          {onSaveInsight && (
            <button
              onClick={() => onSaveInsight(message)}
              className='flex items-center gap-1.5 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground'
            >
              <Pin className='size-2.5' />
              Save as insight
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
