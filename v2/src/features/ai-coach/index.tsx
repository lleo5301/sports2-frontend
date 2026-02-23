import { useEffect } from 'react'
import { Bot, Menu } from 'lucide-react'
import { useAiStore } from '@/stores/ai-store'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ChatPanel } from './components/chat-panel'
import { ConversationList } from './components/conversation-list'
import { PromptGallery } from './components/prompt-gallery'
import { useChat } from './hooks/use-chat'
import { useConversations } from './hooks/use-conversations'

export function AiCoach() {
  const conversations = useConversations()
  const chat = useChat()
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
      // Small delay to let state propagate
      setTimeout(() => chat.sendMessage(prompt), 100)
    }
  }

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          {/* Mobile sidebar toggle */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
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
      </Header>

      <Main fixed fluid className='p-0'>
        <div className='flex h-[calc(100vh-theme(spacing.16))]'>
          {/* Desktop sidebar */}
          <div className='hidden md:block'>
            <ConversationList {...conversations} />
          </div>

          {/* Main area */}
          <div className='flex-1'>
            {conversations.activeConversationId ? (
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
    </>
  )
}
