"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/lib/types";
import { productSlug } from "@/lib/api";

export function AddToCartBox({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;
  const mainPhoto = product.photos?.find((p) => p.isMain) ?? product.photos?.[0];

  function handleAdd() {
    add(
      {
        productId: product.id,
        slug: productSlug(product),
        name: product.name,
        price: product.price,
        image: mainPhoto?.url ?? null,
        maxQty: product.stock,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-full border border-border">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-11 w-11 items-center justify-center text-lg"
          aria-label="Уменьшить количество"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-medium">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
          className="flex h-11 w-11 items-center justify-center text-lg"
          aria-label="Увеличить количество"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={outOfStock}
        className="h-11 flex-1 rounded-full bg-accent text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {outOfStock ? "Нет в наличии" : added ? "Добавлено ✓" : "Добавить в корзину"}
      </button>
    </div>
  );
}
