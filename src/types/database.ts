// Types générés manuellement basés sur le schéma Supabase
// (npx supabase gen types typescript --local > src/types/database.ts en prod)

export type UserRole = 'owner' | 'admin' | 'member'
export type OrgPlan = 'starter' | 'pro' | 'agency'
export type ChannelType = 'whatsapp' | 'instagram' | 'messenger' | 'sms' | 'webchat'
export type ChannelStatus = 'connected' | 'disconnected' | 'pending' | 'error'
export type ContactStatus = 'new' | 'qualified' | 'meeting_booked' | 'proposal' | 'closed_won' | 'closed_lost' | 'unresponsive'
export type MessageDirection = 'inbound' | 'outbound'
export type MessageSenderType = 'contact' | 'bot' | 'human'
export type MessageContentType = 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'template'
export type MessageStatus = 'queued' | 'sent' | 'delivered' | 'read' | 'failed'
export type ConversationStatus = 'active' | 'bot_active' | 'human_takeover' | 'closed'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
export type VerticalType = 'immobilier_luxe' | 'clinique_esthetique' | 'coach_formateur' | 'restaurant_hotel' | 'concession_auto' | 'autre'

export interface Organization {
  id: string
  name: string
  slug: string
  plan: OrgPlan
  logo_url?: string
  website_url?: string
  custom_domain?: string
  brand_name?: string
  brand_color?: string
  claude_api_key_encrypted?: string
  gemini_api_key_encrypted?: string
  max_sub_accounts: number
  // Sprint 3 white-label fields
  seo_title?: string
  seo_description?: string
  terms_url?: string
  privacy_url?: string
  favicon_url?: string
  login_bg_url?: string
  accent_color?: string
  font_family?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface User {
  id: string
  organization_id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface SubAccount {
  id: string
  organization_id: string
  name: string
  slug: string
  vertical: VerticalType
  website_url?: string
  description?: string
  phone?: string
  email?: string
  address?: string
  bot_instructions?: string
  bot_personality?: string
  bot_language: string
  bot_active: boolean
  response_delay_min: number
  response_delay_max: number
  response_length_min: number
  response_length_max: number
  max_message_chunks: number
  typing_speed: number
  google_calendar_id?: string
  google_calendar_token_encrypted?: string
  booking_duration_minutes: number
  booking_buffer_minutes: number
  booking_link_external?: string
  bot_message_limit?: number
  chat_memory_tokens: number
  claude_api_key_encrypted?: string
  // Sprint 2 LLM fields
  default_llm_provider?: string
  default_llm_model?: string
  openai_api_key_encrypted?: string
  gemini_api_key_encrypted?: string
  mistral_api_key_encrypted?: string
  // Sprint 3 fields
  last_optimized_at?: string
  optimization_score?: number
  // Switchy fields
  switchy_custom_domain?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Channel {
  id: string
  sub_account_id: string
  type: ChannelType
  status: ChannelStatus
  external_id?: string
  external_name?: string
  config: Record<string, unknown>
  messages_sent: number
  messages_received: number
  last_active_at?: string
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  sub_account_id: string
  first_name?: string
  last_name?: string
  full_name?: string
  email?: string
  phone?: string
  avatar_url?: string
  channel_type?: ChannelType
  channel_contact_id?: string
  status: ContactStatus
  score: number
  qualification_data: Record<string, unknown>
  tags: string[]
  bot_active: boolean
  bot_messages_count: number
  notes?: string
  custom_fields: Record<string, unknown>
  last_active_at?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Conversation {
  id: string
  sub_account_id: string
  contact_id: string
  channel_id: string
  status: ConversationStatus
  channel_type: ChannelType
  subject?: string
  message_count: number
  unread_count: number
  bot_message_count: number
  last_message_at?: string
  last_message_preview?: string
  last_message_direction?: MessageDirection
  assigned_user_id?: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  closed_at?: string
  contact?: Contact
}

export interface Message {
  id: string
  conversation_id: string
  sub_account_id: string
  direction: MessageDirection
  sender_type: MessageSenderType
  content_type: MessageContentType
  content?: string
  media_url?: string
  media_mime_type?: string
  status: MessageStatus
  channel_type: ChannelType
  external_message_id?: string
  ai_model?: string
  ai_tokens_used?: number
  ai_cost_usd?: number
  metadata: Record<string, unknown>
  created_at: string
  delivered_at?: string
  read_at?: string
}

export interface FAQ {
  id: string
  sub_account_id: string
  question: string
  answer: string
  category?: string
  times_used: number
  last_used_at?: string
  source: string
  source_url?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  sub_account_id: string
  contact_id: string
  conversation_id?: string
  title: string
  starts_at: string
  ends_at: string
  timezone: string
  status: BookingStatus
  google_event_id?: string
  meeting_link?: string
  notes?: string
  created_at: string
  updated_at: string
  cancelled_at?: string
  contact?: Contact
}

export interface Playbook {
  id: string
  vertical: VerticalType
  name: string
  description?: string
  system_prompt: string
  qualification_fields: QualificationField[]
  objection_handlers: ObjectionHandler[]
  conversation_goals: string[]
  default_booking_duration: number
  booking_prompt?: string
  greeting_templates?: string[]
  follow_up_templates?: string[]
  closing_templates?: string[]
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface QualificationField {
  key: string
  label: string
  type?: 'text' | 'select' | 'number'
  options?: string[]
  required?: boolean
}

export interface ObjectionHandler {
  objection: string
  response: string
}

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

// === SWITCHY TYPES ===

export type RetargetingPlatform = 'facebook' | 'google_ads' | 'tiktok' | 'linkedin' | 'twitter' | 'pinterest' | 'snapchat' | 'custom'

export interface RetargetingPixel {
  id: string
  sub_account_id: string
  platform: RetargetingPlatform
  pixel_id: string
  label?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface TrackedLink {
  id: string
  sub_account_id: string
  original_url: string
  switchy_url: string
  custom_domain?: string
  title?: string
  description?: string
  image_url?: string
  deep_linking: boolean
  pixels_applied: string[]
  utm_campaign?: string
  utm_source?: string
  utm_medium?: string
  clicks: number
  conversation_id?: string
  contact_id?: string
  created_at: string
  updated_at: string
}

export interface DealWithAttribution extends Deal {
  first_conversation_id?: string
  first_message_at?: string
  bot_initiated: boolean
  bot_messages_before_human: number
  attribution_channel?: ChannelType
  commission_amount?: number
}

export interface ContactWithBehavior extends Contact {
  behavior_score: number
  avg_response_time_seconds?: number
  avg_message_length?: number
  engagement_level: 'low' | 'medium' | 'high' | 'very_high'
  detected_language: string
  sentiment: 'positive' | 'neutral' | 'negative'
}
