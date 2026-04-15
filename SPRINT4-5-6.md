# SPRINT 4-5-6 — AI CLOSER AGENT IKONIK (FEATURES AVANCÉES)

## ⚡ MODE AUTONOME TOTAL

**Johann n'est PAS disponible. Enchaîne les 18 étapes SANS JAMAIS T'ARRÊTER, SANS JAMAIS POSER DE QUESTION.**

- ❌ JAMAIS demander de confirmation
- ✅ Corriger les erreurs toi-même
- ✅ Activer UI/UX Pro Max skill avant chaque composant UI
- ✅ Framer Motion pour toutes les animations
- ✅ `npm run build` → 0 erreurs à la fin
- ✅ À la toute fin : netlify deploy --prod --dir=dist && git add . && git commit -m "feat: Sprint 4-5-6 complet" && git push

## CONTEXTE

Projet : ~/ai-closer-agent (Sprint 1-2-3 terminés et déployés)
Stack : React 19 + Vite + Tailwind + shadcn/ui + Framer Motion + Supabase + Zustand
Supabase project ID : yehanxvfnavicawspzjr
Toutes les migrations SQL sont DÉJÀ appliquées. NE PAS créer de fichier migration, NE PAS exécuter de SQL.
NE PAS écraser les fichiers existants. AJOUTER les nouveaux modules.

---

## PLAN D'EXÉCUTION — 18 étapes sans pause

```
=== SPRINT 4 — Revenue ===
Étape 1  → Types TypeScript Sprint 4-5-6
Étape 2  → ROI Dashboard (métriques hero, funnel attribution, table deals, timeline parcours, insights IA)
Étape 3  → Comment-to-DM Instagram/Facebook (triggers, templates, stats)
Étape 4  → Paiement in-chat Stripe (création liens, envoi dans conversation, tracking statut)
Étape 5  → Rapports automatiques (config fréquence/destinataires, template email, preview)
Étape 6  → Review automation (demande avis Google/TrustPilot post-deal)

=== SPRINT 5 — Intelligence ===
Étape 7  → Voice notes WhatsApp (transcription entrante, réponse texte intelligente)
Étape 8  → Conversation intelligence (analyse patterns, top questions, top objections, heures optimales)
Étape 9  → Lead scoring comportemental (score basé sur vitesse réponse, longueur messages, engagement)
Étape 10 → Détection de langue automatique (switch prompt selon langue détectée)
Étape 11 → Smart routing (règles d'assignation équipe basées sur qualification)

=== SPRINT 6 — Growth ===
Étape 12 → QR Code generator (WhatsApp direct, avec tracking scans/conversions)
Étape 13 → Speed-to-lead / Form connections (webhook → contact en 10 secondes)
Étape 14 → Social proof widget (notifications flottantes sur site client)
Étape 15 → Portail client simplifié (vue allégée pour le client final)
Étape 16 → Micro-vidéos personnalisées IA (mock UX — structure pour ElevenLabs + Kling)
Étape 17 → Router + Sidebar + Pages + Navigation
Étape 18 → Build + Deploy + Push
```

---

## ÉTAPE 1 — TYPES TYPESCRIPT

Ajouter à la fin de src/types/database.ts :

