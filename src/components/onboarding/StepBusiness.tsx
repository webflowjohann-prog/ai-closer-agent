import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, Loader2, Sparkles, CheckCircle2, AlertCircle, User,
  Instagram, Linkedin, Building2, ChevronRight, Info,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { VerticalSelector } from './VerticalSelector'
import { analyzeSiteStructure } from '@/lib/ai/site-analyzer'
import { scrapeWebsite } from '@/lib/scraper'
import { extractPersonalContent } from '@/lib/ai/content-filter'
import { generateCustomPlaybook } from '@/lib/ai/auto-playbook'
import type { VerticalType } from '@/types/database'
import type { SiteType } from '@/lib/ai/site-analyzer'

export interface BusinessData {
  url: string
  vertical: VerticalType | null
  businessName: string
  personName: string
  profileUrl: string
  instagramUrl: string
  socialUrl: string
  siteMode: 'full' | 'scoped'
  generatedInstructions?: string
  manualDescription?: string
}

interface StepBusinessProps {
  data: BusinessData
  onChange: (data: BusinessData) => void
  onNext: () => void
}

type Scenario = 'initial' | 'analyzing' | 'personal' | 'network' | 'unknown' | 'manual_fallback'

const LOADING_MESSAGES_PERSONAL = [
  'Analyse de votre site...',
  'Identification de vos services...',
  'Extraction de votre contenu...',
  'Génération de votre agent...',
]

const LOADING_MESSAGES_NETWORK = [
  'Analyse du réseau...',
  'Isolation de votre profil...',
  'Extraction de vos informations...',
  'Filtrage du contenu personnel...',
  'Personnalisation de votre agent...',
]

function ProgressMessage({ messages, interval = 900 }: { messages: string[]; interval?: number }) {
  const [idx, setIdx] = useState(0)
  useState(() => {
    const t = setInterval(() => setIdx((i) => Math.min(i + 1, messages.length - 1)), interval)
    return () => clearInterval(t)
  })
  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={idx}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className="text-sm text-[var(--text-secondary)]"
      >
        {messages[idx]}
      </motion.p>
    </AnimatePresence>
  )
}

