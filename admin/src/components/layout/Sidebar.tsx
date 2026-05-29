'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Tv, Trophy, Bell, BarChart2,
  Server, Settings, Megaphone, CreditCard, Users, LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/streams', icon: Tv, label: 'Streams' },
  { href: '/dashboard/matches', icon: Trophy, label: 'Matches' },
  { href: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/dashboard/server-control', icon: Server, label: 'Server Control' },
  { href: '/dashboard/app-config', icon: Settings, label: 'App Config' },
  { href: '/dashboard/ads', icon: Megaphone, label: 'Ads' },
  { href: '/dashboard/premium', icon: CreditCard, label: 'Premium' },
  { href: '/dashboard/users', icon: Users, label: 'Users' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: '#18181b', borderRight: '1px solid #3f3f46' }}>
      <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid #3f3f46' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#22c55e' }}>
          <span className="text-black font-bold text-sm">S</span>
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: '#fafafa' }}>Sports TV</p>
          <p className="text-xs" style={{ color: '#a1a1aa' }}>Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
              style={{
                background: active ? 'rgba(34,197,94,0.12)' : 'transparent',
                color: active ? '#22c55e' : '#a1a1aa',
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3" style={{ borderTop: '1px solid #3f3f46' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-colors hover:opacity-80"
          style={{ color: '#ef4444' }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
