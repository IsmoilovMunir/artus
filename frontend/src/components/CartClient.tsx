"use client";

import Image from "next/image";
import Link from "next/link";
import { cartSubtotal, useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { useHydrated } from "@/lib/useHydrated";

export function CartClient() {
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const hydrated = useHydrated();

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Корзина пуста</h1>
        <p className="mt-2 text-sm text-muted">Загляните в каталог, чтобы что-нибудь выбрать.</p>
        <Link
          href="/catalog"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
        >
          В каталог
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Корзина</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-5">
              <Link
                href={`/product/${item.slug}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted-bg"
              >
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-2" />
                ) : null}
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/product/${item.slug}`} className="text-sm font-medium leading-snug hover:underline">
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="shrink-0 text-xs text-muted transition hover:text-accent"
                  >
                    Удалить
                  </button>
                </div>

                <div className="flex items-end justify-between">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      type="button"
                      onClick={() => setQty(item.productId, item.qty - 1)}
                      className="flex h-8 w-8 items-center justify-center text-base"
                      aria-label="Уменьшить количество"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.productId, item.qty + 1)}
                      disabled={item.qty >= item.maxQty}
                      className="flex h-8 w-8 items-center justify-center text-base disabled:opacity-30"
                      aria-label="Увеличить количество"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-2xl border border-border p-6">
          <div className="flex justify-between text-sm text-muted">
            <span>Товары</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-base font-bold">
            <span>Итого</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <button
            type="button"
            disabled
            title="Оформление заказа появится в следующем обновлении"
            className="mt-6 w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background opacity-40"
          >
            Оформить заказ
          </button>
          <p className="mt-3 text-xs text-muted">
            Оформление заказа появится в следующем обновлении сайта. Пока можно собрать
            корзину и вернуться позже — она сохранится в этом браузере.
          </p>
        </div>
      </div>
    </div>
  );
}
