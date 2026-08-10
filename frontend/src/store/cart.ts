"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  qty: number;
  maxQty: number;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            const nextQty = Math.min(existing.qty + qty, existing.maxQty);
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, qty: nextQty } : i,
              ),
            };
          }
          return {
            items: [...state.items, { ...item, qty: Math.min(qty, item.maxQty) }],
          };
        }),
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      setQty: (productId, qty) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId
                ? { ...i, qty: Math.max(1, Math.min(qty, i.maxQty)) }
                : i,
            )
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "artus-cart" },
  ),
);

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty * i.price, 0);
}
