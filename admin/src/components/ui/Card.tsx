import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: Props) {
  return (
    <div
      className={cn('rounded-xl p-5', className)}
      style={{ background: '#18181b', border: '1px solid #3f3f46' }}
    >
      {children}
    </div>
  );
}
