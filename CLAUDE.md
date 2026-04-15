# CLAUDE.md — AI CLOSER AGENT IKONIK

---

## ⚡ MODE AUTONOME TOTAL — LIRE EN PREMIER

**Tu travailles en mode 100% autonome. Johann n'est PAS disponible. Il a lancé le build et il est PARTI. Il ne reviendra pas avant que tout soit fini.**

### Interdictions absolues — JAMAIS faire ça :
- ❌ JAMAIS écrire "voulez-vous que je continue ?"
- ❌ JAMAIS écrire "dois-je passer à l'étape suivante ?"
- ❌ JAMAIS écrire "est-ce que ça vous convient ?"
- ❌ JAMAIS écrire "souhaitez-vous que je..."
- ❌ JAMAIS écrire "je peux aussi..." et attendre une réponse
- ❌ JAMAIS demander de confirmation, permission ou validation
- ❌ JAMAIS proposer des alternatives et attendre un choix
- ❌ JAMAIS faire un résumé entre deux étapes et s'arrêter
- ❌ JAMAIS écrire "Voilà ce que j'ai fait" et attendre
- ❌ JAMAIS poser UNE SEULE question à Johann

### Obligations absolues — TOUJOURS faire ça :
- ✅ TOUJOURS enchaîner étape 1 → 2 → 3 → ... → 17 SANS PAUSE
- ✅ TOUJOURS prendre les décisions techniques toi-même
- ✅ TOUJOURS corriger les erreurs toi-même sans demander
- ✅ TOUJOURS installer les dépendances manquantes toi-même (utiliser --legacy-peer-deps si conflit npm)
- ✅ TOUJOURS choisir l'option la plus premium/raffinée en cas de doute design
- ✅ TOUJOURS créer des fichiers de code, pas des messages explicatifs
- ✅ TOUJOURS activer UI/UX Pro Max skill AVANT chaque composant UI
- ✅ TOUJOURS utiliser 21st.dev MCP pour l'inspiration avant un composant majeur
- ✅ TOUJOURS utiliser Framer Motion pour les animations
- ✅ En cas de blocage IMPOSSIBLE (ex: clé API manquante), noter dans BLOCKERS.md et continuer les étapes non-dépendantes

### Objectif final
Quand tu finis l'étape 17, le projet doit être :
- `npm run build` → 0 erreurs
- Tous les composants UI sont en place et stylés
- Le router fonctionne avec les guards d'auth
- La migration Supabase est prête à être poussée
- Déployable sur Netlify

### Workflow de build — Exécute dans cet ordre exact, SANS JAMAIS T'ARRÊTER :
```
Étape 1  → Init projet + dépendances + config Vite/Tailwind/TS
Étape 2  → Design system (tokens CSS + tailwind.config)
Étape 3  → shadcn/ui (install + customize tous les composants listés)
Étape 4  → AppShell (Sidebar + Topbar + layout responsive + MobileNav)
Étape 5  → Auth (Login + Register + ForgotPassword + guards + Supabase Auth)
Étape 6  → Migration Supabase + types générés
Étape 7  → Onboarding 3 étapes (StepBusiness + StepChannels + StepActivation)
Étape 8  → Agent IA core (orchestrateur + prompts dynamiques + humanisation)
Étape 9  → Playground (chat simulé pour tester le bot)
Étape 10 → Inbox 3 colonnes (ConversationList + ChatWindow + ContactPanel + Realtime)
Étape 11 → Contacts CRM (table + filtres + recherche + tags + import CSV)
Étape 12 → Dashboard (StatCards + FunnelChart + ActivityChart + RecentConversations)
Étape 13 → Booking (Google Calendar OAuth + dispo + création événement)
Étape 14 → Settings (profil + canaux + bot config + BYOK + équipe)
Étape 15 → Widget WebChat (composant embarquable + script embed)
Étape 16 → Polish (mobile responsive + animations Framer Motion + loading states + error handling + empty states)
Étape 17 → Config Netlify (netlify.toml + build + redirects SPA)
```

**Commence à l'étape 1 et ne t'arrête qu'à la fin de l'étape 17.**

---

## IDENTITÉ PROJET
- **Nom** : AI Closer Agent
- **Entreprise** : IKONIK Artisan Créatif (ikonik-ac.com)
- **Fondateur** : Johann, basé à Rouen
- **Mission** : Agent IA de vente conversationnelle white-label pour le marché français
- **Baseline** : "Colle ton URL, choisis ta verticale, 3 clics, l'agent est actif."

## STACK TECHNIQUE

| Couche | Technologie | Version |
|--------|------------|---------|
| Frontend | React + Vite + Tailwind CSS | React 19, Vite 6, Tailwind 4 |
| Animations | Framer Motion | latest |
| UI Components | shadcn/ui + Radix | latest |
| Backend/DB | Supabase (PostgreSQL + Auth + Realtime + Storage + Edge Functions) | latest |
| IA conversationnelle | Claude API (Anthropic) | claude-sonnet-4-20250514 |
| IA multimodale | Google Gemini API (voice notes, images) | latest |
| WhatsApp | WhatsApp Business API via 360dialog | v2 |
| Instagram/Messenger | Meta Graph API | v21.0 |
| SMS | Twilio | latest |
| Email transactionnel | Resend | latest |
| Booking | Google Calendar API | v3 |
| Déploiement | Netlify | latest |
| Repo | GitHub (webflowjohann-prog/) | - |
| Webhooks/Automatisation | n8n | latest |

## SKILLS & OUTILS DISPONIBLES DANS CLAUDE CODE
- **11 skills personnalisés** (~/.claude/skills/)
- **UI/UX Pro Max skill** (design system generation, patterns, anti-patterns)
- **21st.dev MCP** (inspiration composants + icônes SVG)
- **Framer Motion** (animations, transitions, micro-interactions)
- Toujours activer UI/UX Pro Max en premier sur chaque composant UI

