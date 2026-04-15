# SPRINT 2 — AI CLOSER AGENT IKONIK

## ⚡ MODE AUTONOME TOTAL — LIRE EN PREMIER

**Johann n'est PAS disponible. Il a lancé le build et il est PARTI.**

### Interdictions absolues :
- ❌ JAMAIS écrire "voulez-vous que je continue ?"
- ❌ JAMAIS écrire "dois-je passer à l'étape suivante ?"
- ❌ JAMAIS demander de confirmation ou validation
- ❌ JAMAIS poser UNE SEULE question

### Obligations absolues :
- ✅ Enchaîner étapes 1 → 7 SANS PAUSE
- ✅ Prendre les décisions techniques toi-même
- ✅ Corriger les erreurs toi-même
- ✅ Utiliser --legacy-peer-deps si conflit npm
- ✅ Activer UI/UX Pro Max skill AVANT chaque composant UI
- ✅ Utiliser Framer Motion pour toutes les animations
- ✅ En cas de blocage impossible, noter dans BLOCKERS.md et continuer

### Objectif final
`npm run build` → 0 erreurs. Tous les nouveaux modules intégrés au router existant.

---

## CONTEXTE

Le Sprint 1 est terminé et déployé. Le projet est dans ~/ai-closer-agent. 
Stack : React 19 + Vite 6 + Tailwind + shadcn/ui + Framer Motion + Supabase + Zustand + TanStack Query.
Les fichiers existants sont dans src/. Ne PAS écraser les fichiers du Sprint 1, AJOUTER les nouveaux modules.

Le site est live sur ai-closer-agent.netlify.app.
Supabase project ID : yehanxvfnavicawspzjr

---

## WORKFLOW DE BUILD — Exécute dans cet ordre exact, SANS JAMAIS T'ARRÊTER :

```
Étape 1 → Migration Supabase Sprint 2 (nouvelles tables : deals, campaigns, campaign_sequences, campaign_contacts, follow_ups, message_templates, custom_functions)
Étape 2 → Types TypeScript (ajouter au fichier src/types/database.ts existant)
Étape 3 → Pipeline Deals (kanban drag & drop, colonnes par statut, cards contacts)
Étape 4 → Campagnes Outbound (création campagne, séquences multi-étapes, A/B testing, assignation contacts)
Étape 5 → Follow-ups Automatiques (relances programmées, logique de timing, désactivation auto)
Étape 6 → Templates de Messages (CRUD templates, variables dynamiques, preview temps réel)
Étape 7 → Polish + Router + Build (intégrer au router, sidebar, mobile nav, npm run build → 0 erreurs)
```

---

## ÉTAPE 1 — MIGRATION SUPABASE SPRINT 2

Appliquer cette migration dans supabase/migrations/002_sprint2_schema.sql puis exécuter via Supabase CLI ou SQL Editor.

