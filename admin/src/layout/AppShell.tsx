import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  Tv,
  ShoppingCart,
  LayoutGrid,
  Users,
  ShieldCheck,
  FileText,
  BarChart3,
  Settings,
  Search,
  Bell,
} from "lucide-react";

interface NavDef {
  id: string;
  path: string;
  label: string;
  hue: number;
  icon: typeof LayoutDashboard;
}

const NAV_DEFS: NavDef[] = [
  { id: "dashboard", path: "/dashboard", label: "Дашборд", hue: 250, icon: LayoutDashboard },
  { id: "products", path: "/products", label: "Товары", hue: 195, icon: Tv },
  { id: "orders", path: "/orders", label: "Заказы", hue: 25, icon: ShoppingCart },
  { id: "categories", path: "/categories", label: "Категории", hue: 150, icon: LayoutGrid },
  { id: "customers", path: "/customers", label: "Клиенты", hue: 85, icon: Users },
  { id: "users", path: "/users", label: "Пользователи", hue: 300, icon: ShieldCheck },
  { id: "content", path: "/content", label: "Контент сайта", hue: 235, icon: FileText },
  { id: "analytics", path: "/analytics", label: "Аналитика", hue: 250, icon: BarChart3 },
  { id: "settings", path: "/settings", label: "Настройки", hue: 60, icon: Settings },
];

const TITLES: Record<string, [string, string]> = {
  dashboard: ["Дашборд", "Обзор продаж и склада на сегодня"],
  products: ["Товары", "Каталог телевизоров и аксессуаров Aston"],
  productDetail: ["Карточка товара", "Просмотр и редактирование товара"],
  orders: ["Заказы", "Все заказы интернет-магазина"],
  orderDetail: ["Заказ", "Детали заказа, клиент и доставка"],
  categories: ["Категории", "Структура каталога товаров"],
  customers: ["Клиенты", "База клиентов магазина"],
  users: ["Пользователи", "Роли и доступ к админ-панели"],
  content: ["Контент сайта", "Баннеры, акции, меню и страницы"],
  analytics: ["Аналитика", "Продажи, категории и бренды"],
  settings: ["Настройки", "Наценка, оплата, доставка и интеграции"],
};

function usePageMeta(): [string, string] {
  const location = useLocation();
  const params = useParams();
  const seg = location.pathname.split("/")[1] || "dashboard";
  if (seg === "products" && params.id !== undefined) return TITLES.productDetail;
  if (seg === "orders" && params.id !== undefined) return TITLES.orderDetail;
  return TITLES[seg] ?? TITLES.dashboard;
}

export function AppShell() {
  const location = useLocation();
  const activeSection = location.pathname.split("/")[1] || "dashboard";
  const [pageTitle, pageSubtitle] = usePageMeta();

  return (
    <div className="flex h-screen w-full bg-bg text-text font-sans overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-[248px] min-w-[248px] bg-sidebar border-r border-border flex flex-col p-[20px_14px]">
        <div className="flex items-center gap-2.5 px-2.5 pb-6 pt-1.5">
          <div className="w-[34px] h-[34px] rounded-[9px] shrink-0 bg-[linear-gradient(135deg,var(--color-accent-violet),var(--color-accent-cyan))]" />
          <div className="flex flex-col leading-tight">
            <div className="font-extrabold text-lg tracking-wide">ASTON</div>
            <div className="text-[11px] text-muted font-medium">CRM · Админ-панель</div>
          </div>
        </div>

        <nav className="flex flex-col gap-0.5">
          {NAV_DEFS.map((n) => {
            const active = n.id === activeSection;
            const Icon = n.icon;
            return (
              <NavLink
                key={n.id}
                to={n.path}
                className="flex items-center gap-[11px] px-3 py-2.5 rounded-[9px] mb-0.5 text-[13.5px] font-medium"
                style={{
                  background: active ? `oklch(0.24 0.02 ${n.hue})` : "transparent",
                  color: active ? "var(--color-text)" : "var(--color-text-tertiary)",
                  fontWeight: active ? 600 : 500,
                }}
              >
                <Icon size={15} style={{ color: active ? `oklch(0.68 0.16 ${n.hue})` : "var(--color-faint)" }} />
                {n.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto pt-3.5 px-2.5 border-t border-border-subtle flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-full bg-accent-violet flex items-center justify-center font-bold text-[13px] shrink-0 text-[oklch(0.14_0.01_258)]">
            АД
          </div>
          <div className="leading-tight overflow-hidden">
            <div className="text-[13px] font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
              Админ Дежуров
            </div>
            <div className="text-[11.5px] text-muted">Менеджер магазина</div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* TOPBAR */}
        <div className="h-[66px] min-h-[66px] flex items-center justify-between px-7 border-b border-border bg-topbar">
          <div>
            <div className="text-[19px] font-bold">{pageTitle}</div>
            <div className="text-[12.5px] text-muted mt-0.5">{pageSubtitle}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-[340px] h-[38px] rounded-[9px] bg-surface-2 border border-border-input flex items-center px-3 gap-2">
              <Search size={14} className="text-faint shrink-0" />
              <span className="text-[13px] text-faint">Поиск по товарам, заказам, клиентам...</span>
            </div>
            <div className="w-[38px] h-[38px] rounded-[9px] bg-surface-2 border border-border-input flex items-center justify-center relative shrink-0">
              <div className="w-2 h-2 rounded-full bg-accent-orange absolute top-2 right-2" />
              <Bell size={15} className="text-text-tertiary" />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-7 pt-6 pb-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
