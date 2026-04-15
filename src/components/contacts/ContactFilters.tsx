import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ContactStatus } from '@/types/database'

interface ContactFiltersProps {
  search: string
  onSearchChange: (v: string) => void
  status: ContactStatus | 'all'
  onStatusChange: (v: ContactStatus | 'all') => void
}

const statuses: Array<{ value: ContactStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'new', label: 'Nouveau' },
  { value: 'qualified', label: 'Qualifié' },
  { value: 'meeting_booked', label: 'RDV pris' },
  { value: 'proposal', label: 'Proposition' },
  { value: 'closed_won', label: 'Gagné' },
  { value: 'closed_lost', label: 'Perdu' },
  { value: 'unresponsive', label: 'Sans réponse' },
]

export function ContactFilters({ search, onSearchChange, status, onStatusChange }: ContactFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
        <Input
          placeholder="Rechercher un contact..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-9"
        />
      </div>
      <div className="flex items-center gap-1.5">
        <Filter className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
        <Select value={status} onValueChange={onStatusChange as (v: string) => void}>
          <SelectTrigger className="w-44 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
