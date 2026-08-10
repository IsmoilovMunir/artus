import type { Metadata } from "next";
import { CartClient } from "@/components/CartClient";

export const metadata: Metadata = {
  title: "Корзина",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartClient />;
}
