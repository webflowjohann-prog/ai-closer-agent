import { useState } from 'react'
import { Search, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useContacts } from '@/hooks/useContacts'
import type { Contact } from '@/types/database'
import { cn } from '@/lib/utils'

interface CampaignContactsProps {
  selected: string[]
  onChange: (ids: string[]) => void
}

export function CampaignContacts({ selected, onChange }: CampaignContactsProps) {
  const { contacts, loading } = useContacts()
  const [search, setSearch] = useState('')

  const filtered = contacts.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.full_name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    )
  })

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id))
    } else {
      onChange([...selected, id])
    }
  }

  const toggleAll = () => {
    if (selected.length === filtered.length) {
      onChange([])
    } else {
      onChange(filtered.map((c) => c.id))
    }
  }

  const initials = (c: Contact) =>
    c.full_name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??'

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un contact..."
            className="pl-9 h-8 text-sm"
          />
        </div>
        <button
          onClick={toggleAll}
          className="text-xs text-brand-500 hover:text-brand-700 font-medium whitespace-nowrap"
        >
          {selected.length === filtered.length ? 'Désélectionner tout' : 'Tout sélectionner'}
        </button>
      </div>

      <p className="text-xs text-[var(--text-tertiary)]">
        <span className="font-semibold text-[var(--text-primary)]">{selected.length}</span> contact{selected.length > 1 ? 's' : ''} sélectionné{selected.length > 1 ? 's' : ''}
      </p>

      <div className="max-h-64 overflow-y-auto space-y-1 border border-[var(--border-default)] rounded-xl p-2">
        {loading ? (
          <div className="flex items-center justify-center h-16">
            <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-[var(--text-tertiary)] text-center py-6">Aucun contact trouvé</p>
        ) : (
          filtered.map((c) => {
            const isSelected = selected.includes(c.id)
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-left',
                  isSelected ? 'bg-brand-50' : 'hover:bg-[var(--surface-secondary)]'
                )}
              >
                <div className={cn(
                  'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                  isSelected ? 'bg-brand-500 border-brand-500' : 'border-[var(--color-gray-300)]'
                )}>
                  {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="text-[10px] bg-brand-100 text-brand-700">{initials(c)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text-primary)] truncate">{c.full_name || c.email}</p>
                  <p className="text-[10px] text-[var(--text-tertiary)] truncate">{c.phone || c.email}</p>
                </div>
                {c.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[9px] px-1 py-0">{tag}</Badge>
                ))}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
