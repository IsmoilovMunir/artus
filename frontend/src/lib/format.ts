const currency = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return currency.format(value);
}

export function discountPercent(price: number, oldPrice: number | null): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export type StockTone = "in" | "low" | "out";

export function stockInfo(stock: number): { label: string; tone: StockTone } {
  if (stock <= 0) return { label: "Нет в наличии", tone: "out" };
  if (stock <= 3) return { label: `Осталось ${stock} шт.`, tone: "low" };
  return { label: "В наличии", tone: "in" };
}
