"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/lib/format";
import type { CategoryItem, Product } from "@/lib/types";

type SortKey = "new" | "price-asc" | "price-desc" | "name";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "new", label: "Сначала новые" },
  { value: "price-asc", label: "Сначала дешёвые" },
  { value: "price-desc", label: "Сначала дорогие" },
  { value: "name", label: "По названию" },
];

export function CatalogView({
  products,
  brands,
  categories,
  activeCategory,
  activeSearch,
}: {
  products: Product[];
  brands: string[];
  categories: CategoryItem[];
  activeCategory: string | null;
  activeSearch: string | null;
}) {
  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("new");

  const availableBrands = useMemo(() => {
    const inCatalog = new Set(products.map((p) => p.brand));
    return brands.filter((b) => inCatalog.has(b));
  }, [products, brands]);

  function toggleBrand(brand: string) {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  }

  function clearFilters() {
    setSelectedBrands(new Set());
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
  }

  const hasActiveFilters =
    selectedBrands.size > 0 || minPrice !== "" || maxPrice !== "" || inStockOnly;

  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    let result = products.filter((p) => {
      if (selectedBrands.size > 0 && !selectedBrands.has(p.brand)) return false;
      if (min !== null && p.price < min) return false;
      if (max !== null && p.price > max) return false;
      if (inStockOnly && p.stock <= 0) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name, "ru");
        default:
          return Number(b.id) - Number(a.id);
      }
    });

    return result;
  }, [products, selectedBrands, minPrice, maxPrice, inStockOnly, sort]);

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {activeCategory ?? (activeSearch ? `Поиск: «${activeSearch}»` : "Каталог")}
        </h1>
        <p className="mt-1 text-sm text-muted">{filtered.length} товаров</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/catalog"
          className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
            !activeCategory
              ? "border-foreground bg-foreground text-background"
              : "border-border hover:border-foreground/40"
          }`}
        >
          Все категории
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/catalog?category=${encodeURIComponent(c.name)}`}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
              activeCategory === c.name
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground/40"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-8">
          {availableBrands.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold">Бренд</h3>
              <div className="space-y-2">
                {availableBrands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 text-sm text-muted">
                    <input
                      type="checkbox"
                      checked={selectedBrands.has(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="h-4 w-4 rounded border-border accent-[var(--accent)]"
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-3 text-sm font-semibold">Цена, ₽</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                placeholder={String(priceBounds.min)}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-lg border border-border bg-transparent px-2.5 py-1.5 text-sm outline-none focus:border-foreground/40"
              />
              <span className="text-muted">—</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder={String(priceBounds.max)}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-lg border border-border bg-transparent px-2.5 py-1.5 text-sm outline-none focus:border-foreground/40"
              />
            </div>
            <div className="mt-1.5 text-xs text-muted">
              {formatPrice(priceBounds.min)} – {formatPrice(priceBounds.max)}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-[var(--accent)]"
            />
            Только в наличии
          </label>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-accent transition hover:underline"
            >
              Сбросить фильтры
            </button>
          )}
        </aside>

        <div>
          <div className="mb-5 flex justify-end">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-border bg-transparent px-3.5 py-1.5 text-sm outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-24 text-center text-sm text-muted">
              Ничего не найдено. Попробуйте изменить фильтры.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
