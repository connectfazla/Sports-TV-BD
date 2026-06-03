'use client';

import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface ServerHealth {
  id: string;
  label: string;
  server_region: string;
  is_bdix: boolean;
  health_score: number;
  latency_ms: number | null;
  is_reachable: boolean | null;
  last_checked: string | null;
}

export default function ServerControlPage() {
  const [servers, setServers] = useState<ServerHealth[]>([]);
  const [redirect, setRedirect] = useState({ streamId: '', newUrl: '', label: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<ServerHealth[]>('/health/servers')
      .then(setServers)
      .catch(() => toast.error('Failed to load server health'));
  }, []);

  async function applyRedirect() {
    if (!redirect.streamId || !redirect.newUrl) { toast.error('Stream ID and URL required'); return; }
    setLoading(true);
    try {
      await api.post('/admin/server-rotation', redirect);
      toast.success('Emergency redirect applied');
      setRedirect({ streamId: '', newUrl: '', label: '' });
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  function healthColor(score: number) {
    if (score >= 80) return '#22c55e';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  }

  return (
    <>
      <TopBar title="Server Control" />
      <div className="p-6 space-y-6">
        <Card>
          <h2 className="font-semibold mb-4" style={{ color: '#fafafa' }}>Mirror Health</h2>
          <div className="space-y-3">
            {servers.length === 0 && <p className="text-sm" style={{ color: '#a1a1aa' }}>No mirrors configured</p>}
            {servers.map(s => (
              <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: '#27272a' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#fafafa' }}>{s.label}</p>
                  <p className="text-xs" style={{ color: '#a1a1aa' }}>{s.server_region} {s.is_bdix ? '· BDIX' : ''}</p>
                </div>
                <div className="flex items-center gap-4">
                  {s.latency_ms != null && <span className="text-xs" style={{ color: '#a1a1aa' }}>{s.latency_ms}ms</span>}
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: s.is_reachable ? '#22c55e' : '#ef4444' }} />
                    <span className="text-xs font-bold" style={{ color: healthColor(s.health_score) }}>{s.health_score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-4" onClick={() => api.get<ServerHealth[]>('/health/servers').then(setServers)}>
            Refresh
          </Button>
        </Card>

        <Card>
          <h2 className="font-semibold mb-1" style={{ color: '#fafafa' }}>Emergency CDN Redirect</h2>
          <p className="text-sm mb-4" style={{ color: '#a1a1aa' }}>Disable all mirrors for a stream and route to a new URL instantly.</p>
          <div className="space-y-3">
            <Input label="Stream ID" placeholder="UUID of stream" value={redirect.streamId} onChange={e => setRedirect(r => ({ ...r, streamId: e.target.value }))} />
            <Input label="New Stream URL" placeholder="https://cdn.example.com/live/stream.m3u8" value={redirect.newUrl} onChange={e => setRedirect(r => ({ ...r, newUrl: e.target.value }))} />
            <Input label="Label (optional)" placeholder="Emergency CDN" value={redirect.label} onChange={e => setRedirect(r => ({ ...r, label: e.target.value }))} />
            <Button variant="danger" loading={loading} onClick={applyRedirect}>Apply Emergency Redirect</Button>
          </div>
        </Card>
      </div>
    </>
  );
}
