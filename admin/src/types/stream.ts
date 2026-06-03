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
  created_at: string;
}

export interface Mirror {
  id: string;
  stream_id: string;
  label: string;
  server_region: string;
  is_bdix: boolean;
  priority: number;
  is_enabled: boolean;
  health_score: number;
  last_checked: string | null;
  latency_ms?: number;
  is_reachable?: boolean;
}

export interface SignedMirror {
  id: string;
  label: string;
  signedUrl: string;
  isBdix: boolean;
  region: string;
  priority: number;
  healthScore: number;
}
