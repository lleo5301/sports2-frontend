import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { AiCoachTabs } from './components/ai-coach-tabs'
import { ChatPanel } from './components/chat-panel'
import { ConversationSelector } from './components/conversation-selector'
import { PromptGallery } from './components/prompt-gallery'
import { useChat } from './hooks/use-chat'
import { useConversations } from './hooks/use-conversations'

export function AiCoach() {
  const conversations = useConversations()
  const chat = useChat()

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
      chat.sendMessage(prompt, convo.id)
    }
  }

  return (
    <Main fixed fluid className='p-0'>
      {/* Tab bar */}
      <div className='border-b px-4 pt-3 pb-0'>
        <AiCoachTabs />
      </div>

      {/* Conversation selector bar — replaces the fixed sidebar */}
      <ConversationSelector
        conversations={conversations.conversations}
        activeConversationId={conversations.activeConversationId}
        loading={conversations.loading}
        setActiveConversation={conversations.setActiveConversation}
        createConversation={conversations.createConversation}
        archiveConversation={conversations.archiveConversation}
        renameConversation={conversations.renameConversation}
        deleteConversation={conversations.deleteConversation}
      />

      {/* Main content — flex-1 fills remaining height */}
      <div className='min-h-0 flex-1'>
        {conversations.error ? (
          <div className='flex h-full items-center justify-center p-8'>
            <Card className='w-full max-w-md'>
              <CardContent className='space-y-3 pt-6 text-center'>
                <AlertTriangle className='mx-auto size-10 text-amber-500' />
                <h3 className='text-lg font-semibold'>AI Coach Unavailable</h3>
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
    </Main>
  )
}
