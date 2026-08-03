import type { SelectHTMLAttributes } from "react";

type Variant = "toolbar" | "form";

const VARIANT_BG: Record<Variant, string> = {
  toolbar: "bg-surface-2",
  form: "bg-surface-3",
};

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: Variant;
}

export function Select({ variant = "form", className = "", children, ...rest }: SelectProps) {
  return (
    <select
      className={`h-10 rounded-[9px] ${VARIANT_BG[variant]} border border-border-input px-2.5 text-[13px] text-text-secondary outline-none ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}