## PRINCIPES DE DESIGN NON-NÉGOCIABLES

### Esthétique : "Luxury SaaS Français"
- **Tone** : Premium, raffiné, confiance. Pas clinquant, pas corporate fade.
- **Inspiration** : Linear.app (précision), Stripe Dashboard (clarté), Notion (simplicité), Intercom (chaleur conversationnelle)
- **Interdit** : Arial, Inter, Roboto, gradients violet génériques, esthétique "AI slop"

### Typographie
- Display/Headings : Police distinctive premium (ex: Satoshi, Cabinet Grotesk, General Sans, Plus Jakarta Sans)
- Body : Police lisible élégante (ex: DM Sans, Outfit, Manrope)
- Mono (code/metrics) : JetBrains Mono ou Fira Code
- Charger via Google Fonts ou Fontsource

### Palette de couleurs (tokens CSS)
```css
:root {
  /* Brand */
  --color-brand-50: #f0f4ff;
  --color-brand-100: #dbe4ff;
  --color-brand-200: #bac8ff;
  --color-brand-300: #91a7ff;
  --color-brand-400: #748ffc;
  --color-brand-500: #5c7cfa;  /* Primary */
  --color-brand-600: #4c6ef5;
  --color-brand-700: #4263eb;
  --color-brand-800: #3b5bdb;
  --color-brand-900: #364fc7;

  /* Neutrals */
  --color-gray-50: #f8f9fa;
  --color-gray-100: #f1f3f5;
  --color-gray-200: #e9ecef;
  --color-gray-300: #dee2e6;
  --color-gray-400: #ced4da;
  --color-gray-500: #adb5bd;
  --color-gray-600: #868e96;
  --color-gray-700: #495057;
  --color-gray-800: #343a40;
  --color-gray-900: #212529;

  /* Semantic */
  --color-success: #40c057;
  --color-warning: #fab005;
  --color-danger: #fa5252;
  --color-info: #339af0;

  /* Status pipeline */
  --status-new: #748ffc;
  --status-qualified: #fab005;
  --status-meeting: #339af0;
  --status-proposal: #9775fa;
  --status-closed-won: #40c057;
  --status-closed-lost: #fa5252;

  /* Surfaces */
  --surface-primary: #ffffff;
  --surface-secondary: #f8f9fa;
  --surface-tertiary: #f1f3f5;
  --surface-elevated: #ffffff;

  /* Spacing scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.03);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.02);
}

/* Dark mode */
[data-theme="dark"] {
  --surface-primary: #1a1b1e;
  --surface-secondary: #25262b;
  --surface-tertiary: #2c2e33;
  --surface-elevated: #2c2e33;
  --color-gray-50: #212529;
  --color-gray-100: #25262b;
  --color-gray-200: #2c2e33;
  --color-gray-800: #e9ecef;
  --color-gray-900: #f8f9fa;
}
```

### Animations (Framer Motion)
```tsx
// Page transitions
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } }
}

// Stagger children
const containerVariants = {
  animate: { transition: { staggerChildren: 0.06 } }
}

// Micro-interactions (boutons, cards)
const hoverScale = { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } }

// Sidebar slide
const sidebarVariants = {
  open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  closed: { x: -280 }
}
```

### Composants UI — Règles
1. Tous les composants interactifs ont un état hover, focus, active, disabled
2. Les transitions sont à 200ms ease minimum
3. Les badges de statut utilisent les couleurs sémantiques avec fond léger (10% opacity) + texte couleur pleine
4. Les avatars ont un fallback avec initiales sur fond brand
5. Les tableaux ont un hover row highlight
6. Les champs de formulaire ont un focus ring brand-500
7. Les notifications toast arrivent en slide depuis le haut-droit
8. Le skeleton loading utilise des blocs animés pulse, jamais un spinner seul
9. Mobile-first : tous les layouts commencent en mobile puis s'étendent

### UX — Règles absolues
1. Un patron de clinique ou un agent immobilier doit configurer son agent en < 5 minutes
2. Zéro jargon technique visible par le client final (pas de "webhook", "endpoint", "API key")
3. Mobile-first
4. Le bot doit être testable avant activation (Playground)
5. Chaque interaction doit se sentir comme un SMS humain
6. Les playbooks verticaux fonctionnent "out of the box"
7. Le français est la langue native, pas une traduction

---

## ARCHITECTURE DU PROJET

