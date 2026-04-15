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
