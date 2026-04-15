import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Globe, Image as ImageIcon, Type, FileText, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { ColorPicker } from './ColorPicker'
import { LogoUploader } from './LogoUploader'
import { BrandPreview } from './BrandPreview'

const FONT_OPTIONS = [
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Satoshi', label: 'Satoshi' },
  { value: 'General Sans', label: 'General Sans' },
]

interface SectionProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center text-brand-500">
          {icon}
        </div>
        <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
      </div>
      {children}
    </div>
  )
}

export function WhiteLabelSettings() {
  const { organization, setOrganization } = useOrgStore()
  const [saving, setSaving] = useState(false)

  const [brandName, setBrandName] = useState(organization?.brand_name || '')
  const [brandColor, setBrandColor] = useState(organization?.brand_color || '#5c7cfa')
  const [customDomain, setCustomDomain] = useState(organization?.custom_domain || '')
  const [logoUrl, setLogoUrl] = useState(organization?.logo_url || '')
  const [faviconUrl, setFaviconUrl] = useState<string | undefined>(undefined)
  const [loginBgUrl, setLoginBgUrl] = useState<string | undefined>(undefined)
  const [fontFamily, setFontFamily] = useState(organization?.font_family || 'Plus Jakarta Sans')
  const [seoTitle, setSeoTitle] = useState(organization?.seo_title || '')
  const [seoDescription, setSeoDescription] = useState(organization?.seo_description || '')
  const [termsUrl, setTermsUrl] = useState(organization?.terms_url || '')
  const [privacyUrl, setPrivacyUrl] = useState(organization?.privacy_url || '')

  const handleSave = async () => {
    if (!organization) return
    setSaving(true)
    const { error } = await supabase
      .from('organizations')
      .update({
        brand_name: brandName,
        brand_color: brandColor,
        custom_domain: customDomain || null,
        font_family: fontFamily,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        terms_url: termsUrl || null,
        privacy_url: privacyUrl || null,
        ...(logoUrl && { logo_url: logoUrl }),
        ...(faviconUrl && { favicon_url: faviconUrl }),
        ...(loginBgUrl && { login_bg_url: loginBgUrl }),
      })
      .eq('id', organization.id)

    setSaving(false)
    if (error) {
      toast.error('Erreur de sauvegarde', { description: error.message })
    } else {
      if (organization) {
        setOrganization({
          ...organization,
          brand_name: brandName,
          brand_color: brandColor,
          custom_domain: customDomain || undefined,
          font_family: fontFamily,
          seo_title: seoTitle || undefined,
          seo_description: seoDescription || undefined,
          terms_url: termsUrl || undefined,
          privacy_url: privacyUrl || undefined,
          ...(logoUrl && { logo_url: logoUrl }),
          ...(faviconUrl && { favicon_url: faviconUrl }),
          ...(loginBgUrl && { login_bg_url: loginBgUrl }),
        })
      }
      toast.success('White-label mis à jour', {
        description: 'Vos modifications seront visibles au prochain déploiement.',
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Agency plan banner */}
      <div className="p-4 bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-100 rounded-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-700">White-Label — Plan Agency</p>
            <p className="text-xs text-brand-600 mt-0.5">
              Personnalisez entièrement l'interface avec votre marque. Logo, couleurs, domaine, SEO — vos clients ne voient jamais IKONIK.
            </p>
          </div>
          <span className="px-2 py-1 bg-brand-100 text-brand-700 text-[10px] font-bold rounded-full whitespace-nowrap">
            Actif
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: form */}
        <div className="space-y-8">
          {/* Brand section */}
          <Section icon={<ImageIcon className="w-3.5 h-3.5" />} title="Marque">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Nom de marque</Label>
                <Input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Votre Agence"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <LogoUploader
                  label="Logo principal"
                  value={logoUrl}
                  onChange={(url) => setLogoUrl(url || '')}
                />
                <LogoUploader
                  label="Favicon"
                  value={faviconUrl}
                  onChange={setFaviconUrl}
                  square
                />
              </div>

              <ColorPicker
                label="Couleur principale"
                value={brandColor}
                onChange={setBrandColor}
              />

              <div className="space-y-1.5">
                <Label className="text-xs">Police d'interface</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        <span style={{ fontFamily: f.value }}>{f.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Section>

          <Separator />

          {/* Login page */}
          <Section icon={<Globe className="w-3.5 h-3.5" />} title="Page de connexion">
            <LogoUploader
              label="Image de fond"
              value={loginBgUrl}
              onChange={setLoginBgUrl}
              accept="image/jpeg,image/png,image/webp"
              maxKB={2000}
            />
            <p className="text-[10px] text-[var(--text-tertiary)]">
              JPG, PNG, WebP · max 2 MB · Format paysage recommandé
            </p>
          </Section>

          <Separator />

          {/* Domain */}
          <Section icon={<Globe className="w-3.5 h-3.5" />} title="Domaine personnalisé">
            <div className="space-y-1.5">
              <Label className="text-xs">Sous-domaine ou domaine custom</Label>
              <Input
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="app.votreagence.com"
              />
              <p className="text-[10px] text-[var(--text-tertiary)]">
                Configurez un CNAME vers <span className="font-mono">app.ikonik-ac.com</span> dans votre DNS
              </p>
            </div>
          </Section>

          <Separator />

          {/* SEO */}
          <Section icon={<FileText className="w-3.5 h-3.5" />} title="SEO & Métadonnées">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Titre de l'onglet navigateur</Label>
                <Input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Mon Agence — Agent IA"
                  maxLength={60}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description meta</Label>
                <Textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Plateforme d'agent IA conversationnel..."
                  rows={3}
                  maxLength={160}
                />
                <p className="text-[10px] text-[var(--text-tertiary)] text-right">
                  {seoDescription.length}/160
                </p>
              </div>
            </div>
          </Section>

          <Separator />

          {/* Legal */}
          <Section icon={<Shield className="w-3.5 h-3.5" />} title="Liens légaux">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">URL Conditions générales d'utilisation</Label>
                <Input
                  value={termsUrl}
                  onChange={(e) => setTermsUrl(e.target.value)}
                  placeholder="https://votreagence.com/cgv"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">URL Politique de confidentialité</Label>
                <Input
                  value={privacyUrl}
                  onChange={(e) => setPrivacyUrl(e.target.value)}
                  placeholder="https://votreagence.com/confidentialite"
                />
              </div>
            </div>
          </Section>

          {/* Save */}
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button type="button" onClick={handleSave} disabled={saving} className="w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
            </Button>
          </motion.div>
        </div>

        {/* Right: live preview */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <BrandPreview
            brandName={brandName}
            brandColor={brandColor}
            logoUrl={logoUrl}
            loginBgUrl={loginBgUrl}
            fontFamily={fontFamily}
          />

          {/* Font preview */}
          <div
            className="p-4 border border-[var(--border-default)] rounded-xl bg-[var(--surface-secondary)] space-y-1"
            style={{ fontFamily }}
          >
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Aperçu typographie</p>
            <p className="text-base font-semibold text-[var(--text-primary)]">Bienvenue sur votre espace</p>
            <p className="text-sm text-[var(--text-secondary)]">Gérez vos agents, contacts et conversations depuis un seul endroit.</p>
            <p className="text-xs text-[var(--text-tertiary)]">Propulsé par {brandName || 'votre marque'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
