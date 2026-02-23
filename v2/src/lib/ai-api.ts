/**
 * AI Coach API - conversations, messages (SSE), insights, prompts, API keys, usage.
 */
import type {
  AiConversation,
  AiMessage,
  AiInsight,
  PromptTemplates,
  ApiKeyStatus,
  ApiKeyTestResult,
  UsageSummary,
  AiUsageLog,
  Pagination,
  SSECallbacks,
  InsightCategory,
} from '@/features/ai-coach/types'
import api from './api'
import csrfService from './csrf'

// ============================================
// Helper (same as other API modules)
// ============================================

function getData<T>(res: {
  success?: boolean
  data?: T
  [k: string]: unknown
}): T | undefined {
  return res?.success !== false && res?.data !== undefined
    ? (res.data as T)
    : undefined
}

const defaultPagination: Pagination = { page: 1, limit: 20, total: 0, pages: 0 }

// ============================================
// API Module
// ============================================

export const aiApi = {
  // ------------------------------------------
  // Conversations
  // ------------------------------------------

  createConversation: async (params?: {
    title?: string
    model?: string
    system_prompt?: string
  }): Promise<AiConversation | undefined> => {
    const r = await api.post<{ success?: boolean; data?: AiConversation }>(
      '/ai/conversations',
      params ?? {}
    )
    return getData(r.data as { success?: boolean; data?: AiConversation })
  },

  listConversations: async (params?: {
    page?: number
    limit?: number
    archived?: boolean
  }): Promise<{ data: AiConversation[]; pagination: Pagination }> => {
    const r = await api.get<{
      success?: boolean
      data?: AiConversation[]
      pagination?: Pagination
    }>('/ai/conversations', { params })
    const data = getData(
      r.data as { success?: boolean; data?: AiConversation[] }
    )
    const pagination =
      (r.data as { pagination?: Pagination })?.pagination ?? defaultPagination
    return { data: data ?? [], pagination }
  },

  getConversation: async (
    id: string
  ): Promise<(AiConversation & { messages: AiMessage[] }) | undefined> => {
    const r = await api.get<{
      success?: boolean
      data?: AiConversation & { messages: AiMessage[] }
    }>(`/ai/conversations/${id}`)
    return getData(
      r.data as {
        success?: boolean
        data?: AiConversation & { messages: AiMessage[] }
      }
    )
  },

  updateConversation: async (
    id: string,
    data: {
      title?: string
      is_archived?: boolean
    }
  ): Promise<AiConversation | undefined> => {
    const r = await api.patch<{ success?: boolean; data?: AiConversation }>(
      `/ai/conversations/${id}`,
      data
    )
    return getData(r.data as { success?: boolean; data?: AiConversation })
  },

  deleteConversation: async (id: string): Promise<void> => {
    await api.delete(`/ai/conversations/${id}`)
  },

  // ------------------------------------------
  // Messages (SSE Streaming) — uses fetch(), NOT axios
  // ------------------------------------------

  /**
   * Send a message and stream the AI response via SSE.
   *
   * Returns an AbortController so the caller can cancel the stream.
   *
   * IMPORTANT: This uses fetch() instead of the axios client because
   * axios does not support streaming ReadableStream responses.
   * We must manually include credentials and the CSRF token.
   */
  sendMessage: (
    conversationId: string,
    content: string,
    callbacks: SSECallbacks
  ): AbortController => {
    const controller = new AbortController()
    const baseUrl = import.meta.env.VITE_API_URL || '/api/v1'

    // Fire and forget — the async work happens inside
    ;(async () => {
      try {
        // Get CSRF token (required for POST requests)
        const csrfToken = await csrfService.ensureCsrfToken()

        const response = await fetch(
          `${baseUrl}/ai/conversations/${conversationId}/messages`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
            },
            credentials: 'include',
            signal: controller.signal,
            body: JSON.stringify({ content }),
          }
        )

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null)
          const message =
            errorBody?.error || `Request failed with status ${response.status}`
          callbacks.onError?.(message)
          return
        }

        // Parse the SSE stream
        await parseSSE(response, {
          onEvent: (event, data) => {
            try {
              const parsed = JSON.parse(data)
              switch (event) {
                case 'message_start':
                  callbacks.onMessageStart?.(parsed)
                  break
                case 'content_delta':
                  callbacks.onContentDelta?.(parsed)
                  break
                case 'tool_use':
                  callbacks.onToolUse?.(parsed)
                  break
                case 'tool_result':
                  callbacks.onToolResult?.(parsed)
                  break
                case 'message_end':
                  callbacks.onMessageEnd?.(parsed)
                  break
                case 'error':
                  callbacks.onError?.(parsed.error)
                  break
              }
            } catch {
              // Skip malformed JSON lines
            }
          },
        })
      } catch (err: unknown) {
        if ((err as Error).name === 'AbortError') {
          // User cancelled — not an error
          return
        }
        callbacks.onError?.((err as Error).message || 'Stream failed')
      }
    })()

    return controller
  },

  // ------------------------------------------
  // Insights
  // ------------------------------------------

  generateInsight: async (data: {
    category: InsightCategory
    prompt?: string
    player_id?: number
    game_id?: number
  }): Promise<
    | {
        insight: AiInsight
        tokens: { input: number; output: number; cost_usd: number }
      }
    | undefined
  > => {
    const r = await api.post<{
      success?: boolean
      data?: AiInsight
      tokens?: { input: number; output: number; cost_usd: number }
    }>('/ai/insights/generate', data)
    if (r.data?.success === false) return undefined
    return {
      insight: r.data?.data as AiInsight,
      tokens: r.data?.tokens as {
        input: number
        output: number
        cost_usd: number
      },
    }
  },

  listInsights: async (params?: {
    category?: InsightCategory
    pinned?: boolean
    page?: number
    limit?: number
  }): Promise<{ data: AiInsight[]; pagination: Pagination }> => {
    const r = await api.get<{
      success?: boolean
      data?: AiInsight[]
      pagination?: Pagination
    }>('/ai/insights', { params })
    const data = getData(r.data as { success?: boolean; data?: AiInsight[] })
    const pagination =
      (r.data as { pagination?: Pagination })?.pagination ?? defaultPagination
    return { data: data ?? [], pagination }
  },

  getInsight: async (id: string): Promise<AiInsight | undefined> => {
    const r = await api.get<{ success?: boolean; data?: AiInsight }>(
      `/ai/insights/${id}`
    )
    return getData(r.data as { success?: boolean; data?: AiInsight })
  },

  updateInsight: async (
    id: string,
    data: {
      is_pinned?: boolean
    }
  ): Promise<AiInsight | undefined> => {
    const r = await api.patch<{ success?: boolean; data?: AiInsight }>(
      `/ai/insights/${id}`,
      data
    )
    return getData(r.data as { success?: boolean; data?: AiInsight })
  },

  deleteInsight: async (id: string): Promise<void> => {
    await api.delete(`/ai/insights/${id}`)
  },

  // ------------------------------------------
  // Prompt Templates
  // ------------------------------------------

  getPrompts: async (): Promise<PromptTemplates | undefined> => {
    const r = await api.get<{ success?: boolean; data?: PromptTemplates }>(
      '/ai/prompts'
    )
    return getData(r.data as { success?: boolean; data?: PromptTemplates })
  },

  // ------------------------------------------
  // API Keys (BYOK)
  // ------------------------------------------

  saveApiKey: async (
    apiKey: string,
    provider = 'anthropic'
  ): Promise<ApiKeyStatus | undefined> => {
    const r = await api.post<{ success?: boolean; data?: ApiKeyStatus }>(
      '/ai/api-keys',
      { api_key: apiKey, provider }
    )
    return getData(r.data as { success?: boolean; data?: ApiKeyStatus })
  },

  getApiKeyStatus: async (): Promise<ApiKeyStatus | undefined> => {
    const r = await api.get<{ success?: boolean; data?: ApiKeyStatus }>(
      '/ai/api-keys'
    )
    return getData(r.data as { success?: boolean; data?: ApiKeyStatus })
  },

  removeApiKey: async (): Promise<void> => {
    await api.delete('/ai/api-keys')
  },

  testApiKey: async (apiKey: string): Promise<ApiKeyTestResult | undefined> => {
    const r = await api.post<{ success?: boolean; data?: ApiKeyTestResult }>(
      '/ai/api-keys/test',
      { api_key: apiKey }
    )
    return getData(r.data as { success?: boolean; data?: ApiKeyTestResult })
  },

  // ------------------------------------------
  // Usage
  // ------------------------------------------

  getUsage: async (): Promise<UsageSummary | undefined> => {
    const r = await api.get<{ success?: boolean; data?: UsageSummary }>(
      '/ai/usage'
    )
    return getData(r.data as { success?: boolean; data?: UsageSummary })
  },

  getUsageDetail: async (params?: {
    page?: number
    limit?: number
  }): Promise<{ data: AiUsageLog[]; pagination: Pagination }> => {
    const r = await api.get<{
      success?: boolean
      data?: AiUsageLog[]
      pagination?: Pagination
    }>('/ai/usage/detail', { params })
    const data = getData(r.data as { success?: boolean; data?: AiUsageLog[] })
    const pagination =
      (r.data as { pagination?: Pagination })?.pagination ?? defaultPagination
    return { data: data ?? [], pagination }
  },
}

