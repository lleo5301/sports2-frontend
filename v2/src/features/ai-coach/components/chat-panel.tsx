import { useState, useRef, useEffect } from 'react'
import { Send, Square } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import type { AiMessage } from '../types'
import { MessageBubble } from './message-bubble'
import { ToolIndicator } from './tool-indicator'

interface ChatPanelProps {
  messages: AiMessage[]
  isStreaming: boolean
  streamingText: string
  activeTools: string[]
  error: string | null
  sendMessage: (content: string) => Promise<void>
  cancelStream: () => void
}

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
      {/* Messages area */}
      <ScrollArea className='flex-1'>
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
              <p>Send a message to start the conversation.</p>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Streaming text */}
          {isStreaming && streamingText && (
            <div className='flex justify-start px-4 py-2'>
              <div className='max-w-[85%] rounded-2xl bg-muted px-4 py-2.5 sm:max-w-[75%]'>
                <p className='text-sm whitespace-pre-wrap'>
                  {streamingText}
                  <span className='ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground' />
                </p>
              </div>
            </div>
          )}

          {/* Tool indicators */}
          <ToolIndicator activeTools={activeTools} />

          {/* Streaming indicator when no text yet */}
          {isStreaming && !streamingText && activeTools.length === 0 && (
            <div className='flex justify-start px-4 py-2'>
              <div className='rounded-2xl bg-muted px-4 py-2.5'>
                <div className='flex items-center gap-1.5'>
                  <span className='size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]' />
                  <span className='size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]' />
                  <span className='size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]' />
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className='border-t bg-background p-4'>
        <div className='flex items-end gap-2'>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Ask your AI Coach...'
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
        <p className='mt-1.5 text-center text-[10px] text-muted-foreground'>
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
