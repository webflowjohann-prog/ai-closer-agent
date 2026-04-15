-- ============================================================
-- 001_initial_schema.sql
-- AI Closer Agent IKONIK — Schéma complet MVP
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

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
-- ORGANIZATIONS
-- ============================================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan org_plan NOT NULL DEFAULT 'starter',
  logo_url TEXT,
  website_url TEXT,
  custom_domain TEXT,
  brand_name TEXT,
  brand_color TEXT DEFAULT '#5c7cfa',
  claude_api_key_encrypted TEXT,
  gemini_api_key_encrypted TEXT,
  max_sub_accounts INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- USERS
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
-- SUB-ACCOUNTS
-- ============================================================

CREATE TABLE sub_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  vertical vertical_type NOT NULL DEFAULT 'autre',
  website_url TEXT,
  description TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  bot_instructions TEXT,
  bot_personality TEXT,
  bot_language TEXT DEFAULT 'fr',
  bot_active BOOLEAN DEFAULT false,
  response_delay_min INTEGER DEFAULT 3,
  response_delay_max INTEGER DEFAULT 12,
  response_length_min INTEGER DEFAULT 20,
  response_length_max INTEGER DEFAULT 60,
  max_message_chunks INTEGER DEFAULT 3,
  typing_speed INTEGER DEFAULT 40,
  google_calendar_id TEXT,
  google_calendar_token_encrypted TEXT,
  booking_duration_minutes INTEGER DEFAULT 30,
  booking_buffer_minutes INTEGER DEFAULT 15,
  booking_link_external TEXT,
  bot_message_limit INTEGER,
  chat_memory_tokens INTEGER DEFAULT 50000,
  claude_api_key_encrypted TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(organization_id, slug)
);

CREATE INDEX idx_sub_accounts_org ON sub_accounts(organization_id);

-- ============================================================
-- CHANNELS
-- ============================================================

CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  type channel_type NOT NULL,
  status channel_status NOT NULL DEFAULT 'disconnected',
  external_id TEXT,
  external_name TEXT,
  config JSONB DEFAULT '{}',
  messages_sent INTEGER DEFAULT 0,
  messages_received INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(sub_account_id, type)
);

CREATE INDEX idx_channels_sub ON channels(sub_account_id);

-- ============================================================
-- CONTACTS
-- ============================================================

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT GENERATED ALWAYS AS (
    TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''))
  ) STORED,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  channel_type channel_type,
  channel_contact_id TEXT,
  status contact_status NOT NULL DEFAULT 'new',
  score INTEGER DEFAULT 0,
  qualification_data JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  bot_active BOOLEAN DEFAULT true,
  bot_messages_count INTEGER DEFAULT 0,
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
  channel_type channel_type NOT NULL,
  subject TEXT,
  message_count INTEGER DEFAULT 0,
  unread_count INTEGER DEFAULT 0,
  bot_message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  last_message_direction message_direction,
  assigned_user_id UUID REFERENCES users(id),
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
  direction message_direction NOT NULL,
  sender_type message_sender_type NOT NULL,
  content_type message_content_type NOT NULL DEFAULT 'text',
  content TEXT,
  media_url TEXT,
  media_mime_type TEXT,
  status message_status NOT NULL DEFAULT 'queued',
  channel_type channel_type NOT NULL,
  external_message_id TEXT,
  ai_model TEXT,
  ai_tokens_used INTEGER,
  ai_cost_usd DECIMAL(10, 6),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_sub ON messages(sub_account_id, created_at DESC);

-- ============================================================
-- FAQS
-- ============================================================

CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  times_used INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  source TEXT DEFAULT 'manual',
  source_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_faqs_sub ON faqs(sub_account_id);

-- ============================================================
-- BOOKINGS
-- ============================================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id),
  title TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'Europe/Paris',
  status booking_status NOT NULL DEFAULT 'pending',
  google_event_id TEXT,
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ
);

CREATE INDEX idx_bookings_sub ON bookings(sub_account_id);
CREATE INDEX idx_bookings_contact ON bookings(contact_id);
CREATE INDEX idx_bookings_date ON bookings(sub_account_id, starts_at);

-- ============================================================
-- PLAYBOOKS
-- ============================================================

CREATE TABLE playbooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vertical vertical_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  qualification_fields JSONB NOT NULL,
  objection_handlers JSONB NOT NULL,
  conversation_goals JSONB NOT NULL,
  default_booking_duration INTEGER DEFAULT 30,
  booking_prompt TEXT,
  greeting_templates JSONB,
  follow_up_templates JSONB,
  closing_templates JSONB,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_playbooks_vertical ON playbooks(vertical);

-- ============================================================
-- ANALYTICS EVENTS
-- ============================================================

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  contact_id UUID REFERENCES contacts(id),
  conversation_id UUID REFERENCES conversations(id),
  message_id UUID REFERENCES messages(id),
  booking_id UUID REFERENCES bookings(id),
  channel_type channel_type,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_sub_date ON analytics_events(sub_account_id, created_at DESC);
CREATE INDEX idx_analytics_type ON analytics_events(sub_account_id, event_type, created_at DESC);

-- ============================================================
-- AUDIT LOG
-- ============================================================

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
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
-- ROW LEVEL SECURITY
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

CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE POLICY "org_member_access" ON organizations
  FOR ALL USING (id = get_user_org_id());

CREATE POLICY "users_org_access" ON users
  FOR ALL USING (organization_id = get_user_org_id());

CREATE POLICY "sub_accounts_org_access" ON sub_accounts
  FOR ALL USING (organization_id = get_user_org_id());

CREATE POLICY "channels_org_access" ON channels
  FOR ALL USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

CREATE POLICY "contacts_org_access" ON contacts
  FOR ALL USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

CREATE POLICY "conversations_org_access" ON conversations
  FOR ALL USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

CREATE POLICY "messages_org_access" ON messages
  FOR ALL USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

CREATE POLICY "faqs_org_access" ON faqs
  FOR ALL USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

CREATE POLICY "bookings_org_access" ON bookings
  FOR ALL USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

CREATE POLICY "analytics_org_access" ON analytics_events
  FOR ALL USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

CREATE POLICY "audit_org_access" ON audit_log
  FOR ALL USING (organization_id = get_user_org_id());

CREATE POLICY "playbooks_read" ON playbooks
  FOR SELECT USING (is_active = true);

-- ============================================================
-- TRIGGERS
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
-- REALTIME
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- ============================================================
-- FUNCTIONS
-- ============================================================

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
