import { useAdminStore } from "@/store/useAdminStore";
import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import type { Settings } from "@/lib/types";

const PAYMENT_KEYS: { key: keyof Settings; label: string }[] = [
  { key: "payCard", label: "Банковская карта" },
  { key: "paySbp", label: "СБП" },
  { key: "payCash", label: "Наличными курьеру" },
];

export function PayDeliveryTab() {
  const settings = useAdminStore((s) => s.settings);
  const updateSettings = useAdminStore((s) => s.updateSettings);
  const updateDeliveryCost = useAdminStore((s) => s.updateDeliveryCost);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-5">
        <div className="text-[13px] font-semibold mb-3.5">Способы оплаты</div>
        <div className="flex flex-col gap-3">
          {PAYMENT_KEYS.map((p) => (
            <div key={p.key} className="flex justify-between items-center">
              <span className="text-[13px]">{p.label}</span>
              <Toggle
                active={Boolean(settings[p.key])}
                onLabel="Включено"
                offLabel="Выключено"
                color="var(--color-accent-green)"
                onClick={() => updateSettings({ [p.key]: !settings[p.key] } as Partial<Settings>)}
              />
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5">
        <div className="text-[13px] font-semibold mb-3.5">Способы доставки и тарифы</div>
        <div className="flex flex-col gap-3">
          {settings.delivery.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-2.5">
              <span className="text-[13px]">{d.name}</span>
              <div className="flex items-center gap-1.5">
                <input
                  value={d.cost}
                  onChange={(e) => updateDeliveryCost(d.id, Number(e.target.value))}
                  className="w-[90px] h-[34px] rounded-lg bg-surface-3 border border-border-input px-2.5 text-[13px] font-mono outline-none"
                />
                <span className="text-xs text-muted">₽</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
