'use client';

import { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { Match } from '@/types/match';
import { toast } from 'sonner';
import { Plus, Pencil, Radio } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type MatchStatus = Match['status'];

function statusVariant(s: MatchStatus): 'green' | 'red' | 'yellow' | 'gray' {
  const m: Record<MatchStatus, 'green' | 'red' | 'yellow' | 'gray'> = {
    live: 'green', scheduled: 'yellow', finished: 'gray', postponed: 'red', cancelled: 'red'
  };
  return m[s];
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [scoreModal, setScoreModal] = useState<Match | null>(null);
  const [form, setForm] = useState({ title: '', home_team: '', away_team: '', tournament: '', scheduled_at: '', is_featured: false });
  const [score, setScore] = useState({ home: 0, away: 0 });

  useEffect(() => { fetchMatches(); }, []);

  async function fetchMatches() {
    try {
      setMatches(await api.get<Match[]>('/matches'));
    } catch { toast.error('Failed to load matches'); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    try {
      const m = await api.post<Match>('/matches', form);
      setMatches(ms => [m, ...ms]);
      setShowModal(false);
      toast.success('Match created');
    } catch (e: any) { toast.error(e.message); }
  }

  async function setStatus(id: string, status: MatchStatus) {
    try {
      await api.patch(`/matches/${id}/status`, { status });
      setMatches(ms => ms.map(m => m.id === id ? { ...m, status } : m));
      toast.success(`Status → ${status}`);
    } catch (e: any) { toast.error(e.message); }
  }

  async function saveScore() {
    if (!scoreModal) return;
    try {
      await api.patch(`/matches/${scoreModal.id}/score`, { home_score: score.home, away_score: score.away });
      setMatches(ms => ms.map(m => m.id === scoreModal.id ? { ...m, home_score: score.home, away_score: score.away } : m));
      setScoreModal(null);
      toast.success('Score updated');
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <>
      <TopBar title="Matches" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: '#a1a1aa' }}>{matches.length} matches</p>
          <Button onClick={() => setShowModal(true)}><Plus size={14} /> Add Match</Button>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #3f3f46' }}>
          <table className="w-full text-sm">
            <thead style={{ background: '#18181b', borderBottom: '1px solid #3f3f46' }}>
              <tr>
                {['Match', 'Tournament', 'Status', 'Score', 'Kickoff', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: '#a1a1aa' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8" style={{ color: '#a1a1aa' }}>Loading...</td></tr>
              ) : matches.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #27272a' }}>
                  <td className="px-4 py-3">
                    <p style={{ color: '#fafafa' }}>{m.home_team} vs {m.away_team}</p>
                    <p className="text-xs" style={{ color: '#a1a1aa' }}>{m.title}</p>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#a1a1aa' }}>{m.tournament ?? '—'}</td>
                  <td className="px-4 py-3"><Badge variant={statusVariant(m.status)}>{m.status}</Badge></td>
                  <td className="px-4 py-3 font-mono" style={{ color: '#22c55e' }}>{m.home_score} – {m.away_score}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#a1a1aa' }}>{formatDate(m.scheduled_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setScoreModal(m); setScore({ home: m.home_score, away: m.away_score }); }} style={{ color: '#a1a1aa' }}><Pencil size={14} /></button>
                      {m.status === 'scheduled' && <button onClick={() => setStatus(m.id, 'live')} style={{ color: '#22c55e' }}><Radio size={14} /></button>}
                      {m.status === 'live' && <button onClick={() => setStatus(m.id, 'finished')} style={{ color: '#f59e0b' }}>✓</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Match">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Input label="Home Team" value={form.home_team} onChange={e => setForm(f => ({ ...f, home_team: e.target.value }))} />
          <Input label="Away Team" value={form.away_team} onChange={e => setForm(f => ({ ...f, away_team: e.target.value }))} />
          <Input label="Tournament" value={form.tournament} onChange={e => setForm(f => ({ ...f, tournament: e.target.value }))} />
          <Input label="Kickoff (UTC)" type="datetime-local" value={form.scheduled_at} onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>Create Match</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!scoreModal} onClose={() => setScoreModal(null)} title="Update Score">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input label={scoreModal?.home_team ?? 'Home'} type="number" value={String(score.home)} onChange={e => setScore(s => ({ ...s, home: Number(e.target.value) }))} />
            <span className="mt-6 font-bold" style={{ color: '#fafafa' }}>—</span>
            <Input label={scoreModal?.away_team ?? 'Away'} type="number" value={String(score.away)} onChange={e => setScore(s => ({ ...s, away: Number(e.target.value) }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setScoreModal(null)}>Cancel</Button>
            <Button onClick={saveScore}>Save Score</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
