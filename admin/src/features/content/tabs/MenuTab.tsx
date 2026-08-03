import { useAdminStore } from "@/store/useAdminStore";
import { TableCard, TableHead, TableRow } from "@/components/ui/Table";
import { Toggle } from "@/components/ui/Toggle";

const GRID = "0.6fr 2fr 1fr";

export function MenuTab() {
  const menu = useAdminStore((s) => s.menu);
  const toggleMenuVisible = useAdminStore((s) => s.toggleMenuVisible);

  return (
    <TableCard>
      <TableHead gridTemplateColumns={GRID} columns={["Порядок", "Раздел меню", "Видимость"]} />
      {menu.map((m, i) => (
        <TableRow key={m.id} gridTemplateColumns={GRID} last={i === menu.length - 1}>
          <div className="font-mono text-[13px] text-muted">{m.order}</div>
          <div className="text-[13.5px] font-medium">{m.name}</div>
          <Toggle
            active={m.visible}
            onLabel="Видно на сайте"
            offLabel="Скрыто"
            color="var(--color-accent-green)"
            onClick={() => toggleMenuVisible(m.id)}
          />
        </TableRow>
      ))}
    </TableCard>
  );
}
