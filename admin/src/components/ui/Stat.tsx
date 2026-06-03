interface Props {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}

export function Stat({ label, value, sub, color = '#22c55e' }: Props) {
  return (
    <div className="rounded-xl p-5" style={{ background: '#18181b', border: '1px solid #3f3f46' }}>
      <p className="text-xs font-medium mb-1" style={{ color: '#a1a1aa' }}>{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: '#a1a1aa' }}>{sub}</p>}
    </div>
  );
}
