import { toggleStyle } from "@/lib/badge";

interface ToggleProps {
  active: boolean;
  onLabel: string;
  offLabel: string;
  color?: string;
  onClick: () => void;
}

export function Toggle({ active, onLabel, offLabel, color = "var(--color-accent-green)", onClick }: ToggleProps) {
  return (
    <div style={toggleStyle(active, color)} onClick={onClick}>
      {active ? onLabel : offLabel}
    </div>
  );
}
