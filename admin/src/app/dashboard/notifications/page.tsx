'use client';

import { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  sent_count: number;
  sent_at: string | null;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [form, setForm] = useState({ title: '', body: '', type: 'general', imageUrl: '', deepLink: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get<Notification[]>('/notifications')
      .then(setNotifications)
      .catch(() => toast.error('Failed to load'));
  }, []);

  async function send() {
    if (!form.title || !form.body) { toast.error('Title and body required'); return; }
    setSending(true);
    try {
      const n = await api.post<Notification>('/notifications/send', {
        ...form,
        targetRoles: ['user', 'premium'],
      });
      setNotifications(ns => [n, ...ns]);
      setForm({ title: '', body: '', type: 'general', imageUrl: '', deepLink: '' });
      toast.success(`Notification sent to ${n.sent_count} devices`);
    } catch (e: any) { toast.error(e.message); }
    finally { setSending(false); }
  }

  return (
    <>
      <TopBar title="Notifications" />
      <div className="p-6 space-y-6">
        <Card>
          <h2 className="font-semibold mb-4" style={{ color: '#fafafa' }}>Send Push Notification</h2>
          <div className="space-y-3">
            <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Match Starting!" />
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#a1a1aa' }}>Body</label>
              <textarea
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                rows={3}
                placeholder="Bangladesh vs India kicks off in 5 minutes"
                className="w-full px-3 py-2.5 rounded-lg text-sm resize-none outline-none"
                style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#fafafa' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Image URL (optional)" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
              <Input label="Deep Link (optional)" value={form.deepLink} onChange={e => setForm(f => ({ ...f, deepLink: e.target.value }))} placeholder="sportstv://match/123" />
            </div>
            <Button loading={sending} onClick={send}>Send to All Users</Button>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold mb-4" style={{ color: '#fafafa' }}>History</h2>
          <div className="space-y-2">
            {notifications.length === 0 && <p className="text-sm" style={{ color: '#a1a1aa' }}>No notifications sent yet</p>}
            {notifications.map(n => (
              <div key={n.id} className="px-4 py-3 rounded-lg" style={{ background: '#27272a' }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#fafafa' }}>{n.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#a1a1aa' }}>{n.body}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge variant="green">{n.sent_count} sent</Badge>
                    <p className="text-xs mt-1" style={{ color: '#a1a1aa' }}>{n.sent_at ? formatDate(n.sent_at) : '—'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
