import type { ReactNode } from "react";
import { Card } from "./Card";

export function TableCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <Card className={`overflow-hidden ${className}`}>{children}</Card>;
}

export function TableHead({ columns, gridTemplateColumns }: { columns: ReactNode[]; gridTemplateColumns: string }) {
  return (
    <div
      className="grid gap-4 px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-faint border-b border-border"
      style={{ gridTemplateColumns }}
    >
      {columns.map((c, i) => (
        <div key={i}>{c}</div>
      ))}
    </div>
  );
}

interface TableRowProps {
  gridTemplateColumns: string;
  children: ReactNode;
  onClick?: () => void;
  last?: boolean;
}

export function TableRow({ gridTemplateColumns, children, onClick, last = false }: TableRowProps) {
  return (
    <div
      onClick={onClick}
      className={`grid gap-4 items-center px-5 py-3.5 ${last ? "" : "border-b border-border-subtle"} ${
        onClick ? "cursor-pointer hover:bg-surface-hover" : ""
      }`}
      style={{ gridTemplateColumns }}
    >
      {children}
    </div>
  );
}
