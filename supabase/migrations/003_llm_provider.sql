-- ============================================================
-- 003_llm_provider.sql
-- AI Closer Agent IKONIK — Multi-provider LLM support
-- ============================================================

ALTER TABLE sub_accounts
  ADD COLUMN IF NOT EXISTS default_llm_provider TEXT DEFAULT 'anthropic',
  ADD COLUMN IF NOT EXISTS default_llm_model TEXT DEFAULT 'claude-sonnet-4-20250514',
  ADD COLUMN IF NOT EXISTS openai_api_key_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS gemini_api_key_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS mistral_api_key_encrypted TEXT;

-- Constraint to ensure valid provider values
ALTER TABLE sub_accounts
  ADD CONSTRAINT chk_llm_provider
    CHECK (default_llm_provider IN ('anthropic', 'openai', 'gemini', 'mistral'));
