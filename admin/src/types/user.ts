export interface User {
  id: string;
  device_id: string;
  role: 'user' | 'premium' | 'admin' | 'superadmin';
  is_banned: boolean;
  country_code: string;
  isp: string | null;
  app_version: string | null;
  last_seen_at: string | null;
  created_at: string;
}