```
ai-closer-agent/
├── CLAUDE.md                          # Ce fichier
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── index.html
├── netlify.toml
├── .env.example
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── main.tsx                       # Entry point
│   ├── App.tsx                        # Router + Layout
│   ├── index.css                      # Tailwind imports + CSS tokens
│   │
│   ├── components/
│   │   ├── ui/                        # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── separator.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AppShell.tsx           # Sidebar + Topbar + Content area
│   │   │   ├── Sidebar.tsx            # Navigation principale
│   │   │   ├── Topbar.tsx             # Barre supérieure (org switcher, user menu)
│   │   │   ├── MobileNav.tsx          # Navigation mobile bottom tabs
│   │   │   └── PageHeader.tsx         # Titre page + breadcrumbs + actions
│   │   │
│   │   ├── onboarding/
│   │   │   ├── OnboardingShell.tsx    # Layout 3 étapes (stepper)
│   │   │   ├── StepBusiness.tsx       # Étape 1 : URL + verticale
│   │   │   ├── StepChannels.tsx       # Étape 2 : Connexion canaux
│   │   │   ├── StepActivation.tsx     # Étape 3 : Preview + activation
│   │   │   └── VerticalSelector.tsx   # Grille de sélection verticale
│   │   │
│   │   ├── inbox/
│   │   │   ├── InboxLayout.tsx        # 3 colonnes (liste | conversation | détails)
│   │   │   ├── ConversationList.tsx   # Liste des conversations
│   │   │   ├── ConversationItem.tsx   # Item conversation (avatar, preview, badge)
│   │   │   ├── ChatWindow.tsx         # Zone de messages
│   │   │   ├── MessageBubble.tsx      # Bulle de message (in/out/bot)
│   │   │   ├── ChatInput.tsx          # Zone de saisie + actions
│   │   │   ├── ContactPanel.tsx       # Panel latéral infos contact
│   │   │   └── ChannelBadge.tsx       # Badge WhatsApp/Insta/Web/SMS
│   │   │
│   │   ├── contacts/
│   │   │   ├── ContactsTable.tsx      # Table CRM avec colonnes
│   │   │   ├── ContactRow.tsx         # Ligne contact
│   │   │   ├── ContactDetail.tsx      # Fiche contact complète
│   │   │   ├── ContactFilters.tsx     # Filtres + recherche
│   │   │   ├── ImportCSV.tsx          # Modal import CSV
│   │   │   └── TagManager.tsx         # Gestion tags (CRUD)
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardGrid.tsx      # Grille de KPIs
│   │   │   ├── StatCard.tsx           # Carte métrique individuelle
│   │   │   ├── FunnelChart.tsx        # Envoyé → Livré → Lu → Répondu → RDV
│   │   │   ├── ActivityChart.tsx      # Graphe activité 30 jours
│   │   │   └── RecentConversations.tsx # Dernières conversations
│   │   │
│   │   ├── booking/
│   │   │   ├── BookingCalendar.tsx    # Vue calendrier RDV
│   │   │   ├── BookingSlots.tsx       # Créneaux disponibles
│   │   │   └── BookingSettings.tsx    # Config Google Calendar
│   │   │
│   │   ├── settings/
│   │   │   ├── SettingsLayout.tsx     # Layout settings avec nav latérale
│   │   │   ├── ProfileSettings.tsx    # Profil entreprise
│   │   │   ├── ChannelSettings.tsx    # Config canaux
│   │   │   ├── BotSettings.tsx        # Instructions bot + personality
│   │   │   ├── ApiKeySettings.tsx     # BYOK Claude API key
│   │   │   ├── TeamSettings.tsx       # Gestion équipe
│   │   │   └── BillingSettings.tsx    # Facturation
│   │   │
│   │   ├── playground/
│   │   │   ├── PlaygroundChat.tsx     # Simulateur de conversation
│   │   │   └── PlaygroundControls.tsx # Contrôles (verticale, persona, reset)
│   │   │
│   │   └── shared/
│   │       ├── Logo.tsx               # Logo IKONIK / white-label
│   │       ├── EmptyState.tsx         # États vides avec illustration
│   │       ├── LoadingState.tsx       # Skeleton loading patterns
│   │       ├── ErrorBoundary.tsx      # Error boundary global
│   │       ├── ConfirmDialog.tsx      # Dialog de confirmation
│   │       ├── SearchInput.tsx        # Barre de recherche globale
│   │       └── StatusBadge.tsx        # Badge de statut réutilisable
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   └── OnboardingPage.tsx
│   │   │
│   │   ├── DashboardPage.tsx
│   │   ├── InboxPage.tsx
│   │   ├── ContactsPage.tsx
│   │   ├── BookingPage.tsx
│   │   ├── PlaygroundPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                # Auth state + guards
│   │   ├── useOrganization.ts        # Org context (multi-tenant)
│   │   ├── useSubAccount.ts          # Sub-account switcher
│   │   ├── useConversations.ts       # Realtime conversations
│   │   ├── useMessages.ts            # Messages d'une conversation
│   │   ├── useContacts.ts            # CRUD contacts
│   │   ├── useBookings.ts            # CRUD bookings
│   │   ├── useBotConfig.ts           # Config bot (instructions, FAQs)
│   │   ├── useChannels.ts            # État des canaux connectés
│   │   ├── useDashboardStats.ts      # KPIs temps réel
│   │   ├── usePlayground.ts          # Conversation simulée
│   │   └── useMediaQuery.ts          # Responsive breakpoints
│   │
│   ├── lib/
│   │   ├── supabase.ts               # Client Supabase init
│   │   ├── claude.ts                 # Client Claude API (BYOK)
│   │   ├── channels/
│   │   │   ├── whatsapp.ts           # WhatsApp Business API helpers
│   │   │   ├── instagram.ts          # Instagram Messaging API helpers
│   │   │   ├── messenger.ts          # Messenger API helpers
│   │   │   ├── sms.ts                # Twilio helpers
│   │   │   └── webchat.ts            # WebChat widget helpers
│   │   │
│   │   ├── ai/
│   │   │   ├── agent.ts              # Orchestrateur agent IA
│   │   │   ├── prompts.ts            # System prompts par verticale
│   │   │   ├── playbooks.ts          # Playbooks verticaux (data)
│   │   │   ├── qualification.ts      # Logique de qualification leads
│   │   │   ├── objections.ts         # Gestion objections par verticale
│   │   │   └── humanize.ts           # Humanisation réponses (délai, chunks, typos)
│   │   │
│   │   ├── scraper.ts                # Scraping site client (Edge Function)
│   │   ├── calendar.ts               # Google Calendar API helpers
│   │   ├── email.ts                  # Resend helpers
│   │   └── utils.ts                  # Utilitaires généraux
│   │
│   ├── stores/
│   │   ├── authStore.ts              # Zustand — état auth
│   │   ├── orgStore.ts               # Zustand — organisation courante
│   │   ├── inboxStore.ts             # Zustand — inbox state
│   │   └── uiStore.ts                # Zustand — sidebar, theme, modals
│   │
│   └── types/
│       ├── database.ts               # Types générés par Supabase CLI
│       ├── api.ts                    # Types API responses
│       ├── channels.ts               # Types canaux
│       └── playbooks.ts              # Types playbooks verticaux
│
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   └── 001_initial_schema.sql    # Schéma complet ci-dessous
│   ├── functions/
│   │   ├── webhook-whatsapp/         # Réception messages WhatsApp
│   │   ├── webhook-instagram/        # Réception messages Instagram
│   │   ├── webhook-messenger/        # Réception messages Messenger
│   │   ├── webhook-sms/              # Réception SMS Twilio
│   │   ├── agent-respond/            # Orchestrateur réponse IA
│   │   ├── scrape-website/           # Scraping site client
│   │   ├── generate-faqs/            # Génération FAQs depuis scraping
│   │   └── calendar-check/           # Vérification dispo calendrier
│   └── seed.sql                      # Données de seed (playbooks, templates)
│
└── widget/                           # Widget chat embarquable
    ├── package.json
    ├── vite.config.ts
    ├── src/
    │   ├── Widget.tsx                 # Composant chat widget
    │   ├── WidgetButton.tsx           # Bouton flottant
    │   ├── WidgetChat.tsx             # Interface de chat
    │   └── embed.ts                   # Script d'embed (1 ligne à coller)
    └── dist/                          # Build pour CDN
```

