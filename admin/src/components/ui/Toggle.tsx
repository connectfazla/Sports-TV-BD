'use client';

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: Props) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        className="relative w-10 h-5 rounded-full transition-colors"
        style={{ background: checked ? '#22c55e' : '#3f3f46' }}
        onClick={() => onChange(!checked)}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform"
          style={{ background: '#fff', transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </div>
      {label && <span className="text-sm" style={{ color: '#fafafa' }}>{label}</span>}
    </label>
  );
}
