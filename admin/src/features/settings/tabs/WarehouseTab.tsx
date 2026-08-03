import { useAdminStore } from "@/store/useAdminStore";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const FREQ_OPTIONS = [
  { value: "1", label: "каждую минуту" },
  { value: "5", label: "каждые 5 минут" },
  { value: "15", label: "каждые 15 минут" },
  { value: "60", label: "каждый час" },
];

export function WarehouseTab() {
  const settings = useAdminStore((s) => s.settings);
  const updateSettings = useAdminStore((s) => s.updateSettings);
  const syncWarehouseNow = useAdminStore((s) => s.syncWarehouseNow);

  return (
    <Card className="p-5.5 max-w-[640px]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-[13px] font-semibold mb-1">Интеграция со складом</div>
          <div className="text-xs text-muted">Остаток товаров подтягивается автоматически. Название и цена — только при первом добавлении товара, дальше редактируются вручную</div>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: "color-mix(in oklch, var(--color-accent-green) 15%, transparent)", color: "var(--color-accent-green)" }}
        >
          <div className="w-[7px] h-[7px] rounded-full bg-accent-green" />
          Синхронизировано: {settings.whLastSync}
        </div>
      </div>

      <div className="mb-3.5">
        <div className="text-xs text-muted font-medium mb-1.5">API склада</div>
        <Input variant="locked" mono disabled value={settings.whEndpoint} />
      </div>

      <div className="flex items-center gap-3.5 mb-4.5">
        <div className="text-[13px]">Частота синхронизации</div>
        <Select value={settings.whFreq} onChange={(e) => updateSettings({ whFreq: e.target.value })}>
          {FREQ_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </Select>
        <Button onClick={syncWarehouseNow}>Синхронизировать сейчас</Button>
      </div>

      <div className="text-[13px] font-semibold mb-2.5">Журнал синхронизации</div>
      <div className="flex flex-col gap-2">
        {settings.whLog.map((l, i) => (
          <div key={i} className="flex gap-3.5 text-[12.5px] p-2.5 bg-surface-3 rounded-lg">
            <span className="font-mono text-muted shrink-0">{l.time}</span>
            <span className="text-text-secondary">{l.msg}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
