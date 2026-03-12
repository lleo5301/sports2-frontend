import { create } from 'zustand'
import type { AiConversation, PromptTemplates } from '@/features/ai-coach/types'

interface AiState {
  // State
  conversations: AiConversation[]
  activeConversationId: string | null
  prompts: PromptTemplates | null
  sidebarOpen: boolean

  // Actions
  setConversations: (convos: AiConversation[]) => void
  setActiveConversation: (id: string | null) => void
  addConversation: (convo: AiConversation) => void
  updateConversation: (id: string, updates: Partial<AiConversation>) => void
  removeConversation: (id: string) => void
  setPrompts: (prompts: PromptTemplates) => void
  setSidebarOpen: (open: boolean) => void
}

export const useAiStore = create<AiState>()((set) => ({
  conversations: [],
  activeConversationId: null,
  prompts: null,
  sidebarOpen: false,

  setConversations: (conversations) => set({ conversations }),

  setActiveConversation: (id) => set({ activeConversationId: id }),

  addConversation: (convo) =>
    set((state) => ({
      conversations: [convo, ...state.conversations],
    })),

  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  removeConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      activeConversationId:
        state.activeConversationId === id ? null : state.activeConversationId,
    })),

  setPrompts: (prompts) => set({ prompts }),

  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}))
