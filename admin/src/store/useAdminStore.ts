import { create } from "zustand";
import { api } from "@/api/client";
import type {
  AdminUser,
  Banner,
  CategoryItem,
  Customer,
  MenuItem,
  Order,
  OrderStatus,
  Page,
  Product,
  ProductDraft,
  ProductPhoto,
  Promo,
  Settings,
  SiteSeo,
  UserRole,
} from "@/lib/types";

interface AnalyticsDashboard {
  salesTrend: number[];
  salesFirstLabel: string;
  salesLastLabel: string;
  topProducts: { name: string; sold: number }[];
}

interface AnalyticsBreakdown {
  salesTrendBig: number[];
  categoryBreakdown: { name: string; value: string; pct: number }[];
  brandBreakdown: { name: string; pct: number }[];
}

interface AdminStore {
  loading: boolean;
  loaded: boolean;
  error: string | null;

  products: Product[];
  orders: Order[];
  customers: Customer[];
  users: AdminUser[];
  banners: Banner[];
  promos: Promo[];
  menu: MenuItem[];
  pages: Page[];
  siteSeo: SiteSeo;
  settings: Settings;
  categories: string[];
  categoryList: CategoryItem[];
  brands: string[];
  analytics: AnalyticsDashboard;
  analyticsBreakdown: AnalyticsBreakdown;

