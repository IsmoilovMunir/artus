import { useAdminStore } from "@/store/useAdminStore";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export function StoreTab() {
  const settings = useAdminStore((s) => s.settings);
  const updateSettings = useAdminStore((s) => s.updateSettings);

  return (
    <Card className="p-6 max-w-[520px] flex flex-col gap-3.5">
      <div>
        <div className="text-xs text-muted font-medium mb-1.5">Название организации</div>
        <Input value={settings.storeName} onChange={(e) => updateSettings({ storeName: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <div className="text-xs text-muted font-medium mb-1.5">Телефон</div>
          <Input value={settings.storePhone} onChange={(e) => updateSettings({ storePhone: e.target.value })} />
        </div>
        <div>
          <div className="text-xs text-muted font-medium mb-1.5">Email</div>
          <Input value={settings.storeEmail} onChange={(e) => updateSettings({ storeEmail: e.target.value })} />
        </div>
      </div>
      <div>
        <div className="text-xs text-muted font-medium mb-1.5">Адрес</div>
        <Input value={settings.storeAddress} onChange={(e) => updateSettings({ storeAddress: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <div className="text-xs text-muted font-medium mb-1.5">ИНН</div>
          <Input mono value={settings.storeInn} onChange={(e) => updateSettings({ storeInn: e.target.value })} />
        </div>
        <div>
          <div className="text-xs text-muted font-medium mb-1.5">ОГРН</div>
          <Input mono value={settings.storeOgrn} onChange={(e) => updateSettings({ storeOgrn: e.target.value })} />
        </div>
      </div>
      <div>
        <div className="text-xs text-muted font-medium mb-1.5">Часы работы</div>
        <Input value={settings.storeHours} onChange={(e) => updateSettings({ storeHours: e.target.value })} />
      </div>
    </Card>
  );
}
