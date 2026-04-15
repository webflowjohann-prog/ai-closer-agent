import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Plus, Trash2, Loader2, ToggleLeft, ToggleRight, Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import type { RetargetingPixel, RetargetingPlatform } from '@/types/database'

const PLATFORMS: { value: RetargetingPlatform; label: string; color: string }[] = [
  { value: 'facebook', label: 'Facebook / Meta', color: '#1877f2' },
  { value: 'google_ads', label: 'Google Ads', color: '#4285f4' },
  { value: 'tiktok', label: 'TikTok', color: '#000000' },
  { value: 'linkedin', label: 'LinkedIn', color: '#0a66c2' },
  { value: 'twitter', label: 'Twitter / X', color: '#000000' },
  { value: 'pinterest', label: 'Pinterest', color: '#e60023' },
  { value: 'snapchat', label: 'Snapchat', color: '#fffc00' },
  { value: 'custom', label: 'Custom', color: '#6366f1' },
]

interface PixelForm {
  platform: RetargetingPlatform
  pixel_id: string
  label: string
}

const emptyForm: PixelForm = {
  platform: 'facebook',
  pixel_id: '',
  label: '',
}

export function PixelSettings() {
  const { activeSubAccount } = useOrgStore()
  const [pixels, setPixels] = useState<RetargetingPixel[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<PixelForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!activeSubAccount) return
    fetchPixels()
  }, [activeSubAccount?.id])

  async function fetchPixels() {
    if (!activeSubAccount) return
    setLoading(true)
    const { data, error } = await supabase
      .from('retargeting_pixels')
      .select('*')
      .eq('sub_account_id', activeSubAccount.id)
      .order('created_at', { ascending: true })

    if (error) {
      toast.error('Erreur de chargement', { description: error.message })
    } else {
      setPixels((data ?? []) as RetargetingPixel[])
    }
    setLoading(false)
  }

  async function handleAddPixel() {
    if (!activeSubAccount || !form.pixel_id.trim()) {
      toast.error('Pixel ID requis')
      return
    }
    setSaving(true)
    const { data, error } = await supabase
      .from('retargeting_pixels')
      .insert({
        sub_account_id: activeSubAccount.id,
        platform: form.platform,
        pixel_id: form.pixel_id.trim(),
        label: form.label.trim() || null,
        active: true,
      })
      .select()
      .single()

    if (error) {
      toast.error('Erreur', { description: error.message })
    } else {
      setPixels((prev) => [...prev, data as RetargetingPixel])
      setForm(emptyForm)
      setShowForm(false)
      toast.success('Pixel ajouté', { description: `${getPlatformLabel(form.platform)} — ${form.pixel_id}` })
    }
    setSaving(false)
  }

  async function handleToggle(pixel: RetargetingPixel) {
    setTogglingId(pixel.id)
    const { error } = await supabase
      .from('retargeting_pixels')
      .update({ active: !pixel.active })
      .eq('id', pixel.id)

    if (error) {
      toast.error('Erreur', { description: error.message })
    } else {
      setPixels((prev) =>
        prev.map((p) => (p.id === pixel.id ? { ...p, active: !p.active } : p))
      )
    }
    setTogglingId(null)
  }

  async function handleDelete(pixel: RetargetingPixel) {
    setDeletingId(pixel.id)
    const { error } = await supabase
      .from('retargeting_pixels')
      .delete()
      .eq('id', pixel.id)

    if (error) {
      toast.error('Erreur', { description: error.message })
    } else {
      setPixels((prev) => prev.filter((p) => p.id !== pixel.id))
      toast.success('Pixel supprimé')
    }
    setDeletingId(null)
  }

  function getPlatformLabel(val: RetargetingPlatform) {
    return PLATFORMS.find((p) => p.value === val)?.label ?? val
  }

  function getPlatformColor(val: RetargetingPlatform) {
    return PLATFORMS.find((p) => p.value === val)?.color ?? '#6366f1'
  }

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-brand-50 border border-brand-100 rounded-xl">
        <Info className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-brand-700">Pixels de retargeting</p>
          <p className="text-xs text-brand-600 mt-0.5">
            Vos pixels actifs sont automatiquement injectés dans chaque lien envoyé par votre agent IA.
            Les prospects qui cliquent seront ajoutés à vos audiences publicitaires.
          </p>
        </div>
      </div>

      {/* Header + Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Pixels configurés</h3>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            {pixels.filter((p) => p.active).length} actif{pixels.filter((p) => p.active).length !== 1 ? 's' : ''} sur {pixels.length}
          </p>
        </div>
        <Button size="sm" onClick={() => setShowForm((v) => !v)} variant={showForm ? 'outline' : 'default'}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Ajouter un pixel
        </Button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="p-4 border border-[var(--border-default)] rounded-xl bg-[var(--surface-secondary)] space-y-3">
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Nouveau pixel
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Plateforme</Label>
                  <Select
                    value={form.platform}
                    onValueChange={(v) => setForm((f) => ({ ...f, platform: v as RetargetingPlatform }))}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((p) => (
                        <SelectItem key={p.value} value={p.value} className="text-xs">
                          <span className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: p.color }}
                            />
                            {p.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Pixel ID</Label>
                  <Input
                    className="h-8 text-xs font-mono"
                    placeholder="123456789012345"
                    value={form.pixel_id}
                    onChange={(e) => setForm((f) => ({ ...f, pixel_id: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Label (optionnel)</Label>
                <Input
                  className="h-8 text-xs"
                  placeholder="Ex : Retargeting prospects chauds"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button size="sm" onClick={handleAddPixel} disabled={saving || !form.pixel_id.trim()}>
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                  Ajouter
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setShowForm(false); setForm(emptyForm) }}>
                  Annuler
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pixels list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 bg-[var(--surface-secondary)] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : pixels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Target className="w-8 h-8 text-[var(--text-tertiary)] mb-3" />
          <p className="text-sm text-[var(--text-secondary)]">Aucun pixel configuré</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            Ajoutez vos pixels pour tracker les clics de votre agent IA
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {pixels.map((pixel, idx) => (
              <motion.div
                key={pixel.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.25 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                  pixel.active
                    ? 'border-[var(--border-default)] bg-[var(--surface-primary)]'
                    : 'border-[var(--border-default)] bg-[var(--surface-secondary)] opacity-60'
                }`}
              >
                {/* Platform dot */}
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getPlatformColor(pixel.platform) }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {getPlatformLabel(pixel.platform)}
                    </span>
                    {pixel.label && (
                      <span className="text-[10px] text-[var(--text-tertiary)] truncate">
                        {pixel.label}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-[var(--text-tertiary)] truncate mt-0.5">
                    {pixel.pixel_id}
                  </p>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => handleToggle(pixel)}
                  disabled={togglingId === pixel.id}
                  className="flex-shrink-0 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                  title={pixel.active ? 'Désactiver' : 'Activer'}
                >
                  {togglingId === pixel.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : pixel.active ? (
                    <ToggleRight className="w-5 h-5 text-brand-500" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(pixel)}
                  disabled={deletingId === pixel.id}
                  className="flex-shrink-0 text-[var(--text-tertiary)] hover:text-red-500 transition-colors"
                  title="Supprimer"
                >
                  {deletingId === pixel.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
