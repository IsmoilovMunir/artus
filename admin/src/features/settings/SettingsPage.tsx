import { useNavigate, useParams } from "react-router-dom";
import { Tabs } from "@/components/ui/Tabs";
import { MarkupTab } from "./tabs/MarkupTab";
import { PayDeliveryTab } from "./tabs/PayDeliveryTab";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { StoreTab } from "./tabs/StoreTab";
import { WarehouseTab } from "./tabs/WarehouseTab";

const TABS = [
  { id: "markup", label: "Наценка" },
  { id: "pay-delivery", label: "Оплата и доставка" },
  { id: "notifications", label: "Уведомления" },
  { id: "store", label: "Магазин" },
  { id: "warehouse", label: "Склад" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SettingsPage() {
  const { tab } = useParams<{ tab: TabId }>();
  const navigate = useNavigate();
  const active: TabId = TABS.some((t) => t.id === tab) ? (tab as TabId) : "markup";

  return (
    <div>
      <Tabs items={[...TABS]} active={active} onChange={(id) => navigate(`/settings/${id}`)} accent="var(--color-accent-yellow)" />
      {active === "markup" && <MarkupTab />}
      {active === "pay-delivery" && <PayDeliveryTab />}
      {active === "notifications" && <NotificationsTab />}
      {active === "store" && <StoreTab />}
      {active === "warehouse" && <WarehouseTab />}
    </div>
  );
}
