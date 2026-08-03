export type ProductStatus = "Активен" | "Черновик" | "Архив";

export interface SpecRow {
  key: string;
  value: string;
}

export interface ProductPhoto {
  id: string;
  url: string;
  isMain: boolean;
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

/** Editable draft for the product detail page. `stock` is carried over read-only —
 * it always comes from МойСклад. `name`/`price` come from МойСклад only once, on the
 * sync that first imports a product; after that they're editable like everything else. */
export interface ProductDraft extends Product {
  specs: SpecRow[];
  seoTitle: string;
  seoDescription: string;
  slug: string;
  seoKeywords: string;
  photoAlt: string;
}

export type OrderStatus =
  | "Новый"
  | "В обработке"
  | "Отправлен"
  | "Доставлен"
  | "Отменён";

export type PaymentStatus = "Оплачен" | "Ожидает оплаты" | "Возврат";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  date: string;
  status: OrderStatus;
  payment: PaymentStatus;
  deliveryMethod: string;
  address: string;
  phone: string;
  email: string;
  items: OrderItem[];
  shipping: number;
}

export interface Customer {
  id: string;
  name: string;
  city: string;
  ordersCount: number;
  spent: number;
  lastOrder: string;
}

export type UserRole = "Администратор" | "Менеджер" | "Контент-менеджер";
export type UserStatus = "Активен" | "Заблокирован";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  from: string;
  to: string;
  active: boolean;
}

export interface Promo {
  id: string;
  title: string;
  discount: number;
  scope: string;
  from: string;
  to: string;
  active: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  order: number;
  visible: boolean;
}

export type PageStatus = "Опубликовано" | "Черновик";

export interface Page {
  id: string;
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  status: PageStatus;
  updated: string;
}

export interface SiteSeo {
  title: string;
  description: string;
  gaId: string;
  robotsIndex: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  swatch: string | null;
  sortOrder: number | null;
  productCount: number;
}

export interface MarkupRow {
  id: string;
  name: string;
  pct: number;
}

export interface DeliveryRow {
  id: string;
  name: string;
  cost: number;
}

export interface WarehouseLogEntry {
  time: string;
  msg: string;
}

export interface Settings {
  markupGeneral: number;
  markupByCategory: MarkupRow[];
  markupByBrand: MarkupRow[];
  payCard: boolean;
  paySbp: boolean;
  payCash: boolean;
  delivery: DeliveryRow[];
  notifyEmailNewOrder: boolean;
  notifyEmailStatusChange: boolean;
  notifyPushLowStock: boolean;
  notifyEmail: string;
  storeName: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  storeInn: string;
  storeOgrn: string;
  storeHours: string;
  whEndpoint: string;
  whFreq: string;
  whLastSync: string;
  whLog: WarehouseLogEntry[];
}
