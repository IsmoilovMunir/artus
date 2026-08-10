import type { Metadata } from "next";
import { getBrands, getCategories, getProducts } from "@/lib/api";
import { CatalogView } from "@/components/CatalogView";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Каталог телевизоров и аксессуаров ARTUS: фильтры по бренду, цене и наличию.",
};

interface CatalogPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { category, search } = await searchParams;

  const [products, brands, categories] = await Promise.all([
    getProducts({ category, search }),
    getBrands().catch(() => []),
    getCategories().catch(() => []),
  ]);

  return (
    <CatalogView
      products={products}
      brands={brands}
      categories={categories}
      activeCategory={category ?? null}
      activeSearch={search ?? null}
    />
  );
}
