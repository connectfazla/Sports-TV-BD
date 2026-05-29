import { cn } from '@/lib/utils';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: Props) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm" style={{ color: '#a1a1aa' }}>{label}</label>}
      <input
        {...props}
        className={cn('w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors', className)}
        style={{ background: '#27272a', border: `1px solid ${error ? '#ef4444' : '#3f3f46'}`, color: '#fafafa' }}
      />
      {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  );
}
