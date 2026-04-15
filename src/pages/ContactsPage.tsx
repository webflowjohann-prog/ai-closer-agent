import { useState } from 'react'
import { UserPlus, Download } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { ContactFilters } from '@/components/contacts/ContactFilters'
import { ContactsTable } from '@/components/contacts/ContactsTable'
import { Button } from '@/components/ui/button'
import { useContacts } from '@/hooks/useContacts'
import type { ContactStatus } from '@/types/database'
import { toast } from 'sonner'

export default function ContactsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ContactStatus | 'all'>('all')
  const [page, setPage] = useState(1)

  const { contacts, total, loading, deleteContact } = useContacts({ search, status, page })

  const handleDelete = async (id: string) => {
    const ok = await deleteContact(id)
    if (ok) toast.success('Contact supprimé')
    else toast.error('Erreur lors de la suppression')
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader
        title="Contacts"
        description={`${total.toLocaleString('fr-FR')} contacts`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-3.5 h-3.5" />
              Exporter
            </Button>
            <Button size="sm">
              <UserPlus className="w-3.5 h-3.5" />
              Importer CSV
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-3 px-6 py-3 border-b border-[var(--border-default)] bg-[var(--surface-primary)]">
        <ContactFilters
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          status={status}
          onStatusChange={(v) => { setStatus(v); setPage(1) }}
        />
      </div>

      <div className="flex-1 overflow-y-auto bg-[var(--surface-primary)]">
        <ContactsTable
          contacts={contacts}
          loading={loading}
          onDelete={handleDelete}
          onTagEdit={() => {}}
        />
      </div>

      {total > 25 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--border-default)] bg-[var(--surface-primary)]">
          <p className="text-xs text-[var(--text-tertiary)]">
            {Math.min(page * 25, total)} / {total} contacts
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Précédent
            </Button>
            <Button variant="outline" size="sm" disabled={page * 25 >= total} onClick={() => setPage(p => p + 1)}>
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
