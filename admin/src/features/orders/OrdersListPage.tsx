import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "@/store/useAdminStore";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { TableCard, TableHead, TableRow } from "@/components/ui/Table";
import { money } from "@/lib/money";
import { orderStatusStyle, paymentStatusStyle } from "@/lib/badge";
import type { OrderStatus } from "@/lib/types";

const STATUS_TABS: (OrderStatus | "Все")[] = ["Все", "Новый", "В обработке", "Отправлен", "Доставлен", "Отменён"];
const GRID = "1fr 1.3fr 1fr 0.8fr 0.9fr 1fr 1fr";

export function OrdersListPage() {
  const orders = useAdminStore((s) => s.orders);
  const customers = useAdminStore((s) => s.customers);
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof STATUS_TABS)[number]>("Все");

  const rows = useMemo(() => {
    const sorted = [...orders].sort((a, b) => b.id.localeCompare(a.id));
    const filtered = tab === "Все" ? sorted : sorted.filter((o) => o.status === tab);
    return filtered.map((o) => {
      const customer = customers.find((c) => c.id === o.customerId);
      const itemsCount = o.items.reduce((a, it) => a + it.qty, 0);
      const total = o.items.reduce((a, it) => a + it.price * it.qty, 0) + o.shipping;
      return { ...o, customerName: customer?.name ?? "—", itemsCount, total };
    });
  }, [orders, customers, tab]);

  return (
    <div>
      <Tabs
        items={STATUS_TABS.map((t) => ({ id: t, label: t }))}
        active={tab}
        onChange={setTab}
        accent="var(--color-accent-violet)"
      />
      <TableCard>
        <TableHead
          gridTemplateColumns={GRID}
          columns={["Заказ", "Клиент", "Дата", "Товары", "Сумма", "Оплата", "Статус"]}
        />
        {rows.map((o, i) => (
          <TableRow key={o.id} gridTemplateColumns={GRID} onClick={() => navigate(`/orders/${o.id}`)} last={i === rows.length - 1}>
            <div className="font-mono text-[12.5px]">{o.id}</div>
            <div className="text-[13px]">{o.customerName}</div>
            <div className="text-[12.5px] text-muted">{o.date}</div>
            <div className="font-mono text-[12.5px] text-text-tertiary">{o.itemsCount}</div>
            <div className="font-mono text-[13px]">{money(o.total)}</div>
            <div>
              <Badge style={paymentStatusStyle(o.payment)}>{o.payment}</Badge>
            </div>
            <div>
              <Badge style={orderStatusStyle(o.status)}>{o.status}</Badge>
            </div>
          </TableRow>
        ))}
      </TableCard>
    </div>
  );
}