export function StepBusiness({ data, onChange, onNext }: StepBusinessProps) {
  const [scenario, setScenario] = useState<Scenario>('initial')
  const [detectedSiteType, setDetectedSiteType] = useState<SiteType>('generic')
  const [detectedNetwork, setDetectedNetwork] = useState<string | undefined>()
  const [detectedOwner, setDetectedOwner] = useState<string | undefined>()
  const [loadingMessages, setLoadingMessages] = useState(LOADING_MESSAGES_PERSONAL)
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [scrapingProfile, setScrapingProfile] = useState(false)

  const handleAnalyze = async () => {
    if (!data.url) return
    setError(null)
    setScenario('analyzing')
    setLoadingMessages(LOADING_MESSAGES_PERSONAL)

    try {
      // Step 1: Analyze site structure
      const analysis = await analyzeSiteStructure(data.url)
      setDetectedSiteType(analysis.siteType)
      setDetectedNetwork(analysis.networkName)
      setDetectedOwner(analysis.ownerName)
      setConfidence(analysis.confidence)

      const isPersonal = analysis.siteType === 'personal' && analysis.confidence >= 75
      const isNetwork =
        analysis.siteType === 'network' ||
        analysis.siteType === 'multi_profile' ||
        analysis.siteType === 'marketplace'
      const isUnknown = analysis.confidence < 50

      if (isPersonal) {
        // Scenario A: personal site — auto-scrape full
        setLoadingMessages(LOADING_MESSAGES_PERSONAL)
        const scrapeResult = await scrapeWebsite(data.url, { mode: 'full' })

        if (scrapeResult.success) {
          const playbook = await generateCustomPlaybook({
            scrapedContent: scrapeResult.content,
            siteType: analysis.siteType,
            vertical: data.vertical || 'autre',
            companyName: data.businessName,
            personName: analysis.ownerName,
          })
          onChange({
            ...data,
            personName: analysis.ownerName || data.personName,
            siteMode: 'full',
            generatedInstructions: playbook.systemPrompt,
          })
        }

        setScenario('personal')
      } else if (isNetwork) {
        // Scenario B: network/multi-profile — ask for personal page
        setLoadingMessages(LOADING_MESSAGES_NETWORK)
        setScenario('network')
      } else if (isUnknown) {
        // Scenario C: unknown — show choice
        setScenario('unknown')
      } else {
        // Borderline — treat as personal but with lower confidence
        setScenario('personal')
        const scrapeResult = await scrapeWebsite(data.url, { mode: 'full' })
        if (scrapeResult.success) {
          const playbook = await generateCustomPlaybook({
            scrapedContent: scrapeResult.content,
            siteType: analysis.siteType,
            vertical: data.vertical || 'autre',
            companyName: data.businessName,
          })
          onChange({ ...data, siteMode: 'full', generatedInstructions: playbook.systemPrompt })
        }
        setScenario('personal')
      }
    } catch {
      setScenario('manual_fallback')
      setError('Impossible d\'analyser votre site automatiquement.')
    }
  }

  const handleScrapeProfile = async () => {
    if (!data.profileUrl && !data.url) return
    setScrapingProfile(true)
    setLoadingMessages(LOADING_MESSAGES_NETWORK)

    try {
      const targetUrl = data.profileUrl || data.url
      const scrapeResult = await scrapeWebsite(targetUrl, {
        mode: 'scoped',
        personName: data.personName,
      })

      let finalContent = scrapeResult.content

      // Filter personal content if we have a name
      if (data.personName && scrapeResult.success) {
        const filtered = extractPersonalContent(
          scrapeResult.content,
          data.personName,
          detectedNetwork
        )
        finalContent = filtered.personalContent || scrapeResult.content
      }

      // Also scrape social profiles if provided
      const socialContents: string[] = [finalContent]
      if (data.instagramUrl) {
        const igResult = await scrapeWebsite(data.instagramUrl, {
          mode: 'scoped',
          personName: data.personName,
        })
        if (igResult.success) socialContents.push(igResult.content)
      }
      if (data.socialUrl) {
        const socResult = await scrapeWebsite(data.socialUrl, {
          mode: 'scoped',
          personName: data.personName,
        })
        if (socResult.success) socialContents.push(socResult.content)
      }

      const combinedContent = socialContents.filter(Boolean).join('\n\n')

      const playbook = await generateCustomPlaybook({
        scrapedContent: combinedContent,
        siteType: detectedSiteType,
        vertical: data.vertical || 'autre',
        companyName: data.businessName,
        personName: data.personName,
        networkName: detectedNetwork,
      })

      onChange({
        ...data,
        siteMode: 'scoped',
        generatedInstructions: playbook.systemPrompt,
      })
    } catch {
      setScenario('manual_fallback')
      setError('Impossible d\'analyser votre profil. Vous pouvez décrire votre activité manuellement.')
    } finally {
      setScrapingProfile(false)
    }
  }

  const handleChoicePersonal = () => {
    onChange({ ...data, siteMode: 'full' })
    setDetectedSiteType('personal')
    setScenario('personal')
    handleAnalyzePersonal()
  }

  const handleChoiceNetwork = () => {
    setDetectedSiteType('network')
    setScenario('network')
  }

  const handleAnalyzePersonal = async () => {
    setScenario('analyzing')
    setLoadingMessages(LOADING_MESSAGES_PERSONAL)
    try {
      const scrapeResult = await scrapeWebsite(data.url, { mode: 'full' })
      if (scrapeResult.success) {
        const playbook = await generateCustomPlaybook({
          scrapedContent: scrapeResult.content,
          siteType: 'personal',
          vertical: data.vertical || 'autre',
          companyName: data.businessName,
        })
        onChange({ ...data, siteMode: 'full', generatedInstructions: playbook.systemPrompt })
      }
      setScenario('personal')
    } catch {
      setScenario('personal')
    }
  }

  const canContinue =
    data.url &&
    data.vertical &&
    data.businessName &&
    (scenario === 'personal' || scenario === 'network' || scenario === 'manual_fallback' || scenario === 'initial')

  const canScrapeProfile = data.personName && (data.profileUrl || data.url)

  return (
    <div className="space-y-6">
      {/* Business name */}
      <div className="space-y-1.5">
        <Label htmlFor="businessName">Nom de votre entreprise</Label>
        <Input
          id="businessName"
          placeholder="Maison Berlioz Immobilier"
          value={data.businessName}
          onChange={(e) => onChange({ ...data, businessName: e.target.value })}
        />
      </div>

      {/* URL + analyze button */}
      <div className="space-y-1.5">
        <Label htmlFor="url">URL de votre site web</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <Input
              id="url"
              placeholder="https://monentreprise.fr"
              value={data.url}
              onChange={(e) => {
                onChange({ ...data, url: e.target.value })
                setScenario('initial')
              }}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleAnalyze}
            disabled={!data.url || scenario === 'analyzing'}
            className="shrink-0 gap-1.5"
          >
            {scenario === 'analyzing' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {scenario === 'analyzing' ? 'Analyse...' : 'Analyser'}
          </Button>
        </div>
      </div>

      {/* Dynamic scenario panel */}
      <AnimatePresence mode="wait">

        {/* Analyzing */}
        {scenario === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl flex items-center gap-3"
          >
            <Loader2 className="w-5 h-5 text-brand-500 animate-spin flex-shrink-0" />
            <ProgressMessage messages={loadingMessages} />
          </motion.div>
        )}

        {/* Scenario A: Personal site confirmed */}
        {scenario === 'personal' && (
          <motion.div
            key="personal"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-2"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-sm font-medium text-green-700">
                Site personnel détecté — {detectedOwner || data.businessName}
              </p>
            </div>
            {data.generatedInstructions && (
              <p className="text-xs text-green-600">
                ✓ Agent personnalisé généré depuis le contenu de votre site
              </p>
            )}
            {confidence > 0 && (
              <p className="text-xs text-green-600/70">Confiance : {confidence}%</p>
            )}
          </motion.div>
        )}

        {/* Scenario B: Network / multi-profile */}
        {scenario === 'network' && (
          <motion.div
            key="network"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    {detectedNetwork
                      ? `Réseau ${detectedNetwork} détecté`
                      : 'Site multi-profil détecté'}
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    Ce site regroupe plusieurs professionnels. Pour que votre agent se base uniquement
                    sur <strong>vos</strong> informations :
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Votre nom complet *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                  <Input
                    placeholder="Marie Dupont"
                    value={data.personName}
                    onChange={(e) => onChange({ ...data, personName: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Lien de votre page personnelle *</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                  <Input
                    placeholder="https://reseau.com/conseillers/marie-dupont"
                    value={data.profileUrl}
                    onChange={(e) => onChange({ ...data, profileUrl: e.target.value })}
                    className="pl-9"
                  />
                </div>
                <p className="text-[10px] text-[var(--text-tertiary)]">
                  La page avec votre nom, votre bio et vos réalisations
                </p>
              </div>

              <Button
                onClick={handleScrapeProfile}
                disabled={!canScrapeProfile || scrapingProfile}
                className="w-full gap-1.5"
                size="sm"
              >
                {scrapingProfile
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Sparkles className="w-3.5 h-3.5" />
                }
                {scrapingProfile ? <ProgressMessage messages={LOADING_MESSAGES_NETWORK} /> : 'Extraire mes informations'}
                {!scrapingProfile && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Button>

              {data.generatedInstructions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <p className="text-xs text-green-700 font-medium">
                    Agent personnalisé généré depuis votre profil
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Scenario C: Unknown — choice cards */}
        {scenario === 'unknown' && (
          <motion.div
            key="unknown"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <p className="text-sm text-[var(--text-secondary)]">
              Aidez-nous à comprendre votre situation :
            </p>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleChoicePersonal}
                className="p-4 border-2 border-[var(--border-default)] hover:border-brand-300 rounded-xl text-left space-y-1.5 transition-all group"
              >
                <Globe className="w-5 h-5 text-brand-500" />
                <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-brand-600">
                  C'est mon propre site
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Site dédié à mon entreprise ou activité
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleChoiceNetwork}
                className="p-4 border-2 border-[var(--border-default)] hover:border-brand-300 rounded-xl text-left space-y-1.5 transition-all group"
              >
                <Building2 className="w-5 h-5 text-brand-500" />
                <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-brand-600">
                  Je fais partie d'un réseau
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Réseau, cabinet ou agence multi-agents
                </p>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Manual fallback */}
        {scenario === 'manual_fallback' && (
          <motion.div
            key="fallback"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                {error || 'Analyse automatique indisponible.'} Décrivez votre activité en quelques lignes pour personnaliser votre agent.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Décrivez votre activité</Label>
              <Textarea
                value={data.manualDescription || ''}
                onChange={(e) => onChange({ ...data, manualDescription: e.target.value })}
                placeholder="Ex: Je suis conseiller immobilier spécialisé dans les biens de prestige à Paris. Je propose des biens entre 500K et 3M€, avec un accompagnement personnalisé sur toutes les étapes..."
                rows={4}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social media fields — always visible once past initial */}
      {scenario !== 'initial' && scenario !== 'analyzing' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 p-4 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-default)]"
        >
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
            Réseaux sociaux (optionnel)
          </p>
          <div className="space-y-2">
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <Input
                placeholder="https://instagram.com/votre-profil"
                value={data.instagramUrl}
                onChange={(e) => onChange({ ...data, instagramUrl: e.target.value })}
                className="pl-9 text-sm"
              />
            </div>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <Input
                placeholder="https://linkedin.com/in/votre-profil"
                value={data.socialUrl}
                onChange={(e) => onChange({ ...data, socialUrl: e.target.value })}
                className="pl-9 text-sm"
              />
            </div>
          </div>
          <p className="text-[10px] text-[var(--text-tertiary)]">
            Le contenu de vos profils enrichit les connaissances de l'agent
          </p>
        </motion.div>
      )}

      {/* Vertical selector */}
      <div className="space-y-2">
        <Label>Votre secteur d'activité</Label>
        <VerticalSelector
          value={data.vertical}
          onChange={(vertical) => onChange({ ...data, vertical })}
        />
      </div>

      <Button className="w-full" onClick={onNext} disabled={!canContinue}>
        Continuer
      </Button>
    </div>
  )
}
