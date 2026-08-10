"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductPhoto } from "@/lib/types";

export function Gallery({ photos, alt }: { photos: ProductPhoto[]; alt: string }) {
  const ordered = [...photos].sort((a, b) => Number(b.isMain) - Number(a.isMain));
  const [active, setActive] = useState(0);

  if (ordered.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-muted-bg text-sm text-muted">
        Нет фото
      </div>
    );
  }

  const current = ordered[active];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted-bg">
        <Image
          key={current.id}
          src={current.url}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 44vw, 90vw"
          priority
          className="object-contain p-8"
        />
      </div>

      {ordered.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {ordered.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted-bg transition ${
                i === active ? "border-foreground" : "border-border"
              }`}
            >
              <Image src={photo.url} alt="" fill sizes="64px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
