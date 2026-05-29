'use client';

import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { User } from '@/types/user';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

function roleVariant(r: string): 'green' | 'yellow' | 'gray' {
  return r === 'premium' ? 'yellow' : r === 'admin' || r === 'superadmin' ? 'green' : 'gray';
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<User[]>('/admin/users')
      .then(setUsers)
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  async function toggleBan(u: User) {
    try {
      await api.put(`/admin/users/${u.id}/ban`, { is_banned: !u.is_banned });
      setUsers(us => us.map(x => x.id === u.id ? { ...x, is_banned: !u.is_banned } : x));
      toast.success(u.is_banned ? 'User unbanned' : 'User banned');
    } catch (e: any) { toast.error(e.message); }
  }

  async function promotePremium(u: User) {
    try {
      await api.post('/premium/activate', { userId: u.id, planType: 'manual' });
      await api.put(`/admin/users/${u.id}/role`, { role: 'premium' });
      setUsers(us => us.map(x => x.id === u.id ? { ...x, role: 'premium' } : x));
      toast.success('User promoted to premium');
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <>
      <TopBar title="Users" />
      <div className="p-6">
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #3f3f46' }}>
          <table className="w-full text-sm">
            <thead style={{ background: '#18181b', borderBottom: '1px solid #3f3f46' }}>
              <tr>
                {['Device ID', 'Role', 'ISP', 'Version', 'Last Seen', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: '#a1a1aa' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8" style={{ color: '#a1a1aa' }}>Loading...</td></tr>
              ) : users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #27272a' }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#fafafa' }}>{u.device_id.slice(0, 16)}…</td>
                  <td className="px-4 py-3"><Badge variant={roleVariant(u.role)}>{u.role}</Badge></td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#a1a1aa' }}>{u.isp ?? '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#a1a1aa' }}>{u.app_version ?? '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#a1a1aa' }}>{u.last_seen_at ? formatDate(u.last_seen_at) : '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.is_banned ? 'red' : 'green'}>{u.is_banned ? 'Banned' : 'Active'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant={u.is_banned ? 'secondary' : 'danger'} onClick={() => toggleBan(u)}>
                        {u.is_banned ? 'Unban' : 'Ban'}
                      </Button>
                      {u.role === 'user' && (
                        <Button size="sm" variant="ghost" onClick={() => promotePremium(u)}>Premium</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
