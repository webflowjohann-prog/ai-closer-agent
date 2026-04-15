-- ============================================================
-- 004_sprint3_schema.sql
-- AI Closer Agent IKONIK — Sprint 3
-- ============================================================

-- WHITE-LABEL CONFIG (détails avancés par org)
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS terms_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS privacy_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS favicon_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS login_bg_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS accent_color TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Plus Jakarta Sans';

-- API KEYS
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  permissions TEXT[] DEFAULT '{read}',
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
  secret TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
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

-- BOT SCHEDULE
CREATE TABLE bot_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_account_id UUID NOT NULL REFERENCES sub_accounts(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
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

-- OPTIMIZE LOG
ALTER TABLE sub_accounts ADD COLUMN IF NOT EXISTS last_optimized_at TIMESTAMPTZ;
ALTER TABLE sub_accounts ADD COLUMN IF NOT EXISTS optimization_score INTEGER DEFAULT 0;

-- Triggers
CREATE TRIGGER tr_api_keys_updated BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_webhooks_updated BEFORE UPDATE ON webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_bot_schedules_updated BEFORE UPDATE ON bot_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at();
