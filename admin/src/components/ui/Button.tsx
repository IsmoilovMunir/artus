import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  /** CSS color used for the primary variant's background (defaults to violet accent). */
  accent?: string;
}

export function Button({
  variant = "primary",
  accent = "var(--color-accent-violet)",
  className = "",
  style,
  ...rest
}: ButtonProps) {
  const base =
    "h-[38px] px-[18px] rounded-[9px] text-[13px] font-bold flex items-center gap-2 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  if (variant === "primary") {
    return (
      <button
        className={`${base} text-[oklch(0.14_0.01_258)] ${className}`}
        style={{ background: accent, ...style }}
        {...rest}
      />
    );
  }
  if (variant === "outline") {
    return (
      <button
        className={`${base} bg-transparent border border-border-strong text-text-secondary font-semibold hover:bg-surface-active ${className}`}
        style={style}
        {...rest}
      />
    );
  }
  return (
    <button
      className={`${base} bg-surface-active text-text-secondary font-semibold hover:bg-surface-hover ${className}`}
      style={style}
      {...rest}
    />
  );
}
