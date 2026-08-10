import type { CategoryItem, Product } from "./types";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080/api/v1";

// The backend keeps ~1-minute-fresh stock/price data via a МойСклад poller,
// so ISR revalidation is set to match that cadence instead of caching longer.
const REVALIDATE_SECONDS = 60;

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Products the storefront is allowed to show — drafts/archived items are admin-only. */
function isPublished(product: Product): boolean {
  return product.status === "Активен";
}

export interface ProductFilters {
  search?: string;
  brand?: string;
  category?: string;
  stock?: string;
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.category) params.set("category", filters.category);
  if (filters.stock) params.set("stock", filters.stock);
  const qs = params.toString();
  const products = await apiFetch<Product[]>(`/products${qs ? `?${qs}` : ""}`);
  return products.filter(isPublished);
}

export async function getAllProducts(): Promise<Product[]> {
  return getProducts();
}

/** No slug-lookup endpoint exists on the backend yet, so product pages resolve
 * a slug against the full (cached) catalog instead of fetching by id. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((p) => productSlug(p) === slug) ?? null;
}

export function productSlug(product: Product): string {
  return product.slug && product.slug.trim().length > 0 ? product.slug : product.id;
}

export async function getCategories(): Promise<CategoryItem[]> {
  return apiFetch<CategoryItem[]>("/categories/detailed");
}

export async function getBrands(): Promise<string[]> {
  return apiFetch<string[]>("/brands");
}
