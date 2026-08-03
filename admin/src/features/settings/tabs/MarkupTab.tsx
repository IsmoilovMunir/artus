import { useAdminStore } from "@/store/useAdminStore";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export function MarkupTab() {
  const settings = useAdminStore((s) => s.settings);
  const updateSettings = useAdminStore((s) => s.updateSettings);
  const updateMarkupCategory = useAdminStore((s) => s.updateMarkupCategory);
  const updateMarkupBrand = useAdminStore((s) => s.updateMarkupBrand);

  return (
    <div>
      <Card className="p-5.5 mb-4 max-w-[420px]">
        <div className="text-[13px] font-semibold mb-2">Общая наценка по умолчанию</div>
        <div className="flex items-center gap-2.5">
          <Input
            className="w-[100px]"
            mono
            value={settings.markupGeneral}
            onChange={(e) => updateSettings({ markupGeneral: Number(e.target.value) })}
          />
          <span className="text-sm text-muted">%</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="text-[13px] font-semibold mb-3.5">Наценка по категориям</div>
          <div className="flex flex-col gap-2.5">
            {settings.markupByCategory.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-2.5">
                <span className="text-[13px]">{m.name}</span>
                <div className="flex items-center gap-1.5">
                  <input
                    value={m.pct}
                    onChange={(e) => updateMarkupCategory(m.id, Number(e.target.value))}
                    className="w-16 h-[34px] rounded-lg bg-surface-3 border border-border-input px-2.5 text-[13px] font-mono outline-none"
                  />
                  <span className="text-xs text-muted">%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-[13px] font-semibold mb-3.5">Наценка по брендам</div>
          <div className="flex flex-col gap-2.5">
            {settings.markupByBrand.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-2.5">
                <span className="text-[13px]">{m.name}</span>
                <div className="flex items-center gap-1.5">
                  <input
                    value={m.pct}
                    onChange={(e) => updateMarkupBrand(m.id, Number(e.target.value))}
                    className="w-16 h-[34px] rounded-lg bg-surface-3 border border-border-input px-2.5 text-[13px] font-mono outline-none"
                  />
                  <span className="text-xs text-muted">%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