---

## SCHÉMA DE BASE DE DONNÉES SUPABASE

### Principes
- Multi-tenant : Organization (revendeur) → Sub-Account (client final) → données
- RLS (Row Level Security) sur TOUTES les tables
- Soft delete (deleted_at) sur les entités principales
- Timestamps created_at/updated_at sur toutes les tables
- UUIDs partout

```sql
-- ============================================================
-- 001_initial_schema.sql
-- AI Closer Agent IKONIK — Schéma complet MVP
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Recherche fuzzy

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE org_plan AS ENUM ('starter', 'pro', 'agency');
CREATE TYPE channel_type AS ENUM ('whatsapp', 'instagram', 'messenger', 'sms', 'webchat');
CREATE TYPE channel_status AS ENUM ('connected', 'disconnected', 'pending', 'error');
CREATE TYPE contact_status AS ENUM ('new', 'qualified', 'meeting_booked', 'proposal', 'closed_won', 'closed_lost', 'unresponsive');
CREATE TYPE message_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE message_sender_type AS ENUM ('contact', 'bot', 'human');
CREATE TYPE message_content_type AS ENUM ('text', 'image', 'video', 'audio', 'document', 'location', 'template');
CREATE TYPE message_status AS ENUM ('queued', 'sent', 'delivered', 'read', 'failed');
CREATE TYPE conversation_status AS ENUM ('active', 'bot_active', 'human_takeover', 'closed');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');
CREATE TYPE vertical_type AS ENUM ('immobilier_luxe', 'clinique_esthetique', 'coach_formateur', 'restaurant_hotel', 'concession_auto', 'autre');

-- ============================================================
-- ORGANIZATIONS (Revendeurs / Agences)
-- ============================================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan org_plan NOT NULL DEFAULT 'starter',
  logo_url TEXT,
  website_url TEXT,
  
  -- White-label
  custom_domain TEXT,
  brand_name TEXT,
  brand_color TEXT DEFAULT '#5c7cfa',
  
  -- BYOK
  claude_api_key_encrypted TEXT,  -- Chiffré avec pgcrypto
  gemini_api_key_encrypted TEXT,
  
  -- Limites par plan
  max_sub_accounts INTEGER NOT NULL DEFAULT 5,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- USERS (Membres d'une organisation)
-- ============================================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'member',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_org ON users(organization_id);

-- ============================================================
-- SUB-ACCOUNTS (Clients finaux du revendeur)
-- ============================================================

CREATE TABLE sub_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  vertical vertical_type NOT NULL DEFAULT 'autre',
  
  -- Info entreprise (scraping + manuel)
  website_url TEXT,
  description TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  
  -- Config bot
  bot_instructions TEXT,          -- System prompt custom
  bot_personality TEXT,           -- Personnalité (formel, amical, luxe...)
  bot_language TEXT DEFAULT 'fr',
  bot_active BOOLEAN DEFAULT false,
  
  -- Response settings
  response_delay_min INTEGER DEFAULT 3,    -- Secondes
  response_delay_max INTEGER DEFAULT 12,
  response_length_min INTEGER DEFAULT 20,  -- Mots
  response_length_max INTEGER DEFAULT 60,
  max_message_chunks INTEGER DEFAULT 3,    -- Nombre de bulles max
  typing_speed INTEGER DEFAULT 40,         -- Chars/seconde simulés
  
  -- Booking
  google_calendar_id TEXT,
  google_calendar_token_encrypted TEXT,
  booking_duration_minutes INTEGER DEFAULT 30,
  booking_buffer_minutes INTEGER DEFAULT 15,
  booking_link_external TEXT,     -- Calendly, Acuity, etc.
  
  -- Limites
  bot_message_limit INTEGER,     -- null = illimité
  chat_memory_tokens INTEGER DEFAULT 50000,
  
  -- BYOK override (si différent de l'org)
  claude_api_key_encrypted TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  UNIQUE(organization_id, slug)
);

CREATE INDEX idx_sub_accounts_org ON sub_accounts(organization_id);

-- ============================================================
-- CHANNELS (Canaux connectés par sub-account)
-- ============================================================

CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  type channel_type NOT NULL,
  status channel_status NOT NULL DEFAULT 'disconnected',
  
  -- Identifiants du canal
  external_id TEXT,               -- WhatsApp phone ID, IG page ID, etc.
  external_name TEXT,             -- Nom affiché
  
  -- Config spécifique
  config JSONB DEFAULT '{}',      -- Tokens, API keys, metadata canal
  
  -- Statistiques
  messages_sent INTEGER DEFAULT 0,
  messages_received INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(sub_account_id, type)    -- 1 canal par type par sub-account
);

CREATE INDEX idx_channels_sub ON channels(sub_account_id);

-- ============================================================
-- CONTACTS (CRM)
-- ============================================================

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  
  -- Identité
  first_name TEXT,
  last_name TEXT,
  full_name TEXT GENERATED ALWAYS AS (
    COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')
  ) STORED,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  
  -- Canal source
  channel_type channel_type,
  channel_contact_id TEXT,        -- ID du contact dans le canal (WA number, IG user ID)
  
  -- Qualification
  status contact_status NOT NULL DEFAULT 'new',
  score INTEGER DEFAULT 0,        -- Score de qualification 0-100
  
  -- Données structurées (qualification)
  qualification_data JSONB DEFAULT '{}',
  -- Ex immobilier : { budget: "500K-1M", surface: "120m2", localisation: "Rouen centre", delai: "6 mois" }
  -- Ex clinique : { traitement: "rhinoplastie", budget: "3000-5000", deja_consulte: true }
  
  -- Tags
  tags TEXT[] DEFAULT '{}',
  
  -- Bot
  bot_active BOOLEAN DEFAULT true,
  bot_messages_count INTEGER DEFAULT 0,
  
  -- Metadata
  notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  last_active_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_contacts_sub ON contacts(sub_account_id);
CREATE INDEX idx_contacts_status ON contacts(sub_account_id, status);
CREATE INDEX idx_contacts_channel ON contacts(channel_type, channel_contact_id);
CREATE INDEX idx_contacts_search ON contacts USING gin(full_name gin_trgm_ops);
CREATE INDEX idx_contacts_tags ON contacts USING gin(tags);

-- ============================================================
-- CONVERSATIONS
-- ============================================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  
  status conversation_status NOT NULL DEFAULT 'bot_active',
  
  -- Contexte
  channel_type channel_type NOT NULL,
  subject TEXT,                    -- Sujet auto-détecté
  
  -- Compteurs
  message_count INTEGER DEFAULT 0,
  unread_count INTEGER DEFAULT 0,
  bot_message_count INTEGER DEFAULT 0,
  
  -- Dernière activité
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,       -- Preview du dernier message (100 chars)
  last_message_direction message_direction,
  
  -- Assignation humain
  assigned_user_id UUID REFERENCES users(id),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

CREATE INDEX idx_conversations_sub ON conversations(sub_account_id);
CREATE INDEX idx_conversations_contact ON conversations(contact_id);
CREATE INDEX idx_conversations_status ON conversations(sub_account_id, status);
CREATE INDEX idx_conversations_last_msg ON conversations(sub_account_id, last_message_at DESC);

-- ============================================================
-- MESSAGES
-- ============================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  
  -- Contenu
  direction message_direction NOT NULL,
  sender_type message_sender_type NOT NULL,
  content_type message_content_type NOT NULL DEFAULT 'text',
  content TEXT,                    -- Texte du message
  media_url TEXT,                  -- URL média (image, audio, vidéo)
  media_mime_type TEXT,
  
  -- Statut livraison
  status message_status NOT NULL DEFAULT 'queued',
  
  -- Canal
  channel_type channel_type NOT NULL,
  external_message_id TEXT,        -- ID du message dans le canal externe
  
  -- Metadata IA
  ai_model TEXT,                   -- 'claude-sonnet-4-20250514', etc.
  ai_tokens_used INTEGER,
  ai_cost_usd DECIMAL(10, 6),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_sub ON messages(sub_account_id, created_at DESC);

-- ============================================================
-- FAQS / KNOWLEDGE BASE
-- ============================================================

CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  
  -- Vectoriel (pour RAG)
  embedding VECTOR(1536),         -- OpenAI ada-002 ou equivalent
  
  -- Stats
  times_used INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Source
  source TEXT DEFAULT 'manual',   -- 'manual', 'scraped', 'generated'
  source_url TEXT,
  
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_faqs_sub ON faqs(sub_account_id);

-- ============================================================
-- BOOKINGS (Rendez-vous)
-- ============================================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id),
  
  -- RDV
  title TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'Europe/Paris',
  
  status booking_status NOT NULL DEFAULT 'pending',
  
  -- Google Calendar
  google_event_id TEXT,
  meeting_link TEXT,               -- Zoom, Google Meet, etc.
  
  -- Metadata
  notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ
);

CREATE INDEX idx_bookings_sub ON bookings(sub_account_id);
CREATE INDEX idx_bookings_contact ON bookings(contact_id);
CREATE INDEX idx_bookings_date ON bookings(sub_account_id, starts_at);

-- ============================================================
-- PLAYBOOKS (Templates par verticale)
-- ============================================================

CREATE TABLE playbooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vertical vertical_type NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Config IA
  system_prompt TEXT NOT NULL,          -- System prompt de base
  qualification_fields JSONB NOT NULL,  -- Champs à qualifier
  objection_handlers JSONB NOT NULL,    -- Objections + réponses
  conversation_goals JSONB NOT NULL,    -- Objectifs de conversation
  
  -- Booking
  default_booking_duration INTEGER DEFAULT 30,
  booking_prompt TEXT,                  -- Message pour proposer RDV
  
  -- Templates messages
  greeting_templates JSONB,
  follow_up_templates JSONB,
  closing_templates JSONB,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_playbooks_vertical ON playbooks(vertical);

-- ============================================================
-- ANALYTICS EVENTS (Événements pour dashboard)
-- ============================================================

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  
  event_type TEXT NOT NULL,        -- 'message_sent', 'message_delivered', 'message_read', 'reply_received', 'booking_created', 'lead_qualified', etc.
  
  -- Références optionnelles
  contact_id UUID REFERENCES contacts(id),
  conversation_id UUID REFERENCES conversations(id),
  message_id UUID REFERENCES messages(id),
  booking_id UUID REFERENCES bookings(id),
  
  -- Data
  channel_type channel_type,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_sub_date ON analytics_events(sub_account_id, created_at DESC);
CREATE INDEX idx_analytics_type ON analytics_events(sub_account_id, event_type, created_at DESC);

-- Partition par mois pour les performances (optionnel, à activer en prod)
-- CREATE TABLE analytics_events (...) PARTITION BY RANGE (created_at);

-- ============================================================
-- AUDIT LOG
-- ============================================================

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  
  action TEXT NOT NULL,           -- 'bot.activated', 'channel.connected', 'contact.deleted', etc.
  entity_type TEXT,
  entity_id UUID,
  
  old_data JSONB,
  new_data JSONB,
  
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_org ON audit_log(organization_id, created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Helper function : get user's organization
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Organizations : les membres voient leur org
CREATE POLICY "org_member_access" ON organizations
  FOR ALL USING (id = get_user_org_id());

-- Users : les membres voient les users de leur org
CREATE POLICY "users_org_access" ON users
  FOR ALL USING (organization_id = get_user_org_id());

-- Sub-accounts : via org
CREATE POLICY "sub_accounts_org_access" ON sub_accounts
  FOR ALL USING (organization_id = get_user_org_id());

-- Channels : via sub-account → org
CREATE POLICY "channels_org_access" ON channels
  FOR ALL USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

-- Contacts : via sub-account → org
CREATE POLICY "contacts_org_access" ON contacts
  FOR ALL USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

-- Conversations : via sub-account → org
CREATE POLICY "conversations_org_access" ON conversations
  FOR ALL USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

-- Messages : via sub-account → org
CREATE POLICY "messages_org_access" ON messages
  FOR ALL USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

-- FAQs : via sub-account → org
CREATE POLICY "faqs_org_access" ON faqs
  FOR ALL USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

-- Bookings : via sub-account → org
CREATE POLICY "bookings_org_access" ON bookings
  FOR ALL USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

-- Analytics : via sub-account → org
CREATE POLICY "analytics_org_access" ON analytics_events
  FOR ALL USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

-- Audit : via org
CREATE POLICY "audit_org_access" ON audit_log
  FOR ALL USING (organization_id = get_user_org_id());

-- Playbooks : lecture publique (templates système)
CREATE POLICY "playbooks_read" ON playbooks
  FOR SELECT USING (is_active = true);

-- ============================================================
-- TRIGGERS : updated_at auto
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_organizations_updated BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_sub_accounts_updated BEFORE UPDATE ON sub_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_channels_updated BEFORE UPDATE ON channels FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_contacts_updated BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_conversations_updated BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_faqs_updated BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_bookings_updated BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- REALTIME : activer sur les tables qui en ont besoin
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- ============================================================
-- FUNCTIONS utilitaires
-- ============================================================

-- Incrémenter les compteurs de conversation quand un message arrive
CREATE OR REPLACE FUNCTION on_new_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations SET
    message_count = message_count + 1,
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.content, 100),
    last_message_direction = NEW.direction,
    unread_count = CASE
      WHEN NEW.direction = 'inbound' THEN unread_count + 1
      ELSE unread_count
    END,
    bot_message_count = CASE
      WHEN NEW.sender_type = 'bot' THEN bot_message_count + 1
      ELSE bot_message_count
    END,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  
  -- Mettre à jour le contact
  UPDATE contacts SET
    last_active_at = NEW.created_at,
    bot_messages_count = CASE
      WHEN NEW.sender_type = 'bot' THEN bot_messages_count + 1
      ELSE bot_messages_count
    END,
    updated_at = NOW()
  WHERE id = (
    SELECT contact_id FROM conversations WHERE id = NEW.conversation_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_on_new_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION on_new_message();
```

