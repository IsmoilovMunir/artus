export type ProductStatus = "Активен" | "Черновик" | "Архив";

export interface ProductPhoto {
  id: string;
  url: string;
  isMain: boolean;
}

export interface SpecRow {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  panel: string;
  resolution: string;
  platform: string;
  size: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  status: ProductStatus;
  accessories: string[];
  description: string;
  specs?: SpecRow[];
  seoTitle?: string;
  seoDescription?: string;
  slug?: string;
  seoKeywords?: string;
  photoAlt?: string;
  photos?: ProductPhoto[];
}

export interface CategoryItem {
  id: string;
  name: string;
  swatch: string | null;
  sortOrder: number | null;
  productCount: number;
}
