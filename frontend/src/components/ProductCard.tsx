"use client";

import Image from "next/image";
import Link from "next/link";
import { discountPercent, formatPrice, stockInfo } from "@/lib/format";
import { productSlug } from "@/lib/api";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const slug = productSlug(product);
  const mainPhoto = product.photos?.find((p) => p.isMain) ?? product.photos?.[0];
  const discount = discountPercent(product.price, product.oldPrice);
  const stock = stockInfo(product.stock);

  return (
    <div className="group relative flex flex-col">
      <Link href={`/product/${slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted-bg">
          {mainPhoto ? (
            <Image
              src={mainPhoto.url}
              alt={product.photoAlt || product.name}
              fill
              sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
              className="object-contain p-6 transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              Нет фото
            </div>
          )}

          {discount && (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
              -{discount}%
            </span>
          )}
        </div>

        <div className="mt-4 space-y-1">
          <div className="text-xs font-medium uppercase tracking-wide text-muted">
            {product.brand}
          </div>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</h3>
        </div>
      </Link>

      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <div
            className={
              "text-xs " +
              (stock.tone === "out"
                ? "text-muted"
                : stock.tone === "low"
                  ? "text-accent"
                  : "text-muted")
            }
          >
            {stock.label}
          </div>
        </div>

        <button
          type="button"
          disabled={product.stock <= 0}
          onClick={() =>
            add({
              productId: product.id,
              slug,
              name: product.name,
              price: product.price,
              image: mainPhoto?.url ?? null,
              maxQty: product.stock,
            })
          }
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border transition hover:border-foreground disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Добавить в корзину"
          title={product.stock <= 0 ? "Нет в наличии" : "Добавить в корзину"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
