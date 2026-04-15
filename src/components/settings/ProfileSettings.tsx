import { useState } from 'react'
import { Loader2, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useOrgStore } from '@/stores/orgStore'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function ProfileSettings() {
  const { activeSubAccount, setActiveSubAccount } = useOrgStore()
  const [name, setName] = useState(activeSubAccount?.name || '')
  const [website, setWebsite] = useState(activeSubAccount?.website_url || '')
  const [phone, setPhone] = useState(activeSubAccount?.phone || '')
  const [email, setEmail] = useState(activeSubAccount?.email || '')
  const [address, setAddress] = useState(activeSubAccount?.address || '')
  const [description, setDescription] = useState(activeSubAccount?.description || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!activeSubAccount) return
    setSaving(true)

    const { data, error } = await supabase
      .from('sub_accounts')
      .update({ name, website_url: website, phone, email, address, description })
      .eq('id', activeSubAccount.id)
      .select()
      .single()

    if (error) {
      toast.error('Erreur de sauvegarde')
    } else {
      setActiveSubAccount({ ...activeSubAccount, ...data })
      toast.success('Profil mis à jour')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Nom de l'entreprise</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Site web</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} className="pl-8" placeholder="https://" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Téléphone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+33 6 00 00 00 00" />
        </div>
        <div className="space-y-1.5">
          <Label>Email contact</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Adresse</Label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 rue Example, 75001 Paris" />
      </div>

      <div className="space-y-1.5">
        <Label>Description de l'activité</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez votre activité, vos services, vos points forts..."
          rows={4}
        />
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {saving ? 'Sauvegarde...' : 'Enregistrer'}
      </Button>
    </div>
  )
}
