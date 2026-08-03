import { useAdminStore } from "@/store/useAdminStore";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import type { Settings } from "@/lib/types";

const NOTIF_KEYS: { key: keyof Settings; label: string }[] = [
  { key: "notifyEmailNewOrder", label: "Email при новом заказе" },
  { key: "notifyEmailStatusChange", label: "Email при смене статуса" },
  { key: "notifyPushLowStock", label: "Push при низком остатке" },
];

export function NotificationsTab() {
  const settings = useAdminStore((s) => s.settings);
  const updateSettings = useAdminStore((s) => s.updateSettings);

  return (
    <Card className="p-5 max-w-[480px]">
      <div className="text-[13px] font-semibold mb-3.5">Уведомления</div>
      <div className="flex flex-col gap-3 mb-4">
        {NOTIF_KEYS.map((n) => (
          <div key={n.key} className="flex justify-between items-center">
            <span className="text-[13px]">{n.label}</span>
            <Toggle
              active={Boolean(settings[n.key])}
              onLabel="Включено"
              offLabel="Выключено"
              color="var(--color-accent-green)"
              onClick={() => updateSettings({ [n.key]: !settings[n.key] } as Partial<Settings>)}
            />
          </div>
        ))}
      </div>
      <div className="text-xs text-muted font-medium mb-1.5">Email для уведомлений о заказах</div>
      <Input value={settings.notifyEmail} onChange={(e) => updateSettings({ notifyEmail: e.target.value })} />
    </Card>
  );
}
