import { Link, useMatchRoute } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Receipt,
  BarChart3,
  Settings,
  X,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'POS', href: '/pos', icon: ShoppingCart },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const matchRoute = useMatchRoute();

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/80 lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full border-r bg-card transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && <span className="text-lg font-bold">SmartBiz ERP</span>}
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="hidden lg:flex">
            <ChevronLeft
              className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
            />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="space-y-1 p-2">
          {navigation.map((item) => {
            const isActive = matchRoute({ to: item.href });
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  collapsed && 'justify-center px-2',
                )}
                onClick={onClose}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
