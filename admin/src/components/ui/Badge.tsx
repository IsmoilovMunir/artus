import type { CSSProperties, ReactNode } from "react";

export function Badge({ style, children }: { style: CSSProperties; children: ReactNode }) {
  return <span style={style}>{children}</span>;
}
