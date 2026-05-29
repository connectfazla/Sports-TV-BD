'use client';

import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { api } from '@/lib/api';
import { AdUnit } from '@/types/config';
import { toast } from 'sonner';

export default function AdsPage() {
  const [units, setUnits] = useState<AdUnit[]>([]);

  useEffect(() => {
    // In production decrypt the payload; here we show placeholder UI
    setUnits([
      { id: '1', provider: 'admob', ad_type: 'banner', ad_unit_id: 'ca-app-pub-3940256099942544/6300978111', is_enabled: true, frequency_cap: 0, cooldown_sec: 0 },
      { id: '2', provider: 'admob', ad_type: 'interstitial', ad_unit_id: 'ca-app-pub-3940256099942544/1033173712', is_enabled: true, frequency_cap: 1, cooldown_sec: 900 },
      { id: '3', provider: 'admob', ad_type: 'rewarded', ad_unit_id: 'ca-app-pub-3940256099942544/5224354917', is_enabled: true, frequency_cap: 0, cooldown_sec: 0 },
      { id: '4', provider: 'applovin', ad_type: 'interstitial', ad_unit_id: 'YOUR_APPLOVIN_ID', is_enabled: true, frequency_cap: 1, cooldown_sec: 900 },
    ]);
  }, []);

  async function toggleAd(id: string, val: boolean) {
    try {
      await api.put(`/config/ads/${id}`, { is_enabled: val });
      setUnits(us => us.map(u => u.id === id ? { ...u, is_enabled: val } : u));
      toast.success(`Ad ${val ? 'enabled' : 'disabled'}`);
    } catch (e: any) { toast.error(e.message); }
  }

  const providerColor = (p: string) => p === 'admob' ? '#4285F4' : '#FF6900';

  return (
    <>
      <TopBar title="Ad Management" />
      <div className="p-6 space-y-4">
        <Card>
          <p className="text-sm mb-6" style={{ color: '#a1a1aa' }}>
            Ad unit IDs and configs are fetched encrypted by the app. Toggle ads remotely without APK updates.
          </p>
          <div className="space-y-3">
            {units.map(u => (
              <div key={u.id} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: '#27272a' }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium" style={{ color: '#fafafa' }}>{u.ad_type}</span>
                    <Badge variant="gray">{u.provider}</Badge>
                  </div>
                  <p className="text-xs font-mono" style={{ color: '#a1a1aa' }}>{u.ad_unit_id}</p>
                  {u.cooldown_sec > 0 && <p className="text-xs mt-0.5" style={{ color: '#a1a1aa' }}>Cooldown: {u.cooldown_sec / 60}min · Cap: {u.frequency_cap}/session</p>}
                </div>
                <Toggle checked={u.is_enabled} onChange={v => toggleAd(u.id, v)} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
