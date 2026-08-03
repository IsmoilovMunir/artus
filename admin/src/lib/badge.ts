import type { CSSProperties } from "react";
import type { OrderStatus, PaymentStatus, ProductStatus } from "./types";

/** Pill badge style for a given accent color (any valid CSS color, incl. oklch). */
export function badgeStyle(color: string): CSSProperties {
  return {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 11.5,
    fontWeight: 600,
    color,
    background: `color-mix(in oklch, ${color} 18%, var(--color-surface))`,
    whiteSpace: "nowrap",
  };
}

/** Pill toggle style used for on/off switches rendered as clickable text pills. */
export function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    padding: "5px 12px",
    borderRadius: 16,
    fontSize: 11.5,
    fontWeight: 600,
    cursor: "pointer",
    background: active
      ? `color-mix(in oklch, ${color} 18%, transparent)`
      : "var(--color-surface-active)",
    color: active ? color : "var(--color-muted)",
    width: "fit-content",
  };
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  Новый: "var(--color-accent-cyan)",
  "В обработке": "var(--color-accent-amber)",
  Отправлен: "var(--color-accent-violet)",
  Доставлен: "var(--color-accent-green)",
  Отменён: "var(--color-accent-orange)",
};

export function orderStatusStyle(status: OrderStatus): CSSProperties {
  return badgeStyle(ORDER_STATUS_COLORS[status] ?? "var(--color-muted)");
}

export function paymentStatusStyle(payment: PaymentStatus): CSSProperties {
  const color =
    payment === "Оплачен"
      ? "var(--color-accent-green)"
      : payment === "Возврат"
        ? "var(--color-accent-orange)"
        : "var(--color-accent-amber)";
  return badgeStyle(color);
}

export interface ProductStatusMeta {
  label: string;
  color: string;
}

/** Product availability is derived purely from stock, matching the mockup's rule. */
export function productStockStatus(stock: number): ProductStatusMeta {
  if (stock === 0) return { label: "Нет в наличии", color: "var(--color-accent-orange)" };
  if (stock <= 5) return { label: "Низкий остаток", color: "var(--color-accent-amber)" };
  return { label: "В наличии", color: "var(--color-accent-green)" };
}

export function publishStatusStyle(status: ProductStatus | "Опубликовано"): CSSProperties {
  const color = status === "Активен" || status === "Опубликовано"
    ? "var(--color-accent-green)"
    : status === "Черновик"
      ? "var(--color-accent-amber)"
      : "var(--color-muted)";
  return badgeStyle(color);
}