---

## SPRINT 1 — MVP (4-5 semaines)

### Semaine 1 : Fondations
| Tâche | Détail |
|-------|--------|
| Init projet | `npm create vite@latest` + Tailwind + shadcn/ui + Framer Motion |
| Supabase | Créer projet, appliquer migration 001, configurer Auth |
| AppShell | Sidebar + Topbar + responsive layout |
| Auth | Login / Register / Forgot Password avec Supabase Auth |
| Router | React Router v7, routes protégées, guards auth |
| Design system | Tokens CSS, composants de base shadcn/ui customisés |

### Semaine 2 : Onboarding + Bot Engine
| Tâche | Détail |
|-------|--------|
| Onboarding 3 étapes | StepBusiness (URL + vertical) → StepChannels → StepActivation |
| Scraper Edge Function | Scrape URL, extraire texte, générer bot instructions + FAQs |
| Playbooks seed | 5 playbooks verticaux (immobilier, clinique, coach, restaurant, auto) |
| Agent IA core | Orchestrateur Claude API : system prompt + FAQs + memory + humanisation |
| Playground | Chat simulé pour tester le bot avant activation |

### Semaine 3 : Inbox + Contacts
| Tâche | Détail |
|-------|--------|
| Inbox layout | 3 colonnes responsive (liste | chat | contact panel) |
| Messages realtime | Supabase Realtime subscriptions sur conversations + messages |
| Webhook WhatsApp | Edge Function réception + envoi via 360dialog |
| Webhook Instagram | Edge Function réception + envoi via Meta Graph API |
| Widget WebChat | Widget React embarquable, script 1 ligne |
| Contacts table | CRM table avec filtres, recherche, tags, import CSV |

