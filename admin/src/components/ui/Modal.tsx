'use client';

import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-lg rounded-2xl" style={{ background: '#18181b', border: '1px solid #3f3f46' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #3f3f46' }}>
          <h2 className="font-semibold" style={{ color: '#fafafa' }}>{title}</h2>
          <button onClick={onClose} style={{ color: '#a1a1aa' }}><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
