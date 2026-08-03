import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAdminStore, useCustomer, useOrder } from "@/store/useAdminStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { money } from "@/lib/money";
import { orderStatusStyle, paymentStatusStyle } from "@/lib/badge";
import type { OrderStatus } from "@/lib/types";

const STAGE_ORDER: OrderStatus[] = ["Новый", "В обработке", "Отправлен", "Доставлен"];
const ALL_STATUSES: OrderStatus[] = ["Новый", "В обработке", "Отправлен", "Доставлен", "Отменён"];

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useOrder(id);
  const customer = useCustomer(order?.customerId);
  const setOrderStatus = useAdminStore((s) => s.setOrderStatus);

  if (!order) {
    return <div className="text-muted">Заказ не найден.</div>;
  }

  const itemsTotal = order.items.reduce((a, it) => a + it.price * it.qty, 0);
  const total = itemsTotal + order.shipping;
  const curIdx = STAGE_ORDER.indexOf(order.status);

  const timeline =
    order.status === "Отменён"
      ? [
          { label: "Заказ создан", date: order.date, done: true, cancel: false },
          { label: "Заказ отменён", date: order.date, done: true, cancel: true },
        ]
      : STAGE_ORDER.map((label, i) => ({
          label,
          date: i <= curIdx ? order.date : "—",
          done: i <= curIdx,
          cancel: false,
        }));

  return (
    <div>
      <div
        onClick={() => navigate("/orders")}
        className="flex items-center gap-2 text-[13px] text-muted mb-4.5 cursor-pointer w-fit"
      >
        <ChevronLeft size={14} />
        <span>Заказы</span>
        <span>/</span>
        <span className="text-text-secondary">{order.id}</span>
      </div>

      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3.5">
          <div className="text-[22px] font-extrabold font-mono">{order.id}</div>
          <Badge style={orderStatusStyle(order.status)}>{order.status}</Badge>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {ALL_STATUSES.filter((st) => st !== order.status).map((st) => (
            <div
              key={st}
              onClick={() => setOrderStatus(order.id, st)}
              className="px-3.5 py-2 rounded-lg text-[12.5px] font-semibold cursor-pointer bg-surface-active border border-border-strong text-text-secondary"
            >
              {st}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-5">
        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-[2.2fr_0.6fr_0.9fr_0.9fr] gap-4 px-5 py-3 text-[11.5px] text-faint font-semibold uppercase border-b border-border">
              <div>Товар</div>
              <div>Кол-во</div>
              <div>Цена</div>
              <div>Сумма</div>
            </div>
            {order.items.map((it, i) => (
              <div key={i} className="grid grid-cols-[2.2fr_0.6fr_0.9fr_0.9fr] gap-4 items-center px-5 py-3.5 border-b border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-[38px] h-[38px] rounded-lg shrink-0 bg-[repeating-linear-gradient(45deg,var(--color-surface-active),var(--color-surface-active)_4px,var(--color-surface-2)_4px,var(--color-surface-2)_8px)]" />
                  <div className="text-[13px]">{it.name}</div>
                </div>
                <div className="font-mono text-[13px]">{it.qty}</div>
                <div className="font-mono text-[13px] text-muted">{money(it.price)}</div>
                <div className="font-mono text-[13px]">{money(it.price * it.qty)}</div>
              </div>
            ))}
            <div className="p-3.5 px-5 flex flex-col gap-1.5 items-end">
              <div className="flex gap-6 text-[12.5px] text-muted">
                <span>Доставка</span>
                <span className="font-mono text-text-secondary">{money(order.shipping)}</span>
              </div>
              <div className="flex gap-6 text-[15px] font-bold">
                <span>Итого</span>
                <span className="font-mono">{money(total)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5.5">
            <div className="text-[13px] font-semibold mb-3.5">История заказа</div>
            <div className="flex flex-col">
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-[11px] h-[11px] rounded-full"
                      style={{ background: t.done ? (t.cancel ? "var(--color-accent-orange)" : "var(--color-accent-violet)") : "var(--color-surface-active)" }}
                    />
                    {i < timeline.length - 1 && (
                      <div
                        className="w-0.5 flex-1 min-h-4"
                        style={{ background: t.done ? "color-mix(in oklch, var(--color-accent-violet) 60%, transparent)" : "var(--color-border)" }}
                      />
                    )}
                  </div>
                  <div className="pb-5">
                    <div className="text-[13px] font-medium">{t.label}</div>
                    <div className="text-[11.5px] text-faint mt-0.5">{t.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-4.5">
            <div className="text-[13px] font-semibold mb-3">Клиент</div>
            <div className="text-sm font-semibold mb-0.5">{customer?.name ?? "—"}</div>
            <div className="text-[12.5px] text-muted mb-0.5">{order.phone}</div>
            <div className="text-[12.5px] text-muted">{order.email}</div>
          </Card>
          <Card className="p-4.5">
            <div className="text-[13px] font-semibold mb-3">Доставка</div>
            <div className="text-[12.5px] text-muted mb-1">Адрес</div>
            <div className="text-[13px] mb-3">{order.address}</div>
            <div className="text-[12.5px] text-muted mb-1">Способ доставки</div>
            <div className="text-[13px]">{order.deliveryMethod}</div>
          </Card>
          <Card className="p-4.5">
            <div className="text-[13px] font-semibold mb-3">Оплата</div>
            <div className="flex justify-between mb-1.5">
              <span className="text-[12.5px] text-muted">Способ</span>
              <span className="text-[13px]">Банковская карта</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12.5px] text-muted">Статус</span>
              <Badge style={paymentStatusStyle(order.payment)}>{order.payment}</Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
