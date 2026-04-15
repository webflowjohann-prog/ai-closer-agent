import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ConversationItem } from './ConversationItem'
import { Skeleton } from '@/components/ui/skeleton'
import type { Conversation } from '@/types/database'
import { useInboxStore } from '@/stores/inboxStore'

interface ConversationListProps {
  conversations: Conversation[]
  loading: boolean
}

export function ConversationList({ conversations, loading }: ConversationListProps) {
  const { activeConversationId, setActiveConversation, filter, setFilter } = useInboxStore()
  const [search, setSearch] = useState('')

  const filtered = conversations.filter((c) => {
    const name = c.contact?.full_name?.toLowerCase() || ''
    const preview = c.last_message_preview?.toLowerCase() || ''
    const matchesSearch = !search || name.includes(search.toLowerCase()) || preview.includes(search.toLowerCase())
    const matchesFilter =
      filter === 'all' ||
      (filter === 'bot' && c.status === 'bot_active') ||
      (filter === 'human' && c.status === 'human_takeover') ||
      (filter === 'closed' && c.status === 'closed')
    return matchesSearch && matchesFilter
  })

  const tabs = [
    { id: 'all', label: 'Tous' },
    { id: 'bot', label: 'Bot' },
    { id: 'human', label: 'Humain' },
    { id: 'closed', label: 'Fermés' },
  ] as const

  return (
    <div className="flex flex-col h-full bg-[var(--surface-primary)] border-r border-[var(--border-default)] w-72 flex-shrink-0">
      {/* Header */}
      <div className="p-3 border-b border-[var(--border-default)]">
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>

        <div className="flex gap-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 text-xs py-1 px-2 rounded-md transition-colors ${
                filter === tab.id
                  ? 'bg-brand-50 text-brand-600 font-medium'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-3 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-2">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-center px-4">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Aucune conversation</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                {search ? 'Essayez un autre terme' : 'Les messages arriveront ici'}
              </p>
            </div>
          </div>
        ) : (
          filtered.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={activeConversationId === conv.id}
              onClick={() => setActiveConversation(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