```sql
-- ============================================================
-- 002_sprint2_schema.sql
-- AI Closer Agent IKONIK — Sprint 2
-- ============================================================

-- DEALS PIPELINE
CREATE TYPE deal_stage AS ENUM ('lead', 'qualified', 'meeting', 'proposal', 'negotiation', 'closed_won', 'closed_lost');

CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id),
  
  title TEXT NOT NULL,
  stage deal_stage NOT NULL DEFAULT 'lead',
  value DECIMAL(12, 2),
  currency TEXT DEFAULT 'EUR',
  
  probability INTEGER DEFAULT 0, -- 0-100%
  expected_close_date DATE,
  
  assigned_user_id UUID REFERENCES users(id),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Position dans le kanban
  sort_order INTEGER DEFAULT 0,
  
  -- Timestamps
  stage_changed_at TIMESTAMPTZ DEFAULT NOW(),
  won_at TIMESTAMPTZ,
  lost_at TIMESTAMPTZ,
  lost_reason TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_deals_sub ON deals(sub_account_id);
CREATE INDEX idx_deals_stage ON deals(sub_account_id, stage);
CREATE INDEX idx_deals_contact ON deals(contact_id);

-- CAMPAIGNS
CREATE TYPE campaign_type AS ENUM ('outbound', 'incoming', 'comment_to_dm');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'archived');

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  type campaign_type NOT NULL DEFAULT 'outbound',
  status campaign_status NOT NULL DEFAULT 'draft',
  
  -- Canaux
  channel_type channel_type NOT NULL DEFAULT 'whatsapp',
  
  -- Statistiques
  total_contacts INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  replied_count INTEGER DEFAULT 0,
  booked_count INTEGER DEFAULT 0,
  
  -- Config
  daily_send_limit INTEGER DEFAULT 25,
  send_window_start TIME DEFAULT '09:00',
  send_window_end TIME DEFAULT '20:00',
  timezone TEXT DEFAULT 'Europe/Paris',
  
  tags TEXT[] DEFAULT '{}',
  
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaigns_sub ON campaigns(sub_account_id);
CREATE INDEX idx_campaigns_status ON campaigns(sub_account_id, status);

-- CAMPAIGN SEQUENCES (étapes d'une campagne)
CREATE TABLE campaign_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  
  step_number INTEGER NOT NULL,
  name TEXT, -- "Relance 1", "Relance 2", etc.
  
  -- Contenu
  template_a TEXT NOT NULL, -- Variante A
  template_b TEXT, -- Variante B (A/B testing, optionnel)
  
  -- Timing
  delay_hours INTEGER NOT NULL DEFAULT 24, -- Délai avant envoi (après étape précédente)
  
  -- Conditions d'envoi
  send_if_no_reply BOOLEAN DEFAULT true, -- Envoyer seulement si pas de réponse
  stop_if_replied BOOLEAN DEFAULT true, -- Arrêter la séquence si réponse reçue
  stop_if_booked BOOLEAN DEFAULT true, -- Arrêter si RDV pris
  
  -- Stats par étape
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  replied_count INTEGER DEFAULT 0,
  
  -- Stats A/B
  sent_a INTEGER DEFAULT 0,
  sent_b INTEGER DEFAULT 0,
  replied_a INTEGER DEFAULT 0,
  replied_b INTEGER DEFAULT 0,
  
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(campaign_id, step_number)
);

CREATE INDEX idx_sequences_campaign ON campaign_sequences(campaign_id);

-- CAMPAIGN CONTACTS (contacts assignés à une campagne)
CREATE TYPE campaign_contact_status AS ENUM ('pending', 'in_progress', 'completed', 'replied', 'booked', 'opted_out', 'failed');

CREATE TABLE campaign_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  
  status campaign_contact_status NOT NULL DEFAULT 'pending',
  current_step INTEGER DEFAULT 0, -- Étape actuelle dans la séquence
  
  -- Tracking
  last_sent_at TIMESTAMPTZ,
  next_send_at TIMESTAMPTZ, -- Prochain envoi programmé
  replied_at TIMESTAMPTZ,
  booked_at TIMESTAMPTZ,
  
  -- A/B variant assigné
  ab_variant CHAR(1) DEFAULT 'a', -- 'a' ou 'b'
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(campaign_id, contact_id)
);

CREATE INDEX idx_campaign_contacts_campaign ON campaign_contacts(campaign_id);
CREATE INDEX idx_campaign_contacts_next ON campaign_contacts(next_send_at) WHERE status = 'in_progress';

-- FOLLOW-UPS (relances automatiques hors campagne)
CREATE TYPE follow_up_status AS ENUM ('scheduled', 'sent', 'cancelled', 'failed');

CREATE TABLE follow_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id),
  
  -- Contenu
  message TEXT NOT NULL,
  channel_type channel_type NOT NULL,
  
  -- Programmation
  scheduled_at TIMESTAMPTZ NOT NULL,
  status follow_up_status NOT NULL DEFAULT 'scheduled',
  
  -- Conditions
  cancel_if_replied BOOLEAN DEFAULT true,
  cancel_if_booked BOOLEAN DEFAULT true,
  
  sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_follow_ups_scheduled ON follow_ups(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX idx_follow_ups_sub ON follow_ups(sub_account_id);

-- MESSAGE TEMPLATES
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- 'greeting', 'follow_up', 'closing', 'objection', 'general'
  content TEXT NOT NULL,
  
  -- Variables disponibles : {{first_name}}, {{company_name}}, {{personal_context}}
  variables TEXT[] DEFAULT '{}',
  
  -- Canal spécifique ou universel
  channel_type channel_type, -- null = tous les canaux
  
  -- Stats
  times_used INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_templates_sub ON message_templates(sub_account_id);

-- RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deals_org_access" ON deals FOR ALL USING (sub_account_id IN (SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()));
CREATE POLICY "campaigns_org_access" ON campaigns FOR ALL USING (sub_account_id IN (SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()));
CREATE POLICY "sequences_org_access" ON campaign_sequences FOR ALL USING (campaign_id IN (SELECT id FROM campaigns WHERE sub_account_id IN (SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id())));
CREATE POLICY "campaign_contacts_org_access" ON campaign_contacts FOR ALL USING (campaign_id IN (SELECT id FROM campaigns WHERE sub_account_id IN (SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id())));
CREATE POLICY "follow_ups_org_access" ON follow_ups FOR ALL USING (sub_account_id IN (SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()));
CREATE POLICY "templates_org_access" ON message_templates FOR ALL USING (sub_account_id IN (SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()));

-- Triggers updated_at
CREATE TRIGGER tr_deals_updated BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_campaigns_updated BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_sequences_updated BEFORE UPDATE ON campaign_sequences FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_campaign_contacts_updated BEFORE UPDATE ON campaign_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_follow_ups_updated BEFORE UPDATE ON follow_ups FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_templates_updated BEFORE UPDATE ON message_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Realtime sur les deals pour le kanban
ALTER PUBLICATION supabase_realtime ADD TABLE deals;
```

