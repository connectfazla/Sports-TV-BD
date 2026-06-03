export interface AppConfig {
  min_app_version: string;
  latest_app_version: string;
  latest_apk_url: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  feature_flags: Record<string, boolean>;
  stream_token_ttl: number;
  bdix_preference: boolean;
  force_popup: null | { title: string; message: string; dismissible: boolean };
}

export interface AdUnit {
  id: string;
  provider: string;
  ad_type: string;
  ad_unit_id: string;
  is_enabled: boolean;
  frequency_cap: number;
  cooldown_sec: number;
}
