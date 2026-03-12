import { useEffect } from 'react'
import { AlertTriangle, Bot, Menu } from 'lucide-react'
import { useAiStore } from '@/stores/ai-store'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Main } from '@/components/layout/main'
import { ChatPanel } from './components/chat-panel'
import { ConversationList } from './components/conversation-list'
import { PromptGallery } from './components/prompt-gallery'
import { useChat } from './hooks/use-chat'
import { useConversations } from './hooks/use-conversations'

export function AiCoach() {
  const conversations = useConversations()
  const chat = useChat()
  const isMobile = useIsMobile()
  const { sidebarOpen, setSidebarOpen } = useAiStore()

  // When active conversation changes, load its messages
  useEffect(() => {
    if (conversations.activeConversationId) {
      chat.loadConversation(conversations.activeConversationId)
    } else {
      chat.clearMessages()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations.activeConversationId])

  const handleSelectPrompt = async (prompt: string) => {
    const convo = await conversations.createConversation()
    if (convo) {
      // Pass conversation ID directly to avoid stale closure issue
      chat.sendMessage(prompt, convo.id)
    }
  }

  return (
    <Main fixed fluid className='p-0'>
      {/* Mobile conversation list toggle */}
      <div className='flex items-center gap-2 border-b px-4 py-2 md:hidden'>
        <Sheet open={isMobile && sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon'>
              <Menu className='size-4' />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-72 p-0'>
            <ConversationList
              {...conversations}
              createConversation={async () => {
                const c = await conversations.createConversation()
                setSidebarOpen(false)
                return c
              }}
              setActiveConversation={(id) => {
                conversations.setActiveConversation(id)
                setSidebarOpen(false)
              }}
            />
          </SheetContent>
        </Sheet>
        <Bot className='size-5 text-primary' />
        <h1 className='text-lg font-semibold'>AI Coach</h1>
      </div>

      <div className='flex h-[calc(100vh-theme(spacing.16))]'>
        {/* Desktop sidebar */}
        <div className='hidden md:block'>
          <ConversationList {...conversations} />
        </div>

        {/* Main area */}
        <div className='min-h-0 flex-1'>
          {conversations.error ? (
            <div className='flex h-full items-center justify-center p-8'>
              <Card className='w-full max-w-md'>
                <CardContent className='space-y-3 pt-6 text-center'>
                  <AlertTriangle className='mx-auto size-10 text-amber-500' />
                  <h3 className='text-lg font-semibold'>
                    AI Coach Unavailable
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    {conversations.error}
                  </p>
                  <Button
                    variant='outline'
                    onClick={() => conversations.fetchConversations()}
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : conversations.activeConversationId ? (
            <ChatPanel
              messages={chat.messages}
              isStreaming={chat.isStreaming}
              streamingText={chat.streamingText}
              activeTools={chat.activeTools}
              error={chat.error}
              sendMessage={chat.sendMessage}
              cancelStream={chat.cancelStream}
            />
          ) : (
            <PromptGallery onSelectPrompt={handleSelectPrompt} />
          )}
        </div>
      </div>
    </Main>
  )
}
