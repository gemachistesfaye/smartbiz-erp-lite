import { Outlet, Link, useLocation } from '@tanstack/react-router';
import { ChevronRight, Home } from 'lucide-react';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { useUIStore } from '@/stores/ui-store';
import { useIsDesktop } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Products',
  categories: 'Categories',
  units: 'Units',
  inventory: 'Inventory',
  customers: 'Customers',
  sales: 'Sales',
  expenses: 'Expenses',
  reports: 'Reports',
  settings: 'Business Settings',
  profile: 'Profile',
  suppliers: 'Suppliers',
  help: 'Help & Support',
  pos: 'Point of Sale',
  users: 'User Management',
};

function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  const label = segments
    .slice()
    .reverse()
    .find((seg) => routeLabels[seg]);

  if (!label || label === 'dashboard') {
    return null;
  }

  return (
    <nav
      className="flex items-center space-x-1 text-sm text-muted-foreground mb-4"
      aria-label="Breadcrumb"
    >
      <Link to="/dashboard" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="font-medium text-foreground">{routeLabels[label]}</span>
    </nav>
  );
}

export function DashboardLayout() {
  const { sidebarCollapsed } = useUIStore();
  const isDesktop = useIsDesktop();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 min-h-screen flex flex-col',
          isDesktop && (sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'),
        )}
      >
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
