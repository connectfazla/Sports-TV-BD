'use client';

import { useSession } from 'next-auth/react';

interface Props {
  title: string;
}

export function TopBar({ title }: Props) {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #3f3f46', background: '#18181b' }}>
      <h1 className="text-lg font-semibold" style={{ color: '#fafafa' }}>{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium" style={{ color: '#fafafa' }}>{session?.user?.name ?? 'Admin'}</p>
          <p className="text-xs" style={{ color: '#22c55e' }}>Administrator</p>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#22c55e' }}>
          <span className="text-black font-bold text-xs">A</span>
        </div>
      </div>
    </header>
  );
}