```typescript
// === SPRINT 4-5-6 TYPES ===

export interface CommentTrigger {
  id: string
  sub_account_id: string
  platform: 'instagram' | 'facebook'
  post_id?: string
  post_url?: string
  trigger_keyword?: string
  dm_template: string
  is_active: boolean
  triggers_count: number
  dms_sent: number
  created_at: string
  updated_at: string
}

export interface PaymentLink {
  id: string
  sub_account_id: string
  contact_id?: string
  conversation_id?: string
  title: string
  amount: number
  currency: string
  stripe_payment_link_id?: string
  stripe_payment_link_url?: string
  status: 'pending' | 'paid' | 'expired' | 'cancelled'
  paid_at?: string
  created_at: string
  updated_at: string
  contact?: Contact
}

export interface ReportSchedule {
  id: string
  sub_account_id: string
  frequency: 'daily' | 'weekly' | 'monthly'
  day_of_week: number
  send_to: string[]
  include_sections: string[]
  is_active: boolean
  last_sent_at?: string
  created_at: string
  updated_at: string
}

export interface ReviewRequest {
  id: string
  sub_account_id: string
  contact_id: string
  conversation_id?: string
  platform: 'google' | 'trustpilot' | 'facebook'
  review_url: string
  status: 'pending' | 'sent' | 'clicked' | 'reviewed'
  sent_at?: string
  clicked_at?: string
  created_at: string
  contact?: Contact
}

export interface ConversationInsight {
  id: string
  sub_account_id: string
  period_start: string
  period_end: string
  top_questions: Array<{ question: string; count: number }>
  top_objections: Array<{ objection: string; count: number }>
  best_scripts: Array<{ script: string; conversion_rate: number }>
  avg_response_time_seconds: number
  avg_messages_to_qualify: number
  avg_messages_to_book: number
  busiest_hours: Array<{ hour: number; count: number }>
  best_converting_hours: Array<{ hour: number; rate: number }>
  language_distribution: Record<string, number>
  sentiment_distribution: Record<string, number>
  created_at: string
}

export interface RoutingRule {
  id: string
  sub_account_id: string
  name: string
  conditions: {
    field: string
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than'
    value: string
  }[]
  assign_to_user_id: string
  priority: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface QRCode {
  id: string
  sub_account_id: string
  name: string
  channel_type: ChannelType
  target_url: string
  welcome_message?: string
  campaign_id?: string
  scans_count: number
  conversations_started: number
  qr_image_url?: string
  created_at: string
  updated_at: string
}

export interface FormConnection {
  id: string
  sub_account_id: string
  name: string
  source: 'webhook' | 'meta_lead_ads' | 'google_ads' | 'typeform' | 'custom'
  webhook_url?: string
  webhook_secret?: string
  response_channel: ChannelType
  response_template: string
  response_delay_seconds: number
  leads_received: number
  leads_contacted: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Extended Deal with attribution
export interface DealWithAttribution extends Deal {
  first_conversation_id?: string
  first_message_at?: string
  bot_initiated: boolean
  bot_messages_before_human: number
  attribution_channel?: ChannelType
  commission_amount?: number
}

// Extended Contact with behavior
export interface ContactWithBehavior extends Contact {
  behavior_score: number
  avg_response_time_seconds?: number
  avg_message_length?: number
  engagement_level: 'low' | 'medium' | 'high' | 'very_high'
  detected_language: string
  sentiment: 'positive' | 'neutral' | 'negative'
}
```

---

## ÉTAPE 2 — ROI DASHBOARD

### Fichiers à créer :
- `src/hooks/useROI.ts` — Calculs ROI : pipeline généré, revenus closés, ROI multiplier, funnel attribution, deals avec parcours
- `src/components/dashboard/ROIDashboard.tsx` — Dashboard complet avec toutes les sections
- `src/components/dashboard/ROIHeroCards.tsx` — 3 cartes hero : Pipeline généré (bleu), Revenus closés (vert), ROI x multiplier (vert)
- `src/components/dashboard/AttributionFunnel.tsx` — Funnel : Conversations → Qualifiés → RDV → Propositions → Gagnés avec % entre chaque étape
- `src/components/dashboard/AttributionTable.tsx` — Table des deals closés : nom deal, contact, canal badge, valeur, parcours complet (DM→Qualif→RDV→Visite→Offre), nombre messages bot, durée en jours
- `src/components/dashboard/DealTimeline.tsx` — Timeline verticale d'un deal : chaque événement avec dot coloré, description, date. Cliquable depuis la table
- `src/components/dashboard/ROIInsights.tsx` — 3 cards insights IA : performance par canal, temps de conversion, coût par lead vs publicité

