# SPRINT 3 — AI CLOSER AGENT IKONIK (FINAL)

## ⚡ MODE AUTONOME TOTAL

**Johann n'est PAS disponible. Enchaîne les 6 étapes SANS JAMAIS T'ARRÊTER, SANS JAMAIS POSER DE QUESTION.**

- ❌ JAMAIS demander de confirmation
- ✅ Corriger les erreurs toi-même
- ✅ Activer UI/UX Pro Max skill avant chaque composant UI
- ✅ Framer Motion pour toutes les animations
- ✅ `npm run build` → 0 erreurs à la fin

---

## CONTEXTE

Sprint 1 (MVP) et Sprint 2 (deals, campaigns, templates) sont terminés et déployés.
Projet : ~/ai-closer-agent
Stack : React 19 + Vite + Tailwind + shadcn/ui + Framer Motion + Supabase + Zustand
Supabase project ID : yehanxvfnavicawspzjr
Site : ai-closer-agent.netlify.app

NE PAS écraser les fichiers existants. AJOUTER les nouveaux modules.

---

## WORKFLOW — 6 étapes sans pause :

```
Étape 1 → Migration Supabase Sprint 3 (white_label_config, api_keys, webhooks, bot_schedules)
Étape 2 → Types TypeScript (ajouter à src/types/database.ts)
Étape 3 → White-Label Complet (domaine custom, logo, couleurs, SEO, preview live)
Étape 4 → Webhooks & API publique (clé API, endpoints, logs, documentation inline)
Étape 5 → Bot Schedule + Optimize (horaires d'activité bot, bouton optimize basé sur conversations)
Étape 6 → Polish + Router + Build + Deploy (intégrer au router, sidebar, build, netlify deploy --prod --dir=dist, git push)
```

---

## ÉTAPE 1 — MIGRATION SQL

Créer supabase/migrations/004_sprint3_schema.sql et l'appliquer via l'éditeur SQL ou CLI :

```sql
-- WHITE-LABEL CONFIG (détails avancés par org)
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS terms_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS privacy_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS favicon_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS login_bg_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS accent_color TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Plus Jakarta Sans';

-- API KEYS (pour l'API publique)
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL, -- "ica_live_" + 8 premiers chars pour identification
  permissions TEXT[] DEFAULT '{read}', -- 'read', 'write', 'contacts', 'conversations', 'campaigns'
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_api_keys_org ON api_keys(organization_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "api_keys_org_access" ON api_keys FOR ALL USING (organization_id = get_user_org_id());

-- WEBHOOKS
CREATE TYPE webhook_event AS ENUM ('message.received', 'message.sent', 'conversation.created', 'conversation.closed', 'contact.created', 'contact.updated', 'booking.created', 'booking.cancelled', 'deal.stage_changed', 'deal.won', 'deal.lost');

CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  events webhook_event[] NOT NULL,
  secret TEXT NOT NULL, -- HMAC signing secret
  is_active BOOLEAN DEFAULT true,
  -- Stats
  total_sent INTEGER DEFAULT 0,
  total_failed INTEGER DEFAULT 0,
  last_sent_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_webhooks_org ON webhooks(organization_id);

ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "webhooks_org_access" ON webhooks FOR ALL USING (organization_id = get_user_org_id());

-- WEBHOOK LOGS
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  event webhook_event NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  duration_ms INTEGER,
  success BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_webhook_logs_webhook ON webhook_logs(webhook_id, created_at DESC);

ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "webhook_logs_org_access" ON webhook_logs FOR ALL USING (
  webhook_id IN (SELECT id FROM webhooks WHERE organization_id = get_user_org_id())
);

-- BOT SCHEDULE (horaires d'activité)
CREATE TABLE bot_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=lundi
  start_time TIME NOT NULL DEFAULT '09:00',
  end_time TIME NOT NULL DEFAULT '20:00',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(sub_account_id, day_of_week)
);
CREATE INDEX idx_bot_schedules_sub ON bot_schedules(sub_account_id);

ALTER TABLE bot_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bot_schedules_org_access" ON bot_schedules FOR ALL USING (
  sub_account_id IN (SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id())
);

-- OPTIMIZE LOG (historique des optimisations IA)
ALTER TABLE sub_accounts ADD COLUMN IF NOT EXISTS last_optimized_at TIMESTAMPTZ;
ALTER TABLE sub_accounts ADD COLUMN IF NOT EXISTS optimization_score INTEGER DEFAULT 0;

-- Triggers
CREATE TRIGGER tr_api_keys_updated BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_webhooks_updated BEFORE UPDATE ON webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_bot_schedules_updated BEFORE UPDATE ON bot_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## ÉTAPE 2 — TYPES TYPESCRIPT

Ajouter à la fin de src/types/database.ts :

```typescript
// === SPRINT 3 TYPES ===