---

## ÉTAPE 2 — TYPES TYPESCRIPT

Ajouter ces types à src/types/database.ts (NE PAS écraser le fichier, AJOUTER à la fin) :

```typescript
// === SPRINT 2 TYPES ===

export type DealStage = 'lead' | 'qualified' | 'meeting' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
export type CampaignType = 'outbound' | 'incoming' | 'comment_to_dm'
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived'
export type CampaignContactStatus = 'pending' | 'in_progress' | 'completed' | 'replied' | 'booked' | 'opted_out' | 'failed'
export type FollowUpStatus = 'scheduled' | 'sent' | 'cancelled' | 'failed'

export interface Deal {
  id: string
  sub_account_id: string
  contact_id: string
  conversation_id?: string
  title: string
  stage: DealStage
  value?: number
  currency: string
  probability: number
  expected_close_date?: string
  assigned_user_id?: string
  notes?: string
  tags: string[]
  sort_order: number
  stage_changed_at: string
  won_at?: string
  lost_at?: string
  lost_reason?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  // Joined
  contact?: Contact
}

export interface Campaign {
  id: string
  sub_account_id: string
  name: string
  description?: string
  type: CampaignType
  status: CampaignStatus
  channel_type: ChannelType
  total_contacts: number
  sent_count: number
  delivered_count: number
  read_count: number
  replied_count: number
  booked_count: number
  daily_send_limit: number
  send_window_start: string
  send_window_end: string
  timezone: string
  tags: string[]
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
  // Joined
  sequences?: CampaignSequence[]
}

export interface CampaignSequence {
  id: string
  campaign_id: string
  step_number: number
  name?: string
  template_a: string
  template_b?: string
  delay_hours: number
  send_if_no_reply: boolean
  stop_if_replied: boolean
  stop_if_booked: boolean
  sent_count: number
  delivered_count: number
  replied_count: number
  sent_a: number
  sent_b: number
  replied_a: number
  replied_b: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CampaignContact {
  id: string
  campaign_id: string
  contact_id: string
  status: CampaignContactStatus
  current_step: number
  last_sent_at?: string
  next_send_at?: string
  replied_at?: string
  booked_at?: string
  ab_variant: 'a' | 'b'
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  // Joined
  contact?: Contact
}

export interface FollowUp {
  id: string
  sub_account_id: string
  contact_id: string
  conversation_id?: string
  message: string
  channel_type: ChannelType
  scheduled_at: string
  status: FollowUpStatus
  cancel_if_replied: boolean
  cancel_if_booked: boolean
  sent_at?: string
  created_at: string
  updated_at: string
  // Joined
  contact?: Contact
}

export interface MessageTemplate {
  id: string
  sub_account_id: string
  name: string
  category: string
  content: string
  variables: string[]
  channel_type?: ChannelType
  times_used: number
  last_used_at?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}
```

