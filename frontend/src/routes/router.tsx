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
  lazy(() =>
    import('@/features/auth/pages/login-page').then((m) => ({ default: m.LoginPage })),
  ),
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
    import('@/features/products/pages/product-detail-page').then((m) => ({ default: m.ProductDetailPageWrapper })),
  ),
);
const CategoriesPage = withSuspense(
  lazy(() =>
    import('@/features/categories/pages/categories-page').then((m) => ({ default: m.CategoriesPage })),
  ),
);
const UnitsPage = withSuspense(
  lazy(() =>
    import('@/features/units/pages/units-page').then((m) => ({ default: m.UnitsPage })),
  ),
);
const InventoryPage = withSuspense(
  lazy(() =>
    import('@/features/inventory/pages/inventory-page').then((m) => ({ default: m.InventoryPage })),
  ),
);
const CustomersPage = withSuspense(
  lazy(() =>
    import('@/features/customers/pages/customers-page').then((m) => ({ default: m.CustomersPage })),
  ),
);
const SalesPage = withSuspense(
  lazy(() =>
    import('@/features/sales/pages/sales-page').then((m) => ({ default: m.SalesPage })),
  ),
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
const NotFoundPage = withSuspense(
  lazy(() =>
    import('@/components/shared/not-found-page').then((m) => ({ default: m.NotFoundPage })),
  ),
);

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  errorComponent: ({ error }) => (
    <ServerErrorPage
      message={error?.message || 'An unexpected error occurred.'}
    />
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

const customersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/customers',
  component: CustomersPage,
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
    customersRoute,
    salesRoute,
    expensesRoute,
    reportsRoute,
    settingsRoute,
    profileRoute,
  ]),
  notFoundRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPendingComponent: LoadingScreen,
  defaultErrorComponent: ({ error }) => (
    <ServerErrorPage
      message={error?.message || 'Something went wrong.'}
    />
  ),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