### Intégration :
- Ajouter un onglet "ROI" dans la page DashboardPage.tsx existante (tabs : Vue d'ensemble | ROI)
- Le ROI Dashboard a un sélecteur de période : 7j, 30j, 90j, 12 mois
- Tous les chiffres sont calculés depuis les tables deals + conversations + messages
- Pour le MVP, utiliser des données mock réalistes si la DB est vide (pipeline 847K, closés 124K, ROI x312)
- Animer les chiffres hero avec un compteur animé (framer-motion, de 0 à la valeur en 1.5s)

---

## ÉTAPE 3 — COMMENT-TO-DM

### Fichiers :
- `src/hooks/useCommentTriggers.ts`
- `src/components/campaigns/CommentToDM.tsx` — Page de gestion des triggers
- `src/components/campaigns/CreateTriggerDialog.tsx` — Modal : plateforme (IG/FB), URL du post, mot-clé déclencheur (optionnel = tous les commentaires), template DM avec variables
- `src/components/campaigns/TriggerCard.tsx` — Card avec : plateforme badge, post preview, keyword, stats (triggers/DMs envoyés), toggle actif

### Intégration :
- Ajouter un onglet "Comment → DM" dans CampaignsPage.tsx (tabs : Campagnes | Comment → DM)
- Template DM supporte {{first_name}} et {{comment_text}}

---

## ÉTAPE 4 — PAIEMENT IN-CHAT STRIPE

### Fichiers :
- `src/hooks/usePaymentLinks.ts`
- `src/components/inbox/SendPaymentDialog.tsx` — Modal dans le chat : titre, montant, devise → génère un lien Stripe
- `src/components/inbox/PaymentLinkBubble.tsx` — Bulle spéciale dans le chat avec montant, statut (en attente/payé), bouton copier lien
- `src/components/settings/StripeSettings.tsx` — Config clé API Stripe dans les settings

### Intégration :
- Ajouter un bouton "€" dans ChatInput.tsx qui ouvre SendPaymentDialog
- PaymentLinkBubble apparaît dans le fil de messages comme un type spécial
- Ajouter StripeSettings dans SettingsLayout.tsx sous une nouvelle section "Paiements"
- Pour le MVP, mock la création du lien Stripe (générer une URL fictive). La vraie intégration Stripe viendra après.

---

## ÉTAPE 5 — RAPPORTS AUTOMATIQUES

### Fichiers :
- `src/hooks/useReportSchedules.ts`
- `src/components/settings/ReportSettings.tsx` — Config : fréquence (quotidien/hebdo/mensuel), jour d'envoi, destinataires (emails), sections incluses (checkboxes)
- `src/components/settings/ReportPreview.tsx` — Preview du rapport tel que reçu par email : header avec logo + nom entreprise, KPIs en grille, mini funnel, top deals, recommandations

### Intégration :
- Ajouter dans SettingsLayout.tsx sous section "Rapports" avec icône BarChart3
- La preview s'actualise en temps réel quand on change les sections incluses

---

## ÉTAPE 6 — REVIEW AUTOMATION

### Fichiers :
- `src/hooks/useReviewRequests.ts`
- `src/components/settings/ReviewSettings.tsx` — Config : URL page Google Reviews, URL TrustPilot, message de demande d'avis personnalisable, délai d'envoi après deal gagné
- `src/components/contacts/ReviewRequestButton.tsx` — Bouton "Demander un avis" dans le panel contact
- `src/components/dashboard/ReviewStats.tsx` — Mini widget : avis demandés / envoyés / cliqués / rédigés

### Intégration :
- Ajouter ReviewSettings dans SettingsLayout.tsx
- Ajouter ReviewRequestButton dans ContactPanel.tsx (visible quand deal = closed_won)
- Ajouter ReviewStats en bas du DashboardPage

---

## ÉTAPE 7 — VOICE NOTES WHATSAPP

### Fichiers :
- `src/components/inbox/VoiceNoteBubble.tsx` — Bulle audio avec player inline, bouton play/pause, durée, transcription affichée en dessous
- `src/lib/ai/voice.ts` — Fonction transcribeVoiceNote(audioUrl) qui envoie l'audio à l'API Gemini pour transcription (mock pour le MVP)

### Intégration :
- Modifier MessageBubble.tsx : si content_type === 'audio', afficher VoiceNoteBubble au lieu du texte
- La transcription apparaît en dessous du player audio en texte gris italique
- L'agent IA reçoit la transcription comme texte et répond normalement

---

## ÉTAPE 8 — CONVERSATION INTELLIGENCE

### Fichiers :
- `src/hooks/useConversationInsights.ts`
- `src/components/dashboard/InsightsDashboard.tsx` — Dashboard complet
- `src/components/dashboard/TopQuestions.tsx` — Liste : question + nombre de fois posée + barre de fréquence
- `src/components/dashboard/TopObjections.tsx` — Liste : objection + fréquence + réponse bot qui a le mieux converti
- `src/components/dashboard/HourHeatmap.tsx` — Grille 7j x 24h avec intensité de couleur = volume de messages. Overlay : meilleurs taux de conversion par créneau
- `src/components/dashboard/SentimentGauge.tsx` — Jauge positive/neutre/négatif des conversations

### Intégration :
- Ajouter un onglet "Intelligence" dans DashboardPage.tsx (tabs : Vue d'ensemble | ROI | Intelligence)
- Pour le MVP, générer des données mock réalistes
- Sélecteur de période : 7j, 30j, 90j

---

## ÉTAPE 9 — LEAD SCORING COMPORTEMENTAL

### Fichiers :
- `src/lib/ai/lead-scoring.ts` — Fonction calculateBehaviorScore(contact, messages) : score 0-100 basé sur avg_response_time (<2min = +30, <10min = +20, <1h = +10), avg_message_length (>50 chars = +15, >20 = +10), nombre d'échanges (>10 = +20, >5 = +15), a posé des questions = +10, a mentionné budget = +15
- `src/components/contacts/LeadScoreIndicator.tsx` — Indicateur visuel : cercle progress avec score, couleur (rouge <30, orange 30-60, vert >60), label engagement level

### Intégration :
- Ajouter LeadScoreIndicator dans ContactPanel.tsx et ContactsTable.tsx
- Colonne "Score" dans la table contacts avec tri possible
- Le score se calcule côté client pour le MVP

---

## ÉTAPE 10 — DÉTECTION DE LANGUE

### Fichiers :
- `src/lib/ai/language-detect.ts` — Fonction detectLanguage(text) : détection basique par mots-clés fréquents (fr, en, ar, es, de, it, pt, tr, nl, zh). Retourne le code ISO.
- Modifier src/lib/ai/prompts.ts : si detected_language !== bot_language, ajouter au system prompt "Le prospect écrit en [langue]. Réponds dans sa langue."

### Intégration :
- Modifier agent.ts pour appeler detectLanguage sur le premier message du prospect
- Stocker la langue détectée dans contacts.detected_language
- Afficher un badge langue dans ContactPanel.tsx (drapeau + code)

---

## ÉTAPE 11 — SMART ROUTING

### Fichiers :
- `src/hooks/useRoutingRules.ts`
- `src/components/settings/RoutingRules.tsx` — Liste de règles avec drag pour priorité
- `src/components/settings/RoutingRuleEditor.tsx` — Éditeur : nom de la règle, conditions (SI budget > 500K ET localisation = Rouen ALORS assigner à Samy), sélecteur membre d'équipe

### Intégration :
- Ajouter dans SettingsLayout.tsx sous la section "Équipe"
- Pour le MVP, les règles sont affichées/éditées mais pas exécutées automatiquement (juste la structure UI)

---

## ÉTAPE 12 — QR CODE GENERATOR

### Fichiers :
- `src/hooks/useQRCodes.ts`
- `src/components/growth/QRCodeGenerator.tsx` — Formulaire : nom, canal (WhatsApp/WebChat), message d'accueil, campagne liée (optionnel)
- `src/components/growth/QRCodeCard.tsx` — Card avec QR code affiché (utiliser la lib qrcode via CDN ou canvas), stats scans/conversations, boutons télécharger PNG/SVG/PDF
- `src/components/growth/QRCodeList.tsx` — Liste de tous les QR codes
- `src/pages/GrowthPage.tsx` — Page "Acquisition" avec tabs : QR Codes | Formulaires | Social Proof

### Génération QR :
- Utiliser la lib `qrcode` (npm install qrcode @types/qrcode) pour générer le QR côté client
- L'URL encodée dans le QR : `https://wa.me/NUMERO?text=MESSAGE_ACCUEIL` pour WhatsApp
- Bouton télécharger en PNG haute résolution (1024x1024) et SVG

---

## ÉTAPE 13 — SPEED-TO-LEAD / FORM CONNECTIONS

### Fichiers :
- `src/hooks/useFormConnections.ts`
- `src/components/growth/FormConnectionList.tsx` — Liste des connexions formulaires
- `src/components/growth/FormConnectionEditor.tsx` — Éditeur : nom, source (Webhook/Meta Lead Ads/Google Ads/Typeform/Custom), canal de réponse, template de réponse, délai (slider 5-60 secondes)
- `src/components/growth/WebhookURL.tsx` — Affiche l'URL webhook unique à copier + secret + exemple de payload JSON

### Intégration :
- Onglet "Formulaires" dans GrowthPage.tsx
- L'URL webhook est auto-générée : `https://api.ikonik-ac.com/webhooks/forms/SUB_ACCOUNT_ID`
- Afficher le snippet d'intégration pour Typeform, Meta Lead Ads, Google Ads
- Stats : leads reçus / contactés / taux de réponse

---

## ÉTAPE 14 — SOCIAL PROOF WIDGET

### Fichiers :
- `src/components/growth/SocialProofSettings.tsx` — Config : activer/désactiver, message template ("{{first_name}} de {{city}} vient de {{action}}"), délai entre notifications, position (bas-gauche/bas-droite)
- `src/components/growth/SocialProofPreview.tsx` — Preview de la notification telle qu'elle apparaîtra sur le site client : toast avec avatar, message, animation slide-in
- `widget/src/SocialProofWidget.tsx` — Widget embarquable séparé (comme le chat widget)

### Intégration :
- Onglet "Social Proof" dans GrowthPage.tsx
- Générer le snippet embed : `<script src="https://cdn.ikonik-ac.com/proof.js" data-id="SUB_ACCOUNT_ID"></script>`

---

## ÉTAPE 15 — PORTAIL CLIENT SIMPLIFIÉ

### Fichiers :
- `src/components/layout/ClientPortalShell.tsx` — Layout simplifié : juste un header avec logo + nom + déconnexion, pas de sidebar complexe
- `src/pages/portal/PortalDashboard.tsx` — Vue simplifiée : 4 stat cards (Conversations, RDV, Leads qualifiés, Taux de réponse) + dernières conversations
- `src/pages/portal/PortalConversations.tsx` — Liste des conversations avec preview, pas d'édition bot
- `src/pages/portal/PortalBookings.tsx` — Liste des RDV à venir

### Intégration :
- Nouvelles routes /portal/* dans App.tsx avec ClientPortalShell comme layout
- Détection du rôle : si user.role === 'member' sans permissions admin → rediriger vers /portal
- Le portail ne montre PAS : settings, campagnes, templates, deals pipeline. Juste la vue "lecteur".

---

## ÉTAPE 16 — MICRO-VIDÉOS IA (MOCK)

### Fichiers :
- `src/components/inbox/VideoAIDialog.tsx` — Modal : script de la vidéo (auto-généré ou custom), voix (sélecteur : Masculine FR, Féminine FR, Masculine EN), style visuel (Professionnel, Dynamique, Luxe), bouton "Générer" (mock : affiche un placeholder vidéo avec barre de progression simulée)
- `src/components/inbox/VideoAIBubble.tsx` — Bulle dans le chat avec thumbnail vidéo, durée, bouton play
- `src/components/settings/VideoAISettings.tsx` — Config : clé ElevenLabs (optionnel), clé Kling (optionnel), voix par défaut, style par défaut

### Intégration :
- Ajouter un bouton "Vidéo" (icône Video) dans ChatInput.tsx à côté du bouton paiement
- Ajouter VideoAISettings dans SettingsLayout.tsx
- Pour le MVP, TOUT est mocké. Le bouton Générer affiche un placeholder après 3 secondes d'animation. La vraie intégration ElevenLabs + Kling viendra dans un sprint futur.

---

## ÉTAPE 17 — ROUTER + SIDEBAR + PAGES

### Nouvelles routes dans App.tsx :
```tsx
const GrowthPage = lazy(() => import('./pages/GrowthPage'))
// Portal
const PortalDashboard = lazy(() => import('./pages/portal/PortalDashboard'))
const PortalConversations = lazy(() => import('./pages/portal/PortalConversations'))
const PortalBookings = lazy(() => import('./pages/portal/PortalBookings'))

// Dans les routes /app :
<Route path="growth" element={<GrowthPage />} />

// Routes /portal :
<Route path="/portal" element={<ClientPortalShell />}>
  <Route index element={<PortalDashboard />} />
  <Route path="conversations" element={<PortalConversations />} />
  <Route path="bookings" element={<PortalBookings />} />
</Route>
```

### Sidebar — Ajouter :
```tsx
{ to: '/app/growth', icon: Rocket, label: 'Acquisition' },
```
Importer Rocket de lucide-react. Placer après "Templates".

### DashboardPage — Modifier les tabs :
```tsx
<TabsList>
  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
  <TabsTrigger value="roi">ROI</TabsTrigger>
  <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
</TabsList>
```

---

## ÉTAPE 18 — BUILD + DEPLOY + PUSH

```bash
npm install qrcode @types/qrcode --legacy-peer-deps
npm run build
netlify deploy --prod --dir=dist
git add . && git commit -m "feat: Sprint 4-5-6 - ROI dashboard, comment-to-DM, paiement Stripe, rapports auto, reviews, voice notes, conversation intelligence, lead scoring, language detect, routing, QR codes, speed-to-lead, social proof, portail client, vidéo IA" && git push
```

---

## DESIGN GUIDELINES

- Même design system que Sprint 1-2-3
- shadcn/ui pour tous les composants
- Framer Motion pour les compteurs animés du ROI, les transitions, les hover
- Recharts pour les graphiques (déjà installé)
- Mobile-first
- Skeleton loading partout
- Empty states avec le composant EmptyState existant
- Toast sonner pour toutes les actions
- Pour les données mock : utiliser des valeurs réalistes et variées, pas des placeholders "Lorem ipsum". Des vrais noms français, des vrais montants, des vrais messages.
- Zéro jargon technique visible par le client final
