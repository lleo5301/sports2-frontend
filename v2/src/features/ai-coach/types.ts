// ============================================
// Core Entities
// ============================================

export interface AiConversation {
  id: string // UUID
  team_id: number
  user_id: number
  title: string | null
  model: string // e.g. 'claude-sonnet-4-6', 'claude-haiku-4-5'
  system_prompt: string | null
  is_archived: boolean
  total_tokens: number
  message_count: number
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

export interface AiMessage {
  id: string // UUID
  conversation_id: string
  role: 'user' | 'assistant' | 'tool_call' | 'tool_result'
  content: string | null
  tool_name: string | null
  tool_input: Record<string, unknown> | null
  tool_result: Record<string, unknown> | null
  tokens_used: number | null
  created_at: string
}

export interface AiInsight {
  id: string // UUID
  team_id: number
  user_id: number | null
  category: InsightCategory
  title: string
  content: string // Markdown text
  data_snapshot: Record<string, unknown> | null
  prompt_used: string | null
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export type InsightCategory =
  | 'player_performance'
  | 'pitching_analysis'
  | 'recruiting'
  | 'lineup'
  | 'scouting'
  | 'game_recap'
  | 'weekly_digest'

// ============================================
// Prompt Templates
// ============================================

export interface PromptTemplate {
  id: string // e.g. 'player_report', 'lineup_builder'
  label: string
  description: string
  prompt: string // May contain {variable} placeholders
  variables: string[] // e.g. ['player'], [] for no variables
}

export interface PromptTemplates {
  player_performance: PromptTemplate[]
  game_prep: PromptTemplate[]
  recruiting: PromptTemplate[]
  season_analysis: PromptTemplate[]
}

// ============================================
// API Keys
// ============================================

export interface ApiKeyStatus {
  has_key: boolean
  provider?: string // 'anthropic'
  is_active?: boolean
  created_at?: string
}

export interface ApiKeyTestResult {
  valid: boolean
  error?: string
}

// ============================================
// Usage
// ============================================

export interface UsageSummary {
  total_requests: string // Returned as strings from SQL aggregation
  total_tokens: string
  total_cost_usd: string
  month_tokens: string
  month_cost_usd: string
}

export interface AiUsageLog {
  id: string
  model: string // OpenRouter model ID, e.g. 'anthropic/claude-sonnet-4'
  input_tokens: number
  output_tokens: number
  total_tokens: number
  cost_usd: string // Decimal string, e.g. '0.0234'
  key_source: 'platform' | 'byok'
  created_at: string
}

// ============================================
// SSE Event Payloads
// ============================================

export interface SSEMessageStart {
  conversation_id: string
}

export interface SSEContentDelta {
  text: string
}

export interface SSEToolUse {
  tool: string // MCP tool name, e.g. 'search_players'
  status: 'calling'
}

export interface SSEToolResult {
  tool: string
  status: 'complete'
}

export interface SSEMessageEnd {
  tokens: {
    input: number
    output: number
    cost_usd: number
  }
}

export interface SSEError {
  error: string
}

// ============================================
// Pagination (matches backend format)
// ============================================

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

// ============================================
// SSE Callback Handlers
// ============================================

export interface SSECallbacks {
  onMessageStart?: (data: SSEMessageStart) => void
  onContentDelta?: (data: SSEContentDelta) => void
  onToolUse?: (data: SSEToolUse) => void
  onToolResult?: (data: SSEToolResult) => void
  onMessageEnd?: (data: SSEMessageEnd) => void
  onError?: (error: string) => void
}
