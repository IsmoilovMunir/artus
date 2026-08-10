import Link from "next/link";
import { getCategories } from "@/lib/api";

export async function Footer() {
  const categories = await getCategories().catch(() => []);

  return (
    <footer className="mt-24 border-t border-border bg-muted-bg">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="text-xl font-bold tracking-tight">ARTUS</div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Телевизоры и аксессуары: кронштейны, пульты, кабели, саундбары,
            антенны. Актуальные цены и остатки.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold">Каталог</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/catalog?category=${encodeURIComponent(c.name)}`} className="transition hover:text-foreground">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold">Покупателям</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Оплата при получении</li>
            <li>Доставка курьером</li>
            <li>
              <Link href="/cart" className="transition hover:text-foreground">
                Корзина
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold">Контакты</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Россия</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5">
        <div className="container text-xs text-muted">
          © {new Date().getFullYear()} ARTUS. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
