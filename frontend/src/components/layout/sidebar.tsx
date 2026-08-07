import { Link, useMatchRoute } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Ruler,
  Warehouse,
  Users,
  ShoppingCart,
  Receipt,
  BarChart3,
  Settings,
  HelpCircle,
  X,
  ChevronLeft,
  Store,
  Truck,
  SlidersHorizontal,
  Banknote,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/features/auth/store/auth-store';

const navSections = [
  {
    label: null,
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'POS', href: '/pos', icon: Banknote },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { name: 'Products', href: '/products', icon: Package },
      { name: 'Categories', href: '/categories', icon: FolderTree },
      { name: 'Units', href: '/units', icon: Ruler },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Inventory', href: '/inventory', icon: Warehouse },
      { name: 'Receive Stock', href: '/stock/receive', icon: Truck },
      { name: 'Adjust Stock', href: '/stock/adjust', icon: SlidersHorizontal },
      { name: 'Customers', href: '/customers', icon: Users },
      { name: 'Sales', href: '/sales', icon: ShoppingCart },
      { name: 'Expenses', href: '/expenses', icon: Receipt },
    ],
  },
  {
    label: 'Analytics',
    items: [{ name: 'Reports', href: '/reports', icon: BarChart3 }],
  },
];

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
];

const adminNavigation = [
  { name: 'Users', href: '/users', icon: ShieldCheck },
];

export function Sidebar() {
  const matchRoute = useMatchRoute();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const isOwner = user?.role === 'OWNER';

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full flex-col border-r bg-card transition-all duration-300',
          sidebarCollapsed ? 'w-16' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4 shrink-0">
          {!sidebarCollapsed && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">SmartBiz</span>
            </Link>
          )}
          {sidebarCollapsed && <Store className="mx-auto h-6 w-6 text-primary" />}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              className={cn('h-4 w-4 transition-transform', sidebarCollapsed && 'rotate-180')}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto" role="menubar">
          {navSections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {section.label && !sidebarCollapsed && (
                <p className="px-3 pt-4 pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {section.label}
                </p>
              )}
              {section.label && sidebarCollapsed && sectionIdx > 0 && (
                <div className="mx-3 my-2 h-px bg-border" />
              )}
              {section.items.map((item) => {
                const isActive = matchRoute({ to: item.href });
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    role="menuitem"
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      sidebarCollapsed && 'justify-center px-2',
                    )}
                    onClick={() => setSidebarOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom System Area */}
        <div className="mt-auto shrink-0 p-2">
          <Separator className="mb-2" />
          {!sidebarCollapsed && (
            <p className="px-3 pt-2 pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              System
            </p>
          )}
          {sidebarCollapsed && <div className="my-2 h-px bg-border" />}
          {isOwner && adminNavigation.map((item) => {
            const isActive = matchRoute({ to: item.href });
            return (
              <Link
                key={item.name}
                to={item.href}
                role="menuitem"
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  sidebarCollapsed && 'justify-center px-2',
                )}
                onClick={() => setSidebarOpen(false)}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
          {bottomNavigation.map((item) => {
            const isActive = matchRoute({ to: item.href });
            return (
              <Link
                key={item.name}
                to={item.href}
                role="menuitem"
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  sidebarCollapsed && 'justify-center px-2',
                )}
                onClick={() => setSidebarOpen(false)}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
