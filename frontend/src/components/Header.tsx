import Link from "next/link";
import { Suspense } from "react";
import { getCategories } from "@/lib/api";
import { CartBadge } from "./CartBadge";
import { SearchBox } from "./SearchBox";

export async function Header() {
  const categories = await getCategories().catch(() => []);
  const topCategories = [...categories]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .slice(0, 6);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center gap-6">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight">
          ARTUS
        </Link>

        <nav className="hidden shrink-0 items-center gap-5 text-sm font-medium md:flex">
          <Link href="/catalog" className="transition hover:text-accent">
            Каталог
          </Link>
        </nav>

        <div className="hidden flex-1 justify-center md:flex">
          <Suspense fallback={<div className="h-9 w-full max-w-md" />}>
            <SearchBox />
          </Suspense>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <CartBadge />
        </div>
      </div>

      {topCategories.length > 0 && (
        <div className="border-t border-border">
          <div className="container flex h-11 items-center gap-5 overflow-x-auto text-sm text-muted [scrollbar-width:none]">
            {topCategories.map((c) => (
              <Link
                key={c.id}
                href={`/catalog?category=${encodeURIComponent(c.name)}`}
                className="shrink-0 whitespace-nowrap transition hover:text-foreground"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
