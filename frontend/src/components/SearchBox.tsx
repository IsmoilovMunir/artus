"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

export function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("search", value.trim());
    router.push(`/catalog${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-md">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="search"
        placeholder="Поиск по каталогу…"
        className="w-full rounded-full border border-border bg-muted-bg px-4 py-2 text-sm outline-none transition focus:border-foreground/30"
      />
      <button
        type="submit"
        aria-label="Искать"
        className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:text-foreground"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3-3" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}
