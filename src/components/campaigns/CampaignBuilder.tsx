import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Rocket } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SequenceEditor } from './SequenceEditor'
import { CampaignContacts } from './CampaignContacts'
import { useCampaigns } from '@/hooks/useCampaigns'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { CampaignType, ChannelType, CampaignSequence } from '@/types/database'

const STEPS = ['Informations', 'Séquences', 'Contacts', 'Lancement']

interface CampaignBuilderProps {
  open: boolean
  onClose: () => void
}

export function CampaignBuilder({ open, onClose }: CampaignBuilderProps) {
  const { createCampaign } = useCampaigns()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [saving, setSaving] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<CampaignType>('outbound')
  const [channelType, setChannelType] = useState<ChannelType>('whatsapp')
  const [sequences, setSequences] = useState<(Partial<CampaignSequence> & { _localId: string })[]>([])
  const [contactIds, setContactIds] = useState<string[]>([])

  const go = (dir: number) => {
    setDirection(dir)
    setStep((s) => s + dir)
  }

  const handleLaunch = async () => {
    if (!name) return toast.error('Nom requis')
    setSaving(true)
    try {
      const campaign = await createCampaign.mutateAsync({
        name,
        description,
        type,
        channel_type: channelType,
        status: 'active',
        total_contacts: contactIds.length,
        send_window_start: '09:00',
        send_window_end: '20:00',
      })

      // Save sequences
      if (sequences.length > 0) {
        await supabase.from('campaign_sequences').insert(
          sequences.map((s, i) => ({
            campaign_id: campaign.id,
            step_number: i + 1,
            name: s.name,
            template_a: s.template_a || '',
            template_b: s.template_b,
            delay_hours: s.delay_hours ?? 24,
            send_if_no_reply: s.send_if_no_reply ?? true,
            stop_if_replied: s.stop_if_replied ?? true,
            stop_if_booked: s.stop_if_booked ?? true,
            sort_order: i,
          }))
        )
      }

      // Assign contacts
      if (contactIds.length > 0) {
        await supabase.from('campaign_contacts').insert(
          contactIds.map((contactId, i) => ({
            campaign_id: campaign.id,
            contact_id: contactId,
            ab_variant: i % 2 === 0 ? 'a' : 'b',
          }))
        )
      }

      toast.success('Campagne lancée !', { description: `${contactIds.length} contacts dans la séquence.` })
      onClose()
      resetForm()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setStep(0)
    setName('')
    setDescription('')
    setType('outbound')
    setChannelType('whatsapp')
    setSequences([])
    setContactIds([])
  }

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.25, ease: 'easeOut' as const } },
    exit: (d: number) => ({ x: d > 0 ? -30 : 30, opacity: 0, transition: { duration: 0.2 } }),
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); resetForm() } }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Nouvelle campagne</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center gap-1 mb-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`flex items-center gap-1.5 text-xs font-medium ${i === step ? 'text-brand-500' : i < step ? 'text-[var(--text-secondary)]' : 'text-[var(--text-tertiary)]'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i <= step ? 'bg-brand-500 text-white' : 'bg-[var(--surface-secondary)] text-[var(--text-tertiary)]'}`}>
                  {i < step ? '✓' : i + 1}
                </span>
                <span className="hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-6 h-px bg-[var(--border-default)]" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-4"
            >
              {step === 0 && (
                <>
                  <div className="space-y-1.5">
                    <Label>Nom de la campagne *</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="ex: Prospection Immobilier Juin" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Objectif de la campagne..." className="min-h-[60px] resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Type</Label>
                      <Select value={type} onValueChange={(v) => setType(v as CampaignType)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="outbound">Outbound</SelectItem>
                          <SelectItem value="incoming">Incoming</SelectItem>
                          <SelectItem value="comment_to_dm">Comment → DM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Canal</Label>
                      <Select value={channelType} onValueChange={(v) => setChannelType(v as ChannelType)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="webchat">WebChat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <SequenceEditor
                  initial={[]}
                  onChange={(steps) => setSequences(steps)}
                />
              )}

              {step === 2 && (
                <CampaignContacts selected={contactIds} onChange={setContactIds} />
              )}

              {step === 3 && (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Rocket className="w-7 h-7 text-brand-500" />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">Prêt à lancer !</h3>
                  <p className="text-sm text-[var(--text-tertiary)] mb-4">
                    La campagne <strong>{name}</strong> enverra <strong>{sequences.length}</strong> étape{sequences.length > 1 ? 's' : ''} à <strong>{contactIds.length}</strong> contact{contactIds.length > 1 ? 's' : ''} via <strong>{channelType}</strong>.
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-left">
                    {[
                      { label: 'Séquences', value: sequences.length },
                      { label: 'Contacts', value: contactIds.length },
                      { label: 'Canal', value: channelType },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-[var(--surface-secondary)] rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-[var(--text-primary)]">{value}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-default)]">
          <Button variant="outline" size="sm" onClick={() => go(-1)} disabled={step === 0}>
            <ChevronLeft className="w-3.5 h-3.5 mr-1.5" /> Retour
          </Button>
          {step < STEPS.length - 1 ? (
            <Button size="sm" onClick={() => go(1)} disabled={step === 0 && !name}>
              Suivant <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          ) : (
            <Button size="sm" onClick={handleLaunch} disabled={saving || !name}>
              {saving ? 'Lancement...' : (
                <><Rocket className="w-3.5 h-3.5 mr-1.5" /> Lancer la campagne</>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
