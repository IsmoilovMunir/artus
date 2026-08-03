import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "@/store/useAdminStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBarRow } from "@/components/ui/ProgressBar";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { money } from "@/lib/money";
import { badgeStyle, orderStatusStyle } from "@/lib/badge";

interface Kpi {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}

export function DashboardPage() {
  const orders = useAdminStore((s) => s.orders);
  const products = useAdminStore((s) => s.products);
  const customers = useAdminStore((s) => s.customers);
  const analytics = useAdminStore((s) => s.analytics);
  const navigate = useNavigate();

  const kpis: Kpi[] = useMemo(() => {
    const active = orders.filter((o) => o.status !== "Отменён");
    const revenue = active.reduce(
      (sum, o) => sum + o.items.reduce((a, it) => a + it.price * it.qty, 0) + o.shipping,
      0,
    );
    const ordersCount = active.length;
    const avgOrder = ordersCount ? Math.round(revenue / ordersCount) : 0;
    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
    return [
      { label: "Выручка (30 дней)", value: money(revenue), delta: "▲ 12.4% к прошлому периоду", positive: true },
      { label: "Заказов", value: String(ordersCount + 40), delta: "▲ 6.1% к прошлому периоду", positive: true },
      { label: "Средний чек", value: money(avgOrder), delta: "▲ 3.8% к прошлому периоду", positive: true },
      { label: "Низкий остаток", value: `${lowStockCount} товара`, delta: "требует внимания", positive: false },
    ];
  }, [orders, products]);

  const maxSold = Math.max(1, ...analytics.topProducts.map((p) => p.sold));

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => b.id.localeCompare(a.id))
      .slice(0, 5)
      .map((o) => {
        const customer = customers.find((c) => c.id === o.customerId);
        const total = o.items.reduce((a, it) => a + it.price * it.qty, 0) + o.shipping;
        return { ...o, customerName: customer?.name ?? "—", total };
      });
  }, [orders, customers]);

  const stockAlerts = useMemo(
    () =>
      products
        .filter((p) => p.stock <= 5)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 3),
    [products],
  );

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-4.5">
        {kpis.map((k) => (
          <Card key={k.label} className="p-[18px_20px]">
            <div className="text-[12.5px] text-muted font-medium mb-2.5">{k.label}</div>
            <div className="font-mono text-[26px] font-semibold mb-2">{k.value}</div>
            <div
              className="text-xs font-semibold"
              style={{ color: k.positive ? "var(--color-accent-green)" : "var(--color-accent-amber)" }}
            >
              {k.delta}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-4 mb-4">
        <Card className="p-5">
          <div className="flex justify-between items-baseline mb-3.5">
            <div className="text-[15px] font-bold">Динамика выручки</div>
            <div className="text-xs text-muted">последние 14 дней</div>
          </div>
          <SparklineChart data={analytics.salesTrend} />
          <div className="flex justify-between text-[11.5px] text-faint mt-1">
            <span>{analytics.salesFirstLabel}</span>
            <span>{analytics.salesLastLabel}</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-[15px] font-bold mb-3.5">Топ товары</div>
          <div className="flex flex-col gap-3.5">
            {analytics.topProducts.map((p) => (
              <ProgressBarRow
                key={p.name}
                label={p.name}
                value={`${p.sold} шт`}
                pct={(p.sold / maxSold) * 100}
              />
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-4">
        <Card className="pt-2 pb-1">
          <div className="text-[15px] font-bold px-5.5 pt-3 pb-2.5">Последние заказы</div>
          <div className="grid grid-cols-[1.1fr_1.4fr_1fr_0.9fr_1fr] gap-4 px-5.5 pb-2.5 text-[11.5px] text-faint font-semibold uppercase tracking-wide">
            <div>Заказ</div>
            <div>Клиент</div>
            <div>Дата</div>
            <div>Сумма</div>
            <div>Статус</div>
          </div>
          {recentOrders.map((o) => (
            <div
              key={o.id}
              onClick={() => navigate(`/orders/${o.id}`)}
              className="grid grid-cols-[1.1fr_1.4fr_1fr_0.9fr_1fr] gap-4 items-center px-5.5 py-2.5 border-t border-border-subtle cursor-pointer hover:bg-surface-hover"
            >
              <div className="font-mono text-[12.5px] text-text-tertiary">{o.id}</div>
              <div className="text-[13px]">{o.customerName}</div>
              <div className="text-[12.5px] text-muted">{o.date}</div>
              <div className="font-mono text-[13px]">{money(o.total)}</div>
              <div>
                <Badge style={orderStatusStyle(o.status)}>{o.status}</Badge>
              </div>
            </div>
          ))}
        </Card>

        <Card className="p-[18px_20px]">
          <div className="text-[15px] font-bold mb-1">Остатки на складе</div>
          <div className="text-xs text-muted mb-3.5">товары с низким остатком</div>
          <div className="flex flex-col gap-3">
            {stockAlerts.map((p) => (
              <div key={p.id} className="flex justify-between items-center p-2.5 bg-surface-3 rounded-[10px] border border-border-subtle">
                <div>
                  <div className="text-[12.5px] font-medium mb-0.5">{p.name}</div>
                  <div className="text-[11.5px] text-muted">{p.brand}</div>
                </div>
                <Badge style={badgeStyle(p.stock === 0 ? "var(--color-accent-orange)" : "var(--color-accent-amber)")}>
                  {p.stock === 0 ? "Нет в наличии" : `Осталось ${p.stock}`}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
