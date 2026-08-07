import { lazy, Suspense } from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ServerErrorPage } from '@/components/shared/server-error-page';

function withSuspense(Component: React.LazyExoticComponent<React.ComponentType>) {
  return function SuspenseWrapper() {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Component />
      </Suspense>
    );
  };
}

const LoginPage = withSuspense(
  lazy(() => import('@/features/auth/pages/login-page').then((m) => ({ default: m.LoginPage }))),
);
const RegisterPage = withSuspense(
  lazy(() =>
    import('@/features/auth/pages/register-page').then((m) => ({ default: m.RegisterPage })),
  ),
);
const DashboardPage = withSuspense(
  lazy(() =>
    import('@/features/dashboard/pages/dashboard-page').then((m) => ({ default: m.DashboardPage })),
  ),
);
const ProductsPage = withSuspense(
  lazy(() =>
    import('@/features/products/pages/products-page').then((m) => ({ default: m.ProductsPage })),
  ),
);
const ProductDetailPage = withSuspense(
  lazy(() =>
    import('@/features/products/pages/product-detail-page').then((m) => ({
      default: m.ProductDetailPageWrapper,
    })),
  ),
);
const CategoriesPage = withSuspense(
  lazy(() =>
    import('@/features/categories/pages/categories-page').then((m) => ({
      default: m.CategoriesPage,
    })),
  ),
);
const UnitsPage = withSuspense(
  lazy(() => import('@/features/units/pages/units-page').then((m) => ({ default: m.UnitsPage }))),
);
const InventoryPage = withSuspense(
  lazy(() =>
    import('@/features/inventory/pages/inventory-page').then((m) => ({ default: m.InventoryPage })),
  ),
);
const InventoryHistoryPage = withSuspense(
  lazy(() =>
    import('@/features/inventory/pages/inventory-history-page').then((m) => ({
      default: m.InventoryHistoryPage,
    })),
  ),
);
const LowStockPage = withSuspense(
  lazy(() =>
    import('@/features/inventory/pages/low-stock-page').then((m) => ({ default: m.LowStockPage })),
  ),
);
const SuppliersPage = withSuspense(
  lazy(() =>
    import('@/features/suppliers/pages/suppliers-page').then((m) => ({ default: m.SuppliersPage })),
  ),
);
const SupplierDetailPage = withSuspense(
  lazy(() =>
    import('@/features/suppliers/pages/supplier-detail-page').then((m) => ({
      default: m.SupplierDetailPage,
    })),
  ),
);
const ReceiveStockPage = withSuspense(
  lazy(() =>
    import('@/features/stock/pages/receive-stock-page').then((m) => ({
      default: m.ReceiveStockPage,
    })),
  ),
);
const AdjustStockPage = withSuspense(
  lazy(() =>
    import('@/features/stock/pages/adjust-stock-page').then((m) => ({
      default: m.AdjustStockPage,
    })),
  ),
);
const CustomersPage = withSuspense(
  lazy(() =>
    import('@/features/customers/pages/customers-page').then((m) => ({ default: m.CustomersPage })),
  ),
);
const CustomerDetailPage = withSuspense(
  lazy(() =>
    import('@/features/customers/pages/customer-detail-page').then((m) => ({
      default: m.CustomerDetailPage,
    })),
  ),
);
const SalesPage = withSuspense(
  lazy(() => import('@/features/sales/pages/sales-page').then((m) => ({ default: m.SalesPage }))),
);
const ExpensesPage = withSuspense(
  lazy(() =>
    import('@/features/expenses/pages/expenses-page').then((m) => ({ default: m.ExpensesPage })),
  ),
);
const ReportsPage = withSuspense(
  lazy(() =>
    import('@/features/reports/pages/reports-page').then((m) => ({ default: m.ReportsPage })),
  ),
);
const SettingsPage = withSuspense(
  lazy(() =>
    import('@/features/settings/pages/settings-page').then((m) => ({ default: m.SettingsPage })),
  ),
);
const ProfilePage = withSuspense(
  lazy(() =>
    import('@/features/profile/pages/profile-page').then((m) => ({ default: m.ProfilePage })),
  ),
);
const HelpPage = withSuspense(
  lazy(() => import('@/features/help/pages/help-page').then((m) => ({ default: m.HelpPage }))),
);
const NotFoundPage = withSuspense(
  lazy(() =>
    import('@/components/shared/not-found-page').then((m) => ({ default: m.NotFoundPage })),
  ),
);

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  errorComponent: ({ error }) => (
    <ServerErrorPage message={error?.message || 'An unexpected error occurred.'} />
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: RegisterPage,
});

const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'dashboard',
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: DashboardLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const productsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/products',
  component: ProductsPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/products/$productId',
  component: ProductDetailPage,
});

const categoriesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/categories',
  component: CategoriesPage,
});

const unitsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/units',
  component: UnitsPage,
});

const inventoryRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/inventory',
  component: InventoryPage,
});

const inventoryHistoryRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/inventory/history',
  component: InventoryHistoryPage,
});

const lowStockRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/inventory/low-stock',
  component: LowStockPage,
});

const suppliersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/suppliers',
  component: SuppliersPage,
});

const supplierDetailRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/suppliers/$supplierId',
  component: SupplierDetailPage,
});

const receiveStockRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/stock/receive',
  component: ReceiveStockPage,
});

const adjustStockRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/stock/adjust',
  component: AdjustStockPage,
});

const customersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/customers',
  component: CustomersPage,
});

const customerDetailRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/customers/$customerId',
  component: CustomerDetailPage,
});

const salesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/sales',
  component: SalesPage,
});

const expensesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/expenses',
  component: ExpensesPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/reports',
  component: ReportsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/settings',
  component: SettingsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/profile',
  component: ProfilePage,
});

const helpRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/help',
  component: HelpPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' });
  },
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  dashboardLayoutRoute.addChildren([
    dashboardRoute,
    productsRoute,
    productDetailRoute,
    categoriesRoute,
    unitsRoute,
    inventoryRoute,
    inventoryHistoryRoute,
    lowStockRoute,
    suppliersRoute,
    supplierDetailRoute,
    receiveStockRoute,
    adjustStockRoute,
    customersRoute,
    customerDetailRoute,
    salesRoute,
    expensesRoute,
    reportsRoute,
    settingsRoute,
    profileRoute,
    helpRoute,
  ]),
  notFoundRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPendingComponent: LoadingScreen,
  defaultErrorComponent: ({ error }) => (
    <ServerErrorPage message={error?.message || 'Something went wrong.'} />
  ),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
