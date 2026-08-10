import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts().catch(() => []),
  ]);

  const newArrivals = [...products]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 8);

  const sortedCategories = [...categories].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  return (
    <div>
      <section className="relative overflow-hidden bg-foreground text-background">
        <div className="container flex min-h-[420px] flex-col justify-center gap-6 py-20">
          <span className="w-fit rounded-full border border-background/25 px-3 py-1 text-xs font-medium uppercase tracking-widest text-background/70">
            Новая коллекция
          </span>
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
            Телевизоры и всё
            <br />
            для домашнего кинотеатра
          </h1>
          <p className="max-w-md text-base text-background/70">
            Актуальные цены и остатки, доставка курьером, оплата при получении.
          </p>
          <Link
            href="/catalog"
            className="mt-2 flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            Смотреть каталог
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {sortedCategories.length > 0 && (
        <section className="container py-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Категории</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {sortedCategories.map((c) => (
              <Link
                key={c.id}
                href={`/catalog?category=${encodeURIComponent(c.name)}`}
                className="group flex flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-5 transition hover:border-foreground/30"
              >
                <span
                  className="h-8 w-8 rounded-full"
                  style={{ background: c.swatch || "var(--muted-bg)" }}
                />
                <div>
                  <div className="text-sm font-semibold leading-tight">{c.name}</div>
                  <div className="mt-1 text-xs text-muted">{c.productCount} товаров</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="container py-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Новинки каталога</h2>
            <Link href="/catalog" className="text-sm font-medium text-muted transition hover:text-foreground">
              Весь каталог →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
