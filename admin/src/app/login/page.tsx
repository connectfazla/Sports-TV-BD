'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      toast.error('Invalid credentials');
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#09090b' }}>
      <div className="w-full max-w-sm p-8 rounded-2xl glass">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#22c55e' }}>
            <span className="text-black font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: '#fafafa' }}>Sports TV</h1>
            <p className="text-xs" style={{ color: '#a1a1aa' }}>Admin Dashboard</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#a1a1aa' }}>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
              style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#fafafa' }}
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#a1a1aa' }}>Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#fafafa' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-opacity disabled:opacity-50"
            style={{ background: '#22c55e', color: '#000' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
