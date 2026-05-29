export interface DashboardStats {
  activeViewers: number;
  avgBufferingMs: number;
  ispBreakdown: Array<{ isp: string; count: number }>;
}

export interface StreamStat {
  id: string;
  name: string;
  views: number;
  avg_duration: number;
}
