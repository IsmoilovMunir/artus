import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus } from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TableCard, TableHead, TableRow } from "@/components/ui/Table";
import { money } from "@/lib/money";
import { badgeStyle, productStockStatus } from "@/lib/badge";

const ALL_BRANDS = "Все бренды";
const ALL_CATEGORIES = "Все категории";
const STOCK_FILTERS = ["Все остатки", "В наличии", "Низкий остаток", "Нет в наличии"] as const;
const GRID = "3.4fr 0.7fr 0.8fr 1fr 0.8fr 0.5fr 0.8fr 0.5fr";

export function ProductsListPage() {
  const products = useAdminStore((s) => s.products);
  const brandList = useAdminStore((s) => s.brands);
  const categoryList = useAdminStore((s) => s.categories);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState<string>(ALL_BRANDS);
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [stock, setStock] = useState<(typeof STOCK_FILTERS)[number]>(STOCK_FILTERS[0]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (brand !== ALL_BRANDS && p.brand !== brand) return false;
      if (category !== ALL_CATEGORIES && p.category !== category) return false;
      if (stock !== "Все остатки") {
        const st = p.stock === 0 ? "Нет в наличии" : p.stock <= 5 ? "Низкий остаток" : "В наличии";
        if (st !== stock) return false;
      }
      const q = search.trim().toLowerCase();
      if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, brand, category, stock, search]);

  return (
    <div>
      <div className="flex gap-2.5 mb-4 items-center flex-wrap">
        <Input
          variant="toolbar"
          placeholder="Поиск по названию или SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-[320px]"
        />
        <Select variant="toolbar" value={brand} onChange={(e) => setBrand(e.target.value)}>
          {[ALL_BRANDS, ...brandList].map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>
        <Select variant="toolbar" value={category} onChange={(e) => setCategory(e.target.value)}>
          {[ALL_CATEGORIES, ...categoryList].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select variant="toolbar" value={stock} onChange={(e) => setStock(e.target.value as (typeof STOCK_FILTERS)[number])}>
          {STOCK_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <div className="flex-1" />
        <Button onClick={() => navigate("/products/new")}>
          <Plus size={15} />
          Добавить товар
        </Button>
      </div>

      <TableCard>
        <TableHead
          gridTemplateColumns={GRID}
          columns={["Товар", "Бренд", "Категория", "Панель / Платформа", "Цена", "Остаток", "Статус", ""]}
        />
        {filtered.map((p, i) => {
          const meta = productStockStatus(p.stock);
          const specLine = [p.panel, p.resolution, p.platform].filter((v) => v && v !== "—").join(" · ") || "—";
          const mainPhoto = (p.photos ?? []).find((ph) => ph.isMain) ?? (p.photos ?? [])[0];
          return (
            <TableRow
              key={p.id}
              gridTemplateColumns={GRID}
              onClick={() => navigate(`/products/${p.id}`)}
              last={i === filtered.length - 1}
            >
              <div className="flex items-center gap-3 min-w-0">
                {mainPhoto ? (
                  <img
                    src={mainPhoto.url}
                    alt={p.name}
                    className="w-[42px] h-[42px] rounded-lg shrink-0 object-cover"
                  />
                ) : (
                  <div className="w-[42px] h-[42px] rounded-lg shrink-0 bg-[repeating-linear-gradient(45deg,var(--color-surface-active),var(--color-surface-active)_4px,var(--color-surface-2)_4px,var(--color-surface-2)_8px)]" />
                )}
                <div className="min-w-0">
                  <div className="text-[13px] font-medium truncate">{p.name}</div>
                  <div className="font-mono text-[11px] text-faint mt-0.5">{p.sku}</div>
                </div>
              </div>
              <div className="text-[12.5px] text-text-tertiary">{p.brand}</div>
              <div className="text-[12.5px] text-text-tertiary">{p.category}</div>
              <div className="text-xs text-muted">{specLine}</div>
              <div>
                <div className="font-mono text-[13px]">{money(p.price)}</div>
                {p.oldPrice ? (
                  <div className="font-mono text-[11px] text-faint line-through">{money(p.oldPrice)}</div>
                ) : null}
              </div>
              <div className="font-mono text-[13px]">{p.stock}</div>
              <div>
                <Badge style={badgeStyle(meta.color)}>{meta.label}</Badge>
              </div>
              <div className="flex gap-2 justify-end">
                <div className="w-7 h-7 rounded-md bg-surface-active flex items-center justify-center">
                  <ChevronRight size={14} className="text-text-tertiary" />
                </div>
              </div>
            </TableRow>
          );
        })}
      </TableCard>
      <div className="flex justify-between items-center mt-3.5 text-[12.5px] text-muted">
        <div>
          Показано {filtered.length} из {products.length} товаров
        </div>
      </div>
    </div>
  );
}
