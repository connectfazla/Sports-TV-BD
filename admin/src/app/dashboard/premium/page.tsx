'use client';

import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

interface Sub {
  id: string;
  user_id: string;
  device_id: string;
  status: string;
  plan_type: string;
  started_at: string;
  expires_at: string | null;
  payment_gateway: string | null;
}

export default function PremiumPage() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Sub[]>('/premium/subscriptions')
      .then(setSubs)
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <TopBar title="Premium Subscriptions" />
      <div className="p-6">
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #3f3f46' }}>
          <table className="w-full text-sm">
            <thead style={{ background: '#18181b', borderBottom: '1px solid #3f3f46' }}>
              <tr>
                {['Device', 'Plan', 'Status', 'Gateway', 'Expires', 'Started'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: '#a1a1aa' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8" style={{ color: '#a1a1aa' }}>Loading...</td></tr>
              ) : subs.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8" style={{ color: '#a1a1aa' }}>No subscriptions yet</td></tr>
              ) : subs.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #27272a' }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#fafafa' }}>{s.device_id?.slice(0, 12)}…</td>
                  <td className="px-4 py-3"><Badge variant="yellow">{s.plan_type}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={s.status === 'active' ? 'green' : 'red'}>{s.status}</Badge></td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#a1a1aa' }}>{s.payment_gateway ?? 'manual'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#a1a1aa' }}>{s.expires_at ? formatDate(s.expires_at) : 'Lifetime'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#a1a1aa' }}>{formatDate(s.started_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
