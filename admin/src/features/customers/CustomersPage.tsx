import { useAdminStore } from "@/store/useAdminStore";
import { TableCard, TableHead, TableRow } from "@/components/ui/Table";
import { money } from "@/lib/money";

const GRID = "1.6fr 1fr 0.9fr 1fr 1fr";

export function CustomersPage() {
  const customers = useAdminStore((s) => s.customers);

  return (
    <TableCard>
      <TableHead gridTemplateColumns={GRID} columns={["Клиент", "Город", "Заказов", "Потрачено", "Последний заказ"]} />
      {customers.map((c, i) => {
        const initials = c.name
          .split(" ")
          .map((w) => w[0])
          .join("");
        return (
          <TableRow key={c.id} gridTemplateColumns={GRID} last={i === customers.length - 1}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-accent-cyan flex items-center justify-center text-xs font-bold text-[oklch(0.14_0.01_258)] shrink-0">
                {initials}
              </div>
              <div className="text-[13px]">{c.name}</div>
            </div>
            <div className="text-[12.5px] text-text-tertiary">{c.city}</div>
            <div className="font-mono text-[13px]">{c.ordersCount}</div>
            <div className="font-mono text-[13px]">{money(c.spent)}</div>
            <div className="text-[12.5px] text-muted">{c.lastOrder}</div>
          </TableRow>
        );
      })}
    </TableCard>
  );
}
