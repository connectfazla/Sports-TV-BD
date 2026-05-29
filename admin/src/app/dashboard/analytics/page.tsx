'use client';

import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { api } from '@/lib/api';
import { DashboardStats, StreamStat } from '@/types/analytics';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#22c55e', '#16a34a', '#4ade80', '#86efac', '#bbf7d0'];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [streamStats, setStreamStats] = useState<StreamStat[]>([]);

  useEffect(() => {
    Promise.all([
      api.get<DashboardStats>('/analytics/dashboard'),
      api.get<StreamStat[]>('/analytics/streams'),
    ]).then(([d, s]) => { setStats(d); setStreamStats(s); })
      .catch(() => toast.error('Failed to load analytics'));
  }, []);

  return (
    <>
      <TopBar title="Analytics" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat label="Active Viewers (1h)" value={stats?.activeViewers ?? '—'} />
          <Stat label="Avg Buffering (1h)" value={stats ? `${stats.avgBufferingMs.toFixed(0)}ms` : '—'} color="#f59e0b" />
          <Stat label="ISP Sources" value={stats?.ispBreakdown.length ?? '—'} color="#a1a1aa" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <h2 className="font-semibold mb-4" style={{ color: '#fafafa' }}>ISP Breakdown (24h)</h2>
            {stats?.ispBreakdown.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={stats.ispBreakdown} dataKey="count" nameKey="isp" cx="50%" cy="50%" outerRadius={80} label={({ isp }) => isp}>
                    {stats.ispBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#27272a', border: '1px solid #3f3f46', color: '#fafafa' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-center py-8" style={{ color: '#a1a1aa' }}>No data yet</p>}
          </Card>

          <Card>
            <h2 className="font-semibold mb-4" style={{ color: '#fafafa' }}>Top Streams (24h)</h2>
            {streamStats.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={streamStats.slice(0, 8)} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 11 }} width={80} />
                  <Tooltip contentStyle={{ background: '#27272a', border: '1px solid #3f3f46', color: '#fafafa' }} />
                  <Bar dataKey="views" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-center py-8" style={{ color: '#a1a1aa' }}>No data yet</p>}
          </Card>
        </div>
      </div>
    </>
  );
}