### Semaine 4 : Dashboard + Booking + Settings
| Tâche | Détail |
|-------|--------|
| Dashboard | KPIs funnel + graphe activité 30j + conversations récentes |
| Booking | Google Calendar OAuth + vérification dispo + création événement |
| Settings | Profil entreprise, canaux, instructions bot, BYOK, équipe |
| Multi-tenant | Org switcher, sub-account switcher, RLS vérifié |

### Semaine 5 : Polish + Beta
| Tâche | Détail |
|-------|--------|
| Mobile responsive | Tester et ajuster tous les écrans mobile |
| Error handling | Error boundaries, toasts, états vides, skeleton loading |
| Onboarding tour | Tooltips de guidage premier usage |
| Deploy Netlify | CI/CD GitHub → Netlify, custom domain |
| Beta Maison Berlioz | Onboarding Samy + Baptiste, playbook immobilier luxe |

---

## CONVENTIONS DE CODE

### Nommage
- Composants React : PascalCase (`ConversationList.tsx`)
- Hooks : camelCase avec préfixe `use` (`useConversations.ts`)
- Utilitaires : camelCase (`formatDate.ts`)
- Types : PascalCase (`Contact`, `Message`, `Conversation`)
- Tables SQL : snake_case pluriel (`sub_accounts`, `analytics_events`)
- Colonnes SQL : snake_case (`created_at`, `sub_account_id`)

