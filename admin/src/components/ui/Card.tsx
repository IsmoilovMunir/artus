import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...rest }: CardProps) {
  return (
    <div
      className={`rounded-[14px] bg-surface border border-border ${className}`}
      {...rest}
    />
  );
}