// ============================================
// SSE Parser (used internally by sendMessage)
// ============================================

/**
 * Parse a Server-Sent Events stream from a fetch Response.
 *
 * SSE format:
 *   event: content_delta
 *   data: {"text":"Hello"}
 *
 *   event: tool_use
 *   data: {"tool":"search_players","status":"calling"}
 *
 * Each event is two lines (event + data) separated by a blank line.
 */
async function parseSSE(
  response: Response,
  handlers: { onEvent: (event: string, data: string) => void }
): Promise<void> {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let currentEvent = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // Split on newlines and process complete lines
    const lines = buffer.split('\n')
    buffer = lines.pop() || '' // Keep the last incomplete line in the buffer

    for (const line of lines) {
      if (line.startsWith('event: ')) {
        currentEvent = line.slice(7).trim()
      } else if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (currentEvent) {
          handlers.onEvent(currentEvent, data)
          currentEvent = ''
        }
      }
      // Blank lines are event separators — no action needed since we
      // dispatch on 'data:' lines immediately after capturing 'event:'.
    }
  }

  // Process any remaining buffer content
  if (buffer.trim()) {
    const remainingLines = buffer.split('\n')
    for (const line of remainingLines) {
      if (line.startsWith('event: ')) {
        currentEvent = line.slice(7).trim()
      } else if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (currentEvent) {
          handlers.onEvent(currentEvent, data)
          currentEvent = ''
        }
      }
    }
  }
}

export default aiApi
