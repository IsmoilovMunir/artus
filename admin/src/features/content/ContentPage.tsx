import { useNavigate, useParams } from "react-router-dom";
import { Tabs } from "@/components/ui/Tabs";
import { BannersTab } from "./tabs/BannersTab";
import { PromoTab } from "./tabs/PromoTab";
import { MenuTab } from "./tabs/MenuTab";
import { PagesTab } from "./tabs/PagesTab";
import { SeoTab } from "./tabs/SeoTab";

const TABS = [
  { id: "banners", label: "Баннеры" },
  { id: "promo", label: "Акции" },
  { id: "menu", label: "Меню и категории" },
  { id: "pages", label: "Страницы" },
  { id: "seo", label: "SEO" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ContentPage() {
  const { tab } = useParams<{ tab: TabId }>();
  const navigate = useNavigate();
  const active: TabId = TABS.some((t) => t.id === tab) ? (tab as TabId) : "banners";

  return (
    <div>
      <Tabs items={[...TABS]} active={active} onChange={(id) => navigate(`/content/${id}`)} accent="var(--color-accent-blue)" />
      {active === "banners" && <BannersTab />}
      {active === "promo" && <PromoTab />}
      {active === "menu" && <MenuTab />}
      {active === "pages" && <PagesTab />}
      {active === "seo" && <SeoTab />}
    </div>
  );
}
