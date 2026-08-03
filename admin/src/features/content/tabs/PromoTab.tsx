import { Plus } from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";

export function PromoTab() {
  const promos = useAdminStore((s) => s.promos);
  const togglePromo = useAdminStore((s) => s.togglePromo);

  return (
    <div>
      <div className="flex justify-end mb-3.5">
        <Button accent="var(--color-accent-blue)">
          <Plus size={15} />
          Добавить акцию
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {promos.map((p) => (
          <Card key={p.id} className="flex gap-4 p-4.5 items-center">
            <div className="w-14 h-14 rounded-[10px] shrink-0 flex items-center justify-center font-extrabold text-[15px] bg-accent-orange text-[oklch(0.14_0.01_258)]">
              -{p.discount}%
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold mb-0.5">{p.title}</div>
              <div className="text-[12.5px] text-muted mb-1.5">{p.scope}</div>
              <div className="text-[11.5px] text-faint font-mono">{p.from} — {p.to}</div>
            </div>
            <Toggle
              active={p.active}
              onLabel="Активна"
              offLabel="Выключена"
              color="var(--color-accent-green)"
              onClick={() => togglePromo(p.id)}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
