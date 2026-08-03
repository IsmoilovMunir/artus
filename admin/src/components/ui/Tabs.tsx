export interface TabItem<T extends string = string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  accent?: string;
}

export function Tabs<T extends string>({ items, active, onChange, accent = "var(--color-accent-violet)" }: TabsProps<T>) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <div
            key={item.id}
            onClick={() => onChange(item.id)}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold cursor-pointer border"
            style={{
              background: isActive ? accent : "var(--color-surface-2)",
              color: isActive ? "oklch(0.14 0.01 258)" : "var(--color-text-tertiary)",
              borderColor: isActive ? "transparent" : "var(--color-border-input)",
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
}
