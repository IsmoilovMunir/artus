import { useAdminStore } from "@/store/useAdminStore";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";

export function SeoTab() {
  const siteSeo = useAdminStore((s) => s.siteSeo);
  const updateSiteSeo = useAdminStore((s) => s.updateSiteSeo);

  return (
    <Card className="p-5.5 max-w-[640px]">
      <div className="text-sm font-bold mb-4">SEO настройки сайта</div>
      <div className="mb-3.5">
        <div className="text-xs text-muted font-medium mb-1.5">Заголовок главной страницы (title)</div>
        <Input value={siteSeo.title} onChange={(e) => updateSiteSeo({ title: e.target.value })} />
      </div>
      <div className="mb-3.5">
        <div className="text-xs text-muted font-medium mb-1.5">Meta description по умолчанию</div>
        <Textarea rows={3} value={siteSeo.description} onChange={(e) => updateSiteSeo({ description: e.target.value })} />
      </div>
      <div className="mb-3.5">
        <div className="text-xs text-muted font-medium mb-1.5">Google Analytics / метрика ID</div>
        <Input placeholder="G-XXXXXXX" value={siteSeo.gaId} onChange={(e) => updateSiteSeo({ gaId: e.target.value })} />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-[13px]">Разрешить индексацию сайта поисковиками</div>
        <Toggle
          active={siteSeo.robotsIndex}
          onLabel="Включено"
          offLabel="Выключено"
          color="var(--color-accent-green)"
          onClick={() => updateSiteSeo({ robotsIndex: !siteSeo.robotsIndex })}
        />
      </div>
    </Card>
  );
}