export type WebhookEvent = 'message.received' | 'message.sent' | 'conversation.created' | 'conversation.closed' | 'contact.created' | 'contact.updated' | 'booking.created' | 'booking.cancelled' | 'deal.stage_changed' | 'deal.won' | 'deal.lost'

export interface ApiKey {
  id: string
  organization_id: string
  name: string
  key_hash: string
  key_prefix: string
  permissions: string[]
  last_used_at?: string
  expires_at?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Webhook {
  id: string
  organization_id: string
  url: string
  events: WebhookEvent[]
  secret: string
  is_active: boolean
  total_sent: number
  total_failed: number
  last_sent_at?: string
  last_error?: string
  created_at: string
  updated_at: string
}

export interface WebhookLog {
  id: string
  webhook_id: string
  event: WebhookEvent
  payload: Record<string, unknown>
  response_status?: number
  response_body?: string
  duration_ms?: number
  success: boolean
  created_at: string
}

export interface BotSchedule {
  id: string
  sub_account_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
  created_at: string
  updated_at: string
}
```

---

## ÉTAPE 3 — WHITE-LABEL COMPLET

### Fichiers à créer :
- `src/components/settings/WhiteLabelSettings.tsx` — Page complète de config white-label
- `src/components/settings/BrandPreview.tsx` — Preview live du branding (login page mockup)
- `src/components/settings/ColorPicker.tsx` — Sélecteur de couleur avec presets + custom hex
- `src/components/settings/LogoUploader.tsx` — Upload logo + favicon avec preview

### Ajouter dans SettingsLayout.tsx :
- Nouvelle section "White-Label" avec icône Palette (lucide-react)
- Visible uniquement pour le plan "agency" (ou afficher avec badge "Plan Agency requis" pour les autres)

### UX White-Label :
- Formulaire divisé en sections : Marque (nom, logo, favicon, couleurs), SEO (titre, description), Légal (CGV URL, politique confidentialité URL), Login (image de fond custom)
- Preview live sur la droite : une mini reproduction de la page login avec le logo, les couleurs et le nom appliqués en temps réel pendant que l'utilisateur modifie
- Sélecteur de couleur principal : 8 presets (bleu, violet, vert, rouge, orange, rose, teal, indigo) + champ hex custom
- Couleur secondaire / accent auto-calculée
- Upload logo : drag & drop, preview, suppression. Formats acceptés : SVG, PNG. Taille max : 500KB
- Upload favicon : même chose, carré obligatoire
- Sélecteur de police : Plus Jakarta Sans, DM Sans, Inter, Satoshi, General Sans (dropdown avec preview de chaque font)
- Bouton "Prévisualiser" qui ouvre la page login dans un nouvel onglet avec le branding appliqué
- Bouton "Enregistrer" avec toast de confirmation

---

## ÉTAPE 4 — WEBHOOKS & API PUBLIQUE

### Fichiers à créer :
- `src/hooks/useApiKeys.ts` — CRUD clés API
- `src/hooks/useWebhooks.ts` — CRUD webhooks + logs
- `src/components/settings/ApiAccessSettings.tsx` — Gestion clés API + webhooks
- `src/components/settings/ApiKeyCard.tsx` — Card clé API (nom, préfixe, permissions, actions)
- `src/components/settings/CreateApiKeyDialog.tsx` — Modal création avec copie de la clé
- `src/components/settings/WebhookList.tsx` — Liste webhooks avec statut
- `src/components/settings/WebhookEditor.tsx` — Créer/éditer webhook (URL, events checkboxes, test)
- `src/components/settings/WebhookLogs.tsx` — Logs des derniers appels (statut, durée, payload)
- `src/components/settings/ApiDocs.tsx` — Documentation inline des endpoints

### Ajouter dans SettingsLayout.tsx :
- Nouvelle section "API & Webhooks" avec icône Code2 (lucide-react)

### UX Clés API :
- Liste des clés avec : nom, préfixe (ica_live_abc...), permissions badges, dernière utilisation, statut
- Bouton "Créer une clé" → Dialog : nom, permissions (checkboxes : Contacts, Conversations, Campagnes, Deals), expiration optionnelle
- Après création : afficher la clé complète UNE SEULE FOIS avec bouton copier et avertissement "Cette clé ne sera plus affichée"
- Bouton révoquer avec confirmation

### UX Webhooks :
- Liste avec : URL tronquée, events badges, succès/échecs, dernier appel, toggle actif
- Éditeur : champ URL, checkboxes pour chaque event (groupés par catégorie : Messages, Conversations, Contacts, Bookings, Deals), secret auto-généré avec copie
- Bouton "Tester" qui envoie un payload de test à l'URL
- Onglet Logs : tableau avec statut (200 vert, 4xx orange, 5xx rouge), event, durée, date, expand pour voir le payload

### Documentation inline (ApiDocs.tsx) :
- Accordéons par endpoint : GET /contacts, GET /conversations, POST /messages, etc.
- Chaque endpoint montre : méthode + URL, headers requis (Authorization: Bearer ica_live_xxx), paramètres, exemple de réponse JSON
- Bouton copier sur chaque exemple
- Note : "Documentation complète disponible sur docs.ikonik-ac.com" (lien futur)

---

## ÉTAPE 5 — BOT SCHEDULE + OPTIMIZE

### Fichiers à créer :
- `src/components/settings/BotScheduleSettings.tsx` — Grille horaire hebdomadaire
- `src/components/settings/ScheduleRow.tsx` — Ligne par jour (toggle, start time, end time)
- `src/components/settings/OptimizeBot.tsx` — Bouton + résultats d'optimisation

### Ajouter dans SettingsLayout.tsx / BotSettings.tsx :
- Section "Horaires du bot" dans les instructions bot
- Section "Optimisation" avec le bouton

### UX Bot Schedule :
- Grille 7 jours : Lundi → Dimanche
- Chaque jour : toggle actif/inactif + sélecteur heure début + sélecteur heure fin
- Presets rapides : "Horaires bureau" (lun-ven 9h-18h), "Étendu" (lun-sam 8h-21h), "24/7", "Custom"
- En dehors des horaires, le bot ne répond pas (message configurable : "Nous sommes actuellement fermés, nous reviendrons vers vous dès l'ouverture")
- Message hors horaires configurable dans un champ texte

### UX Optimize :
- Bouton "Optimiser mon agent" avec icône Sparkles
- Au clic : analyse les dernières conversations (mock pour le MVP — afficher un score et des suggestions)
- Résultats : score global 0-100, suggestions dans une liste :
  - "Ajouter une FAQ sur les délais de livraison (demandé 12 fois)"
  - "Le taux de réponse baisse après la 3ème relance — réduire à 2"
  - "Les prospects qualifiés le soir (après 19h) convertissent 40% mieux"
- Bouton "Appliquer les suggestions" (mock : affiche toast "Suggestions appliquées")
- Date de dernière optimisation affichée

---

## ÉTAPE 6 — POLISH + ROUTER + BUILD + DEPLOY

### Router — Pas de nouvelles pages, les nouveaux composants sont dans Settings.

### Sidebar — Pas de changement.

### SettingsLayout.tsx — Ajouter les sections :
```tsx
{ id: 'whitelabel', label: 'White-Label', icon: Palette },
{ id: 'api', label: 'API & Webhooks', icon: Code2 },
```
Importer Palette et Code2 de lucide-react.
La section "Instructions bot" doit maintenant inclure le BotScheduleSettings et OptimizeBot.

### Build + Deploy + Push :
```bash
npm run build
netlify deploy --prod --dir=dist
git add . && git commit -m "feat: Sprint 3 - white-label, API, webhooks, bot schedule, optimize" && git push
```

---

## DESIGN GUIDELINES (rappel)

- Même design system que Sprint 1-2
- shadcn/ui pour tous les composants
- Framer Motion partout
- Mobile-first
- Skeleton loading
- Empty states
- Toast notifications (sonner)
- Zéro jargon technique visible par le client final
- Le white-label doit donner envie — c'est l'argument de vente principal pour le plan Agency
