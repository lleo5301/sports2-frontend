import { useState } from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { AiConversation } from '../types'
import { ConversationList } from './conversation-list'

interface ConversationSelectorProps {
  conversations: AiConversation[]
  activeConversationId: string | null
  loading: boolean
  setActiveConversation: (id: string | null) => void
  createConversation: () => Promise<AiConversation | null>
  archiveConversation: (id: string) => Promise<void>
  renameConversation: (id: string, title: string) => Promise<void>
  deleteConversation: (id: string) => Promise<void>
}

export function ConversationSelector({
  conversations,
  activeConversationId,
  loading,
  setActiveConversation,
  createConversation,
  archiveConversation,
  renameConversation,
  deleteConversation,
}: ConversationSelectorProps) {
  const [open, setOpen] = useState(false)

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  )
  const label =
    activeConversation?.title ||
    (activeConversationId ? 'New conversation' : 'Conversations')

  const handleSelect = (id: string | null) => {
    setActiveConversation(id)
    setOpen(false)
  }

  const handleCreate = async () => {
    const c = await createConversation()
    setOpen(false)
    return c
  }

  return (
    <div className='flex items-center justify-between gap-2 border-b px-4 py-2'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='ghost' size='sm' className='max-w-xs font-normal'>
            <ChevronsUpDown className='size-3.5 shrink-0 text-muted-foreground' />
            <span className='truncate'>{label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-72 p-0'
          align='start'
          side='bottom'
          sideOffset={4}
        >
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            loading={loading}
            setActiveConversation={handleSelect}
            createConversation={handleCreate}
            archiveConversation={archiveConversation}
            renameConversation={renameConversation}
            deleteConversation={deleteConversation}
            className='h-[min(80dvh,22rem)] w-full border-r-0'
          />
        </PopoverContent>
      </Popover>

      <Button
        size='sm'
        variant='outline'
        className='shrink-0'
        onClick={() => createConversation()}
      >
        <Plus className='size-3.5' />
        New
      </Button>
    </div>
  )
}
