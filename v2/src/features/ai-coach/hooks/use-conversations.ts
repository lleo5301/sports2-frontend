import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAiStore } from '@/stores/ai-store'
import { aiApi } from '@/lib/ai-api'
import type { Pagination } from '../types'

export function useConversations() {
  const {
    conversations,
    setConversations,
    activeConversationId,
    setActiveConversation,
    addConversation,
    removeConversation,
    updateConversation,
  } = useAiStore()

  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  })

  const fetchConversations = useCallback(
    async (page = 1) => {
      setLoading(true)
      try {
        const result = await aiApi.listConversations({ page, limit: 20 })
        setConversations(result.data)
        setPagination(result.pagination)
      } catch {
        toast.error('Failed to load conversations')
      } finally {
        setLoading(false)
      }
    },
    [setConversations]
  )

  // Load conversations on mount
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const createConversation = useCallback(
    async (params?: {
      title?: string
      model?: string
      system_prompt?: string
    }) => {
      try {
        const convo = await aiApi.createConversation(params)
        if (convo) {
          addConversation(convo)
          setActiveConversation(convo.id)
          return convo
        }
      } catch {
        toast.error('Failed to create conversation')
      }
      return null
    },
    [addConversation, setActiveConversation]
  )

  const archiveConversation = useCallback(
    async (id: string) => {
      try {
        await aiApi.updateConversation(id, { is_archived: true })
        removeConversation(id)
        toast.success('Conversation archived')
      } catch {
        toast.error('Failed to archive conversation')
      }
    },
    [removeConversation]
  )

  const renameConversation = useCallback(
    async (id: string, title: string) => {
      try {
        await aiApi.updateConversation(id, { title })
        updateConversation(id, { title })
      } catch {
        toast.error('Failed to rename conversation')
      }
    },
    [updateConversation]
  )

  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        await aiApi.deleteConversation(id)
        removeConversation(id)
        toast.success('Conversation deleted')
      } catch {
        toast.error('Failed to delete conversation')
      }
    },
    [removeConversation]
  )

  return {
    conversations,
    activeConversationId,
    loading,
    pagination,
    setActiveConversation,
    fetchConversations,
    createConversation,
    archiveConversation,
    renameConversation,
    deleteConversation,
  }
}