  loadAll: () => Promise<void>;
  loadCategoryList: () => Promise<void>;
  createCategory: (data: { name: string; swatch: string }) => Promise<void>;
  updateCategory: (id: string, data: { name: string; swatch: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  saveProduct: (draft: ProductDraft) => Promise<string>;
  uploadProductPhoto: (productId: string, file: File, isMain: boolean) => Promise<void>;
  deleteProductPhoto: (productId: string, photoId: string) => Promise<void>;

  setOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
  setUserRole: (id: string, role: UserRole) => Promise<void>;
  toggleBanner: (id: string) => Promise<void>;
  togglePromo: (id: string) => Promise<void>;
  toggleMenuVisible: (id: string) => Promise<void>;
  savePage: (page: Page) => Promise<void>;
  updateSiteSeo: (patch: Partial<SiteSeo>) => Promise<void>;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
  updateMarkupCategory: (id: string, pct: number) => Promise<void>;
  updateMarkupBrand: (id: string, pct: number) => Promise<void>;
  updateDeliveryCost: (id: string, cost: number) => Promise<void>;
  syncWarehouseNow: () => Promise<void>;
}

const EMPTY_SITE_SEO: SiteSeo = { title: "", description: "", gaId: "", robotsIndex: true };
const EMPTY_SETTINGS: Settings = {
  markupGeneral: 0, markupByCategory: [], markupByBrand: [],
  payCard: false, paySbp: false, payCash: false, delivery: [],
  notifyEmailNewOrder: false, notifyEmailStatusChange: false, notifyPushLowStock: false, notifyEmail: "",
  storeName: "", storePhone: "", storeEmail: "", storeAddress: "", storeInn: "", storeOgrn: "", storeHours: "",
  whEndpoint: "", whFreq: "5", whLastSync: "", whLog: [],
};
const EMPTY_ANALYTICS: AnalyticsDashboard = { salesTrend: [], salesFirstLabel: "", salesLastLabel: "", topProducts: [] };
const EMPTY_BREAKDOWN: AnalyticsBreakdown = { salesTrendBig: [], categoryBreakdown: [], brandBreakdown: [] };

function upsertPayload(draft: ProductDraft) {
  return {
    name: draft.name,
    price: draft.price,
    sku: draft.sku,
    brand: draft.brand,
    category: draft.category,
    panel: draft.panel,
    resolution: draft.resolution,
    platform: draft.platform,
    size: draft.size,
    status: draft.status,
    description: draft.description,
    accessories: draft.accessories,
    specs: draft.specs,
    seoTitle: draft.seoTitle,
    seoDescription: draft.seoDescription,
    slug: draft.slug,
    seoKeywords: draft.seoKeywords,
    photoAlt: draft.photoAlt,
  };
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  loading: false,
  loaded: false,
  error: null,

  products: [],
  orders: [],
  customers: [],
  users: [],
  banners: [],
  promos: [],
  menu: [],
  pages: [],
  siteSeo: EMPTY_SITE_SEO,
  settings: EMPTY_SETTINGS,
  categories: [],
  categoryList: [],
  brands: [],
  analytics: EMPTY_ANALYTICS,
  analyticsBreakdown: EMPTY_BREAKDOWN,

  loadAll: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const [products, orders, customers, users, banners, promos, menu, pages, siteSeo, settings, categories, brands, analytics, analyticsBreakdown] =
        await Promise.all([
          api.get<Product[]>("/products"),
          api.get<Order[]>("/orders"),
          api.get<Customer[]>("/customers"),
          api.get<AdminUser[]>("/users"),
          api.get<Banner[]>("/content/banners"),
          api.get<Promo[]>("/content/promos"),
          api.get<MenuItem[]>("/content/menu"),
          api.get<Page[]>("/content/pages"),
          api.get<SiteSeo>("/content/seo"),
          api.get<Settings>("/settings"),
          api.get<string[]>("/categories"),
          api.get<string[]>("/brands"),
          api.get<AnalyticsDashboard>("/analytics/dashboard"),
          api.get<AnalyticsBreakdown>("/analytics/breakdown"),
        ]);
      set({
        products, orders, customers, users, banners, promos, menu, pages, siteSeo, settings,
        categories, brands, analytics, analyticsBreakdown,
        loading: false, loaded: true,
      });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : String(e) });
    }
  },

  saveProduct: async (draft) => {
    const body = upsertPayload(draft);
    const saved = draft.id
      ? await api.put<Product>(`/products/${draft.id}`, body)
      : await api.post<Product>("/products", body);
    set((state) => {
      const exists = state.products.some((p) => p.id === saved.id);
      return { products: exists ? state.products.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...state.products] };
    });
    return saved.id;
  },

  uploadProductPhoto: async (productId, file, isMain) => {
    const form = new FormData();
    form.append("file", file);
    form.append("isMain", String(isMain));
    const photo = await api.upload<ProductPhoto>(`/products/${productId}/photos`, form);
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId
          ? { ...p, photos: [...(isMain ? (p.photos ?? []).map((ph) => ({ ...ph, isMain: false })) : (p.photos ?? [])), photo] }
          : p,
      ),
    }));
  },

  deleteProductPhoto: async (productId, photoId) => {
    await api.del(`/products/${productId}/photos/${photoId}`);
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, photos: (p.photos ?? []).filter((ph) => ph.id !== photoId) } : p,
      ),
    }));
  },

  setOrderStatus: async (id, status) => {
    const updated = await api.patch<Order>(`/orders/${id}/status`, { status });
    set((state) => ({ orders: state.orders.map((o) => (o.id === id ? updated : o)) }));
  },

  toggleUserStatus: async (id) => {
    const updated = await api.patch<AdminUser>(`/users/${id}/status`);
    set((state) => ({ users: state.users.map((u) => (u.id === id ? updated : u)) }));
  },

  setUserRole: async (id, role) => {
    const updated = await api.patch<AdminUser>(`/users/${id}/role`, { role });
    set((state) => ({ users: state.users.map((u) => (u.id === id ? updated : u)) }));
  },

  toggleBanner: async (id) => {
    const updated = await api.patch<Banner>(`/content/banners/${id}/toggle`);
    set((state) => ({ banners: state.banners.map((b) => (b.id === id ? updated : b)) }));
  },

  togglePromo: async (id) => {
    const updated = await api.patch<Promo>(`/content/promos/${id}/toggle`);
    set((state) => ({ promos: state.promos.map((p) => (p.id === id ? updated : p)) }));
  },

  toggleMenuVisible: async (id) => {
    const updated = await api.patch<MenuItem>(`/content/menu/${id}/toggle`);
    set((state) => ({ menu: state.menu.map((m) => (m.id === id ? updated : m)) }));
  },

  savePage: async (page) => {
    const updated = await api.put<Page>(`/content/pages/${page.id}`, {
      title: page.title,
      content: page.content,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
    });
    set((state) => ({ pages: state.pages.map((p) => (p.id === page.id ? updated : p)) }));
  },

  updateSiteSeo: async (patch) => {
    const current = get().siteSeo;
    const updated = await api.put<SiteSeo>("/content/seo", { ...current, ...patch });
    set({ siteSeo: updated });
  },

  updateSettings: async (patch) => {
    const updated = await api.put<Settings>("/settings", patch);
    set({ settings: updated });
  },

  updateMarkupCategory: async (id, pct) => {
    const updated = await api.patch<Settings>(`/settings/markup/category/${id}`, { pct });
    set({ settings: updated });
  },

  updateMarkupBrand: async (id, pct) => {
    const updated = await api.patch<Settings>(`/settings/markup/brand/${id}`, { pct });
    set({ settings: updated });
  },

  updateDeliveryCost: async (id, cost) => {
    const updated = await api.patch<Settings>(`/settings/delivery/${id}`, { cost });
    set({ settings: updated });
  },

  syncWarehouseNow: async () => {
    const updated = await api.post<Settings>("/settings/warehouse/sync");
    set({ settings: updated });
  },

  loadCategoryList: async () => {
    const categoryList = await api.get<CategoryItem[]>("/categories/detailed");
    set({ categoryList });
  },

  createCategory: async (data) => {
    await api.post<CategoryItem>("/categories", data);
    await get().loadCategoryList();
    const categories = await api.get<string[]>("/categories");
    set({ categories });
  },

  updateCategory: async (id, data) => {
    await api.put<CategoryItem>(`/categories/${id}`, data);
    await get().loadCategoryList();
    const categories = await api.get<string[]>("/categories");
    set({ categories });
  },

  deleteCategory: async (id) => {
    await api.del(`/categories/${id}`);
    await get().loadCategoryList();
    const categories = await api.get<string[]>("/categories");
    set({ categories });
  },
}));

export function useProduct(id: string | undefined) {
  return useAdminStore((s) => s.products.find((p) => p.id === id));
}

export function useOrder(id: string | undefined) {
  return useAdminStore((s) => s.orders.find((o) => o.id === id));
}

export function useCustomer(id: string | undefined) {
  return useAdminStore((s) => s.customers.find((c) => c.id === id));
}
