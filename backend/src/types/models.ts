export interface User {
  id: string;
  device_id: string;
  fcm_token: string | null;
  role: 'user' | 'premium' | 'admin' | 'superadmin';
  is_banned: boolean;
  country_code: string;
  isp: string | null;
  app_version: string | null;
  last_seen_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Stream {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  category: string;
  sort_order: number;
  status: 'active' | 'inactive' | 'maintenance';
  is_premium: boolean;
  is_featured: boolean;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface Mirror {
  id: string;
  stream_id: string;
  url_encrypted: string;
  url_iv: string;
  url_tag: string;
  label: string;
  server_region: string;
  is_bdix: boolean;
  priority: number;
  is_enabled: boolean;
  health_score: number;
  last_checked: Date | null;
  created_at: Date;
}

export interface Match {
  id: string;
  title: string;
  home_team: string;
  away_team: string;
  home_logo: string | null;
  away_logo: string | null;
  tournament: string | null;
  venue: string | null;
  stream_id: string | null;
  status: 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';
  scheduled_at: Date;
  started_at: Date | null;
  ended_at: Date | null;
  home_score: number;
  away_score: number;
  stats: Record<string, unknown>;
  standings: Record<string, unknown>;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  image_url: string | null;
  deep_link: string | null;
  target_roles: string[];
  sent_count: number;
  sent_at: Date | null;
  scheduled_at: Date | null;
  created_at: Date;
}

export interface AdConfig {
  id: string;
  provider: string;
  ad_type: string;
  ad_unit_id: string;
  is_enabled: boolean;
  frequency_cap: number;
  cooldown_sec: number;
  geo_rules: Record<string, unknown>;
  fallback_config: Record<string, unknown>;
  updated_at: Date;
}

export interface PremiumSubscription {
  id: string;
  user_id: string;
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  plan_type: string;
  started_at: Date;
  expires_at: Date | null;
  payment_ref: string | null;
  payment_gateway: string | null;
  metadata: Record<string, unknown>;
  created_at: Date;
}
