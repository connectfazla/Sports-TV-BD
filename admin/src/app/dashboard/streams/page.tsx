'use client';

import { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { Stream } from '@/types/stream';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { formatDate } from '@/lib/utils';

function statusVariant(s: string): 'green' | 'red' | 'yellow' {
  return s === 'active' ? 'green' : s === 'inactive' ? 'red' : 'yellow';
}

export default function StreamsPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Stream | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', logo_url: '', category: 'sports', is_premium: false, is_featured: false });

  useEffect(() => { fetchStreams(); }, []);

  async function fetchStreams() {
    try {
      const data = await api.get<Stream[]>('/streams');
      setStreams(data);
    } catch (e) {
      toast.error('Failed to load streams');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: '', slug: '', logo_url: '', category: 'sports', is_premium: false, is_featured: false });
    setShowModal(true);
  }

  function openEdit(s: Stream) {
    setEditing(s);
    setForm({ name: s.name, slug: s.slug, logo_url: s.logo_url ?? '', category: s.category, is_premium: s.is_premium, is_featured: s.is_featured });
    setShowModal(true);
  }

  async function handleSave() {
    try {
      if (editing) {
        const updated = await api.put<Stream>(`/streams/${editing.id}`, form);
        setStreams(ss => ss.map(s => s.id === editing.id ? updated : s));
        toast.success('Stream updated');
      } else {
        const created = await api.post<Stream>('/streams', form);
        setStreams(ss => [...ss, created]);
        toast.success('Stream created');
      }
      setShowModal(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function toggleStatus(s: Stream) {
    const newStatus = s.status === 'active' ? 'inactive' : 'active';
    try {
      await api.patch(`/streams/${s.id}/status`, { status: newStatus });
      setStreams(ss => ss.map(x => x.id === s.id ? { ...x, status: newStatus } : x));
      toast.success(`Stream ${newStatus}`);
    } catch (e: any) { toast.error(e.message); }
  }

  async function deleteStream(id: string) {
    if (!confirm('Delete this stream?')) return;
    try {
      await api.delete(`/streams/${id}`);
      setStreams(ss => ss.filter(s => s.id !== id));
      toast.success('Stream deleted');
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <>
      <TopBar title="Streams" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: '#a1a1aa' }}>{streams.length} channels</p>
          <Button onClick={openCreate}><Plus size={14} /> Add Stream</Button>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #3f3f46' }}>
          <table className="w-full text-sm">
            <thead style={{ background: '#18181b', borderBottom: '1px solid #3f3f46' }}>
              <tr>
                {['Name', 'Category', 'Status', 'Premium', 'Updated', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: '#a1a1aa' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8" style={{ color: '#a1a1aa' }}>Loading...</td></tr>
              ) : streams.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #27272a' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {s.logo_url && <img src={s.logo_url} className="w-6 h-6 rounded object-cover" alt="" />}
                      <span style={{ color: '#fafafa' }}>{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="gray">{s.category}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={statusVariant(s.status)}>{s.status}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={s.is_premium ? 'yellow' : 'gray'}>{s.is_premium ? 'Premium' : 'Free'}</Badge></td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#a1a1aa' }}>{formatDate(s.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleStatus(s)} title={s.status === 'active' ? 'Disable' : 'Enable'} style={{ color: '#a1a1aa' }}>
                        {s.status === 'active' ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => openEdit(s)} style={{ color: '#a1a1aa' }}><Pencil size={14} /></button>
                      <button onClick={() => deleteStream(s.id)} style={{ color: '#ef4444' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Stream' : 'Add Stream'}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Slug" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
          <Input label="Logo URL" value={form.logo_url} onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))} />
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#a1a1aa' }}>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#fafafa' }}>
              {['sports', 'cricket', 'football', 'tennis', 'bdix', 'international', 'fifa'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm" style={{ color: '#a1a1aa' }}>
              <input type="checkbox" checked={form.is_premium} onChange={e => setForm(f => ({ ...f, is_premium: e.target.checked }))} />
              Premium
            </label>
            <label className="flex items-center gap-2 text-sm" style={{ color: '#a1a1aa' }}>
              <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
              Featured
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
