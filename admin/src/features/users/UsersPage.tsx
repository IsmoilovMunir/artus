import { UserPlus } from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { ALL_ROLES, ROLE_HUES } from "@/lib/constants";
import { badgeStyle } from "@/lib/badge";
import type { UserRole } from "@/lib/types";

const GRID = "1.4fr 1.4fr 1fr 0.8fr 1fr 0.9fr";

const ROLE_INFO = [
  { title: "Администратор", desc: "Полный доступ: товары, заказы, пользователи, настройки, контент сайта." },
  { title: "Менеджер", desc: "Товары и заказы. Без доступа к настройкам и наценке." },
  { title: "Контент-менеджер", desc: "Баннеры и страницы сайта. Без доступа к ценам и заказам." },
];

export function UsersPage() {
  const users = useAdminStore((s) => s.users);
  const toggleUserStatus = useAdminStore((s) => s.toggleUserStatus);
  const setUserRole = useAdminStore((s) => s.setUserRole);

  return (
    <div>
      <div className="flex justify-end mb-3.5">
        <Button accent="var(--color-accent-purple)">
          <UserPlus size={15} />
          Пригласить пользователя
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="grid gap-3 px-5 py-3 text-[11.5px] text-faint font-semibold uppercase border-b border-border" style={{ gridTemplateColumns: GRID }}>
          <div>Пользователь</div>
          <div>Email</div>
          <div>Роль</div>
          <div>Статус</div>
          <div>Последний вход</div>
          <div />
        </div>
        {users.map((u, i) => {
          const initials = u.name.split(" ").map((w) => w[0]).join("");
          return (
            <div
              key={u.id}
              className={`grid gap-3 items-center px-5 py-3.5 ${i === users.length - 1 ? "" : "border-b border-border-subtle"}`}
              style={{ gridTemplateColumns: GRID }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: ROLE_HUES[u.role], color: "oklch(0.14 0.01 258)" }}
                >
                  {initials}
                </div>
                <div className="text-[13px] font-medium">{u.name}</div>
              </div>
              <div className="text-[12.5px] text-text-tertiary">{u.email}</div>
              <Select
                value={u.role}
                onChange={(e) => setUserRole(u.id, e.target.value as UserRole)}
                className="h-8 w-fit text-xs"
              >
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </Select>
              <div>
                <Badge style={badgeStyle(u.status === "Активен" ? "var(--color-accent-green)" : "var(--color-accent-orange)")}>
                  {u.status}
                </Badge>
              </div>
              <div className="text-xs text-muted font-mono">{u.lastLogin}</div>
              <div className="flex justify-end">
                <div
                  onClick={() => toggleUserStatus(u.id)}
                  className="text-[11px] font-semibold px-2 py-1.5 rounded-lg cursor-pointer text-center bg-surface-active"
                  style={{ color: u.status === "Активен" ? "var(--color-accent-orange)" : "var(--color-accent-green)" }}
                >
                  {u.status === "Активен" ? "Заблокировать" : "Разблокировать"}
                </div>
              </div>
            </div>
          );
        })}
      </Card>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {ROLE_INFO.map((r) => (
          <Card key={r.title} className="p-4">
            <div className="text-[13px] font-bold mb-1">{r.title}</div>
            <div className="text-xs text-muted">{r.desc}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
