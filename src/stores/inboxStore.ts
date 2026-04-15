import { create } from 'zustand'

interface InboxState {
  activeConversationId: string | null
  filter: 'all' | 'bot' | 'human' | 'closed'
  search: string
  setActiveConversation: (id: string | null) => void
  setFilter: (filter: 'all' | 'bot' | 'human' | 'closed') => void
  setSearch: (search: string) => void
}

export const useInboxStore = create<InboxState>((set) => ({
  activeConversationId: null,
  filter: 'all',
  search: '',
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),
}))
