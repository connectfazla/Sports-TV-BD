interface Props {
  children: React.ReactNode;
  variant?: 'green' | 'red' | 'yellow' | 'gray';
}

const variants = {
  green:  { background: 'rgba(34,197,94,0.15)',  color: '#22c55e'  },
  red:    { background: 'rgba(239,68,68,0.15)',  color: '#ef4444'  },
  yellow: { background: 'rgba(245,158,11,0.15)', color: '#f59e0b'  },
  gray:   { background: 'rgba(161,161,170,0.15)',color: '#a1a1aa'  },
};

export function Badge({ children, variant = 'gray' }: Props) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
      style={variants[variant]}
    >
      {children}
    </span>
  );
}
