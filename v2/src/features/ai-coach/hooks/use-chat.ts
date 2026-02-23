import { useState, useRef, useCallback, useEffect } from 'react'
import { useAiStore } from '@/stores/ai-store'
import { aiApi } from '@/lib/ai-api'
import type { AiMessage, SSEMessageEnd } from '../types'

interface UseChatReturn {
  messages: AiMessage[]
  isStreaming: boolean
  streamingText: string
  activeTools: string[]
  error: string | null
  tokenInfo: SSEMessageEnd['tokens'] | null
  sendMessage: (content: string) => Promise<void>
  cancelStream: () => void
  loadConversation: (conversationId: string) => Promise<void>
  clearMessages: () => void
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<AiMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [activeTools, setActiveTools] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [tokenInfo, setTokenInfo] = useState<SSEMessageEnd['tokens'] | null>(
    null
  )

  const abortRef = useRef<AbortController | null>(null)
  const { activeConversationId, updateConversation } = useAiStore()

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const loadConversation = useCallback(async (conversationId: string) => {
    setError(null)
    try {
      const convo = await aiApi.getConversation(conversationId)
      if (convo?.messages) {
        setMessages(convo.messages)
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to load conversation')
    }
  }, [])

  const sendMessage = useCallback(
    async (content: string, conversationIdOverride?: string) => {
      const convId = conversationIdOverride || activeConversationId
      if (!convId || isStreaming) return

      setError(null)
      setTokenInfo(null)

      // Optimistically add the user message to local state
      const userMessage: AiMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: convId,
        role: 'user',
        content,
        tool_name: null,
        tool_input: null,
        tool_result: null,
        tokens_used: null,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMessage])
      setIsStreaming(true)
      setStreamingText('')
      setActiveTools([])

      // Cancel any existing stream
      abortRef.current?.abort()

      // Start SSE stream
      let accumulatedText = ''

      abortRef.current = aiApi.sendMessage(convId, content, {
        onMessageStart: () => {
          // Stream has started
        },

        onContentDelta: (data) => {
          accumulatedText += data.text
          setStreamingText(accumulatedText)
        },

        onToolUse: (data) => {
          setActiveTools((prev) => [...prev, data.tool])
        },

        onToolResult: (data) => {
          setActiveTools((prev) => prev.filter((t) => t !== data.tool))

          // Add tool_call + tool_result as collapsed messages
          setMessages((prev) => [
            ...prev,
            {
              id: `tool-call-${Date.now()}`,
              conversation_id: convId,
              role: 'tool_call' as const,
              content: null,
              tool_name: data.tool,
              tool_input: null,
              tool_result: null,
              tokens_used: null,
              created_at: new Date().toISOString(),
            },
            {
              id: `tool-result-${Date.now()}`,
              conversation_id: convId,
              role: 'tool_result' as const,
              content: null,
              tool_name: data.tool,
              tool_input: null,
              tool_result: null,
              tokens_used: null,
              created_at: new Date().toISOString(),
            },
          ])
        },

        onMessageEnd: (data) => {
          // Finalize: add the complete assistant message
          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              conversation_id: convId,
              role: 'assistant',
              content: accumulatedText,
              tool_name: null,
              tool_input: null,
              tool_result: null,
              tokens_used: data.tokens.output,
              created_at: new Date().toISOString(),
            },
          ])
          setStreamingText('')
          setIsStreaming(false)
          setActiveTools([])
          setTokenInfo(data.tokens)

          // Update the conversation's updated_at in the store
          updateConversation(convId, {
            updated_at: new Date().toISOString(),
          })
        },

        onError: (errorMsg) => {
          setError(errorMsg)
          setIsStreaming(false)
          setStreamingText('')
          setActiveTools([])
        },
      })
    },
    [activeConversationId, isStreaming, updateConversation]
  )

  const cancelStream = useCallback(() => {
    abortRef.current?.abort()
    setIsStreaming(false)
    // Keep whatever text was accumulated so far
    if (streamingText) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-cancelled-${Date.now()}`,
          conversation_id: activeConversationId || '',
          role: 'assistant',
          content: streamingText + '\n\n*(Response cancelled)*',
          tool_name: null,
          tool_input: null,
          tool_result: null,
          tokens_used: null,
          created_at: new Date().toISOString(),
        },
      ])
      setStreamingText('')
    }
    setActiveTools([])
  }, [activeConversationId, streamingText])

  const clearMessages = useCallback(() => {
    setMessages([])
    setStreamingText('')
    setError(null)
    setTokenInfo(null)
  }, [])

  return {
    messages,
    isStreaming,
    streamingText,
    activeTools,
    error,
    tokenInfo,
    sendMessage,
    cancelStream,
    loadConversation,
    clearMessages,
  }
}
