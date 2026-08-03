import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/layout/AppShell";
import { useAdminStore } from "@/store/useAdminStore";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { ProductsListPage } from "@/features/products/ProductsListPage";
import { ProductDetailPage } from "@/features/products/ProductDetailPage";
import { OrdersListPage } from "@/features/orders/OrdersListPage";
import { OrderDetailPage } from "@/features/orders/OrderDetailPage";
import { CategoriesPage } from "@/features/categories/CategoriesPage";
import { CustomersPage } from "@/features/customers/CustomersPage";
import { UsersPage } from "@/features/users/UsersPage";
import { ContentPage } from "@/features/content/ContentPage";
import { AnalyticsPage } from "@/features/analytics/AnalyticsPage";
import { SettingsPage } from "@/features/settings/SettingsPage";

export default function App() {
  const loaded = useAdminStore((s) => s.loaded);
  const error = useAdminStore((s) => s.error);
  const loadAll = useAdminStore((s) => s.loadAll);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg text-text font-sans">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Не удалось загрузить данные</div>
          <div className="text-sm text-muted">{error}</div>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg text-text font-sans text-sm text-muted">
        Загрузка...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="products" element={<ProductsListPage />} />
          <Route path="products/new" element={<ProductDetailPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />

          <Route path="orders" element={<OrdersListPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />

          <Route path="categories" element={<CategoriesPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="users" element={<UsersPage />} />

          <Route path="content" element={<Navigate to="/content/banners" replace />} />
          <Route path="content/:tab" element={<ContentPage />} />

          <Route path="analytics" element={<AnalyticsPage />} />

          <Route path="settings" element={<Navigate to="/settings/markup" replace />} />
          <Route path="settings/:tab" element={<SettingsPage />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
