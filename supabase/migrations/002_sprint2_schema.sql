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
