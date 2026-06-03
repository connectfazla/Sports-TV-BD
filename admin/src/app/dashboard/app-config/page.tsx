'use client';

import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface RawConfig {
  maintenance_mode: boolean;
  maintenance_message: string;
  min_app_version: string;
  latest_app_version: string;
  latest_apk_url: string;
  bdix_preference: boolean;
  feature_flags: Record<string, boolean>;
  force_popup: null | { title: string; message: string; dismissible: boolean };
}

export default function AppConfigPage() {
  const [config, setConfig] = useState<Partial<RawConfig>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    // In production this would decrypt the payload; for the admin we fetch raw from the DB endpoint
    // For now show a message to use direct API
    setConfig({
      maintenance_mode: false,
      maintenance_message: 'We will be back shortly',
      min_app_version: '1.0.0',
      latest_app_version: '1.0.0',
      latest_apk_url: '',
      bdix_preference: true,
      feature_flags: { chat: true, standings: true, stats: true, rewarded_hd: true },
    });
  }, []);

  async function save(key: string, value: unknown) {
    setSaving(key);
    try {
      await api.put(`/config/app/${key}`, { value });
      toast.success(`${key} updated`);
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(null); }
  }

  async function toggleMaintenance(v: boolean) {
    setConfig(c => ({ ...c, maintenance_mode: v }));
    await save('maintenance_mode', v);
    if (v) toast.warning('Maintenance mode ENABLED — users will see maintenance screen');
  }

  async function toggleFeature(key: string, v: boolean) {
    const flags = { ...config.feature_flags, [key]: v };
    setConfig(c => ({ ...c, feature_flags: flags }));
    await save('feature_flags', flags);
  }

  return (
    <>
      <TopBar title="App Config" />
      <div className="p-6 space-y-6">
        <Card>
          <h2 className="font-semibold mb-4" style={{ color: '#fafafa' }}>Maintenance Mode</h2>
          <div className="space-y-4">
            <Toggle
              checked={config.maintenance_mode ?? false}
              onChange={toggleMaintenance}
              label="Enable maintenance mode (all users see maintenance screen)"
            />
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input label="Maintenance Message" value={config.maintenance_message ?? ''} onChange={e => setConfig(c => ({ ...c, maintenance_message: e.target.value }))} />
              </div>
              <Button size="sm" loading={saving === 'maintenance_message'} onClick={() => save('maintenance_message', config.maintenance_message)}>Save</Button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold mb-4" style={{ color: '#fafafa' }}>App Version Control</h2>
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <div className="flex-1"><Input label="Minimum App Version (force update)" value={config.min_app_version ?? ''} onChange={e => setConfig(c => ({ ...c, min_app_version: e.target.value }))} /></div>
              <Button size="sm" loading={saving === 'min_app_version'} onClick={() => save('min_app_version', config.min_app_version)}>Save</Button>
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1"><Input label="Latest Version" value={config.latest_app_version ?? ''} onChange={e => setConfig(c => ({ ...c, latest_app_version: e.target.value }))} /></div>
              <Button size="sm" loading={saving === 'latest_app_version'} onClick={() => save('latest_app_version', config.latest_app_version)}>Save</Button>
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1"><Input label="Latest APK URL (direct download)" value={config.latest_apk_url ?? ''} onChange={e => setConfig(c => ({ ...c, latest_apk_url: e.target.value }))} /></div>
              <Button size="sm" loading={saving === 'latest_apk_url'} onClick={() => save('latest_apk_url', config.latest_apk_url)}>Save</Button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold mb-4" style={{ color: '#fafafa' }}>Feature Flags</h2>
          <div className="space-y-3">
            {Object.entries(config.feature_flags ?? {}).map(([key, val]) => (
              <Toggle key={key} checked={val} onChange={v => toggleFeature(key, v)} label={key} />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold mb-1" style={{ color: '#fafafa' }}>BDIX Preference</h2>
          <p className="text-sm mb-3" style={{ color: '#a1a1aa' }}>When enabled, app prefers BDIX mirrors for Bangladesh users.</p>
          <Toggle checked={config.bdix_preference ?? true} onChange={v => { setConfig(c => ({ ...c, bdix_preference: v })); save('bdix_preference', v); }} label="Prefer BDIX servers" />
        </Card>
      </div>
    </>
  );
}
