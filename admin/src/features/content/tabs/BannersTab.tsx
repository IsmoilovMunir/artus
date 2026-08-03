import { Plus } from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";

export function BannersTab() {
  const banners = useAdminStore((s) => s.banners);
  const toggleBanner = useAdminStore((s) => s.toggleBanner);

  return (
    <div>
      <div className="flex justify-end mb-3.5">
        <Button accent="var(--color-accent-blue)">
          <Plus size={15} />
          Добавить баннер
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {banners.map((b) => (
          <Card key={b.id} className="flex gap-4 p-4.5 items-center">
            <div className="w-[120px] h-16 rounded-[9px] shrink-0 bg-[repeating-linear-gradient(45deg,var(--color-surface-active),var(--color-surface-active)_5px,var(--color-surface-2)_5px,var(--color-surface-2)_10px)]" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold mb-0.5">{b.title}</div>
              <div className="text-[12.5px] text-muted mb-1.5">{b.subtitle}</div>
              <div className="text-[11.5px] text-faint font-mono">{b.from} — {b.to}</div>
            </div>
            <Toggle
              active={b.active}
              onLabel="Активен"
              offLabel="Выключен"
              color="var(--color-accent-green)"
              onClick={() => toggleBanner(b.id)}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
