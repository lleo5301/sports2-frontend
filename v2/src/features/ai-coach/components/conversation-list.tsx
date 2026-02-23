import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  MoreHorizontal,
  Plus,
  Archive,
  Pencil,
  Trash2,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import type { AiConversation } from '../types'

interface ConversationListProps {
  conversations: AiConversation[]
  activeConversationId: string | null
  loading: boolean
  setActiveConversation: (id: string | null) => void
  createConversation: () => Promise<AiConversation | null>
  archiveConversation: (id: string) => Promise<void>
  renameConversation: (id: string, title: string) => Promise<void>
  deleteConversation: (id: string) => Promise<void>
}

export function ConversationList({
  conversations,
  activeConversationId,
  loading,
  setActiveConversation,
  createConversation,
  archiveConversation,
  renameConversation,
  deleteConversation,
}: ConversationListProps) {
  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const handleRenameSubmit = async () => {
    if (renameId && renameValue.trim()) {
      await renameConversation(renameId, renameValue.trim())
      setRenameId(null)
      setRenameValue('')
    }
  }

  return (
    <>
      <div className='flex h-full w-72 flex-col border-r'>
        <div className='flex items-center justify-between border-b p-3'>
          <h2 className='text-sm font-semibold'>Conversations</h2>
          <Button
            size='sm'
            variant='outline'
            onClick={() => createConversation()}
          >
            <Plus className='mr-1 size-3.5' />
            New
          </Button>
        </div>

        <ScrollArea className='flex-1'>
          <div className='flex flex-col gap-0.5 p-2'>
            {loading && conversations.length === 0 && (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className='h-14 w-full rounded-lg' />
                ))}
              </>
            )}

            {!loading && conversations.length === 0 && (
              <div className='p-4 text-center text-sm text-muted-foreground'>
                No conversations yet
              </div>
            )}

            {conversations.map((convo) => (
              <div
                key={convo.id}
                className={cn(
                  'group flex cursor-pointer items-start gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent',
                  activeConversationId === convo.id && 'bg-accent'
                )}
                onClick={() => setActiveConversation(convo.id)}
              >
                <MessageSquare className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
                <div className='min-w-0 flex-1'>
                  <p className='truncate font-medium'>
                    {convo.title || 'New conversation'}
                  </p>
                  <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <span>
                      {formatDistanceToNow(new Date(convo.updated_at), {
                        addSuffix: true,
                      })}
                    </span>
                    <Badge
                      variant='secondary'
                      className='px-1 py-0 text-[10px]'
                    >
                      {convo.model.replace('claude-', '').split('-')[0]}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant='ghost'
                      size='icon'
                      className='size-6 shrink-0 opacity-0 group-hover:opacity-100'
                    >
                      <MoreHorizontal className='size-3.5' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setRenameId(convo.id)
                        setRenameValue(convo.title || '')
                      }}
                    >
                      <Pencil className='mr-2 size-3.5' />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        archiveConversation(convo.id)
                      }}
                    >
                      <Archive className='mr-2 size-3.5' />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='text-destructive'
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteConversation(convo.id)
                      }}
                    >
                      <Trash2 className='mr-2 size-3.5' />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Rename dialog */}
      <Dialog
        open={!!renameId}
        onOpenChange={(open) => !open && setRenameId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleRenameSubmit()
            }}
            className='space-y-4'
          >
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder='Conversation title'
              autoFocus
            />
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                type='button'
                onClick={() => setRenameId(null)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={!renameValue.trim()}>
                Rename
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
