import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type Variant = "toolbar" | "form" | "locked";

const VARIANT_BG: Record<Variant, string> = {
  toolbar: "bg-surface-2",
  form: "bg-surface-3",
  locked: "bg-surface-inset",
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant;
  mono?: boolean;
}

export function Input({ variant = "form", mono = false, className = "", disabled, ...rest }: InputProps) {
  return (
    <input
      disabled={disabled}
      className={`w-full h-10 rounded-[9px] ${VARIANT_BG[variant]} border border-border-input px-3 text-[13px] outline-none ${
        disabled ? "text-faint" : "text-text"
      } ${mono ? "font-mono" : ""} ${className}`}
      {...rest}
    />
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: Variant;
}

export function Textarea({ variant = "form", className = "", ...rest }: TextareaProps) {
  return (
    <textarea
      className={`w-full rounded-[9px] ${VARIANT_BG[variant]} border border-border-input px-3 py-2.5 text-[13px] text-text-secondary outline-none resize-y ${className}`}
      {...rest}
    />
  );
}
