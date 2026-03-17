import { useState, useRef, useEffect } from 'react'
import { Send, Square } from 'lucide-react'
import { toast } from 'sonner'
import { aiApi } from '@/lib/ai-api'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { INSIGHT_CATEGORY_LABELS } from '../constants'
import type { AiMessage, InsightCategory } from '../types'
import { MessageBubble } from './message-bubble'
import { ToolIndicator } from './tool-indicator'

interface ChatPanelProps {
  messages: AiMessage[]
  isStreaming: boolean
  streamingText: string
  activeTools: string[]
  error: string | null
  sendMessage: (
    content: string,
    conversationIdOverride?: string
  ) => Promise<void>
  cancelStream: () => void
}

const INSIGHT_CATEGORIES = Object.keys(
  INSIGHT_CATEGORY_LABELS
) as InsightCategory[]

export function ChatPanel({
  messages,
  isStreaming,
  streamingText,
  activeTools,
  error,
  sendMessage,
  cancelStream,
}: ChatPanelProps) {
  const [input, setInput] = useState('')
  const [saveTarget, setSaveTarget] = useState<AiMessage | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages or streaming text
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isStreaming) {
        sendMessage(input.trim())
        setInput('')
      }
    }
    if (e.key === 'Escape' && isStreaming) {
      cancelStream()
    }
  }

  const handleSend = () => {
    if (input.trim() && !isStreaming) {
      sendMessage(input.trim())
      setInput('')
    }
  }

  return (
    <div className='flex h-full flex-col'>
      {/* Messages area — native scroll */}
      <div className='min-h-0 flex-1 overflow-y-auto'>
        <div className='flex flex-col py-4'>
          {error && (
            <div className='px-4 pb-2'>
              <Alert variant='destructive'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {messages.length === 0 && !isStreaming && (
            <div className='flex flex-1 items-center justify-center p-8 text-center text-muted-foreground'>
              <p className='text-sm'>
                Start by asking anything about your team.
              </p>
            </div>
          )}

          {messages.map((msg, i) => {
            // For assistant messages, check if any tool calls immediately preceded this turn
            let usedTools = false
            if (msg.role === 'assistant') {
              let j = i - 1
              while (
                j >= 0 &&
                (messages[j].role === 'tool_call' ||
                  messages[j].role === 'tool_result')
              ) {
                usedTools = true
                j--
              }
            }
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                usedTools={usedTools}
                onSaveInsight={
                  msg.role === 'assistant' ? setSaveTarget : undefined
                }
              />
            )
          })}

          {/* Streaming text — document style, matching assistant message treatment */}
          {isStreaming && streamingText && (
            <div className='flex justify-start px-4 py-3'>
              <div className='w-full max-w-[85%] sm:max-w-[75%]'>
                <div className='border-l-2 border-primary/30 pl-4'>
                  <div className='prose prose-sm max-w-none whitespace-pre-wrap dark:prose-invert'>
                    {streamingText}
                    <span className='ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground' />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tool indicators */}
          <ToolIndicator activeTools={activeTools} />

          {/* Thinking indicator when no text yet */}
          {isStreaming && !streamingText && activeTools.length === 0 && (
            <div className='flex justify-start px-4 py-3'>
              <div className='border-l-2 border-primary/30 pl-4'>
                <div className='flex items-center gap-1.5'>
                  <span className='size-1.5 animate-bounce rounded-full bg-muted-foreground' />
                  <span className='size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]' />
                  <span className='size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]' />
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input area */}
      <div className='shrink-0 border-t bg-background p-4'>
        <div className='flex items-end gap-2'>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Ask anything about your team...'
            disabled={isStreaming}
            className='max-h-[120px] min-h-[44px] resize-none'
            rows={1}
          />
          {isStreaming ? (
            <Button
              size='icon'
              variant='destructive'
              onClick={cancelStream}
              className='shrink-0'
            >
              <Square className='size-4' />
            </Button>
          ) : (
            <Button
              size='icon'
              onClick={handleSend}
              disabled={!input.trim()}
              className='shrink-0'
            >
              <Send className='size-4' />
            </Button>
          )}
        </div>
        <p className='mt-1.5 text-center text-xs text-muted-foreground'>
          Enter to send · Shift+Enter for new line · Esc to stop
        </p>
      </div>

      {/* Save-to-insights dialog */}
      <SaveInsightDialog
        message={saveTarget}
        onClose={() => setSaveTarget(null)}
      />
    </div>
  )
}

function SaveInsightDialog({
  message,
  onClose,
}: {
  message: AiMessage | null
  onClose: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] =
    useState<InsightCategory>('player_performance')

  // Reset form state when a new message is targeted
  useEffect(() => {
    if (message) {
      const firstLine = (message.content || '')
        .split('\n')[0]
        .replace(/^#+\s*/, '')
        .trim()
      setTitle(firstLine.slice(0, 60))
      setCategory('player_performance')
    }
  }, [message])

  const handleSave = async () => {
    if (!message || !title.trim()) return
    setSaving(true)
    try {
      await aiApi.createInsight({
        title: title.trim(),
        content: message.content || '',
        category,
      })
      toast.success('Saved to Insights')
      onClose()
    } catch {
      toast.error('Failed to save insight')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={!!message} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>Save as Insight</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='insight-title'>Title</Label>
            <Input
              id='insight-title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Insight title'
              autoFocus
            />
          </div>
          <div className='space-y-2'>
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as InsightCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INSIGHT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {INSIGHT_CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim() || saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
