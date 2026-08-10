"use client";

import Link from "next/link";
import { cartCount, useCartStore } from "@/store/cart";
import { useHydrated } from "@/lib/useHydrated";

export function CartBadge() {
  const items = useCartStore((s) => s.items);
  const hydrated = useHydrated();

  const count = hydrated ? cartCount(items) : 0;

  return (
    <Link
      href="/cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-muted-bg"
      aria-label="Корзина"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-1.7 6.6A1 1 0 0 0 6.3 21H17" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="21" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="17" cy="21" r="1.4" fill="currentColor" stroke="none" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
