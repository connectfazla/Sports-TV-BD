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
  scheduled_at: string;
  started_at: string | null;
  home_score: number;
  away_score: number;
  stats: Record<string, unknown>;
  is_featured: boolean;
  created_at: string;
}