---

## ÉTAPE 3 — PIPELINE DEALS (Kanban)

### Fichiers à créer :
- `src/hooks/useDeals.ts` — CRUD deals + Realtime
- `src/components/deals/DealsKanban.tsx` — Board kanban avec colonnes par stage
- `src/components/deals/DealColumn.tsx` — Colonne individuelle (header + compteur + total valeur)
- `src/components/deals/DealCard.tsx` — Card dans le kanban (nom contact, valeur, tags, date)
- `src/components/deals/DealDetail.tsx` — Dialog/panel détail d'un deal
- `src/components/deals/CreateDealDialog.tsx` — Modal création deal
- `src/pages/DealsPage.tsx` — Page complète

### UX du Kanban :
- 7 colonnes : Lead → Qualifié → RDV → Proposition → Négociation → Gagné → Perdu
- Drag & drop entre colonnes (utiliser le state local + update Supabase, PAS de librairie externe lourde — utiliser onDragStart/onDragOver/onDragEnd natifs HTML5)
- Chaque colonne affiche : nombre de deals + total valeur en EUR
- Chaque card affiche : nom contact, valeur, tags, ancienneté
- Couleurs colonnes : Lead (#748ffc), Qualifié (#fab005), RDV (#339af0), Proposition (#9775fa), Négociation (#ff922b), Gagné (#40c057), Perdu (#fa5252)
- Animation Framer Motion sur le drop
- Filtre par tag, recherche par nom, filtre par assigné
- Vue condensée (cards petites) et vue détaillée (cards grandes)

### Probabilités par défaut par stage :
- lead: 10%, qualified: 25%, meeting: 40%, proposal: 60%, negotiation: 80%, closed_won: 100%, closed_lost: 0%

---

## ÉTAPE 4 — CAMPAGNES OUTBOUND

### Fichiers à créer :
- `src/hooks/useCampaigns.ts` — CRUD campagnes
- `src/components/campaigns/CampaignList.tsx` — Liste des campagnes avec stats
- `src/components/campaigns/CampaignCard.tsx` — Card campagne (nom, statut, stats funnel mini)
- `src/components/campaigns/CampaignBuilder.tsx` — Wizard de création campagne
- `src/components/campaigns/SequenceEditor.tsx` — Éditeur de séquences (étapes, timing, A/B)
- `src/components/campaigns/SequenceStep.tsx` — Une étape de séquence (template A/B, délai, conditions)
- `src/components/campaigns/CampaignContacts.tsx` — Sélection/import contacts pour la campagne
- `src/components/campaigns/CampaignStats.tsx` — Stats détaillées d'une campagne
- `src/components/campaigns/ABResults.tsx` — Résultats A/B testing par étape
- `src/pages/CampaignsPage.tsx` — Page complète
- `src/pages/CampaignDetailPage.tsx` — Détail d'une campagne

### UX Campagnes :
- Liste avec cards : nom, type badge, statut badge, mini funnel bar (envoyés→réponses→rdv), date création
- Bouton "Nouvelle campagne" ouvre le wizard :
  1. Nom + type (outbound/incoming) + canal
  2. Séquences : ajouter étapes, chaque étape a template A + B optionnel + délai en heures + conditions stop
  3. Sélection contacts (depuis CRM, par tag, par statut, ou import CSV)
  4. Preview + lancer
- Variables dans les templates : {{first_name}}, {{company_name}}, {{personal_context}}
- Preview du message avec variables remplacées par des exemples
- Stats A/B : taux de réponse variante A vs B avec indicateur "gagnant"

---

## ÉTAPE 5 — FOLLOW-UPS AUTOMATIQUES

### Fichiers à créer :
- `src/hooks/useFollowUps.ts` — CRUD follow-ups
- `src/components/follow-ups/FollowUpList.tsx` — Liste des relances programmées
- `src/components/follow-ups/FollowUpItem.tsx` — Item relance (contact, message, date, statut)
- `src/components/follow-ups/CreateFollowUp.tsx` — Formulaire création relance
- `src/components/follow-ups/FollowUpSettings.tsx` — Config par défaut (délais, nombre max de relances)

### Logique :
- Afficher les follow-ups programmés dans un tableau trié par date
- Statut visuel : scheduled (bleu), sent (vert), cancelled (gris), failed (rouge)
- Bouton annuler sur les follow-ups scheduled
- Les follow-ups sont créés automatiquement quand un contact ne répond pas (logique dans l'agent IA)
- Config : délai entre relances (24h, 48h, 72h), nombre max de relances (3), message par défaut

Les follow-ups n'ont PAS de page dédiée. Ils apparaissent dans :
- Le panel contact (ContactPanel dans l'inbox)
- La page campagne (quand liés à une campagne)
- Les settings (config par défaut)

---

## ÉTAPE 6 — TEMPLATES DE MESSAGES

### Fichiers à créer :
- `src/hooks/useTemplates.ts` — CRUD templates
- `src/components/templates/TemplateList.tsx` — Liste templates avec catégories
- `src/components/templates/TemplateEditor.tsx` — Éditeur avec preview temps réel
- `src/components/templates/TemplatePreview.tsx` — Preview du message avec variables remplacées
- `src/components/templates/VariableInserter.tsx` — Boutons pour insérer des variables {{...}}
- `src/pages/TemplatesPage.tsx` — Page complète

### UX :
- Catégories en tabs : Tous, Accueil, Relance, Closing, Objection, Général
- Chaque template : nom, catégorie badge, contenu tronqué, canal badge, utilisations
- Éditeur split : textarea à gauche, preview à droite
- Boutons variables au-dessus du textarea : clic → insère {{variable}} au curseur
- Variables dispo : {{first_name}}, {{last_name}}, {{company_name}}, {{personal_context}}, {{agent_name}}
- Preview remplace les variables par des exemples réalistes
- Compteur de mots / caractères
- Indicateur canal (WhatsApp a une limite de 1024 chars pour les templates)

---

## ÉTAPE 7 — POLISH + ROUTER + BUILD

### Router — Ajouter ces routes dans src/App.tsx :
```tsx
// Ajouter dans les lazy imports
const DealsPage = lazy(() => import('./pages/DealsPage'))
const CampaignsPage = lazy(() => import('./pages/CampaignsPage'))
const CampaignDetailPage = lazy(() => import('./pages/CampaignDetailPage'))
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'))

// Ajouter dans les routes <Route path="/app">
<Route path="deals" element={<DealsPage />} />
<Route path="campaigns" element={<CampaignsPage />} />
<Route path="campaigns/:id" element={<CampaignDetailPage />} />
<Route path="templates" element={<TemplatesPage />} />
```

### Sidebar — Ajouter ces items dans src/components/layout/Sidebar.tsx :
```tsx
// Ajouter après l'item Calendar :
{ to: '/app/deals', icon: TrendingUp, label: 'Deals' },
{ to: '/app/campaigns', icon: Megaphone, label: 'Campagnes' },
{ to: '/app/templates', icon: FileText, label: 'Templates' },
```
Importer les icônes : `TrendingUp, Megaphone, FileText` de lucide-react.

### MobileNav — Ajouter les mêmes items dans MobileNav.tsx (remplacer Booking par Deals dans la bottom nav, les autres accessibles depuis un menu "Plus")

### Build final :
```bash
npm run build
```
→ 0 erreurs obligatoire.

---

## DESIGN GUIDELINES (rappel)

- Même design system que Sprint 1 (tokens CSS dans src/index.css)
- shadcn/ui pour tous les composants de base
- Framer Motion pour : transitions de page, animations kanban drag/drop, hover cards, apparition listes
- Mobile-first
- Skeleton loading sur tous les chargements
- Empty states avec illustrations (composant EmptyState existant)
- Toast notifications (sonner) pour toutes les actions CRUD
- Pas de jargon technique visible (pas de "webhook", "API", "endpoint")
