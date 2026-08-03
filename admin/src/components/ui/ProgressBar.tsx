interface ProgressBarRowProps {
  label: string;
  value: string;
  pct: number;
  color?: string;
}

export function ProgressBarRow({ label, value, pct, color = "var(--color-accent-violet)" }: ProgressBarRowProps) {
  return (
    <div>
      <div className="flex justify-between text-[12.5px] mb-1.5">
        <span className="font-medium truncate max-w-[150px]">{label}</span>
        <span className="font-mono text-muted">{value}</span>
      </div>
      <div className="h-1.5 rounded bg-surface-active overflow-hidden">
        <div className="h-full rounded" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
      </div>
    </div>
  );
}
