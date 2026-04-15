import { useState } from 'react'
import { motion } from 'framer-motion'
import { MoreHorizontal, MessageSquare, Trash2, Tag, Bot, User as UserIcon } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { ChannelBadge } from '@/components/inbox/ChannelBadge'
import { formatRelativeDate, getInitials } from '@/lib/utils'
import type { Contact } from '@/types/database'

interface ContactsTableProps {
  contacts: Contact[]
  loading: boolean
  onDelete: (id: string) => void
  onTagEdit: (contact: Contact) => void
}

const statusVariant: Record<string, string> = {
  new: 'new',
  qualified: 'qualified',
  meeting_booked: 'meeting',
  proposal: 'proposal',
  closed_won: 'won',
  closed_lost: 'lost',
  unresponsive: 'secondary',
}

const statusLabel: Record<string, string> = {
  new: 'Nouveau',
  qualified: 'Qualifié',
  meeting_booked: 'RDV',
  proposal: 'Proposition',
  closed_won: 'Gagné',
  closed_lost: 'Perdu',
  unresponsive: 'Inactif',
}

export function ContactsTable({ contacts, loading, onDelete, onTagEdit }: ContactsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-2.5 w-28" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-center">
        <div>
          <UserIcon className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
          <p className="text-sm font-medium text-[var(--text-secondary)]">Aucun contact</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Les contacts apparaîtront ici</p>
        </div>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contact</TableHead>
          <TableHead>Canal</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Dernière activité</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact, i) => {
          const name = contact.full_name?.trim() || contact.phone || contact.email || 'Inconnu'
          return (
            <motion.tr
              key={contact.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="border-b border-[var(--border-default)] hover:bg-[var(--surface-secondary)] transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{name}</p>
                    {contact.email && (
                      <p className="text-xs text-[var(--text-tertiary)] truncate max-w-[160px]">{contact.email}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {contact.channel_type ? (
                  <ChannelBadge type={contact.channel_type} />
                ) : (
                  <span className="text-xs text-[var(--text-tertiary)]">—</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[contact.status] as any}>
                  {statusLabel[contact.status]}
                </Badge>
              </TableCell>
              <TableCell>
                {contact.score > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[var(--color-gray-200)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${contact.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--text-secondary)] font-mono">{contact.score}</span>
                  </div>
                ) : (
                  <span className="text-xs text-[var(--text-tertiary)]">—</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[120px]">
                  {contact.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-[var(--surface-tertiary)] text-[var(--text-secondary)] rounded-full">
                      {tag}
                    </span>
                  ))}
                  {(contact.tags?.length || 0) > 2 && (
                    <span className="text-[10px] text-[var(--text-tertiary)]">+{contact.tags.length - 2}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {contact.last_active_at ? formatRelativeDate(contact.last_active_at) : '—'}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <MessageSquare className="w-4 h-4" />
                      Voir conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onTagEdit(contact)}>
                      <Tag className="w-4 h-4" />
                      Gérer les tags
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(contact.id)}
                      className="text-danger focus:text-danger focus:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          )
        })}
      </TableBody>
    </Table>
  )
}
