import type { UserRole } from "./types";

export const ALL_ROLES: UserRole[] = ["Администратор", "Менеджер", "Контент-менеджер"];

export const ROLE_HUES: Record<UserRole, string> = {
  Администратор: "var(--color-accent-violet)",
  Менеджер: "var(--color-accent-cyan)",
  "Контент-менеджер": "var(--color-accent-amber)",
};