### Imports
```tsx
// 1. React / libraries externes
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 2. Composants UI
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// 3. Composants internes
import { ContactPanel } from '@/components/inbox/ContactPanel'

// 4. Hooks
import { useConversations } from '@/hooks/useConversations'

// 5. Libs / utils
import { supabase } from '@/lib/supabase'
import { formatRelativeDate } from '@/lib/utils'

// 6. Types
import type { Conversation } from '@/types/database'
```

### État
- Zustand pour l'état global (auth, org, UI)
- React Query (TanStack Query) pour le server state (contacts, conversations, FAQs)
- useState pour l'état local de composant
- Supabase Realtime pour les updates temps réel (messages, conversations)

### Erreurs
- Toujours un try/catch sur les appels Supabase/API
- Toast notification pour les erreurs utilisateur
- Console.error + Sentry (futur) pour les erreurs techniques
- Never show raw error messages to users

---

## PLAYBOOK VERTICALE EXEMPLE : IMMOBILIER LUXE

```json
{
  "vertical": "immobilier_luxe",
  "name": "Agent Immobilier Luxe",
  "system_prompt": "Tu es l'assistant commercial de {{company_name}}, agence immobilière de prestige. Tu t'adresses à des prospects fortunés qui recherchent des biens d'exception.\n\nRÈGLES :\n- Vouvoiement obligatoire\n- Ton élégant, jamais familier\n- Vocabulaire luxe : \"propriété d'exception\", \"emplacement privilégié\", \"prestations haut de gamme\"\n- Ne jamais parler de prix en premier, qualifier d'abord\n- Créer un sentiment d'exclusivité et de rareté\n- Maximum 2-3 phrases par message\n- Poser UNE question à la fois\n\nFLOW :\n1. Accueil chaleureux et professionnel\n2. Comprendre le projet (achat/vente/investissement)\n3. Qualifier : budget, surface, localisation, délai\n4. Présenter 1-2 biens correspondants (si disponibles dans la base)\n5. Proposer un rendez-vous privé avec un conseiller\n\nOBJECTIF : Obtenir un rendez-vous en présentiel.",
  
  "qualification_fields": [
    { "key": "project_type", "label": "Type de projet", "options": ["Achat résidence principale", "Achat résidence secondaire", "Investissement locatif", "Vente"] },
    { "key": "budget", "label": "Budget", "options": ["300K-500K", "500K-1M", "1M-2M", "2M-5M", "5M+"] },
    { "key": "surface", "label": "Surface souhaitée", "type": "text" },
    { "key": "location", "label": "Secteur recherché", "type": "text" },
    { "key": "timeline", "label": "Délai", "options": ["Immédiat", "3 mois", "6 mois", "1 an", "Pas de rush"] }
  ],
  
  "objection_handlers": [
    {
      "objection": "C'est trop cher",
      "response": "Je comprends votre réflexion. L'emplacement et les prestations de ce bien en font un investissement patrimonial rare. Souhaitez-vous que nous explorions ensemble des alternatives dans votre enveloppe, ou que je vous présente l'historique de valorisation du quartier ?"
    },
    {
      "objection": "Je veux juste regarder",
      "response": "Bien sûr, c'est la meilleure approche. Pour vous présenter des biens réellement pertinents, puis-je vous poser quelques questions sur vos critères ? Cela nous évitera de vous montrer des propriétés qui ne correspondent pas à vos attentes."
    },
    {
      "objection": "J'ai déjà un agent",
      "response": "Tout à fait, c'est important d'être bien accompagné. Notre valeur ajoutée réside dans notre accès à des biens off-market et notre réseau d'exception. Seriez-vous ouvert à un échange sans engagement pour découvrir nos exclusivités ?"
    }
  ]
}
```

---

## VARIABLES D'ENVIRONNEMENT (.env.example)

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxx

# Claude API (fallback si pas de BYOK)
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Google
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx

# WhatsApp (360dialog)
WHATSAPP_API_KEY=xxxxx
WHATSAPP_WEBHOOK_SECRET=xxxxx

# Meta (Instagram/Messenger)
META_APP_ID=xxxxx
META_APP_SECRET=xxxxx
META_VERIFY_TOKEN=xxxxx

# Twilio (SMS)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+33xxxxx

# Resend (Email)
RESEND_API_KEY=re_xxxxx

# Encryption key pour les API keys stockées
ENCRYPTION_KEY=xxxxx
```

---

## COMMANDES DE DÉMARRAGE

```bash
# 1. Init projet
npm create vite@latest ai-closer-agent -- --template react-ts
cd ai-closer-agent

# 2. Dépendances core
npm install @supabase/supabase-js @supabase/auth-helpers-react
npm install framer-motion
npm install zustand @tanstack/react-query
npm install react-router-dom
npm install date-fns
npm install lucide-react
npm install recharts
npm install sonner  # Toast notifications

# 3. shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input badge card dialog dropdown-menu avatar toast skeleton tabs select textarea switch slider table tooltip separator

# 4. Tailwind (déjà inclus via Vite template)

# 5. Dev
npm run dev

# 6. Supabase CLI
npx supabase init
npx supabase db push  # Appliquer la migration
npx supabase gen types typescript --local > src/types/database.ts
```

---

## ORDRE DE BUILD POUR CLAUDE CODE

**RAPPEL : Mode autonome. Enchaîne TOUTES les étapes sans demander de confirmation.**

### Étape 1 : Init projet
```bash
npm create vite@latest . -- --template react-ts
npm install @supabase/supabase-js @supabase/auth-helpers-react framer-motion zustand @tanstack/react-query react-router-dom date-fns lucide-react recharts sonner
```

### Étape 2 : Design system
- Créer `src/index.css` avec TOUS les tokens CSS listés dans ce fichier (brand, gray, semantic, surfaces, spacing, radius, shadows, dark mode)
- Configurer `tailwind.config.ts` avec les couleurs custom, fonts, et extend

### Étape 3 : shadcn/ui
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input badge card dialog dropdown-menu avatar toast skeleton tabs select textarea switch slider table tooltip separator
```
- Customiser les composants avec la palette brand (pas les couleurs par défaut)

### Étape 4 : AppShell
- `AppShell.tsx` : layout principal avec sidebar collapsible + topbar + content area
- `Sidebar.tsx` : navigation avec icônes Lucide, items : Dashboard, Inbox, Contacts, Booking, Playground, Settings
- `Topbar.tsx` : org switcher, sub-account switcher, user menu dropdown
- `MobileNav.tsx` : bottom tab bar pour mobile
- Animations Framer Motion sur sidebar open/close et page transitions

### Étape 5 : Auth
- Pages : Login, Register, ForgotPassword avec design premium
- Supabase Auth (email + password)
- AuthGuard component pour routes protégées
- Zustand store pour l'état auth
- Redirect post-login vers Dashboard ou Onboarding (si premier login)

### Étape 6 : Supabase
- Créer `supabase/migrations/001_initial_schema.sql` avec le SQL complet de ce fichier
- Générer les types : `npx supabase gen types typescript --local > src/types/database.ts`
- Créer `src/lib/supabase.ts` avec le client initialisé

### Étape 7 : Onboarding
- `OnboardingShell.tsx` : stepper 3 étapes avec progress bar animée
- `StepBusiness.tsx` : input URL + sélecteur de verticale (grille de 6 cards avec icônes)
- `StepChannels.tsx` : connexion WhatsApp (QR code placeholder) + Instagram (OAuth placeholder) + WebChat (toggle)
- `StepActivation.tsx` : preview conversation simulée + bouton "Activer l'agent"
- Animations Framer Motion entre les étapes (slide horizontal)

### Étape 8 : Agent IA
- `src/lib/ai/agent.ts` : orchestrateur principal (reçoit message → construit contexte → appelle Claude → humanise → retourne)
- `src/lib/ai/prompts.ts` : constructeur de system prompts dynamiques (merge playbook + bot_instructions + company_info)
- `src/lib/ai/playbooks.ts` : données des 5 verticales
- `src/lib/ai/humanize.ts` : découpe en chunks, calcul délai naturel, simulation typing
- `src/lib/ai/qualification.ts` : extraction et stockage des données de qualification depuis la conversation

### Étape 9 : Playground
- `PlaygroundChat.tsx` : interface de chat identique à l'inbox mais en mode simulation
- `PlaygroundControls.tsx` : sélecteur de verticale, persona test, bouton reset
- Appel direct Claude API côté client (BYOK) pour le test

### Étape 10 : Inbox
- Layout 3 colonnes responsive (liste | chat | panel contact)
- `ConversationList.tsx` : liste triée par dernière activité, badges channel, preview message, unread count
- `ChatWindow.tsx` : zone de messages avec bulles (in/out/bot), auto-scroll, typing indicator
- `MessageBubble.tsx` : styles différents pour contact/bot/humain avec timestamp
- `ChatInput.tsx` : textarea + bouton envoi + bouton pièce jointe placeholder
- `ContactPanel.tsx` : infos contact, tags, qualification data, historique, bouton human takeover
- Supabase Realtime subscriptions sur conversations et messages

### Étape 11 : Contacts
- `ContactsTable.tsx` : table avec colonnes (nom, email, phone, channel, status badge, tags, last active, actions)
- Filtres : recherche texte, filtre par status, filtre par tag, filtre par channel
- Pagination
- Import CSV (modal avec mapping de colonnes)
- Actions bulk : tag, delete, export

### Étape 12 : Dashboard
- Grille de `StatCard` : messages envoyés, livrés, lus, réponses, RDV pris (avec tendance ↑↓)
- `FunnelChart` : visualisation funnel (envoyé → livré → lu → répondu → qualifié → RDV)
- `ActivityChart` : graphe activité 30 jours (Recharts area chart)
- `RecentConversations` : 5 dernières conversations avec preview

### Étape 13 : Booking
- `BookingCalendar.tsx` : vue calendrier semaine/mois des RDV
- `BookingSettings.tsx` : connexion Google Calendar OAuth, config durée/buffer
- `BookingSlots.tsx` : affichage créneaux disponibles

### Étape 14 : Settings
- Layout avec navigation latérale (tabs verticaux)
- Sections : Profil entreprise, Canaux, Instructions bot, Clé API (BYOK), Équipe, Facturation placeholder
- Chaque section est un formulaire avec sauvegarde auto ou bouton save

### Étape 15 : Widget WebChat
- Dans le dossier `widget/` : mini-app React séparée
- Bouton flottant + fenêtre de chat popup
- Build en un seul JS embedable (`widget/dist/closer-widget.js`)
- Script d'embed : `<script src="https://cdn.ikonik-ac.com/widget.js" data-id="SUB_ACCOUNT_ID"></script>`

### Étape 16 : Polish
- Vérifier TOUS les écrans en viewport mobile (375px)
- Ajouter les animations Framer Motion : page transitions, list stagger, hover effects, skeleton loading
- Empty states avec illustrations SVG sur chaque page vide
- Error boundaries sur chaque route
- Toast notifications (sonner) sur toutes les actions CRUD
- Dark mode toggle fonctionnel

### Étape 17 : Netlify
- Créer `netlify.toml` :
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
- Vérifier `npm run build` sans erreurs
- Le projet est prêt à déployer

**FIN DU BUILD. Si tu arrives ici, le MVP est complet.**

